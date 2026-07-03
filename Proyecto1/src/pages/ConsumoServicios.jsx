import React, { useState } from 'react';

const ConsumoServicios = ({ listaConceptos, setListaConceptos, listaContratos, listaInmuebles, listaInquilinos, lecturasTemporales, setLecturasTemporales }) => {
  // === ESTADOS PARA TARIFARIO (CONCEPTOS) ===
  const [showTarifarioModal, setShowTarifarioModal] = useState(false);
  const [showConceptoForm, setShowConceptoForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConcepto, setCurrentConcepto] = useState(null);
  const [formData, setFormData] = useState({
    descCorta: '', descripcion: '', tipo: 'Fijo', unidad: '', importe: 0, estado: 'Habilitado'
  });

  // === ESTADOS PARA REGISTRAR CONSUMOS ===
  const [showConsumoModal, setShowConsumoModal] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [lecturasActivas, setLecturasActivas] = useState({});

  // === LÓGICA TARIFARIO ===
  const handleOpenConceptoForm = (concepto = null) => {
    if (concepto) {
      setIsEditing(true);
      setCurrentConcepto(concepto);
      setFormData(concepto);
    } else {
      setIsEditing(false);
      setCurrentConcepto(null);
      setFormData({ descCorta: '', descripcion: '', tipo: 'Fijo', unidad: '', importe: 0, estado: 'Habilitado' });
    }
    setShowConceptoForm(true);
  };

  const handleCloseConceptoForm = () => {
    setShowConceptoForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConceptoSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setListaConceptos(listaConceptos.map(c => c.id === currentConcepto.id ? { ...formData, id: currentConcepto.id, importe: parseFloat(formData.importe) || 0 } : c));
    } else {
      setListaConceptos([...listaConceptos, { ...formData, id: Date.now(), importe: parseFloat(formData.importe) || 0 }]);
    }
    handleCloseConceptoForm();
  };

  const toggleEstado = (id) => {
    setListaConceptos(listaConceptos.map(c => {
      if (c.id === id) {
        return { ...c, estado: c.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' };
      }
      return c;
    }));
  };

  // === LÓGICA CONTRATOS VIGENTES ===
  // Safely fallback to empty arrays if undefined initially
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
    alert('Consumos guardados temporalmente. Podrás procesarlos al emitir el recibo de este mes.');
    handleCloseConsumoModal();
  };

  // Filtra los servicios habilitados
  const conceptosActivos = (listaConceptos || []).filter(c => c.estado === 'Habilitado');

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Consumo de Servicios por Inmueble</h1>
          <p className="page-subtitle">Selecciona un inmueble con contrato para registrar lecturas o ver tarifas</p>
        </div>
        <button className="btn-outline" onClick={() => setShowTarifarioModal(true)}>
          <i className="ph ph-gear"></i>
          Configurar Tarifario
        </button>
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

              <h4 style={{ marginBottom: '1rem' }}>Servicios Aplicables (Habilitados)</h4>
              
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
                    {conceptosActivos.map(concepto => (
                      <tr key={concepto.id}>
                        <td><strong>{concepto.descripcion}</strong></td>
                        <td>
                          <span className={`badge ${concepto.tipo === 'Fijo' ? 'badge-primary' : 'badge-warning'}`}>
                            {concepto.tipo}
                          </span>
                        </td>
                        <td>
                          {concepto.tipo === 'Fijo' ? (
                            <span className="text-muted">S/ {Number(concepto.importe).toFixed(2)} / mes</span>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input 
                                type="number" 
                                className="form-control" 
                                style={{ width: '80px', padding: '0.3rem' }} 
                                placeholder="Inicial" 
                                value={lecturasActivas[concepto.id]?.lecturaInicial || ''}
                                onChange={(e) => handleLecturaTemporalChange(concepto.id, 'lecturaInicial', e.target.value)}
                              />
                              <span>-</span>
                              <input 
                                type="number" 
                                className="form-control" 
                                style={{ width: '80px', padding: '0.3rem' }} 
                                placeholder="Final" 
                                value={lecturasActivas[concepto.id]?.lecturaFinal || ''}
                                onChange={(e) => handleLecturaTemporalChange(concepto.id, 'lecturaFinal', e.target.value)}
                              />
                              <span className="text-muted">{concepto.unidad}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {concepto.tipo === 'Fijo' ? `S/ ${Number(concepto.importe).toFixed(2)}` : <span className="text-muted">Calculado al emitir recibo</span>}
                        </td>
                      </tr>
                    ))}
                    {conceptosActivos.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-3">No hay servicios habilitados en el tarifario.</td>
                      </tr>
                    )}
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

      {/* MODAL: CONFIGURAR TARIFARIO (Antigua vista principal) */}
      {showTarifarioModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Configurar Tarifario de Servicios</h2>
              <button className="btn-icon" onClick={() => setShowTarifarioModal(false)}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button className="btn-primary" onClick={() => handleOpenConceptoForm()}>
                  <i className="ph ph-plus"></i>
                  Nuevo Concepto
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Desc.</th>
                    <th>Tipo</th>
                    <th>Unidad</th>
                    <th>Importe</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaConceptos.map((concepto) => (
                    <tr key={concepto.id}>
                      <td>{concepto.descripcion}</td>
                      <td>
                        <span className={`badge ${concepto.tipo === 'Fijo' ? 'badge-primary' : 'badge-warning'}`}>
                          {concepto.tipo}
                        </span>
                      </td>
                      <td>{concepto.unidad || '-'}</td>
                      <td>{concepto.tipo === 'Fijo' ? `S/ ${Number(concepto.importe).toFixed(2)}` : '-'}</td>
                      <td>
                        <span className={`badge ${concepto.estado === 'Habilitado' ? 'badge-success' : 'badge-error'}`}>
                          {concepto.estado}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="Editar" onClick={() => handleOpenConceptoForm(concepto)}>
                            <i className="ph ph-pencil-simple"></i>
                          </button>
                          <button 
                            className="btn-icon" 
                            title={concepto.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'} 
                            onClick={() => toggleEstado(concepto.id)}
                          >
                            <i className={`ph ${concepto.estado === 'Habilitado' ? 'ph-x-circle' : 'ph-check-circle'}`}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {listaConceptos.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No hay conceptos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORMULARIO NUEVO/EDITAR CONCEPTO */}
      {showConceptoForm && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'Editar Concepto' : 'Nuevo Concepto'}</h2>
              <button className="btn-icon" onClick={handleCloseConceptoForm}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleConceptoSubmit} className="form-grid">
                <div className="form-group">
                  <label>Abreviación (Desc_Corta)</label>
                  <input type="text" name="descCorta" className="form-control" value={formData.descCorta} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Descripción Larga</label>
                  <input type="text" name="descripcion" className="form-control" value={formData.descripcion} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Tipo de Consumo</label>
                  <select name="tipo" className="form-control" value={formData.tipo} onChange={handleChange}>
                    <option value="Fijo">Fijo</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Unidad de Medida</label>
                  <input type="text" name="unidad" className="form-control" value={formData.unidad} onChange={handleChange} placeholder="Ej. m3, kw, um" />
                </div>
                {formData.tipo === 'Fijo' && (
                  <div className="form-group">
                    <label>Importe Mensual Fijo</label>
                    <input type="number" step="0.01" name="importe" className="form-control" value={formData.importe} onChange={handleChange} required />
                  </div>
                )}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Estado</label>
                  <select name="estado" className="form-control" value={formData.estado} onChange={handleChange}>
                    <option value="Habilitado">Habilitado</option>
                    <option value="Deshabilitado">Deshabilitado</option>
                  </select>
                </div>
                <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                  <button type="button" className="btn-outline" onClick={handleCloseConceptoForm}>Cancelar</button>
                  <button type="submit" className="btn-primary">Grabar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumoServicios;
