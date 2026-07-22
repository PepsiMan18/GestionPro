import React, { useState } from 'react';
import './PanelControl.css';

const Reportes = ({ listaContratos = [], listaRecibos = [], listaInquilinos = [], listaInmuebles = [] }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Funciones auxiliares para calcular estados de contratos
  const getEstadoContrato = (contrato) => {
    if (contrato.estado === 'Finalizado' || contrato.estado === 'Anulado') return 'Cerrado';
    
    if (contrato.fechaFin) {
      const hoy = new Date();
      const fin = new Date(contrato.fechaFin);
      const diffTime = fin - hoy;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Vencido';
      if (diffDays <= 30) return 'Por Vencer';
      return 'Vigente';
    }
    
    return contrato.estado;
  };

  const getInquilinoName = (idInq) => {
    const inq = listaInquilinos.find(i => Number(i.id) === Number(idInq));
    return inq ? inq.nombre : 'Inquilino Desconocido';
  };

  const getInmuebleName = (idInm) => {
    const inm = listaInmuebles.find(i => Number(i.id) === Number(idInm));
    return inm ? inm.codigo : 'Inmueble Desconocido';
  };

  // --- REPORTE 1: CONTRATOS VIGENTES, VENCIDOS ---
  const rep1_contratos = listaContratos.filter(c => {
    const estado = getEstadoContrato(c);
    return estado === 'Vigente' || estado === 'Vencido';
  });

  // --- REPORTE 2: RI PENDIENTES DE COBRAR ---
  const rep2_pendientes = listaRecibos.filter(r => {
    const saldo = r.saldo !== undefined ? r.saldo : r.total;
    return r.estado !== 'Anulado' && r.estado !== 'Pagado' && saldo > 0;
  });
  const rep2_totalDeuda = rep2_pendientes.reduce((acc, r) => acc + (r.saldo !== undefined ? r.saldo : r.total), 0);

  // --- REPORTE 3: CLIENTES MOROSOS ---
  // Recibos con saldo > 0 y cuya fecha de vencimiento ya pasó
  const recibosMorosos = rep2_pendientes.filter(r => {
    if (!r.fechaVencimiento) return false;
    return new Date(r.fechaVencimiento) < new Date();
  });
  
  // Agrupar deuda por inquilino
  const morososAgrupados = {};
  recibosMorosos.forEach(r => {
    if (!morososAgrupados[r.inquilino]) {
      // Buscar datos del inquilino
      const inq = listaInquilinos.find(i => i.nombre.toLowerCase().trim() === r.inquilino.toLowerCase().trim());
      
      morososAgrupados[r.inquilino] = {
        nombre: r.inquilino,
        documento: inq ? `${inq.tipoDocumento} ${inq.numeroDocumento}` : '-',
        contacto: inq ? `+51 ${inq.celular}` : '-',
        deudaTotal: 0,
        recibosVencidos: 0
      };
    }
    morososAgrupados[r.inquilino].deudaTotal += (r.saldo !== undefined ? r.saldo : r.total);
    morososAgrupados[r.inquilino].recibosVencidos += 1;
  });
  const rep3_morosos = Object.values(morososAgrupados).sort((a, b) => b.deudaTotal - a.deudaTotal);
  const rep3_totalMora = rep3_morosos.reduce((acc, m) => acc + m.deudaTotal, 0);

  // --- REPORTE 4: CONTRATOS PROXIMOS A VENCER ---
  const rep4_proximos = listaContratos.filter(c => getEstadoContrato(c) === 'Por Vencer');

  // --- REPORTE 5: INMUEBLES DISPONIBLES ---
  const rep5_disponibles = listaInmuebles.filter(i => 
    i.estado === 'Desocupado' || i.estado === 'Disponible'
  );

  const TABS = [
    { id: 0, label: 'Contratos Vigentes/Vencidos', icon: 'ph-file-text' },
    { id: 1, label: 'RI Pendientes de Cobrar', icon: 'ph-receipt' },
    { id: 2, label: 'Clientes Morosos', icon: 'ph-warning-circle' },
    { id: 3, label: 'Contratos Próximos a Vencer', icon: 'ph-clock-countdown' },
    { id: 4, label: 'Inmuebles Disponibles', icon: 'ph-house-line' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="dashboard-title">Reportes Gerenciales</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Monitorea el estado de contratos, deudas y disponibilidad de inmuebles.</p>
        </div>
        <button className="btn-outline" onClick={() => window.print()}>
          <i className="ph ph-printer"></i>
          Imprimir Reporte
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        {TABS.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1rem',
              background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <i className={`ph ${tab.icon}`} style={{ fontSize: '1.25rem' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORTE 1 */}
      {activeTab === 0 && (
        <div className="table-container fade-in">
          <div className="table-header">
            <h2 className="table-title">Contratos Vigentes y Vencidos</h2>
            <span className="badge badge-vacant">Total: {rep1_contratos.length}</span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Inmueble</th>
                  <th>Inquilino</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rep1_contratos.map(c => {
                  const estado = getEstadoContrato(c);
                  return (
                    <tr key={c.id}>
                      <td style={{fontWeight: 600}}>{c.codigoInmueble || getInmuebleName(c.idInmueble)}</td>
                      <td>{c.nombreInquilino || getInquilinoName(c.idInquilino)}</td>
                      <td>{c.fechaInicio}</td>
                      <td>{c.fechaFin}</td>
                      <td className="price-text">S/ {Number(c.monto).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${estado === 'Vigente' ? 'badge-vacant' : 'badge-debt'}`}>
                          {estado}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {rep1_contratos.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No se encontraron contratos bajo este criterio.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTE 2 */}
      {activeTab === 1 && (
        <div className="table-container fade-in">
          <div className="table-header">
            <h2 className="table-title">RI Pendientes de Cobrar</h2>
            <span className="badge badge-debt" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              Deuda Total Esperada: S/ {rep2_totalDeuda.toFixed(2)}
            </span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nro Documento</th>
                  <th>Inquilino</th>
                  <th>Inmueble</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vcmto</th>
                  <th>Saldo Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {rep2_pendientes.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.nroRi}</strong></td>
                    <td>{r.inquilino}</td>
                    <td>{r.inmueble}</td>
                    <td>{r.fechaEmision}</td>
                    <td>{r.fechaVencimiento || '-'}</td>
                    <td><strong style={{color: 'var(--status-debt)'}}>S/ {Number(r.saldo !== undefined ? r.saldo : r.total).toFixed(2)}</strong></td>
                  </tr>
                ))}
                {rep2_pendientes.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No hay recibos pendientes de cobrar. ¡Todo está al día!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTE 3 */}
      {activeTab === 2 && (
        <div className="table-container fade-in">
          <div className="table-header">
            <h2 className="table-title">Relación de Clientes Morosos</h2>
            <span className="badge badge-debt" style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: '#fee2e2', color: '#b91c1c' }}>
              Mora Acumulada: S/ {rep3_totalMora.toFixed(2)}
            </span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Inquilino / Razón Social</th>
                  <th>Documento</th>
                  <th>Contacto</th>
                  <th>Recibos Vencidos</th>
                  <th>Deuda Total Vencida</th>
                </tr>
              </thead>
              <tbody>
                {rep3_morosos.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{fontWeight: 600}}>{m.nombre}</td>
                    <td>{m.documento}</td>
                    <td>{m.contacto}</td>
                    <td>
                      <span className="badge badge-occupied" style={{background: '#fef08a', color: '#854d0e'}}>
                        {m.recibosVencidos} recibo(s)
                      </span>
                    </td>
                    <td><strong style={{color: '#b91c1c', fontSize: '1.1rem'}}>S/ {m.deudaTotal.toFixed(2)}</strong></td>
                  </tr>
                ))}
                {rep3_morosos.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: 'var(--status-vacant)'}}>
                    <i className="ph ph-smiley" style={{fontSize: '2rem', display: 'block', marginBottom: '0.5rem'}}></i>
                    ¡Excelente! No hay clientes con deudas vencidas actualmente.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTE 4 */}
      {activeTab === 3 && (
        <div className="table-container fade-in">
          <div className="table-header">
            <h2 className="table-title">Contratos Próximos a Vencer (30 días)</h2>
            <span className="badge badge-occupied">Total: {rep4_proximos.length}</span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Inmueble</th>
                  <th>Inquilino</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rep4_proximos.map(c => (
                  <tr key={c.id}>
                    <td style={{fontWeight: 600}}>{c.codigoInmueble || getInmuebleName(c.idInmueble)}</td>
                    <td>{c.nombreInquilino || getInquilinoName(c.idInquilino)}</td>
                    <td>{c.fechaInicio}</td>
                    <td><strong style={{color: '#d97706'}}>{c.fechaFin}</strong></td>
                    <td className="price-text">S/ {Number(c.monto).toFixed(2)}</td>
                    <td>
                      <span className="badge badge-occupied" style={{background: '#fef08a', color: '#854d0e'}}>
                        Por Vencer
                      </span>
                    </td>
                  </tr>
                ))}
                {rep4_proximos.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No hay contratos próximos a vencer en los siguientes 30 días.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTE 5 */}
      {activeTab === 4 && (
        <div className="table-container fade-in">
          <div className="table-header">
            <h2 className="table-title">Inmuebles Disponibles</h2>
            <span className="badge badge-vacant">Disponibles: {rep5_disponibles.length}</span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Sector</th>
                  <th>Área / Piso</th>
                  <th>Precio Sugerido</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rep5_disponibles.map(i => (
                  <tr key={i.id}>
                    <td><strong>{i.codigo}</strong></td>
                    <td>{i.descripcion}</td>
                    <td>{i.sector}</td>
                    <td>{i.area || '-'} / {i.piso || '-'}</td>
                    <td className="price-text">{i.alquiler}</td>
                    <td>
                      <span className="badge badge-vacant">Disponible</span>
                    </td>
                  </tr>
                ))}
                {rep5_disponibles.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No hay inmuebles disponibles en este momento. ¡Ocupación al 100%!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reportes;
