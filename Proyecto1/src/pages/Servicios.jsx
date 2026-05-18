import React, { useState } from 'react';
import TablaServicios from '../components/TablaServicios';
import ModalServicio from '../components/ModalServicio';
import './PanelControl.css';

const Servicios = ({ listaServicios, setListaServicios, listaContratos, listaInmuebles }) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleGuardarServicio = (nuevoServicio) => {
    // Generar nuevo ID
    const newId = listaServicios.length > 0 ? Math.max(...listaServicios.map(s => s.id)) + 1 : 1;
    setListaServicios([...listaServicios, { ...nuevoServicio, id: newId }]);
    setModalAbierto(false);
  };

  // Calcular métricas
  const totalMontoPendiente = listaServicios
    .filter(s => s.estado === 'Pendiente')
    .reduce((sum, s) => sum + s.monto, 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Control de Servicios (Agua/Luz)</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Registra las lecturas de medidores y calcula los cobros de servicios.</p>
        </div>
        <button className="btn-primary" onClick={() => setModalAbierto(true)}>
          <i className="ph ph-drop"></i>
          Registrar Lectura
        </button>
      </div>

      <div className="summary-cards" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div className="summary-card">
          <div className="summary-icon" style={{background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7'}}>
            <i className="ph-fill ph-drop"></i>
          </div>
          <div className="summary-info">
            <h3>Agua Pendiente</h3>
            <p className="summary-number">
              S/ {listaServicios.filter(s => s.tipo === 'Agua' && s.estado === 'Pendiente').reduce((acc, curr) => acc + curr.monto, 0).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon" style={{background: 'rgba(234, 179, 8, 0.1)', color: '#eab308'}}>
            <i className="ph-fill ph-lightning"></i>
          </div>
          <div className="summary-info">
            <h3>Luz Pendiente</h3>
            <p className="summary-number">
              S/ {listaServicios.filter(s => s.tipo === 'Luz' && s.estado === 'Pendiente').reduce((acc, curr) => acc + curr.monto, 0).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon" style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}>
            <i className="ph-fill ph-warning-circle"></i>
          </div>
          <div className="summary-info">
            <h3>Total por Cobrar</h3>
            <p className="summary-number">S/ {totalMontoPendiente.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <TablaServicios 
        servicios={listaServicios} 
        contratos={listaContratos} 
        inmuebles={listaInmuebles} 
      />

      <ModalServicio
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        alGuardar={handleGuardarServicio}
        contratos={listaContratos}
        inmuebles={listaInmuebles}
      />
    </div>
  );
};

export default Servicios;
