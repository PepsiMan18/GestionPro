import React from 'react';
import './PanelControl.css';

const Facturacion = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Pagos y Facturación Electrónica</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Controla los ingresos, genera comprobantes y emite facturas electrónicas.</p>
        </div>
        <button className="btn-primary">
          <i className="ph ph-receipt"></i>
          Emitir Factura Libre
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Historial de Pagos Recientes</h2>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Inquilino / Inmueble</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Método de Pago</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>26 Oct 2026</td>
                <td>
                  <div style={{fontWeight: '600'}}>Juan Pérez</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Calle Los Pinos 123</div>
                </td>
                <td>Alquiler Octubre</td>
                <td className="price-text">S/ 1,000.00</td>
                <td>Transferencia Bancaria</td>
                <td>
                  <button className="btn-outline" style={{ fontSize: '0.875rem' }}>
                    <i className="ph ph-file-pdf"></i>
                    Ver Factura
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Facturacion;
