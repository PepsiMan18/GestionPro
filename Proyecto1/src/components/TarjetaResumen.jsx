import React from 'react';

const TarjetaResumen = ({ titulo, valor, icono, color }) => {
  return (
    <div className="summary-card">
      <div 
        className="summary-icon-wrapper" 
        style={{ 
          backgroundColor: `var(--${color}-bg, #e0e7ff)`,
          color: `var(--${color}, #4f46e5)`
        }}
      >
        <i className={`ph ${icono}`}></i>
      </div>
      <div className="summary-info">
        <span className="summary-label">{titulo}</span>
        <span className="summary-value">{valor}</span>
      </div>
    </div>
  );
};

export default TarjetaResumen;
