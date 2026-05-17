import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PanelControl from './pages/PanelControl';
import Inmuebles from './pages/Inmuebles';
import Inquilinos from './pages/Inquilinos';
import Servicios from './pages/Servicios';
import Facturacion from './pages/Facturacion';
import Contratos from './pages/Contratos';
import Configuracion from './pages/Configuracion';
import Reportes from './pages/Reportes';
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

function App() {
  const [listaInmuebles, setListaInmuebles] = React.useState(inmueblesIniciales);
  const [listaInquilinos, setListaInquilinos] = React.useState(inquilinosIniciales);
  const [listaContratos, setListaContratos] = React.useState(contratosIniciales);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<PanelControl listaInmuebles={listaInmuebles} />} />
            <Route path="/inmuebles" element={<Inmuebles listaInmuebles={listaInmuebles} setListaInmuebles={setListaInmuebles} />} />
            <Route path="/inquilinos" element={<Inquilinos listaInquilinos={listaInquilinos} setListaInquilinos={setListaInquilinos} />} />
            <Route path="/contratos" element={<Contratos listaContratos={listaContratos} setListaContratos={setListaContratos} listaInmuebles={listaInmuebles} setListaInmuebles={setListaInmuebles} listaInquilinos={listaInquilinos} />} />
            <Route path="/servicios" element={<Servicios />} />
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
