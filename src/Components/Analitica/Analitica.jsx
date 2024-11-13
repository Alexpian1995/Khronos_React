import React, { useContext, useState, useEffect } from 'react'; 
import { ThemeContext } from '../../ThemeContext'; 
import Header from '../HeaderTemplate/Header'; 
import Content from '../../Content/Content'; 
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 
import './Analitica.css';

// Registra los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,  // Asegúrate de registrar ArcElement para los gráficos tipo Pie
  Title,
  Tooltip,
  Legend
);

const Analitica = () => {
  const { DarkTheme } = useContext(ThemeContext); 
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Fetch de empleados y registros de asistencia
  const fetchEmployees = async () => {
    const employeesCollection = collection(db, 'empleados');
    const employeeSnapshot = await getDocs(employeesCollection);
    const employeeList = employeeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEmployees(employeeList);
  };

  const fetchAttendanceRecords = async () => {
    const attendanceCollection = collection(db, 'asistencia');
    const attendanceSnapshot = await getDocs(attendanceCollection);
    const attendanceList = attendanceSnapshot.docs.map(doc => doc.data());
    setAttendanceRecords(attendanceList);
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceRecords();
  }, []);

  // Filtrar empleados con horas extras y ausencia
  const empleadosConHorasExtrasList = attendanceRecords.filter(record => record.horasExtras > 0).map(record => record.empleado);
  const empleadosAusentesList = attendanceRecords.filter(record => record.ausencia === 'Sí' && record.horasExtras === 0).map(record => record.empleado); // Solo empleados ausentes sin horas extras
  const empleadosPresentesList = attendanceRecords.filter(record => (record.ausencia === 'No' || record.horasExtras > 0)).map(record => record.empleado); // Incluye empleados presentes y con horas extras

  // Datos para el gráfico de barras
  const barData = {
    labels: ['Empleados Presentes', 'Empleados con Ausencia', 'Empleados con Horas Extras'],
    datasets: [
      {
        label: 'Empleados',
        data: [
          empleadosPresentesList.length,
          empleadosAusentesList.length,
          empleadosConHorasExtrasList.length,
        ],
        backgroundColor: ['#810551', '#05454d)', '#333333'],
        borderColor: ['#1E88E5', '#05454d', '#43A047'],
        borderWidth: 1
      }
    ]
  };

  // Datos para el gráfico de torta
  const pieData = {
    labels: ['Empleados Presentes', 'Empleados con Ausencia', 'Empleados con Horas Extras'],
    datasets: [
      {
        data: [
          empleadosPresentesList.length,
          empleadosAusentesList.length,
          empleadosConHorasExtrasList.length,
        ],
        backgroundColor: ['#810551', '#05454d', '#333333']
      }
    ]
  };

  // Opciones para los gráficos con tamaño personalizado
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite controlar el tamaño con CSS
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`main ${DarkTheme ? 'dark' : ''}`}>
      <Header />
      <Content />
      
      <div className="analitica-container">
        <h2>Análisis de Datos de Asistencia</h2>
        
        <div className="charts-container">
          <div className="chart">
            <h3>Distribución de Empleados</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
          
          <div className="chart">
            <h3>Empleados por Estado</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        <h3>Detalles de Asistencia</h3>
        <table>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Documento</th>
              <th>Fecha</th>
              <th>Horas Extras</th>
              <th>Ausencia</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.empleado}</td>
                <td>{record.documento}</td>
                <td>{record.fecha}</td>
                <td>{record.horasExtras}</td>
                <td>{record.ausencia}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Lista de Empleados por Estado</h3>
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Empleados</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Empleados Presentes</td>
              <td>{empleadosPresentesList.join(', ')}</td>
            </tr>
            <tr>
              <td>Empleados Ausentes</td>
              <td>{empleadosAusentesList.join(', ')}</td>
            </tr>
            <tr>
              <td>Empleados con Horas Extras</td>
              <td>{empleadosConHorasExtrasList.join(', ')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analitica;
