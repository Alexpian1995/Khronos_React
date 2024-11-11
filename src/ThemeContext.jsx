import { createContext, useState } from 'react';

// Creación del contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [DarkTheme, setDarkTheme] = useState(true);
    const [activeView, setActiveView] = useState("Inicio"); // Añade activeView aquí

    return (
        <ThemeContext.Provider value={{ DarkTheme, setDarkTheme, activeView, setActiveView }}>
            {children}
        </ThemeContext.Provider>
    );
};
