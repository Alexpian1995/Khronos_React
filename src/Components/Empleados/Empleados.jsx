import React, { useContext, useEffect, useState } from 'react'; 
import { ThemeContext } from '../../ThemeContext'; // Asegúrate de que la ruta sea correcta
import { db } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Importa las funciones necesarias
import Header from '../HeaderTemplate/Header';
import './Empleados.css'; // Asegúrate de que la ruta sea correcta

const Empleados = () => {
  const { DarkTheme } = useContext(ThemeContext);
  const [employees, setEmployees] = useState([]); // Estado para empleados
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // ID del empleado en edición
  const [editedName, setEditedName] = useState(''); // Nombre editado
  const [editedDocumento, setEditedDocumento] = useState(''); // Documento editado

  // Función para obtener empleados desde Firestore
  const fetchEmployees = async () => {
    const employeesCollection = collection(db, 'empleados'); // Asegúrate de que el nombre de la colección sea correcto
    const employeesSnapshot = await getDocs(employeesCollection);
    const employeesList = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Obtener datos
    setEmployees(employeesList); // Actualiza el estado
  };

  // Usar useEffect para cargar empleados al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Función para manejar la eliminación del empleado
  const handleDeleteEmployee = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este empleado?'); // Mostrar alerta de confirmación
    if (confirmed) {
      const employeeDoc = doc(db, 'empleados', id);
      await deleteDoc(employeeDoc); // Elimina el documento de Firestore
      fetchEmployees(); // Recarga la lista de empleados
    }
  };

  // Función para iniciar la edición de un empleado
  const handleEditEmployee = (employee) => {
    setEditingEmployeeId(employee.id);
    setEditedName(employee.nombre); 
    setEditedDocumento(employee.documento);
  };

  // Función para guardar los cambios en el nombre y documento del empleado
  const handleSaveEdit = async () => {
    const employeeDoc = doc(db, 'empleados', editingEmployeeId);
    await updateDoc(employeeDoc, {
      nombre: editedName,
      documento: editedDocumento,
    });
    setEditingEmployeeId(null); // Salir del modo de edición
    setEditedName(''); 
    setEditedDocumento(''); // Limpiar los campos de edición
    fetchEmployees(); // Recarga la lista de empleados
  };

  // Función para generar un ID numérico a partir del ID alfanumérico de Firestore
  function generateNumericId(id) {
    let numericId = 0;
    for (let i = 0; i < id.length; i++) {
      numericId += id.charCodeAt(i); // Sumar el valor ASCII de cada carácter
    }
    return numericId; // Devuelve el número calculado
  }

  return (
    <div className={`main ${DarkTheme ? 'dark' : ''}`}>
      <Header />
      <br />
      <br />
      <br />
      
      <h1>Lista de Empleados</h1>
      {employees.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{generateNumericId(employee.id)}</td> {/* Muestra el ID numérico generado */}
                <td>
                  {editingEmployeeId === employee.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="input" // Añadido estilo
                    />
                  ) : (
                    employee.nombre 
                  )}
                </td>
                <td>
                  {editingEmployeeId === employee.id ? (
                    <input
                      type="text"
                      value={editedDocumento}
                      onChange={(e) => setEditedDocumento(e.target.value)}
                      className="input" // Añadido estilo
                    />
                  ) : (
                    employee.documento
                  )}
                </td>
                <td>
                  {editingEmployeeId === employee.id ? (
                    <>
                      <button onClick={handleSaveEdit} className="button">Guardar</button>
                      <button onClick={() => setEditingEmployeeId(null)} className="button">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditEmployee(employee)} className="edit-button">Editar</button>
                      <button onClick={() => handleDeleteEmployee(employee.id)} className="delete-button">Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Empleados;
