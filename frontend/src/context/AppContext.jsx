// context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import apiClient from "../api";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This is the login function called from your Login component
    const login = (newToken, userData) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);

        // Update the apiClient to use the new token for all subsequent requests
        apiClient.defaults.headers.common['Authorization'] = `Token ${newToken}`;
        
        setUser(userData);
        setToken(newToken); // This will trigger the useEffect to re-run
    };

    // This is the logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');

        // Remove the auth header from the apiClient instance
        delete apiClient.defaults.headers.common['Authorization'];

        setUser(null);
        setToken(null);
    };
    
    useEffect(() => {
        const initializeApp = async () => {
            // First, fetch public data that doesn't require auth
            try {
                const doctorsResponse = await apiClient.get('/doctors/');
                setDoctors(doctorsResponse.data);
            } catch (error) {
                console.error("Failed to fetch doctors list.", error);
            }
            
            // The 'token' state variable is used here from the initial useState
            if (token) {
                console.log("Token found, setting auth header and fetching user profile...");
                apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
                try {
                    // Use the correct, updated URL
                    const userResponse = await apiClient.get('/auth/user/');
                    setUser(userResponse.data);
                } catch (error) {
                    console.error("Initialization failed: Invalid token.", error);
                    logout(); // If token is bad, perform a full logout cleanup
                }
            }
            
            setLoading(false);
        };

        initializeApp();
        // The dependency array is correct. This should run when the token state changes.
    }, [token]);


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
            {/* Show a loading indicator until the initial auth check is done */}
            {loading ? <p>Loading application...</p> : props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;