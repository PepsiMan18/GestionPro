import React, { useState } from 'react';

export const SERVICIOS_OFICIALES = [
  { id: 1, descCorta: 'luz', descripcion: 'Energía Eléctrica', tipo: 'Variable', unidad: 'kw', importe: 0 },
  { id: 2, descCorta: 'agua', descripcion: 'Agua', tipo: 'Variable', unidad: 'm3', importe: 0 },
  { id: 3, descCorta: 'vigilancia', descripcion: 'Vigilancia', tipo: 'Fijo', unidad: 'MES', importe: 80 },
  { id: 4, descCorta: 'limpieza', descripcion: 'Limpieza', tipo: 'Fijo', unidad: 'MES', importe: 40 },
  { id: 5, descCorta: 'internet', descripcion: 'Internet', tipo: 'Fijo', unidad: 'MES', importe: 40 }
];

const ConsumoServicios = ({ listaContratos, listaInmuebles, listaInquilinos, lecturasTemporales, setLecturasTemporales }) => {
  const [showConsumoModal, setShowConsumoModal] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [lecturasActivas, setLecturasActivas] = useState({});

  const contratos = listaContratos || [];
  const inmuebles = listaInmuebles || [];
  const inquilinos = listaInquilinos || [];
  
  const contratosVigentes = contratos.filter(c => c.estado === 'Vigente' || c.estado === 'Doc Pendiente');

  const getInmuebleInfo = (contrato) => {
    if (contrato.codigoInmueble) return contrato.codigoInmueble;
    const inm = inmuebles.find(i => Number(i.id) === Number(contrato.idInmueble));
    return inm ? inm.codigo : 'Desconocido';
  };

  const getInquilinoInfo = (contrato) => {
    if (contrato.nombreInquilino) return contrato.nombreInquilino;
    const inq = inquilinos.find(i => Number(i.id) === Number(contrato.idInquilino));
    return inq ? (inq.nombre || inq.razonSocial) : 'Desconocido';
  };

  const handleOpenRegistrarConsumo = (contrato) => {
    setContratoSeleccionado({
      ...contrato,
      codigoInmueble: getInmuebleInfo(contrato),
      nombreInquilino: getInquilinoInfo(contrato)
    });
    
    const temps = (lecturasTemporales && lecturasTemporales[contrato.id]) ? lecturasTemporales[contrato.id] : {};
    setLecturasActivas(temps);
    setShowConsumoModal(true);
  };

  const handleCloseConsumoModal = () => {
    setShowConsumoModal(false);
    setContratoSeleccionado(null);
    setLecturasActivas({});
  };
  
  const handleLecturaTemporalChange = (idConcepto, campo, valor) => {
    setLecturasActivas(prev => ({
      ...prev,
      [idConcepto]: {
        ...prev[idConcepto],
        [campo]: valor
      }
    }));
  };
  
  const handleGuardarTemporales = () => {
    if (setLecturasTemporales && contratoSeleccionado) {
      setLecturasTemporales(prev => ({
        ...prev,
        [contratoSeleccionado.id]: lecturasActivas
      }));
    }
    alert('Consumos guardados temporalmente. Podrás procesarlos al emitir el recibo.');
    handleCloseConsumoModal();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Consumo de Servicios por Inmueble</h1>
          <p className="page-subtitle">Selecciona un inmueble con contrato para registrar lecturas o consultar servicios</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Inmuebles con Contrato Vigente</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contrato #</th>
                <th>Inmueble</th>
                <th>Inquilino</th>
                <th>Vigencia</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contratosVigentes.map(contrato => (
                <tr key={contrato.id}>
                  <td><strong>{contrato.id}</strong></td>
                  <td>{getInmuebleInfo(contrato)}</td>
                  <td>{getInquilinoInfo(contrato)}</td>
                  <td>{contrato.fechaInicio} al {contrato.fechaFin}</td>
                  <td className="text-center">
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      onClick={() => handleOpenRegistrarConsumo(contrato)}
                    >
                      <i className="ph ph-list-plus"></i>
                      Ver / Registrar Servicios
                    </button>
                  </td>
                </tr>
              ))}
              {contratosVigentes.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">No hay contratos vigentes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: VER Y REGISTRAR CONSUMOS DEL INMUEBLE */}
      {showConsumoModal && contratoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>Servicios del Inmueble: {contratoSeleccionado.codigoInmueble}</h2>
              <button className="btn-icon" onClick={handleCloseConsumoModal}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Inquilino:</strong> {contratoSeleccionado.nombreInquilino}</p>
                <p style={{ margin: '0' }}><strong>Contrato:</strong> #{contratoSeleccionado.id}</p>
              </div>

              <h4 style={{ marginBottom: '1rem' }}>Servicios Aplicables</h4>
              
              <div className="table-responsive">
                <table className="data-table" style={{ fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th>Servicio</th>
                      <th>Tipo</th>
                      <th>Lectura / Importe Fijo</th>
                      <th>Costo Est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICIOS_OFICIALES.map(concepto => {
                      const esFijo = concepto.tipo === 'Fijo';
                      const valInicial = lecturasActivas[concepto.id]?.lecturaInicial ?? '';
                      const valFinal = lecturasActivas[concepto.id]?.lecturaFinal ?? '';
                      const valFijo = lecturasActivas[concepto.id]?.importeFijo ?? concepto.importe;
                      
                      let costoEst = 'Calculado al emitir recibo';
                      if (esFijo) {
                        costoEst = `S/ ${Number(valFijo).toFixed(2)}`;
                      } else if (valInicial !== '' && valFinal !== '' && parseFloat(valFinal) >= parseFloat(valInicial)) {
                        const consumo = parseFloat(valFinal) - parseFloat(valInicial);
                        const precioUnit = concepto.descCorta === 'agua' ? 2.50 : 1.20;
                        costoEst = `S/ ${(consumo * precioUnit).toFixed(2)} (${consumo} ${concepto.unidad})`;
                      }

                      return (
                        <tr key={concepto.id}>
                          <td><strong>{concepto.descripcion}</strong></td>
                          <td>
                            <span className={`badge ${esFijo ? 'badge-primary' : 'badge-warning'}`}>
                              {esFijo ? 'FIJO' : 'CONSUMO'}
                            </span>
                          </td>
                          <td>
                            {esFijo ? (
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <span>S/</span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  style={{ width: '100px', padding: '0.3rem' }} 
                                  value={valFijo}
                                  onChange={(e) => handleLecturaTemporalChange(concepto.id, 'importeFijo', parseFloat(e.target.value) || 0)}
                                />
                                <span className="text-muted">/ mes</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  style={{ width: '80px', padding: '0.3rem' }} 
                                  placeholder="Inicial" 
                                  value={valInicial}
                                  onChange={(e) => handleLecturaTemporalChange(concepto.id, 'lecturaInicial', e.target.value)}
                                />
                                <span>-</span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  style={{ width: '80px', padding: '0.3rem' }} 
                                  placeholder="Final" 
                                  value={valFinal}
                                  onChange={(e) => handleLecturaTemporalChange(concepto.id, 'lecturaFinal', e.target.value)}
                                />
                                <span className="text-muted">{concepto.unidad}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{costoEst}</strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                <button className="btn-outline" onClick={handleCloseConsumoModal}>Cerrar</button>
                <button className="btn-primary" onClick={handleGuardarTemporales}>
                  Guardar Lecturas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumoServicios;
