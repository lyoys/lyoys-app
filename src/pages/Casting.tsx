import { Link } from 'react-router-dom';
import { useCastingCalls } from '../services/castingSource';
import ApplyButton from '../components/ApplyButton';

export default function Casting() {
  const { calls, loading } = useCastingCalls();
  return (
    <div>
      <h1>Chamadas de casting</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Confira as oportunidades abertas. Complete seu perfil uma vez e se candidate com um toque.
        {loading && ' Atualizando...'}
      </p>

      {calls.map((c) => (
        <div className="card" key={c.id}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span className={`badge ${c.status}`}>{c.status === 'aberta' ? 'Inscrições abertas' : 'Encerrada'}</span>
            <span className={`badge ${c.origem === 'lyoys' ? 'lyoys' : 'terceiros'}`}>
              {c.origem === 'lyoys' ? 'Projeto Lyoys' : `Divulgação · ${c.parceiro}`}
            </span>
          </div>
          <h2 style={{ marginTop: 0, marginBottom: 4 }}>{c.titulo}</h2>
          <p style={{ margin: '4px 0', color: 'var(--text-muted)' }}>{c.categoria} · {c.local}</p>
          <p>{c.descricao}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Prazo de inscrição: {new Date(c.dataLimite).toLocaleDateString('pt-BR')}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {c.origem === 'lyoys' ? (
              <>
                <Link to={`/casting/${c.id}`} className="btn secondary">Ver detalhes</Link>
                {c.status === 'aberta' && <ApplyButton castingId={c.id} />}
              </>
            ) : (
              <Link to={`/casting/${c.id}`} className="btn secondary">Ver mais informações</Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
