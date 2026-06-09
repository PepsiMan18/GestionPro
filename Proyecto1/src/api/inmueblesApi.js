import { apiFetch } from './config';

export async function getInmuebles() {
  const response = await apiFetch('/api/inmuebles');
  if (!response) return [];
  if (!response.ok) throw new Error('Error al obtener inmuebles');
  const data = await response.json();
  return Array.isArray(data) ? data.map(mapFromDTO) : [];
}

export async function getInmuebleById(id) {
  const response = await apiFetch(`/api/inmuebles/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Error al obtener inmueble');
  const data = await response.json();
  return mapFromDTO(data);
}


const mapTipoToId = (tipo) => {
  const map = { 'Local Comercial': 1, 'Oficina': 2, 'Tienda Externa': 3, 'Puesto': 4, 'Módulo': 5 };
  return map[tipo] || 1;
};
const mapSectorToId = (sector) => {
  const map = { 'Mercado': 1, 'Galería': 2, 'Sección M': 3, 'Sección R': 4, 'Sección S': 5, 'Tiendas Externas': 6, 'Oficinas': 7, 'Módulos': 8 };
  return map[sector] || 1;
};
const mapEstadoToId = (estado) => {
  const map = { 'Disponible': 1, 'Ocupado': 2, 'Mantenimiento': 3, 'Reservado': 4 };
  return map[estado] || 1;
};
const parseAlquiler = (val) => {
  if (!val) return 0;
  const num = parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

const mapToDTO = (data) => ({
  idTipoInmueble: mapTipoToId(data.tipo),
  idSector: mapSectorToId(data.sector),
  idEstadoInmueble: mapEstadoToId(data.estado),
  idMoneda: 1,
  codigoInmueble: data.codigo,
  descripcionInmueble: data.descripcion,
  pisoInmueble: data.piso?.toString() || "1",
  precioAlquiler: parseAlquiler(data.alquiler),
  incluyeServicios: data.incluyeServicios || "N",
  observaciones: null
});


const mapFromDTO = (dto) => ({
  id: dto.idInmueble || dto.id || Date.now() + Math.random(),
  codigo: dto.codigoInmueble || '',
  descripcion: dto.descripcionInmueble || '',
  tipo: dto.tipoInmueble || 'Local Comercial',
  sector: dto.sector || 'Mercado',
  alquiler: dto.precioAlquiler ? `$${Number(dto.precioAlquiler).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00',
  estado: dto.estadoInmueble || 'Disponible',
  area: '', // Backend no devuelve area
  piso: dto.pisoInmueble || '',
  incluyeServicios: dto.incluyeServicios || 'N'
});
// ----------------------------------------

export async function createInmueble(data) {
  const dto = mapToDTO(data);
  const response = await apiFetch('/api/inmuebles', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  if (response.status === 409) throw new Error('Código de inmueble duplicado');
  if (response.status === 422) {
    const errors = await response.json();
    throw new Error(JSON.stringify(errors));
  }
  if (!response.ok) throw new Error('Error al crear inmueble');
  return response.json();
}

export async function updateInmueble(id, data) {
  const dto = mapToDTO(data);
  const response = await apiFetch(`/api/inmuebles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
  if (response.status === 404) throw new Error('Inmueble no encontrado');
  if (!response.ok) throw new Error('Error al actualizar inmueble');
  return response.json();
}

export async function deleteInmueble(id) {
  const response = await apiFetch(`/api/inmuebles/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 404) throw new Error('Inmueble no encontrado');
  if (!response.ok) throw new Error('Error al eliminar inmueble');
}
