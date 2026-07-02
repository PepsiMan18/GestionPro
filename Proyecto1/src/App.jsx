import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PanelControl from './pages/PanelControl';
import Inmuebles from './pages/Inmuebles';
import Inquilinos from './pages/Inquilinos';
import ConsumoServicios from './pages/ConsumoServicios';
import EmisionRecibos from './pages/EmisionRecibos';
import Facturacion from './pages/Facturacion';
import Contratos from './pages/Contratos';
import Configuracion from './pages/Configuracion';
import Reportes from './pages/Reportes';
import Login from './pages/Login';
import { getInmuebles } from './api/inmueblesApi';
import { getInquilinos } from './api/inquilinosApi';
import { getContratos } from './api/contratosApi';
import { getConceptosConsumo } from './api/conceptosApi';
import './App.css';

const inmueblesIniciales = [
  {
    id: 1,
    codigo: 'A-15',
    descripcion: 'PUESTO A-15',
    tipo: 'Local Comercial',
    sector: 'Mercado',
    estado: 'Ocupado',
    area: '20 m2',
    piso: '1',
    alquiler: '$1,000.00',
    incluyeServicios: 'N',
    imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200&h=150'
  },
  {
    id: 2,
    codigo: 'OF-202',
    descripcion: 'LOCAL OF.202',
    tipo: 'Oficina',
    sector: 'Oficinas',
    estado: 'Desocupado',
    area: '45 m2',
    piso: '2',
    alquiler: '$1,200.00',
    incluyeServicios: 'S',
    imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200&h=150'
  },
  {
    id: 3,
    codigo: 'TDA.113',
    descripcion: 'LOCAL TDA.113',
    tipo: 'Tienda Externa',
    sector: 'Tiendas Externas',
    estado: 'Mantenimiento',
    area: '30 m2',
    piso: '1',
    alquiler: '$1,500.00',
    incluyeServicios: 'N',
    imagen: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=200&h=150'
  }
];

const inquilinosIniciales = [
  {
    id: 1,
    tipoCliente: 'Natural',
    tipoDocumento: 'DNI',
    numeroDocumento: '71234567',
    nombre: 'Juan Pérez',
    celular: '987654321',
    correo: 'juan@email.com',
    direccion: 'Av. Siempre Viva 123',
    estado: 'Activo'
  },
  {
    id: 2,
    tipoCliente: 'Jurídica',
    tipoDocumento: 'RUC',
    numeroDocumento: '20123456789',
    nombre: 'Empresa XYZ S.A.C.',
    celular: '999888777',
    correo: 'contacto@xyz.com',
    direccion: 'Calle Los Negocios 456',
    estado: 'Activo'
  }
];

const contratosIniciales = [
  {
    id: 1,
    idInmueble: 1, // A-15
    idInquilino: 1, // Juan Pérez
    fechaInicio: '2025-01-01',
    fechaFin: '2026-12-31',
    monto: 1000,
    estado: 'Vigente',
    archivo: 'contrato.pdf'
  },
  {
    id: 2,
    idInmueble: 3, // TDA.113
    idInquilino: 2, // XYZ
    fechaInicio: '2025-01-15',
    fechaFin: '2026-06-15',
    monto: 1500,
    estado: 'Vigente',
    archivo: null
  }
];

const conceptosIniciales = [
  { id: 1, descCorta: 'agua', descripcion: 'Agua', tipo: 'Variable', unidad: 'm3', importe: 0, estado: 'Habilitado' },
  { id: 2, descCorta: 'luz', descripcion: 'Energía Eléctrica', tipo: 'Variable', unidad: 'kw', importe: 0, estado: 'Habilitado' },
  { id: 3, descCorta: 'internet', descripcion: 'Internet', tipo: 'Fijo', unidad: '', importe: 15, estado: 'Habilitado' },
  { id: 4, descCorta: 'vigilancia', descripcion: 'Vigilancia', tipo: 'Fijo', unidad: 'um', importe: 39, estado: 'Habilitado' },
  { id: 5, descCorta: 'gas', descripcion: 'Gas', tipo: 'Variable', unidad: 'um', importe: 0, estado: 'Habilitado' }
];

