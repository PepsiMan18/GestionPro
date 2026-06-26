import React, { useState, useEffect } from 'react';

const ModalEmitirRecibo = ({ 
  onClose, 
  listaRecibos, 
  setListaRecibos, 
  listaContratos, 
  listaConceptos, 
  listaInquilinos, 
  listaInmuebles,
  setIsLoadingGlobal
}) => {
  const [paso, setPaso] = useState(1);
  const [tipoRi, setTipoRi] = useState('');
  
  const [contratoId, setContratoId] = useState('');
  const [datosContrato, setDatosContrato] = useState(null);
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [periodo, setPeriodo] = useState('');
  
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [conceptosActivos, setConceptosActivos] = useState([]);
  
  // Precio unitario inventado para el cálculo de consumo variable
  const PRECIO_UNITARIO_AGUA = 2.50; 
  const PRECIO_UNITARIO_LUZ = 1.20;

  useEffect(() => {
    // Generar periodo actual MM/YYYY
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    setPeriodo(`${mes}/${anio}`);
    
    // Asumimos 15 días de vencimiento
    const fv = new Date();
    fv.setDate(fv.getDate() + 15);
    setFechaVencimiento(fv.toISOString().split('T')[0]);
  }, []);

  const handleContratoChange = (e) => {
    const cid = parseInt(e.target.value);
    setContratoId(cid);
    
    if (cid) {
      const c = listaContratos.find(c => Number(c.id) === Number(cid));
      const inq = listaInquilinos.find(i => Number(i.id) === Number(c.idInquilino));
      const inm = listaInmuebles.find(i => Number(i.id) === Number(c.idInmueble));
      setDatosContrato({
        inquilino: c.nombreInquilino || (inq ? inq.nombre || inq.razonSocial : 'Desconocido'),
        inmueble: c.codigoInmueble || (inm ? inm.codigo : 'Desconocido'),
      });
      setMostrarDetalle(false);
      setConceptosActivos([]);
    } else {
      setDatosContrato(null);
      setMostrarDetalle(false);
      setConceptosActivos([]);
    }
  };

  const activarDetalle = () => {
    setIsLoadingGlobal(true);
    setTimeout(() => {
      const habilitados = listaConceptos.filter(c => c.estado === 'Habilitado');
      const preparados = habilitados.map(c => ({
        ...c,
        lecturaInicial: c.tipo === 'Variable' ? 0 : null,
        lecturaFinal: c.tipo === 'Variable' ? 0 : null,
        importeCalculado: c.tipo === 'Fijo' ? c.importe : 0
      }));
      setConceptosActivos(preparados);
      setMostrarDetalle(true);
      setIsLoadingGlobal(false);
    }, 800); // Simulando red
  };

  const handleLecturaChange = (id, campo, valor) => {
    const valNum = parseFloat(valor) || 0;
    setConceptosActivos(prev => prev.map(c => {
      if (c.id === id) {
        const nuevoC = { ...c, [campo]: valNum };
        if (c.tipo === 'Variable') {
          const lInicial = campo === 'lecturaInicial' ? valNum : c.lecturaInicial;
          const lFinal = campo === 'lecturaFinal' ? valNum : c.lecturaFinal;
          const consumo = Math.max(0, lFinal - lInicial);
          // Calcular según tipo
          let precio = 1;
          if (c.descCorta.toLowerCase().includes('agua')) precio = PRECIO_UNITARIO_AGUA;
          else if (c.descCorta.toLowerCase().includes('luz') || c.descCorta.toLowerCase().includes('energ')) precio = PRECIO_UNITARIO_LUZ;
          
          nuevoC.importeCalculado = consumo * precio;
        }
        return nuevoC;
      }
      return c;
    }));
  };

  const calcularTotal = () => {
    return conceptosActivos.reduce((acc, c) => acc + c.importeCalculado, 0);
  };

  const handleGrabar = () => {
    if (!contratoId) {
      alert("Seleccione un contrato primero");
      return;
    }
    const total = calcularTotal();
    if (total <= 0) {
      alert("El recibo debe tener un monto mayor a 0");
      return;
    }

    setIsLoadingGlobal(true);
    setTimeout(() => {
      const nuevoId = Date.now();
      const nroFormateado = `RI-${String(listaRecibos.length + 1).padStart(4, '0')}`;
      
      const nuevoRI = {
        id: nuevoId,
        nroRi: nroFormateado,
        idContrato: contratoId,
        tipo: tipoRi,
        inquilino: datosContrato.inquilino,
        inmueble: datosContrato.inmueble,
        fechaEmision: fechaEmision,
        fechaVencimiento: fechaVencimiento,
        periodo: periodo,
        total: total,
        estado: 'Emitido',
        detalle: conceptosActivos // Guardamos para un futuro
      };

      setListaRecibos([...listaRecibos, nuevoRI]);
      setIsLoadingGlobal(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: paso === 2 ? '800px' : '500px' }}>
        <div className="modal-header">
          <h2>Emitir Recibo de Ingreso - Paso {paso}</h2>
          <button className="btn-icon" onClick={onClose}>
            <i className="ph ph-x"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {paso === 1 && (
            <div className="form-grid">
              <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>¿Qué tipo de recibo deseas generar?</p>
                
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  
                  <div 
                    onClick={() => setTipoRi('Consumo de servicios')}
                    style={{ 
                      padding: '1.25rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: tipoRi === 'Consumo de servicios' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                      backgroundColor: tipoRi === 'Consumo de servicios' ? 'var(--primary-light)' : 'var(--bg-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', color: tipoRi === 'Consumo de servicios' ? 'var(--primary)' : 'var(--text-muted)' }}>
                      <i className="ph ph-drop"></i>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: tipoRi === 'Consumo de servicios' ? 'var(--primary)' : 'var(--text-main)' }}>Consumo de Servicios</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cobro de agua, luz, internet, vigilancia y otros mantenimientos.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setTipoRi('Alquiler de Inmueble')}
                    style={{ 
                      padding: '1.25rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: tipoRi === 'Alquiler de Inmueble' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                      backgroundColor: tipoRi === 'Alquiler de Inmueble' ? 'var(--primary-light)' : 'var(--bg-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', color: tipoRi === 'Alquiler de Inmueble' ? 'var(--primary)' : 'var(--text-muted)' }}>
                      <i className="ph ph-house-line"></i>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: tipoRi === 'Alquiler de Inmueble' ? 'var(--primary)' : 'var(--text-main)' }}>Alquiler de Inmueble</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cuota mensual por el arrendamiento del local u oficina.</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <button 
                  className="btn-outline" 
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => setPaso(2)} 
                  disabled={!tipoRi}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="form-grid">
              {/* Info de Selección */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>3. Seleccione Contrato (solo vigentes)</label>
                <select className="form-control" value={contratoId} onChange={handleContratoChange}>
                  <option value="">-- Seleccione --</option>
                  {listaContratos.filter(c => c.estado === 'Vigente' || c.estado === 'Doc Pendiente').map(c => {
                    const inm = listaInmuebles.find(i => Number(i.id) === Number(c.idInmueble));
                    const codInmueble = c.codigoInmueble || (inm ? inm.codigo : c.idInmueble);
                    return (
                      <option key={c.id} value={c.id}>
                        Contrato #{c.id} - Inmueble: {codInmueble}
                      </option>
                    );
                  })}
                </select>
              </div>

              {datosContrato && (
                <>
                  <div className="form-group">
                    <label>Inquilino</label>
                    <input type="text" className="form-control" value={datosContrato.inquilino} readOnly disabled />
                  </div>
                  <div className="form-group">
                    <label>Inmueble</label>
                    <input type="text" className="form-control" value={datosContrato.inmueble} readOnly disabled />
                  </div>
                  <div className="form-group">
                    <label>Fecha Emisión</label>
                    <input type="date" className="form-control" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Fecha Vencimiento</label>
                    <input type="date" className="form-control" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Período</label>
                    <input type="text" className="form-control" value={periodo} readOnly disabled />
                  </div>
                  
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4>Detalle de Conceptos</h4>
                    {!mostrarDetalle && (
                      <button className="btn-outline" onClick={activarDetalle}>
                        <i className="ph ph-list-numbers"></i> Activar Detalle
                      </button>
                    )}
                  </div>

                  {mostrarDetalle && (
                    <div className="table-responsive" style={{ gridColumn: '1 / -1' }}>
                      <table className="data-table" style={{ fontSize: '0.9rem' }}>
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>U.M.</th>
                            <th>Lect. Inicial</th>
                            <th>Lect. Final</th>
                            <th>Importe ($)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conceptosActivos.map(c => (
                            <tr key={c.id}>
                              <td>{c.descripcion}</td>
                              <td>{c.unidad || '-'}</td>
                              {c.tipo === 'Variable' ? (
                                <>
                                  <td>
                                    <input 
                                      type="number" 
                                      className="form-control" 
                                      style={{ width: '100px', padding: '4px' }}
                                      value={c.lecturaInicial} 
                                      onChange={(e) => handleLecturaChange(c.id, 'lecturaInicial', e.target.value)} 
                                    />
                                  </td>
                                  <td>
                                    <input 
                                      type="number" 
                                      className="form-control" 
                                      style={{ width: '100px', padding: '4px' }}
                                      value={c.lecturaFinal} 
                                      onChange={(e) => handleLecturaChange(c.id, 'lecturaFinal', e.target.value)} 
                                    />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="text-muted">-</td>
                                  <td className="text-muted">-</td>
                                </>
                              )}
                              <td><strong>{c.importeCalculado.toFixed(2)}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="4" className="text-right"><strong>TOTAL A PAGAR:</strong></td>
                            <td><strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>${calcularTotal().toFixed(2)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </>
              )}

              <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button className="btn-outline" onClick={() => setPaso(1)}>Atrás</button>
                <button className="btn-primary" onClick={handleGrabar} disabled={!mostrarDetalle || calcularTotal() <= 0}>
                  Grabar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalEmitirRecibo;
