import React from 'react';

const TablaContratos = ({ listaContratos, listaInmuebles, listaInquilinos, alEditar, alFinalizar, alSubirPdf }) => {

  const calcularEstado = (fechaFin, estadoActual) => {
    if(estadoActual === 'Doc Pendiente') return { texto: 'Doc Pendiente', clase: 'badge-debt' };
    if(estadoActual === 'Finalizado') return { texto: 'Finalizado', clase: '' };
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diffTime = fin - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { texto: 'Vencido', clase: 'badge-debt' };
    if (diffDays <= 30) return { texto: 'Por Vencer', clase: 'badge-occupied' }; // Naranja/Warning en el futuro, por ahora yellow
    return { texto: 'Vigente', clase: 'badge-vacant' }; // Verde para vigente
  };

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Inmueble</th>
              <th>Inquilino</th>
              <th>Vigencia</th>
              <th>Monto Alquiler</th>
              <th>Estado</th>
              <th>Contrato PDF</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaContratos.map(contrato => {
              const inmueble = listaInmuebles.find(i => i.id === Number(contrato.idInmueble));
              const inquilino = listaInquilinos.find(i => i.id === Number(contrato.idInquilino));
              const estado = calcularEstado(contrato.fechaFin, contrato.estado);
              
              const codigoAMostrar = contrato.codigoInmueble || (inmueble ? inmueble.codigo : 'Inmueble N/A');
              const nombreAMostrar = contrato.nombreInquilino || (inquilino ? inquilino.nombre : 'Inquilino N/A');
              const docAMostrar = inquilino ? inquilino.numeroDocumento : '';

              return (
                <tr key={contrato.id}>
                  <td style={{fontWeight: 600}}>{codigoAMostrar}</td>
                  <td>
                    <div>{nombreAMostrar}</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{docAMostrar}</div>
                  </td>
                  <td>
                    <div style={{fontSize: '0.875rem'}}>{contrato.fechaInicio} al</div>
                    <div style={{fontWeight: 600}}>{contrato.fechaFin}</div>
                  </td>
                  <td className="price-text">S/ {contrato.monto}</td>
                  <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                  <td>
                    {contrato.estado === 'Doc Pendiente' ? (
                      <label className="btn-primary" style={{padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}>
                        <i className="ph ph-upload-simple"></i> Subir PDF
                        <input type="file" style={{display: 'none'}} accept=".pdf" onChange={(e) => e.target.files[0] && alSubirPdf(contrato.id, e.target.files[0])} />
                      </label>
                    ) : (
                      <button className="btn-outline" style={{padding: '0.25rem 0.5rem'}} title="Ver Documento">
                        <i className="ph ph-file-pdf" style={{color: 'var(--primary)', fontSize: '1.2rem'}}></i>
                      </button>
                    )}
                  </td>
                  <td>
                    {estado.texto !== 'Finalizado' && (
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button className="btn-outline" style={{fontSize: '0.8rem'}} onClick={() => alEditar(contrato)} title="Renovar">
                          <i className="ph ph-arrows-clockwise"></i> Renovar
                        </button>
                        <button className="btn-outline" style={{fontSize: '0.8rem', color: '#e74c3c', borderColor: '#e74c3c'}} onClick={() => alFinalizar(contrato.id, contrato.idInmueble)} title="Finalizar Contrato">
                          <i className="ph ph-stop-circle"></i>
                        </button>
                      </div>
                    )}
                    {estado.texto === 'Finalizado' && <span style={{fontSize: '0.8rem', color:'var(--text-muted)'}}>Cerrado</span>}
                  </td>
                </tr>
              )
            })}
            {listaContratos.length === 0 && (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No hay contratos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TablaContratos;