const recibosIniciales = [
  { id: 1, nroRi: 'RI-0001', idContrato: 1, tipo: 'Consumo de servicios', inquilino: 'Juan Pérez', inmueble: 'A-15', fechaEmision: '2026-06-15', fechaVencimiento: '2026-06-30', periodo: '06/2026', total: 125.00, estado: 'Emitido' }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [listaInmuebles, setListaInmuebles] = React.useState(inmueblesIniciales);
  const [listaInquilinos, setListaInquilinos] = React.useState(inquilinosIniciales);
  const [listaContratos, setListaContratos] = React.useState(contratosIniciales);
  const [listaConceptos, setListaConceptos] = React.useState(conceptosIniciales);
  const [listaRecibos, setListaRecibos] = React.useState(recibosIniciales);
  
  // Estado global para guardar lecturas temporales antes de emitir recibos
  // Formato: { [idContrato]: [ { idConcepto, lecturaInicial, lecturaFinal } ] }
  const [lecturasTemporales, setLecturasTemporales] = React.useState({});

  React.useEffect(() => {
    if (isAuthenticated) {
      // Intentar cargar la lista real desde AWS
      getInmuebles()
        .then(data => {
          if (data && data.length > 0) {
            setListaInmuebles(data);
          }
        })
        .catch(err => {
          console.warn("No se pudo cargar Inmuebles desde AWS. Usando datos simulados locales:", err);
        });
        
      getInquilinos()
        .then(data => {
          if (data && data.length > 0) {
            setListaInquilinos(data);
          }
        })
        .catch(err => {
          console.warn("No se pudo cargar Inquilinos desde AWS. Usando datos simulados locales:", err);
        });

      getContratos()
        .then(data => {
          if (data && data.length > 0) {
            setListaContratos(data);
          }
        })
        .catch(err => {
          console.warn("No se pudo cargar Contratos desde AWS. Usando datos simulados locales:", err);
        });

      getConceptosConsumo()
        .then(data => {
          if (data && data.length > 0) {
            setListaConceptos(data);
          }
        })
        .catch(err => {
          console.warn("No se pudo cargar Conceptos desde AWS. Usando datos simulados locales:", err);
        });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header onLogout={handleLogout} />
        <main className="content">
          <Routes>
            <Route path="/" element={<PanelControl listaInmuebles={listaInmuebles} />} />
            <Route path="/inmuebles" element={<Inmuebles listaInmuebles={listaInmuebles} setListaInmuebles={setListaInmuebles} />} />
            <Route path="/inquilinos" element={<Inquilinos listaInquilinos={listaInquilinos} setListaInquilinos={setListaInquilinos} listaContratos={listaContratos} />} />
            <Route path="/contratos" element={<Contratos listaContratos={listaContratos} setListaContratos={setListaContratos} listaInmuebles={listaInmuebles} setListaInmuebles={setListaInmuebles} listaInquilinos={listaInquilinos} />} />
            <Route path="/consumo-servicios" element={<ConsumoServicios listaConceptos={listaConceptos} setListaConceptos={setListaConceptos} listaContratos={listaContratos} listaInmuebles={listaInmuebles} listaInquilinos={listaInquilinos} lecturasTemporales={lecturasTemporales} setLecturasTemporales={setLecturasTemporales} />} />
            <Route path="/emision-recibos" element={<EmisionRecibos listaRecibos={listaRecibos} setListaRecibos={setListaRecibos} listaContratos={listaContratos} listaConceptos={listaConceptos} listaInquilinos={listaInquilinos} listaInmuebles={listaInmuebles} lecturasTemporales={lecturasTemporales} setLecturasTemporales={setLecturasTemporales} />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
