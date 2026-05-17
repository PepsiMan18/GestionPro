import React from 'react';

const obtenerEtiquetaEstado = (estado) => {
  switch(estado) {
    case 'Ocupado':
      return <span className="badge badge-occupied">Ocupado</span>;
    case 'Desocupado':
    case 'Disponible':
      return <span className="badge badge-vacant">Disponible</span>;
    case 'Mantenimiento':
      return <span className="badge badge-debt">Mantenimiento</span>;
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
              <th>Código</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Sector/Zona</th>
              <th>Estado</th>
              <th>Área</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaInmuebles.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{ fontWeight: 600 }}>{item.codigo}</span>
                </td>
                <td>
                  <div className="property-cell">
                    <div>
                      <span className="property-address">{item.descripcion}</span>
                      <span className="property-city">{item.alquiler}</span>
                    </div>
                  </div>
                </td>
                <td>{item.tipo}</td>
                <td>{item.sector}</td>
                <td>{obtenerEtiquetaEstado(item.estado)}</td>
                <td>{item.area}</td>
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
