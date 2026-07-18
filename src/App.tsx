import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Servicos from './pages/Servicos';
import Casting from './pages/Casting';
import CastingDetalhe from './pages/CastingDetalhe';
import Inscricao from './pages/Inscricao';
import Perfil from './pages/Perfil';
import Contato from './pages/Contato';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/casting" element={<Casting />} />
          <Route path="/casting/:id" element={<CastingDetalhe />} />
          <Route path="/inscricao" element={<Inscricao />} />
          <Route path="/inscricao/:id" element={<Inscricao />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
