import React, { useContext, useState, useEffect } from 'react'; 
import { ThemeContext } from '../../ThemeContext'; 
import Header from '../HeaderTemplate/Header'; 
import Content from '../../Content/Content'; 
import { db } from '../../firebase'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'; 
import jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import './Asistencia.css';

const Asistencia = () => {
  const { DarkTheme } = useContext(ThemeContext); 
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [fecha, setFecha] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [aprobacion, setAprobacion] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);  // Estado para manejar la edición

  // Función para obtener los empleados
  const fetchEmployees = async () => {
    const employeesCollection = collection(db, 'empleados');
    const employeeSnapshot = await getDocs(employeesCollection);
    const employeeList = employeeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEmployees(employeeList);
  };

  // Función para obtener los registros de asistencia desde Firebase
  const fetchAttendanceRecords = async () => {
    const attendanceCollection = collection(db, 'asistencia');
    const attendanceSnapshot = await getDocs(attendanceCollection);
    const attendanceList = attendanceSnapshot.docs.map(doc => ({
      id: doc.id,  // Guardamos el ID del documento para usarlo en actualizaciones y eliminaciones
      ...doc.data()
    }));
    setAttendanceRecords(attendanceList);
  };

  // Función para manejar la creación o actualización de registros de asistencia
  const handleAttendance = async () => {
    if (selectedEmployee && horaEntrada && horaSalida && fecha) {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      const horasTrabajadas = calculateHours(horaEntrada, horaSalida);
      const horasExtras = horasTrabajadas > 8 ? horasTrabajadas - 8 : 0;

      const newRecord = {
        empleado: employee.nombre,
        documento: employee.documento,
        horaEntrada: horaEntrada,
        horaSalida: horaSalida,
        fecha: fecha,
        horasTrabajadas: horasTrabajadas,
        horasExtras: horasExtras,
        ausencia: selectedOption === 'ausencia' ? 'Sí' : 'No',
        justificacion: selectedOption === 'ausencia' ? justificacion : '',
        aprobar: aprobacion
      };

      if (editingRecord) {
        // Si estamos editando un registro existente, actualizamos en lugar de crear uno nuevo
        const recordRef = doc(db, 'asistencia', editingRecord.id);
        await updateDoc(recordRef, newRecord);
        alert('Registro de asistencia actualizado correctamente.');
        setEditingRecord(null);  // Limpiar el estado de edición
      } else {
        // Si no estamos editando, agregamos un nuevo registro
        const attendanceRef = collection(db, 'asistencia');
        await addDoc(attendanceRef, newRecord);
        alert('Registro de asistencia guardado correctamente.');
      }

      // Actualizar el estado de los registros de asistencia
      setAttendanceRecords(prevRecords => {
        if (editingRecord) {
          // Si estamos editando, reemplazamos el registro actualizado
          return prevRecords.map(record =>
            record.id === editingRecord.id ? newRecord : record
          );
        } else {
          return [...prevRecords, newRecord];
        }
      });

      // Reiniciar el formulario
      resetForm();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const calculateHours = (entrada, salida) => {
    const entradaDate = new Date(`1970-01-01T${entrada}:00`);
    const salidaDate = new Date(`1970-01-01T${salida}:00`);
    const diffMs = salidaDate - entradaDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedOption('');
    setHoraEntrada('');
    setHoraSalida('');
    setFecha('');
    setJustificacion('');
    setAprobacion('');
  };

  const handleEdit = (record) => {
    // Configuramos el estado de edición con los datos del registro seleccionado
    setEditingRecord(record);
    setSelectedEmployee(record.empleadoId); // Suponiendo que 'empleadoId' es el ID del empleado
    setHoraEntrada(record.horaEntrada);
    setHoraSalida(record.horaSalida);
    setFecha(record.fecha);
    setSelectedOption(record.ausencia === 'Sí' ? 'ausencia' : 'horaExtra');
    setJustificacion(record.justificacion);
    setAprobacion(record.aprobar);
  };

  const handleDelete = async (id) => {
    // Eliminamos el registro de la base de datos
    const recordRef = doc(db, 'asistencia', id);
    await deleteDoc(recordRef);
    // Actualizamos el estado local para reflejar la eliminación
    setAttendanceRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    alert('Registro de asistencia eliminado correctamente.');
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceRecords();
  }, []);

  const handleAprobacionChange = (index, value) => {
    const updatedRecords = [...attendanceRecords];
    updatedRecords[index].aprobar = value;
    setAttendanceRecords(updatedRecords);
  };

  const exportToPDF = async () => {
    const input = document.getElementById('attendance-table');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('l', 'mm', 'a4');
    
    const imgBackground = new Image();
    imgBackground.src = 'https://media.istockphoto.com/id/1300464397/es/foto/los-tiempos-de-trabajo-empresarial-concepto-personas-trabajan-escribiendo-en-la-superposici%C3%B3n.webp?a=1&b=1&s=612x612&w=0&k=20&c=_2LkzEoCMsou1LESIcRgGr48bZrvAXckxvqIwfuJrxs=';

    imgBackground.onload = () => {
      pdf.addImage(imgBackground, 'JPEG', 0, 0, 297, 210);

      pdf.setFontSize(20);
      pdf.text('Registro de Asistencia', 105, 20, { align: 'center' });

      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position + 30, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgBackground, 'JPEG', 0, 0, 297, 210);
        pdf.addImage(imgData, 'PNG', 0, position + 30, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('registros_asistencia.pdf');
    };
  };

  return (
    <div className={`main ${DarkTheme ? "dark" : ""}`}>
      <Header />
      <Content />
      <div className='asistencia-container'>
        <h2>Seleccionar Empleado</h2>
        <select
          value={selectedEmployee}
          onChange={(e) => {
            setSelectedEmployee(e.target.value);
            setSelectedOption('');
            setHoraEntrada('');
            setHoraSalida('');
            setFecha('');
            setJustificacion('');
            setAprobacion('');
          }}
        >
          <option value="" disabled>Selecciona un empleado</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.nombre} - {employee.documento}
            </option>
          ))}
        </select>

        {selectedEmployee && (
          <div>
            <p>Empleado seleccionado: {employees.find(emp => emp.id === selectedEmployee).nombre}</p>
            
            <h3>Seleccionar Opción</h3>
            <select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                if (e.target.value === 'ausencia') {
                  setJustificacion('');
                }
              }}
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="horaExtra">Hora Extra</option>
              <option value="ausencia">Ausencia</option>
            </select>

            {selectedOption && (
              <div>
                <h3>Ingresar Fecha y Horas</h3>
                <label>Fecha:</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
                <div>
                  <label>Hora de Entrada:</label>
                  <input
                    type="time"
                    value={horaEntrada}
                    onChange={(e) => setHoraEntrada(e.target.value)}
                  />
                </div>
                <div>
                  <label>Hora de Salida:</label>
                  <input
                    type="time"
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                  />
                </div>

                {selectedOption === 'ausencia' && (
                  <div>
                    <label>Ausencia con Justificación:</label>
                    <select
                      value={justificacion}
                      onChange={(e) => setJustificacion(e.target.value)}
                    >
                      <option value="" disabled>Seleccionar</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                )}

                <p>Opción seleccionada: {selectedOption === 'horaExtra' ? 'Hora Extra' : 'Ausencia'}</p>
                <button onClick={handleAttendance}>
                  {editingRecord ? 'Guardar Cambios' : 'Registrar Asistencia'}
                </button>
              </div>
            )}
          </div>
        )}

        <h2>Registros de Asistencia</h2>
        <table id="attendance-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Documento</th>
              <th>Fecha</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Horas Trabajadas</th>
              <th>Horas Extras</th>
              <th>Ausencia</th>
              <th>Justificación</th>
              <th>Aprobar</th>
              <th>Acciones</th> {/* Columna para editar y eliminar */}
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.empleado}</td>
                <td>{record.documento}</td>
                <td>{record.fecha}</td>
                <td>{record.horaEntrada}</td>
                <td>{record.horaSalida}</td>
                <td>{record.horasTrabajadas}</td>
                <td>{record.horasExtras}</td>
                <td>{record.ausencia}</td>
                <td>{record.justificacion}</td>
                <td>
                  <select
                    value={record.aprobar || ''}
                    onChange={(e) => handleAprobacionChange(index, e.target.value)}
                  >
                    <option value="" disabled>Seleccionar</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  
                  <button onClick={() => handleDelete(record.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={exportToPDF}>Exportar a PDF</button>
      </div>
    </div>
  );
};

export default Asistencia;
