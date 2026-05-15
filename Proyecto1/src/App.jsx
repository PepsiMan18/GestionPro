import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PanelControl from './pages/PanelControl';
import Inmuebles from './pages/Inmuebles';
import Inquilinos from './pages/Inquilinos';
import Servicios from './pages/Servicios';
import Facturacion from './pages/Facturacion';
import Reportes from './pages/Reportes';
import './App.css';

const inmueblesIniciales = [
  {
    id: 1,
    direccion: 'Calle Los Pinos 123',
    ciudad: 'Lima',
    tipo: 'Departamento',
    estado: 'Ocupado',
    alquiler: '$1,000.00',
    proximosPagos: 'Agua: 15 Oct',
    imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200&h=150',
    inquilino: 'Juan Pérez',
    diaCobro: '15'
  },
  {
    id: 2,
    direccion: 'Av. Las Gardenias 456',
    ciudad: 'Lima',
    tipo: 'Departamento',
    estado: 'Desocupado',
    alquiler: '$1,200.00',
    proximosPagos: 'Al Día',
    imagen: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200&h=150'
  },
  {
    id: 3,
    direccion: 'Residencial San Antonio',
    ciudad: 'Lima',
    tipo: 'Casa',
    estado: 'Con Deuda',
    alquiler: '$1,500.00',
    proximosPagos: 'Renta Atrasada',
    imagen: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=200&h=150',
    inquilino: 'María Gómez',
    diaCobro: '5'
  }
];

function App() {
  const [listaInmuebles, setListaInmuebles] = useState(inmueblesIniciales);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<PanelControl listaInmuebles={listaInmuebles} />} />
            <Route path="/inmuebles" element={<Inmuebles listaInmuebles={listaInmuebles} setListaInmuebles={setListaInmuebles} />} />
            <Route path="/inquilinos" element={<Inquilinos />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
