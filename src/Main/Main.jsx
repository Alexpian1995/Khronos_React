import { useContext } from 'react';
import './Main.css';
import { ThemeContext } from '../ThemeContext';
import Header from '../Components/HeaderTemplate/Header';
import Content from '../Content/Content';


const Main = () => {
    const { DarkTheme } = useContext(ThemeContext);

    return (
        <div className={`main ${DarkTheme && "dark"}`}>
            <Header />
            <Content />

            <div class="main">
    <div class="container">
        <h1>Bienvenidos a Khronos</h1>

        <h2>Descripción del Proyecto</h2>
        <p>Khronos es una aplicación de gestión de horarios diseñada para facilitar el registro y seguimiento de la asistencia de empleados. Permite al administrador registrar horas de entrada y salida, gestionar ausencias y calcular automáticamente horas trabajadas y horas extras.</p>
        
        <h2>Características Principales</h2>
        <ul>
            <li>Registro de Asistencia: Ingreso fácil de horas trabajadas.</li>
            <li>Gestión de Ausencias: Opción de justificar ausencias.</li>
            <li>Aprobación de Registros: Supervisores pueden aprobar la asistencia.</li>
            <li>Exportación a PDF: Generación de reportes de asistencia.</li>
        </ul>
        
        <h2>Tecnologías Utilizadas</h2>
        <ul>
            <li>Frontend: React.js</li>
            <li>Backend: Firebase</li>
        </ul>

        <h2>Objetivo</h2>
        <p>Optimizar la gestión del tiempo laboral y promover la transparencia en la administración de recursos humanos.</p>
    </div>
</div>


            
        </div>
    );
};

export default Main;
