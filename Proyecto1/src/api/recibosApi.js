import { apiFetch } from './config';

export async function generarRecibosIniciales(idContrato, usuario = 'admin') {
  const response = await apiFetch('/api/recibos-consumo/generar-iniciales', {
    method: 'POST',
    body: JSON.stringify({
      idContrato: Number(idContrato),
      usuario
    }),
  });
  
  if (!response) return null;
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Error al generar recibos iniciales');
  }
  return response.json();
}

export async function getRecibosConsumo() {
  const response = await apiFetch('/api/recibos-consumo');
  if (!response) return [];
  if (!response.ok) throw new Error('Error al obtener recibos');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createReciboConsumo(data) {
  const response = await apiFetch('/api/recibos-consumo', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response) return null;
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Error al crear la cabecera del recibo');
  }
  return response.json();
}

export async function agregarDetalleRecibo(idRecibo, data) {
  const response = await apiFetch(`/api/recibos-consumo/${idRecibo}/detalle`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response) return null;
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || 'Error al agregar detalle al recibo');
  }
  return response.json();
}
