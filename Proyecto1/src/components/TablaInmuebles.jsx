import React from 'react';

const obtenerEtiquetaEstado = (estado) => {
  switch(estado) {
    case 'Ocupado':
      return <span className="badge badge-occupied">Ocupado</span>;
    case 'Desocupado':
      return <span className="badge badge-vacant">Desocupado</span>;
    case 'Con Deuda':
      return <span className="badge badge-debt">Con Deuda</span>;
    default:
      return <span className="badge">{estado}</span>;
  }
};

const TablaInmuebles = ({ listaInmuebles = [], alEditarInmueble }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Lista de Inmuebles</h2>
        <button className="btn-outline">
          <i className="ph ph-funnel"></i>
          Filtrar
        </button>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Dirección</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Alquiler Mensual</th>
              <th>Próximos Pagos / Servicios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaInmuebles.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="property-cell">
                    <img src={item.imagen} alt={item.direccion} className="property-img" />
                    <div>
                      <span className="property-address">{item.direccion}</span>
                      <span className="property-city">{item.ciudad}</span>
                    </div>
                  </div>
                </td>
                <td>{item.tipo}</td>
                <td>{obtenerEtiquetaEstado(item.estado)}</td>
                <td className="price-text">{item.alquiler}</td>
                <td>
                  {item.estado === 'Con Deuda' ? (
                    <span className="payment-alert">
                      <i className="ph-fill ph-warning-circle"></i>
                      {item.proximosPagos}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.875rem' }}>{item.proximosPagos}</span>
                  )}
                </td>
                <td>
                  <button 
                    className="btn-outline" 
                    style={{ fontSize: '0.875rem' }}
                    onClick={() => alEditarInmueble && alEditarInmueble(item)}
                  >
                    <i className="ph ph-invoice"></i>
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaInmuebles;
