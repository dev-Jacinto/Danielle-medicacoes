import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Painel from './pages/Painel';

function App() {
  return (
    <Routes>
      {/* Ao acessar a raiz do site, redireciona para o login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/painel" element={<Painel />} />
    </Routes>
  );
}

export default App;