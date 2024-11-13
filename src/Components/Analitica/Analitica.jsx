import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../ThemeContext';
import Header from '../HeaderTemplate/Header';
import Content from '../../Content/Content';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';  // Importamos jsPDF
import 'jspdf-autotable';
import './Analitica.css';

// Registra los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analitica = () => {
  const { DarkTheme } = useContext(ThemeContext);
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('barras');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredAttendanceRecords, setFilteredAttendanceRecords] = useState([]);

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

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = attendanceRecords.filter(record => {
        const recordDate = new Date(record.fecha);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });
      setFilteredAttendanceRecords(filtered);
    } else {
      setFilteredAttendanceRecords(attendanceRecords);
    }
  }, [startDate, endDate, attendanceRecords]);

  const empleadosConHorasExtrasList = filteredAttendanceRecords.filter(record => record.horasExtras > 0).map(record => record.empleado);
  const empleadosAusentesList = filteredAttendanceRecords.filter(record => record.ausencia === 'Sí' && record.horasExtras === 0).map(record => record.empleado);
  const empleadosPresentesList = filteredAttendanceRecords.filter(record => (record.ausencia === 'No' || record.horasExtras > 0)).map(record => record.empleado);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Definir barData y pieData
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
        backgroundColor: ['#810551', '#05454d', '#333333'],
        borderColor: ['#1E88E5', '#05454d', '#43A047'],
        borderWidth: 1
      }
    ]
  };

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

  // Función para generar el informe PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Informe de Asistencia de Empleados', 14, 20);

    doc.setFontSize(12);
    doc.text(`Rango de Fechas: ${startDate} a ${endDate}`, 14, 30);
    doc.text('Empleados Presentes:', 14, 40);
    doc.text(empleadosPresentesList.join(', '), 14, 50);

    doc.text('Empleados Ausentes:', 14, 60);
    doc.text(empleadosAusentesList.join(', '), 14, 70);

    doc.text('Empleados con Horas Extras:', 14, 80);
    doc.text(empleadosConHorasExtrasList.join(', '), 14, 90);

    doc.text('Detalles de Asistencia:', 14, 100);
    
    // Agregar la tabla de asistencia
    let startY = 110;
    doc.autoTable({
      head: [['Empleado', 'Documento', 'Fecha', 'Horas Extras', 'Ausencia']],
      body: filteredAttendanceRecords.map(record => [
        record.empleado,
        record.documento,
        record.fecha,
        record.horasExtras,
        record.ausencia
      ]),
      startY: startY,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255]
      }
    });

    doc.save('reporte_asistencia.pdf');
  };

  return (
    <div className={`main ${DarkTheme ? 'dark' : ''}`}>
      <Header />
      <Content />

      <div className="analitica-container">
        <h2>Análisis de Datos de Asistencia</h2>

        <div className="date-picker-container">
          <label>
            Desde:
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </label>
          <label>
            Hasta:
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </label>
        </div>

        {/* Pestañas */}
        <div className="tabs">
          <button
            className={activeTab === 'barras' ? 'active' : ''}
            onClick={() => setActiveTab('barras')}
          >
            Gráfico de Barras
          </button>
          <button
            className={activeTab === 'torta' ? 'active' : ''}
            onClick={() => setActiveTab('torta')}
          >
            Gráfico de Torta
          </button>
          <button
            className={activeTab === 'tablas' ? 'active' : ''}
            onClick={() => setActiveTab('tablas')}
          >
            Tablas
          </button>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'barras' && (
          <div className="chart">
            <h3>Distribución de Empleados</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        )}

        {activeTab === 'torta' && (
          <div className="chart">
            <h3>Empleados por Estado</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        )}

        {activeTab === 'tablas' && (
          <>
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
                {filteredAttendanceRecords.map((record, index) => (
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
          </>
        )}

        <button onClick={generatePDF}>Generar Reporte PDF</button>
      </div>
    </div>
  );
};

export default Analitica;
