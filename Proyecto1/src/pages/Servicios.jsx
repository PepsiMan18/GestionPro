import React from 'react';
import './PanelControl.css';

const Servicios = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Control de Servicios (Agua/Luz)</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Registra las lecturas de medidores y calcula los cobros de servicios.</p>
        </div>
        <button className="btn-primary">
          <i className="ph ph-drop"></i>
          Registrar Lectura
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Lecturas del Mes Actual</h2>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Inmueble</th>
                <th>Servicio</th>
                <th>Lectura Anterior</th>
                <th>Lectura Actual</th>
                <th>Consumo</th>
                <th>Monto a Cobrar</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: '600'}}>Calle Los Pinos 123</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0284c7'}}>
                    <i className="ph-fill ph-drop"></i> Agua
                  </div>
                </td>
                <td>120 m³</td>
                <td>125 m³</td>
                <td>5 m³</td>
                <td className="price-text">$15.00</td>
                <td><span className="badge badge-alert">Pendiente</span></td>
              </tr>
              <tr>
                <td style={{fontWeight: '600'}}>Av. Las Gardenias 456</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308'}}>
                    <i className="ph-fill ph-lightning"></i> Luz
                  </div>
                </td>
                <td>450 kWh</td>
                <td>510 kWh</td>
                <td>60 kWh</td>
                <td className="price-text">$42.00</td>
                <td><span className="badge badge-occupied">Facturado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Servicios;
