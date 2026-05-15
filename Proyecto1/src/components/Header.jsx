import React from 'react';

const Header = () => {
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
            <span className="user-name">Carlos G.</span>
            <span className="user-role">Administrador</span>
          </div>
          <i className="ph ph-caret-down" style={{color: 'var(--text-muted)'}}></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
