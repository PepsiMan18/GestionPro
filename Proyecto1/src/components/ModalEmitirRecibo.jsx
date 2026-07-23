import React, { useState, useEffect } from 'react';
import { createReciboConsumo, agregarDetalleRecibo } from '../api/recibosApi';

const ModalEmitirRecibo = ({ 
  onClose, 
  listaRecibos, 
  setListaRecibos, 
  listaContratos, 
  listaConceptos, 
  listaInquilinos, 
  listaInmuebles,
  setIsLoadingGlobal,
  lecturasTemporales,
  setLecturasTemporales
}) => {
  const [paso, setPaso] = useState(1);
  const [tipoRi, setTipoRi] = useState('');
  
  const [contratoId, setContratoId] = useState('');
  const [datosContrato, setDatosContrato] = useState(null);
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [conceptosActivos, setConceptosActivos] = useState([]);
  const [mesesGarantiaCobro, setMesesGarantiaCobro] = useState(0);
  
  // Precio unitario inventado para el cálculo de consumo variable
  const PRECIO_UNITARIO_AGUA = 2.50; 
  const PRECIO_UNITARIO_LUZ = 1.20;

  useEffect(() => {
    // Generar periodo actual MM/YYYY por defecto si no hay contrato
    const hoy = new Date();
    const opcionesMes = { month: 'long', year: 'numeric' };
    const nombreMes = hoy.toLocaleDateString('es-ES', opcionesMes);
    setPeriodo(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));
    
    // Asumimos 15 días de vencimiento
    const fv = new Date();
    fv.setDate(fv.getDate() + 15);
    setFechaVencimiento(fv.toISOString().split('T')[0]);
  }, []);

  const generarMesesContrato = (fechaInicio, fechaFin) => {
    const meses = [];
    if (!fechaInicio || !fechaFin) return meses;
    
    // Evitar problemas de zona horaria agregando T12:00:00
    let actual = new Date(fechaInicio + 'T12:00:00');
    const fin = new Date(fechaFin + 'T12:00:00');
    
    const opcionesMes = { month: 'long', year: 'numeric' };
    
    while (actual <= fin || (actual.getMonth() === fin.getMonth() && actual.getFullYear() === fin.getFullYear())) {
      const nombreMes = actual.toLocaleDateString('es-ES', opcionesMes);
      const nombreCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
      if (!meses.includes(nombreCapitalizado)) {
        meses.push(nombreCapitalizado);
      }
      actual.setMonth(actual.getMonth() + 1);
    }
    return meses;
  };

  const handleContratoChange = (e) => {
    const cid = parseInt(e.target.value);
    setContratoId(cid);
    
    if (cid) {
      const c = listaContratos.find(c => Number(c.id) === Number(cid));
      const inq = listaInquilinos.find(i => Number(i.id) === Number(c.idInquilino));
      const inm = listaInmuebles.find(i => Number(i.id) === Number(c.idInmueble));

      const montoAlquiler = parseFloat(c.monto) || 0;
      const numGarDef = tipoRi === 'Garantía de Alquiler' ? (parseInt(c.mesesGarantia) || 1) : 0;
      setMesesGarantiaCobro(numGarDef);

      setDatosContrato({
        inquilino: c.nombreInquilino || (inq ? inq.nombre || inq.razonSocial : 'Desconocido'),
        inmueble: c.codigoInmueble || (inm ? inm.codigo : 'Desconocido'),
        monto: montoAlquiler,
        mesesGarantiaContrato: c.mesesGarantia || 1
      });
      
      let mesesCalculados = generarMesesContrato(c.fechaInicio, c.fechaFin);
      
      // Filtrar meses que ya fueron cobrados (no anulados)
      const recibosValidos = listaRecibos.filter(r => Number(r.idContrato) === Number(cid) && r.tipo === tipoRi && r.estado !== 'Anulado');
      const mesesYaCobrados = recibosValidos.map(r => r.periodo);
      
      mesesCalculados = mesesCalculados.filter(m => !mesesYaCobrados.includes(m));
      
      if (tipoRi === 'Consumo de servicios') {
         const hoy = new Date();
         const mesActual = hoy.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
         const actualCap = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);
         
         const pasado = new Date();
         pasado.setMonth(pasado.getMonth() - 1);
         const mesPasado = pasado.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
         const pasadoCap = mesPasado.charAt(0).toUpperCase() + mesPasado.slice(1);
         
         mesesCalculados = mesesCalculados.filter(m => m === actualCap || m === pasadoCap);
         
         if (mesesCalculados.length === 0) {
             const ultimo = generarMesesContrato(c.fechaInicio, c.fechaFin).pop();
             if (ultimo && !mesesYaCobrados.includes(ultimo)) mesesCalculados.push(ultimo);
         }
      }
      
      setMesesDisponibles(mesesCalculados);
      if (mesesCalculados.length > 0) {
        setPeriodo(mesesCalculados[mesesCalculados.length - 1]);
      } else {
        setPeriodo('Todos los meses cobrados');
      }
      
      if (tipoRi === 'Alquiler de Inmueble') {
        let conceptos = [{
          id: 'alquiler',
          descripcion: 'Alquiler de Inmueble (Mes Adelantado)',
          tipo: 'Fijo',
          importeCalculado: montoAlquiler
        }];
        if (numGarDef > 0) {
          conceptos.push({
            id: 'garantia',
            descripcion: `Garantía de Alquiler (${numGarDef} ${numGarDef === 1 ? 'Mes' : 'Meses'} de Garantía)`,
            tipo: 'Fijo',
            importeCalculado: montoAlquiler * numGarDef,
            mesesGarantia: numGarDef
          });
        }
        setConceptosActivos(conceptos);
        setMostrarDetalle(true);
      } else if (tipoRi === 'Garantía de Alquiler') {
        const numG = numGarDef || 1;
        setConceptosActivos([{
          id: 'garantia',
          descripcion: `Garantía de Alquiler (${numG} ${numG === 1 ? 'Mes' : 'Meses'} de Garantía)`,
          tipo: 'Fijo',
          importeCalculado: montoAlquiler * numG,
          mesesGarantia: numG
        }]);
        setMostrarDetalle(true);
      } else {
        setMostrarDetalle(false);
        setConceptosActivos([]);
      }
    } else {
      setDatosContrato(null);
      setMostrarDetalle(false);
      setConceptosActivos([]);
      setMesesDisponibles([]);
    }
  };

  const handleGarantiaChange = (numGar) => {
    setMesesGarantiaCobro(numGar);
    if (!contratoId) return;
    const c = listaContratos.find(c => Number(c.id) === Number(contratoId));
    if (!c) return;
    const montoAlquiler = parseFloat(c.monto) || 0;

    let conceptos = [];
    if (tipoRi === 'Alquiler de Inmueble') {
      conceptos.push({
        id: 'alquiler',
        descripcion: 'Alquiler de Inmueble (Mes Adelantado)',
        tipo: 'Fijo',
        importeCalculado: montoAlquiler
      });
    }

    if (numGar > 0) {
      conceptos.push({
        id: 'garantia',
        descripcion: `Garantía de Alquiler (${numGar} ${numGar === 1 ? 'Mes' : 'Meses'} de Garantía)`,
        tipo: 'Fijo',
        importeCalculado: montoAlquiler * numGar,
        mesesGarantia: numGar
      });
    }

    setConceptosActivos(conceptos);
    setMostrarDetalle(true);
  };

  const activarDetalle = () => {
    setIsLoadingGlobal(true);
    setTimeout(() => {
      const habilitados = listaConceptos.filter(c => c.estado === 'Habilitado');
      const temps = (lecturasTemporales && lecturasTemporales[contratoId]) ? lecturasTemporales[contratoId] : {};
      
      const preparados = habilitados.map(c => {
        let inicial = 0;
        let final = 0;
        if (c.tipo === 'Variable' && temps[c.id]) {
          inicial = parseFloat(temps[c.id].lecturaInicial) || 0;
          final = parseFloat(temps[c.id].lecturaFinal) || 0;
        }
        
        const consumo = Math.max(0, final - inicial);
        let precio = 1;
        if (c.descCorta.toLowerCase().includes('agua')) precio = PRECIO_UNITARIO_AGUA;
        else if (c.descCorta.toLowerCase().includes('luz') || c.descCorta.toLowerCase().includes('energ')) precio = PRECIO_UNITARIO_LUZ;
        
        return {
          ...c,
          lecturaInicial: c.tipo === 'Variable' ? inicial : null,
          lecturaFinal: c.tipo === 'Variable' ? final : null,
          importeCalculado: c.tipo === 'Fijo' ? c.importe : (consumo * precio)
        };
      });
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
    
    const procesarRecibo = async () => {
      let nuevoId = Date.now();
      let nroFormateado = `RI-${String(listaRecibos.length + 1).padStart(4, '0')}`;
      let exitoAWS = true;
      
      try {
        const contratoReal = listaContratos.find(c => Number(c.id) === Number(contratoId));
        
        // Paso A: Cabecera
        const cabeceraData = {
          idInmueble: Number(contratoReal.idInmueble),
          mesConsumo: periodo,
          mesCobro: periodo, 
          usuario: 'admin'
        };
        const cabeceraRes = await createReciboConsumo(cabeceraData);
        if (cabeceraRes && cabeceraRes.idNroRecibo) {
          nuevoId = cabeceraRes.idNroRecibo;
        }
        
        // Paso B: Detalles
        for (const c of conceptosActivos) {
          // Obtener el ID del concepto original asegurando compatibilidad de UI
          const conceptoOriginalId = c.id === 'alquiler' ? 9 : c.id; 
          
          const detalleData = {
            idConceptoConsumo: Number(conceptoOriginalId),
            lecturaInicial: c.tipo === 'Variable' ? Number(c.lecturaInicial || 0) : null,
            fLecturaInicial: c.tipo === 'Variable' ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString() : null,
            lecturaFinal: c.tipo === 'Variable' ? Number(c.lecturaFinal || 0) : null,
            fLecturaFinal: c.tipo === 'Variable' ? new Date().toISOString() : null,
            importeManual: c.tipo === 'Variable' ? null : Number(c.importeCalculado)
          };
          await agregarDetalleRecibo(nuevoId, detalleData);
        }
      } catch (err) {
        console.warn("Fallo al grabar recibo en AWS, aplicando fallback local:", err);
        exitoAWS = false;
      }
      
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
        detalle: conceptosActivos
      };

      setListaRecibos([...listaRecibos, nuevoRI]);
      setIsLoadingGlobal(false);
      onClose();
      
      if (exitoAWS) {
        alert("Recibo y detalles generados exitosamente en la base de datos.");
        if (setLecturasTemporales) {
          setLecturasTemporales(prev => {
            const copia = { ...prev };
            delete copia[contratoId];
            return copia;
          });
        }
      }
    };

    procesarRecibo();
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
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cuota mensual por el arrendamiento del local u oficina (con opción a incluir garantía).</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setTipoRi('Garantía de Alquiler')}
                    style={{ 
                      padding: '1.25rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: tipoRi === 'Garantía de Alquiler' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                      backgroundColor: tipoRi === 'Garantía de Alquiler' ? 'var(--primary-light)' : 'var(--bg-body)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', color: tipoRi === 'Garantía de Alquiler' ? 'var(--primary)' : 'var(--text-muted)' }}>
                      <i className="ph ph-shield-check"></i>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: tipoRi === 'Garantía de Alquiler' ? 'var(--primary)' : 'var(--text-main)' }}>Garantía de Alquiler</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cobro exclusivo de depósito en garantía (1 o 2 meses).</p>
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
                    <label>Período a Cobrar</label>
                    <select className="form-control" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                      {mesesDisponibles.length > 0 ? (
                        mesesDisponibles.map((mes, index) => (
                          <option key={index} value={mes}>{mes}</option>
                        ))
                      ) : (
                        <option value={periodo}>{periodo}</option>
                      )}
                    </select>
                  </div>
                  
                  {(tipoRi === 'Alquiler de Inmueble' || tipoRi === 'Garantía de Alquiler') && (
                    <div className="form-group">
                      <label>Meses de Garantía</label>
                      <select 
                        className="form-control" 
                        value={mesesGarantiaCobro} 
                        onChange={(e) => handleGarantiaChange(parseInt(e.target.value))}
                      >
                        {tipoRi === 'Alquiler de Inmueble' && <option value="0">Sin Garantía (Solo Alquiler)</option>}
                        <option value="1">1 Mes de Garantía (S/ {(datosContrato.monto || 0).toFixed(2)})</option>
                        <option value="2">2 Meses de Garantía (S/ {((datosContrato.monto || 0) * 2).toFixed(2)})</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4>Detalle de Conceptos</h4>
                    {!mostrarDetalle && tipoRi === 'Consumo de servicios' && (
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
                            <th>Importe (S/)</th>
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
                            <td><strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>S/ {calcularTotal().toFixed(2)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </>
              )}

              <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button className="btn-outline" onClick={() => setPaso(1)}>Atrás</button>
                <button className="btn-primary" onClick={handleGrabar} disabled={!mostrarDetalle || calcularTotal() <= 0 || periodo === 'Todos los meses cobrados'}>
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
