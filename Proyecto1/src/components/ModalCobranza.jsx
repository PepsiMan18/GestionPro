import React, { useState, useEffect } from 'react';
import { registrarCobranza } from '../api/cobranzasApi';

const BANCOS = [
  { id: 'BCP', nombre: 'Banco de Crédito del Perú (BCP)' },
  { id: 'BBVA', nombre: 'BBVA Continental' },
  { id: 'INTERBANK', nombre: 'Interbank' },
  { id: 'SCOTIABANK', nombre: 'Scotiabank' },
  { id: 'BANBIF', nombre: 'BanBif' },
  { id: 'NACION', nombre: 'Banco de la Nación' }
];

const MEDIOS_PAGO = [
  { id: 'DP', nombre: 'Depósito en Cuenta' },
  { id: 'EF', nombre: 'Efectivo' },
  { id: 'PL', nombre: 'Plin' },
  { id: 'TR', nombre: 'Transferencia Bancaria' },
  { id: 'YA', nombre: 'Yape' }
];

const ModalCobranza = ({ recibo, onClose, onSuccess }) => {
  const [fechaCobranza, setFechaCobranza] = useState('');
  const [importePagar, setImportePagar] = useState('');
  const [medioPago, setMedioPago] = useState('');
  const [banco, setBanco] = useState('');
  const [nroOperacion, setNroOperacion] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Saldo calculado
  const saldoPendiente = recibo.saldo !== undefined ? recibo.saldo : recibo.total;

  useEffect(() => {
    // Set today's date automatically
    const today = new Date().toISOString().split('T')[0];
    setFechaCobranza(today);
    
    // Default to the full remaining balance
    setImportePagar(saldoPendiente);
  }, [saldoPendiente]);

  const handleImporteChange = (e) => {
    let val = e.target.value;
    if (Number(val) > saldoPendiente) {
      val = saldoPendiente; // No permitir que sea mayor al saldo
    }
    setImportePagar(val);
  };

  const requiereBanco = medioPago === 'DP' || medioPago === 'TR';
  const requiereNroOp = medioPago !== 'EF' && medioPago !== '';

  const handleGrabar = async () => {
    setError('');
    
    if (!importePagar || Number(importePagar) <= 0) {
      setError('El importe a pagar debe ser mayor a 0');
      return;
    }
    
    if (Number(importePagar) > saldoPendiente) {
      setError('El importe a pagar no puede ser mayor al saldo');
      return;
    }

    if (!medioPago) {
      setError('Debe seleccionar un medio de pago');
      return;
    }

    if (requiereBanco && !banco) {
      setError('Debe seleccionar un banco para este medio de pago');
      return;
    }

    if (requiereNroOp && !nroOperacion.trim()) {
      setError('El número de operación es obligatorio');
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        idRecibo: recibo.id,
        fechaCobranza,
        importePagado: Number(importePagar),
        medioPago,
        banco: requiereBanco ? banco : null,
        nroOperacion: requiereNroOp ? nroOperacion : null
      };

      await registrarCobranza(data);
      onSuccess(data);
    } catch (err) {
      setError(err.message || 'Error al procesar la cobranza');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2>Gestión de Cobranza</h2>
          <button className="btn-icon" onClick={onClose} disabled={isLoading}>
            <i className="ph ph-x"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div className="alert-error" style={{ marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px' }}>{error}</div>}
          
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'var(--bg-body)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Recibo Seleccionado</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{recibo.nroRi}</strong>
                  <span className="badge badge-vacant">{recibo.periodo}</span>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontWeight: '500' }}>{recibo.inquilino}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Deuda Total: S/ {recibo.total.toFixed(2)}</span>
                  <strong style={{ color: 'var(--status-debt)' }}>Saldo: S/ {Number(saldoPendiente).toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Fecha de Cobranza</label>
              <input type="date" className="form-control" value={fechaCobranza} onChange={(e) => setFechaCobranza(e.target.value)} disabled={isLoading} />
            </div>

            <div className="form-group">
              <label>Importe a Pagar (S/)</label>
              <input 
                type="number" 
                className="form-control" 
                value={importePagar} 
                onChange={handleImporteChange}
                max={saldoPendiente}
                min="0.01"
                step="0.01"
                disabled={isLoading}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Medio de Pago</label>
              <select className="form-control" value={medioPago} onChange={(e) => setMedioPago(e.target.value)} disabled={isLoading}>
                <option value="">-- Seleccionar --</option>
                {MEDIOS_PAGO.map(m => (
                  <option key={m.id} value={m.id}>{m.id} - {m.nombre}</option>
                ))}
              </select>
            </div>

            {requiereBanco && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Banco</label>
                <select className="form-control" value={banco} onChange={(e) => setBanco(e.target.value)} disabled={isLoading}>
                  <option value="">-- Seleccione Banco --</option>
                  {BANCOS.map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {requiereNroOp && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Nro. de Operación</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nroOperacion} 
                  onChange={(e) => setNroOperacion(e.target.value)}
                  placeholder="Ej. 123456789"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button className="btn-outline" onClick={onClose} disabled={isLoading}>Cancelar</button>
            <button className="btn-primary" onClick={handleGrabar} disabled={isLoading || !importePagar || !medioPago}>
              {isLoading ? 'Grabando...' : 'Grabar Cobranza'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCobranza;
