import {Login} from '../Login/Login'
import {Inicio} from '../Components/Inicio/Inicio'
import {Formempleado} from '../Components/Formempleado/Formempleado'
import {Empleados} from '../Components/Empleados/Empleados'
import {Asistencia} from '../Components/Asistencia/Asistencia'
import {Analitica} from '../Components/Analitica/Analitica'


export let enrutadorApp = [
    {
        element: <Login />,
        path: "/Login",
    },
    {
        path: "/",
        element: <Inicio />,
        children: [
            {
                path: 'formempleado',
                element: <Formempleado />
            },
            {
                path: 'empleados',
                element: <Empleados />
            },
            {
                path: 'asistencia',
                element: <Asistencia />
            },
            {
                path: 'analitica',
                element: <Analitica />
            }
        ]
    },
]