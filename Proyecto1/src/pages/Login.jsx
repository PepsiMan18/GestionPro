import React, { useState } from 'react';
import { login } from '../api/authApi';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password); // El backend espera "admin"
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('rol', data.rol);
      sessionStorage.setItem('nombreUsuario', data.nombreUsuario);
      setError('');
      onLogin();
    } catch (err) {
      console.error(err);
      if (err.message === 'Failed to fetch') {
        setError('Error de conexión (Posible problema de CORS en el backend).');
      } else {
        setError(err.message || 'Error al iniciar sesión.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="ph-fill ph-buildings login-logo"></i>
          <h1>GestiónPro</h1>
          <p>Bienvenido de vuelta, ingresa tus credenciales para acceder al panel de administración.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <i className="ph ph-warning-circle"></i> {error}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <div className="input-with-icon">
              <i className="ph ph-user"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej. admin" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-with-icon">
              <i className="ph ph-lock-key"></i>
              <input 
                type="password" 
                className="form-control" 
                placeholder="•••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-login">
            Ingresar al Sistema <i className="ph ph-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
