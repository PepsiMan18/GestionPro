import React from 'react';

const Configuracion = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Configuración del Sistema</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
            Mantenedores de catálogos: Tipos de Inmueble, Sectores, Estado y parámetros generales.
          </p>
        </div>
      </div>
      
      {/* Placeholder para la configuración */}
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
        <i className="ph ph-gear" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>El módulo de configuración está en construcción.</p>
      </div>
    </div>
  );
};

export default Configuracion;
