import { useEffect, useState } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Templates/Navigation';
import { ThemeContext } from './ThemeContext';
import Main from './Main/Main';
import Login from './Login/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import FormEmpleado from './Components/Formempleado/Formempleado';
import Empleados from './Components/Empleados/Empleados';
import Asistencia from './Components/Asistencia/Asistencia';
import Analitica from './Components/Analitica/Analitica';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [DarkTheme, setDarkTheme] = useState(true);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [employees, setEmployees] = useState([]); // State for managing employees

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
                localStorage.setItem("email", user.email); 
            } else {
                setLoggedIn(false);
                localStorage.removeItem("email");
            }
        });

        return () => unsubscribe(); 
    }, []);

    return (
        <ThemeContext.Provider value={{ DarkTheme, setDarkTheme }}>
            <Router>
                <div className='App'>
                    {LoggedIn ? (
                        <>
                            <Navigation />
                            <Routes>
                                <Route path='/main' element={<Main />} />
                                <Route path='/forempleado' element={<FormEmpleado setEmployees={setEmployees} />} />
                                <Route path='/empleados' element={<Empleados employees={employees} />} />
                                <Route path='/asistencia' element={<Asistencia />} />
                                <Route path='/analitica' element={<Analitica />} />
                            </Routes>
                        </>
                    ) : (
                        <Login />
                    )}
                </div>
            </Router>
        </ThemeContext.Provider>
    );
}

export default App;
