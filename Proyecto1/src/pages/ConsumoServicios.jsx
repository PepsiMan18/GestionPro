import React, { useState } from 'react';

const ConsumoServicios = ({ listaConceptos, setListaConceptos }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConcepto, setCurrentConcepto] = useState(null);

  const [formData, setFormData] = useState({
    descCorta: '',
    descripcion: '',
    tipo: 'Fijo',
    unidad: '',
    importe: 0,
    estado: 'Habilitado'
  });

  const handleOpenModal = (concepto = null) => {
    if (concepto) {
      setIsEditing(true);
      setCurrentConcepto(concepto);
      setFormData(concepto);
    } else {
      setIsEditing(false);
      setCurrentConcepto(null);
      setFormData({
        descCorta: '',
        descripcion: '',
        tipo: 'Fijo',
        unidad: '',
        importe: 0,
        estado: 'Habilitado'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setListaConceptos(listaConceptos.map(c => c.id === currentConcepto.id ? { ...formData, id: currentConcepto.id } : c));
    } else {
      setListaConceptos([...listaConceptos, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const toggleEstado = (id) => {
    setListaConceptos(listaConceptos.map(c => {
      if (c.id === id) {
        return { ...c, estado: c.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' };
      }
      return c;
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mantenimiento de Consumos y Servicios</h1>
          <p className="page-subtitle">Gestiona los conceptos fijos y variables</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="ph ph-plus"></i>
          Nuevo Concepto
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Abreviación</th>
                <th>Descripción</th>
                <th>Tipo de Consumo</th>
                <th>Unidad de Medida</th>
                <th>Importe Fijo</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaConceptos.map((concepto) => (
                <tr key={concepto.id}>
                  <td>{concepto.descCorta}</td>
                  <td>{concepto.descripcion}</td>
                  <td>
                    <span className={`badge ${concepto.tipo === 'Fijo' ? 'badge-primary' : 'badge-warning'}`}>
                      {concepto.tipo}
                    </span>
                  </td>
                  <td>{concepto.unidad || '-'}</td>
                  <td>{concepto.tipo === 'Fijo' ? `$${concepto.importe.toFixed(2)}` : '-'}</td>
                  <td>
                    <span className={`badge ${concepto.estado === 'Habilitado' ? 'badge-success' : 'badge-error'}`}>
                      {concepto.estado}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Editar" onClick={() => handleOpenModal(concepto)}>
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
                  <td colSpan="7" className="text-center py-4">No hay conceptos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'Editar Concepto' : 'Nuevo Concepto'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form-grid">
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
                  <button type="button" className="btn-outline" onClick={handleCloseModal}>Cancelar</button>
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
