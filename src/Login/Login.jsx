import './Login.css';
import infinity from "../assets/Khronos.png"; 
import { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [NewUser, setNewUser] = useState(true); 
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState(""); 

    
    useEffect(() => {
        
        setUsername("");
        setEmail("");
        setPassword("");
        setError(false);
        setErrorMsg("");
        setSuccessMsg("");
    }, [NewUser]);

    const submit = (e) => {
        e.preventDefault();
        setError(false);
        setErrorMsg("");
        setSuccessMsg(""); 

        if (NewUser) {
            // Crear cuenta
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    localStorage.setItem("username", username); 
                    setSuccessMsg("Usuario registrado con éxito."); 
                    
                    
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        setError(true);
                        setErrorMsg("El correo electrónico ya está en uso. Inicia sesión en su lugar.");
                        setNewUser(false); 
                    } else {
                        setError(true);
                        setErrorMsg(error.message); 
                    }
                });
        } else {
           
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    console.log("Sesión iniciada exitosamente");
                })
                .catch((error) => {
                    setError(true);
                    setErrorMsg(error.message); 
                });
        }
    };

    return (
        <div className='login-page'>
            <header>
                <span>from <i>Cesde Student</i></span>
            </header>
            <img className='logo' src={infinity} alt="Logo" />
            <h2 className="title">Sub-Min <br />Khronos</h2>

            <form onSubmit={submit}>
                {NewUser && (
                    <div className="username">
                        <input 
                            onChange={(e) => setUsername(e.target.value)} 
                            type="text" 
                            id="username" 
                            required 
                            value={username} 
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                )}
                <div className="email">
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        id="email" 
                        required 
                        value={email} 
                    />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="password">
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        id="password" 
                        required 
                        value={password} 
                    />
                    <label htmlFor="password">Password</label>
                </div>
                
                {error && <span className='error'>Proceso fallido: {errorMsg}</span>}
                {successMsg && <span className='success'>{successMsg}</span>} 

                <button type="submit">{NewUser ? "Registrarse" : "Iniciar sesión"}</button>

                {NewUser ? (
                    <span className='user-start'>
                        ¿Tienes una cuenta? <b onClick={() => {
                            setNewUser(false);
                        }}>Iniciar sesión</b>
                    </span>
                ) : (
                    <span className='user-start'>
                        ¿No tienes una cuenta? <b onClick={() => {
                            setNewUser(true);
                        }}>Registrarse</b>
                    </span>
                )}
            </form>
        </div>
    );
};

export default Login;
