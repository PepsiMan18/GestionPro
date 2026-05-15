import React from 'react';
import './PanelControl.css';

const Reportes = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Reportes Financieros</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Visualiza métricas, ingresos y estado general de la inversión.</p>
        </div>
        <button className="btn-outline">
          <i className="ph ph-download-simple"></i>
          Exportar a Excel
        </button>
      </div>

      <div className="table-container" style={{padding: '5rem 2rem', textAlign: 'center'}}>
        <i className="ph-fill ph-chart-bar" style={{fontSize: '4rem', color: 'var(--text-muted)'}}></i>
        <h2 style={{marginTop: '1rem', color: 'var(--text-main)'}}>Módulo en construcción</h2>
        <p style={{color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto'}}>
          Pronto podrás ver aquí los gráficos de ingresos mensuales, gastos operativos e índice de morosidad.
        </p>
      </div>
    </div>
  );
};

export default Reportes;
