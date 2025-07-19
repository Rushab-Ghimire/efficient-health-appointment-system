// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import apiClient from "../api";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (newToken, userData) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
        apiClient.defaults.headers.common['Authorization'] = `Token ${newToken}`;
        setUser(userData);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };
    
    // This effect runs ONCE when the app first loads to initialize everything.
    useEffect(() => {
        const initializeApp = async () => {
            setLoading(true);
            const currentToken = localStorage.getItem('authToken');
            
            // Set auth header immediately if token exists
            if (currentToken) {
                apiClient.defaults.headers.common['Authorization'] = `Token ${currentToken}`;
            }

            // Use Promise.all to fetch public and private data concurrently
            try {
                const promises = [
                    apiClient.get('/api/doctors/') // Always fetch doctors
                ];

                if (currentToken) {
                    // Only add the user fetch promise if a token exists
                    promises.push(apiClient.get('/api/users/me/')); // <-- CORRECTED URL
                }

                const responses = await Promise.all(promises);
                
                setDoctors(responses[0].data); // Doctors are always the first response

                if (responses.length > 1) {
                    setUser(responses[1].data); // User is the second, if it exists
                }

            } catch (error) {
                console.error("Initialization Error:", error);
                // If an error occurs (likely a bad token), ensure logout state
                if (currentToken) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, [token]); // Re-run this ENTIRE initialization if the token changes (login/logout)

    const contextValue = {
        doctors,
        token,
        user,
        loading,
        login,
        logout,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {loading ? <div className="text-center p-10 font-semibold">Loading Application...</div> : props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;