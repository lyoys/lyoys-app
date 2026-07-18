import { useParams, Link, Navigate } from 'react-router-dom';
import { useCastingCalls } from '../services/castingSource';
import ApplyButton from '../components/ApplyButton';

export default function CastingDetalhe() {
  const { id } = useParams();
  const { calls, loading } = useCastingCalls();
  const call = calls.find((c) => c.id === id);

  // Só redireciona depois que a busca remota terminar, para não expulsar quem abriu o
  // link de uma vaga que só existe na planilha (ainda não chegou no estado inicial).
  if (!call) {
    if (loading) return null;
    return <Navigate to="/casting" replace />;
  }

  return (
    <div>
      <Link to="/casting" style={{ fontSize: '0.85rem' }}>&larr; Voltar para casting</Link>
      <h1>{call.titulo}</h1>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        <span className={`badge ${call.status}`}>
          {call.status === 'aberta' ? 'Inscrições abertas' : 'Encerrada'}
        </span>
        <span className={`badge ${call.origem === 'lyoys' ? 'lyoys' : 'terceiros'}`}>
          {call.origem === 'lyoys' ? 'Projeto Lyoys' : `Divulgação · ${call.parceiro}`}
        </span>
      </div>

      {call.origem === 'terceiros' && (
        <div className="card" style={{ borderColor: 'var(--gold)' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            A Lyoys está apenas divulgando esta oportunidade em parceria com {call.parceiro}. A
            seleção e o processo seguem com a produtora parceira, não com a Lyoys.
          </p>
        </div>
      )}

      <div className="card">
        <p><strong>Categoria:</strong> {call.categoria}</p>
        <p><strong>Local:</strong> {call.local}</p>
        <p><strong>Prazo:</strong> {new Date(call.dataLimite).toLocaleDateString('pt-BR')}</p>
        <p>{call.descricao}</p>
      </div>

      <h2>Requisitos</h2>
      <div className="card">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {call.requisitos.map((r) => (
            <li key={r} style={{ marginBottom: 6 }}>{r}</li>
          ))}
        </ul>
      </div>

      {call.status === 'aberta' && call.origem === 'lyoys' && <ApplyButton castingId={call.id} />}
    </div>
  );
}
