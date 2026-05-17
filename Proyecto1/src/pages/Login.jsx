import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@gestion.com' && password === '123456789') {
      setError('');
      onLogin();
    } else {
      setError('Correo o contraseña incorrectos.');
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
            <label className="form-label">Correo Electrónico</label>
            <div className="input-with-icon">
              <i className="ph ph-envelope"></i>
              <input 
                type="email" 
                className="form-control" 
                placeholder="admin@gestion.com" 
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
