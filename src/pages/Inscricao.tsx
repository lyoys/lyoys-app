import { useParams, Navigate } from 'react-router-dom';

// Rota antiga de formulário de inscrição avulso. Substituída pelo fluxo de Perfil
// (candidatura em um toque usando dados salvos). Mantida como redirecionamento para
// não quebrar links antigos que apontem para /inscricao/:id.
export default function Inscricao() {
  const { id } = useParams();
  return <Navigate to={id ? `/perfil?candidatar=${id}` : '/perfil'} replace />;
}
