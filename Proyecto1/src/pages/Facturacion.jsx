import React, { useState } from 'react';
import './PanelControl.css';
import ModalCobranza from '../components/ModalCobranza';

const Facturacion = ({ listaRecibos = [], setListaRecibos }) => {
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  // Filtrar recibos que NO están anulados ni pagados completamente
  // y calcular su saldo actual. Asumimos que si no tiene "saldo", es igual al total.
  const recibosPendientes = listaRecibos
    .filter(r => r.estado !== 'Anulado')
    .map(r => ({
      ...r,
      saldo: r.saldo !== undefined ? r.saldo : r.total
    }))
    .filter(r => r.saldo > 0);

  const handleCobranzaSuccess = (data) => {
    // Actualizar el saldo del recibo cobrado
    const nuevosRecibos = listaRecibos.map(r => {
      if (r.id === data.idRecibo) {
        const saldoAnterior = r.saldo !== undefined ? r.saldo : r.total;
        const nuevoSaldo = saldoAnterior - data.importePagado;
        
        return {
          ...r,
          saldo: Math.max(0, nuevoSaldo),
          estado: nuevoSaldo <= 0.01 ? 'Pagado' : r.estado
        };
      }
      return r;
    });

    setListaRecibos(nuevosRecibos);
    setReciboSeleccionado(null);
    alert('Cobranza registrada correctamente.');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Gestión de Cobranzas</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Controla los ingresos y registra los pagos de los recibos emitidos.</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Documentos por Cobrar (Saldo &gt; 0)</h2>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Inquilino</th>
                <th>Inmueble</th>
                <th>Nro Documento</th>
                <th>Fecha Emisión</th>
                <th>Fecha Vcmto</th>
                <th>Moneda</th>
                <th>Importe</th>
                <th>Saldo Pendiente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recibosPendientes.map((recibo) => (
                <tr key={recibo.id}>
                  <td>
                    <div style={{fontWeight: '600'}}>{recibo.inquilino}</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{recibo.tipo}</div>
                  </td>
                  <td>{recibo.inmueble}</td>
                  <td><strong>{recibo.nroRi}</strong></td>
                  <td>{recibo.fechaEmision}</td>
                  <td>{recibo.fechaVencimiento || '-'}</td>
                  <td>PEN (S/)</td>
                  <td className="price-text">S/ {Number(recibo.total).toFixed(2)}</td>
                  <td>
                    <strong style={{ color: 'var(--status-debt)' }}>
                      S/ {Number(recibo.saldo).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <button 
                      className="btn-primary" 
                      style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}
                      onClick={() => setReciboSeleccionado(recibo)}
                    >
                      <i className="ph ph-hand-coins"></i>
                      Cobrar
                    </button>
                  </td>
                </tr>
              ))}
              {recibosPendientes.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <i className="ph ph-check-circle" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--status-occupied)' }}></i>
                      <p>No hay documentos pendientes de cobro.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {reciboSeleccionado && (
        <ModalCobranza 
          recibo={reciboSeleccionado}
          onClose={() => setReciboSeleccionado(null)}
          onSuccess={handleCobranzaSuccess}
        />
      )}
    </div>
  );
};

export default Facturacion;
