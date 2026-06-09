import { apiFetch } from './config';

// --- MAPPERS (Frontend -> Backend DTO) ---
const mapTipoClienteToId = (tipo) => {
  const map = { 'Natural': 1, 'Jurídica': 2 };
  return map[tipo] || 1;
};

const mapTipoDocToId = (tipo) => {
  const map = { 'DNI': 1, 'RUC': 2, 'CE': 3 };
  return map[tipo] || 1;
};

const mapToDTO = (data) => ({
  idTipoCliente: mapTipoClienteToId(data.tipoCliente),
  idTDocumento: mapTipoDocToId(data.tipoDocumento),
  nroDocumento: data.numeroDocumento,
  rsocialNApellidos: data.nombre,
  celularTelefono: data.celular,
  direccion: data.direccion,
  correo: data.correo,
  referencia: data.referencias || "Ninguna"
});

const mapToUpdateDTO = (data) => ({
  rsocialNApellidos: data.nombre,
  celularTelefono: data.celular,
  direccion: data.direccion,
  correo: data.correo,
  referencia: data.referencias || "Ninguna",
  vigente: data.vigente !== undefined ? data.vigente : true
});

// --- MAPPERS (Backend DTO -> Frontend) ---
const mapFromDTO = (dto) => ({
  id: dto.idInquilino || dto.id || Date.now() + Math.random(),
  tipoCliente: dto.tipoCliente || 'Natural',
  tipoDocumento: dto.tipoDocumento || 'DNI',
  numeroDocumento: dto.nroDocumento || '',
  nombre: dto.rsocialNApellidos || '',
  celular: dto.celularTelefono || '',
  correo: dto.correo || '',
  direccion: dto.direccion || '',
  sustentoIngresos: '', // No mapeado en backend
  referencias: dto.referencia || '',
  vigente: dto.vigente ?? true
});
// ----------------------------------------

export async function getInquilinos() {
  const response = await apiFetch('/api/inquilinos');
  if (!response) return []; // en caso de 401
  if (!response.ok) throw new Error('Error al obtener inquilinos');
  const data = await response.json();
  return Array.isArray(data) ? data.map(mapFromDTO) : [];
}

export async function createInquilino(data) {
  const dto = mapToDTO(data);
  const response = await apiFetch('/api/inquilinos', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  
  if (response.status === 409) throw new Error('Documento ya registrado');
  if (response.status === 400) {
    const msg = await response.text();
    throw new Error(msg);
  }
  if (!response.ok) throw new Error('Error al crear inquilino');
  return response.json();
}

export async function updateInquilino(id, data) {
  const dto = mapToUpdateDTO(data);
  const response = await apiFetch(`/api/inquilinos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
  if (response.status === 404) throw new Error('Inquilino no encontrado');
  if (!response.ok) throw new Error('Error al actualizar inquilino');
  return response.json();
}

export async function deleteInquilino(id) {
  const response = await apiFetch(`/api/inquilinos/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 404) throw new Error('Inquilino no encontrado');
  if (!response.ok) throw new Error('Error al eliminar inquilino');
  return true;
}

export async function consultarDocumento(numero) {
  const response = await apiFetch(`/api/inquilinos/consultar-documento?numeroDocumento=${numero}`);
  if (!response) return null;
  if (!response.ok) throw new Error('No se pudo encontrar el documento');
  return response.json();
}
