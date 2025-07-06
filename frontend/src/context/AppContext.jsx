import { createContext, useState } from "react";
import { doctors as initialDoctors } from '../assets/assets';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState(initialDoctors); // Allows dynamic updates

    const currencySymbol = '$';

    const value = {
        doctors,
        setDoctors,           // Export setDoctors in case needed
        currencySymbol
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
