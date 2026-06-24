import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="ph-fill ph-buildings logo-icon"></i>
        <span className="logo-text">GestiónPro</span>
      </div>
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-squares-four sidebar-icon"></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/inmuebles" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-house-line sidebar-icon"></i>
              Mis Inmuebles
            </NavLink>
          </li>
          <li>
            <NavLink to="/inquilinos" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-users sidebar-icon"></i>
              Inquilinos
            </NavLink>
          </li>
          <li>
            <NavLink to="/contratos" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-file-text sidebar-icon"></i>
              Contratos
            </NavLink>
          </li>
          <li>
            <NavLink to="/consumo-servicios" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-drop sidebar-icon"></i>
              Consumo de Servicios
            </NavLink>
          </li>
          <li>
            <NavLink to="/emision-recibos" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-receipt sidebar-icon"></i>
              Emisión de Recibos
            </NavLink>
          </li>
          <li>
            <NavLink to="/facturacion" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-money sidebar-icon"></i>
              Pagos y Cobranzas
            </NavLink>
          </li>
          <li>
            <NavLink to="/reportes" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-chart-line-up sidebar-icon"></i>
              Reportes
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuracion" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <i className="ph ph-gear sidebar-icon"></i>
              Configuración
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
