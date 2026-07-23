export function numeroALetras(monto) {
  if (monto === undefined || monto === null || isNaN(monto)) return 'CERO CON 00/100 SOLES';

  const num = Math.abs(Number(monto));
  const enteros = Math.floor(num);
  const centavos = Math.round((num - enteros) * 100);

  const centavosTexto = String(centavos).padStart(2, '0') + '/100';

  if (enteros === 0) return `CERO CON ${centavosTexto} SOLES`;

  function Unidades(n) {
    switch(n) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
      default: return '';
    }
  }

  function Decenas(n) {
    const decena = Math.floor(n / 10);
    const unidad = n % 10;
    switch(decena) {
      case 1:
        switch(unidad) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + Unidades(unidad);
        }
      case 2:
        if (unidad === 0) return 'VEINTE';
        return 'VEINTI' + Unidades(unidad);
      case 3: return DecenasY('TREINTA', unidad);
      case 4: return DecenasY('CUARENTA', unidad);
      case 5: return DecenasY('CINCUENTA', unidad);
      case 6: return DecenasY('SESENTA', unidad);
      case 7: return DecenasY('SETENTA', unidad);
      case 8: return DecenasY('OCHENTA', unidad);
      case 9: return DecenasY('NOVENTA', unidad);
      case 0: return Unidades(unidad);
      default: return '';
    }
  }

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades);
    return strSin;
  }

  function Centenas(n) {
    const centenas = Math.floor(n / 100);
    const decenas = n % 100;
    switch(centenas) {
      case 1:
        if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + Decenas(decenas);
      case 3: return 'TRESCIENTOS ' + Decenas(decenas);
      case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
      case 5: return 'QUINIENTOS ' + Decenas(decenas);
      case 6: return 'SEISCIENTOS ' + Decenas(decenas);
      case 7: return 'SETECIENTOS ' + Decenas(decenas);
      case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
      case 9: return 'NOVECIENTOS ' + Decenas(decenas);
      default: return Decenas(decenas);
    }
  }

  function Miles(n) {
    const divisor = 1000;
    const cientos = Math.floor(n / divisor);
    const resto = n % divisor;
    let strMiles = '';
    if (cientos > 0) {
      if (cientos === 1) {
        strMiles = 'UN MIL';
      } else {
        strMiles = Centenas(cientos) + ' MIL';
      }
    }
    const strCentenas = Centenas(resto);
    if (strMiles === '') return strCentenas;
    return (strMiles + ' ' + strCentenas).trim();
  }

  const textoEnteros = Miles(enteros);
  return `${textoEnteros} CON ${centavosTexto} SOLES`.trim();
}
