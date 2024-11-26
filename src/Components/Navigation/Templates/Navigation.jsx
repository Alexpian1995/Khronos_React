import { useContext, useEffect, useState } from 'react';
import './Navigation.css';
import { FaHome } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { MdAccessTimeFilled, MdAnalytics,  MdSwapHoriz } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";
import { ThemeContext } from '../../../ThemeContext';
import Nav from '../../NaviconTemplate/Nav'; 
import logo from '../../../assets/log.jpeg'

const Navigation = () => {
    const [nav, setNav] = useState(false);
    const [useremail, setUseremail] = useState("");  
    const { DarkTheme, setDarkTheme } = useContext(ThemeContext);

    function changeTheme() {
        setDarkTheme(!DarkTheme);
    }

    useEffect(() => {
        const email = localStorage.getItem("email");
        setUseremail(email ? email : "No user logged in");
    }, []);

    return (
        <div className={`navigation ${nav ? "active" : ""} ${DarkTheme ? "dark" : ""}`}>
            {/* Toggle button para mostrar el menú */}
            <div className={`menu ${nav ? "active" : ""}`} onClick={() => setNav(!nav)}>
                <FiChevronLeft className='menu-icon' />
            </div>
            
            <header>
                <div className='profile'>
                    <img 
                        src={logo}
                        alt="user-img" 
                        className="profile-img" 
                    />
                </div>
                <span>Khronos</span>
                <span>{useremail}</span>
            </header>

            {/* Menú de navegación */}
            <nav>
                <Nav title="Inicio" Icon={FaHome} to="/main" />
                <Nav title="Agregar Empleado" Icon={IoPersonAdd} to="/forempleado" />
                <Nav title="Empleados" Icon={IoIosPeople} to="/empleados" />
                <Nav title="Asistencia" Icon={MdAccessTimeFilled} to="/asistencia" />
                <Nav title="Analítica" Icon={MdAnalytics} to="/analitica" />
            </nav>
            
            <div className='divider'></div>

            
            <Nav
                Icon={MdSwapHoriz}
                title={`${DarkTheme ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro"}`}
                onClick={changeTheme}
            />
        </div>
    );
};

export default Navigation;
