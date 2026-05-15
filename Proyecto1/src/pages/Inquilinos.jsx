import React from 'react';
import './PanelControl.css';

const Inquilinos = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Directorio de Inquilinos</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Administra la información de contacto y estado de tus inquilinos.</p>
        </div>
        <button className="btn-primary">
          <i className="ph ph-user-plus"></i>
          Nuevo Inquilino
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Lista de Inquilinos</h2>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Contacto</th>
                <th>Inmueble Asignado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: '600'}}>Juan Pérez</td>
                <td>DNI 12345678</td>
                <td>
                  <div style={{fontSize: '0.875rem'}}>+51 987654321</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>juan@email.com</div>
                </td>
                <td>Calle Los Pinos 123</td>
                <td><span className="badge badge-occupied">Activo</span></td>
                <td>
                  <button className="btn-outline" style={{ fontSize: '0.875rem' }}>Ver Perfil</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inquilinos;
