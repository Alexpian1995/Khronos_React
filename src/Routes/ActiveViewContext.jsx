
import { createContext, useState } from 'react';

export const ActiveViewContext = createContext();

export const ActiveViewProvider = ({ children }) => {
    const [activeView, setActiveView] = useState("Inicio"); 

    return (
        <ActiveViewContext.Provider value={{ activeView, setActiveView }}>
            {children}
        </ActiveViewContext.Provider>
    );
};
