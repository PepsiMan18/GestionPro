import React, { useState } from 'react';
import ModalEmitirRecibo from '../components/ModalEmitirRecibo';

const EmisionRecibos = ({ listaRecibos, setListaRecibos, listaContratos, listaConceptos, listaInquilinos, listaInmuebles }) => {
  const [showModal, setShowModal] = useState(false);
  const [filtroNro, setFiltroNro] = useState('');
  const [filtroInquilino, setFiltroInquilino] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Filtrado de recibos
  const recibosFiltrados = listaRecibos.filter(r => {
    return (
      (filtroNro === '' || r.nroRi.toLowerCase().includes(filtroNro.toLowerCase())) &&
      (filtroInquilino === '' || r.inquilino.toLowerCase().includes(filtroInquilino.toLowerCase())) &&
      (filtroFecha === '' || r.fechaEmision.includes(filtroFecha))
    );
  });

  const handleAnular = (id) => {
    if (window.confirm('¿Está seguro de anular este recibo?')) {
      setIsLoading(true);
      // Simulando llamada a API
      setTimeout(() => {
        setListaRecibos(listaRecibos.map(r => r.id === id ? { ...r, estado: 'Anulado' } : r));
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="page-container">
      {isLoading && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Emisión de Recibos de Ingresos</h1>
          <p className="page-subtitle">Gestión de recibos del período actual</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <i className="ph ph-receipt"></i>
          Emitir Recibo Ingreso
        </button>
      </div>

      <div className="card mb-4">
        <h3 className="card-title">Filtros de Búsqueda</h3>
        <div className="filter-grid">
          <div className="form-group">
            <label>Nro RI</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por número..." 
              value={filtroNro}
              onChange={(e) => setFiltroNro(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Inquilino</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar inquilino..." 
              value={filtroInquilino}
              onChange={(e) => setFiltroInquilino(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Fecha de Emisión</label>
            <input 
              type="date" 
              className="form-control" 
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nro RI</th>
                <th>Tipo</th>
                <th>Inquilino</th>
                <th>Inmueble</th>
                <th>Fecha Emisión</th>
                <th>Período</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recibosFiltrados.map((recibo) => (
                <tr key={recibo.id}>
                  <td><strong>{recibo.nroRi}</strong></td>
                  <td>{recibo.tipo}</td>
                  <td>{recibo.inquilino}</td>
                  <td>{recibo.inmueble}</td>
                  <td>{recibo.fechaEmision}</td>
                  <td>{recibo.periodo}</td>
                  <td><strong>${recibo.total.toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge ${recibo.estado === 'Emitido' ? 'badge-success' : 'badge-error'}`}>
                      {recibo.estado}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Ver detalle" 
                        onClick={() => alert('Visualizar detalle PDF no implementado aún.')}
                      >
                        <i className="ph ph-eye"></i>
                      </button>
                      {recibo.estado === 'Emitido' && (
                        <button 
                          className="btn-icon text-danger" 
                          title="Anular Recibo" 
                          onClick={() => handleAnular(recibo.id)}
                        >
                          <i className="ph ph-prohibit"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {recibosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4">No se encontraron recibos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalEmitirRecibo 
          onClose={() => setShowModal(false)}
          listaRecibos={listaRecibos}
          setListaRecibos={setListaRecibos}
          listaContratos={listaContratos}
          listaConceptos={listaConceptos}
          listaInquilinos={listaInquilinos}
          listaInmuebles={listaInmuebles}
          setIsLoadingGlobal={setIsLoading}
        />
      )}
    </div>
  );
};

export default EmisionRecibos;
