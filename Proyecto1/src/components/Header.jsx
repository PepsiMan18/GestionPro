import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <header className="header">
      <div className="header-search">
        <i className="ph ph-magnifying-glass"></i>
        <input type="text" placeholder="Buscar inquilino o inmueble..." />
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <i className="ph ph-bell"></i>
          <span className="notification-badge"></span>
        </button>

        <div className="user-profile">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff"
            alt="Admin"
            className="avatar"
          />
          <div className="user-info">
            <span className="user-name">Usuario</span>
            <span className="user-role">Administrador</span>
          </div>
          <i className="ph ph-caret-down" style={{ color: 'var(--text-muted)' }}></i>
        </div>
        <button 
          onClick={onLogout}
          style={{
            background: 'transparent', border: 'none', color: 'var(--danger)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s'
          }}
          title="Cerrar Sesión"
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <i className="ph ph-sign-out" style={{ fontSize: '1.25rem' }}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
