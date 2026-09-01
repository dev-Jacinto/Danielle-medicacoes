import { Navigate } from 'react-router-dom';
import { estaLogado } from '../services/authService';

// Envolve uma página que só pode ser vista por quem está logado.
// Se não tiver token salvo, redireciona para o login.
function RotaProtegida({ children }) {
  if (!estaLogado()) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RotaProtegida;