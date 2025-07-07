// context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import apiClient from "../api"; // Import our new API client

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);

    const fetchDoctors = async () => {
        try {
            const response = await apiClient.get('/doctors/');
            setDoctors(response.data);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        }
    };

    const fetchUserProfile = async () => {
        if (token) {
            try {
                // You'll need an endpoint like this in your backend to get the current user's profile
                const response = await apiClient.get('/auth/user/'); // You need to create this endpoint
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                logout(); // If token is invalid, log out
            }
        }
    };

    // This effect runs once when the app loads
    useEffect(() => {
        fetchDoctors();
        fetchUserProfile();
    }, [token]); // Re-fetch user profile if token changes

    const login = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    const contextValue = {
        doctors,
        token,
        user,
        login,
        logout,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;