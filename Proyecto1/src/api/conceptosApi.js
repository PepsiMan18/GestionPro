import { apiFetch } from './config';

export async function getConceptosConsumo() {
  const response = await apiFetch('/api/conceptos-consumo');
  if (!response) return [];
  if (!response.ok) throw new Error('Error al obtener conceptos de consumo');
  const data = await response.json();
  
  // Transformar camelCase / PascalCase al formato frontend si es necesario
  return Array.isArray(data) ? data.map(dto => ({
    id: dto.idConceptoConsumo || dto.id,
    descCorta: dto.descCorta || dto.DescCorta,
    descripcion: dto.descripcion || dto.Descripcion,
    tipo: dto.tipoConcepto || dto.TipoConcepto,
    importe: dto.importe || dto.Importe
  })) : [];
}
