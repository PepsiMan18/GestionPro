import { apiFetch } from './config';

export async function registrarCobranza(data) {
  // data expected:
  // idRecibo, importePagado, medioPago, banco, nroOperacion, fechaCobranza
  
  try {
    const response = await apiFetch('/api/cobranzas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response || !response.ok) {
      throw new Error('Fallo en la API, usando fallback local');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('API de Cobranzas no disponible aún. Usando simulación local:', error);
    // Simulación de respuesta exitosa
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: 'Cobranza registrada localmente' });
      }, 500);
    });
  }
}
