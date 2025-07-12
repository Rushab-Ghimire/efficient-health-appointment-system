// context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import apiClient from "../api";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    // This state is crucial for preventing race conditions
    const [loading, setLoading] = useState(true); // Start as true

    // This is the login function called from Login.jsx
    const login = (newToken, userData) => {
        localStorage.setItem('authToken', newToken);
        setUser(userData);
        setToken(newToken); // This will trigger the useEffect below
    };

    // This is the logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null); // This will also trigger the useEffect
    };
    
    // --- THIS useEffect IS THE HEART OF THE CONTEXT ---
    useEffect(() => {
        // Create a single async function to manage the initial app load
        const initializeApp = async () => {
            try {
                // Always fetch public data like the list of doctors
                const doctorsResponse = await apiClient.get('/doctors/');
                setDoctors(doctorsResponse.data);

                // If a token exists, try to validate it and fetch the user profile
                if (token) {
                    console.log("Token found, fetching user profile...");
                    const userResponse = await apiClient.get('/auth/user/');
                    setUser(userResponse.data);
                }
            } catch (error) {
                // This block runs if the token is invalid or expired
                console.error("Initialization failed, likely due to an invalid token.", error);
                // Clean up the invalid state
                logout();
            } finally {
                // --- CRITICAL CHANGE 1 ---
                // No matter what happens (success or failure), the initial loading is now finished.
                setLoading(false);
            }
        };

        initializeApp();
    }, [token]); // This effect re-runs whenever the user logs in or out (token changes)


    const contextValue = {
        doctors,
        token,
        user,
        loading, // --- CRITICAL CHANGE 2: Expose the loading state ---
        login,
        logout,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {/* --- CRITICAL CHANGE 3: Don't render the app until the initial check is done --- */}
            {!loading && props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;