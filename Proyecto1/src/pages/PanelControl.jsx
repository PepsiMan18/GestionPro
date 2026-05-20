import React from 'react';
import TarjetaResumen from '../components/TarjetaResumen';
import './PanelControl.css';

const PanelControl = ({ listaInmuebles = [] }) => {
  const total = listaInmuebles.length;
  const ocupados = listaInmuebles.filter(i => i.estado === 'Ocupado' || i.estado === 'Con Deuda').length;
  const vacios = listaInmuebles.filter(i => i.estado === 'Desocupado' || i.estado === 'Disponible').length;
  const morosos = listaInmuebles.filter(i => i.estado === 'Con Deuda').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Control</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Resumen general del estado de tus propiedades e inquilinos.</p>
        </div>
      </div>

      <div className="summary-grid">
        <TarjetaResumen titulo="Total Inmuebles" valor={total} icono="ph-buildings" color="primary" />
        <TarjetaResumen titulo="Ocupados" valor={ocupados} icono="ph-door" color="status-occupied" />
        <TarjetaResumen titulo="Desocupados" valor={vacios} icono="ph-door-open" color="status-vacant" />
        <TarjetaResumen titulo="Pagos Atrasados" valor={morosos} icono="ph-warning-circle" color="status-debt" />
      </div>

      <div style={{marginTop: '2rem'}}>
        <h3>Actividad Reciente</h3>
        <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Aquí podremos ver el historial de los últimos recibos pagados o alertas.</p>
      </div>
    </div>
  );
};

export default PanelControl;
