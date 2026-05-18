import { apiFetch } from './config';

export async function getInmuebles() {
  const response = await apiFetch('/api/inmuebles');
  if (!response) return []; // en caso de 401 redirect
  if (!response.ok) throw new Error('Error al obtener inmuebles');
  return response.json();
}

export async function getInmuebleById(id) {
  const response = await apiFetch(`/api/inmuebles/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Error al obtener inmueble');
  return response.json();
}

export async function createInmueble(data) {
  const response = await apiFetch('/api/inmuebles', {
    method: 'POST',
    body: JSON.stringify(data),
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
  const response = await apiFetch(`/api/inmuebles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
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
