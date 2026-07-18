import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <p className="tag">Bem-vindo ao universo</p>
        <h1>LYØYS</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Desenvolvemos projetos culturais e estratégias de comunicação para iniciativas
          institucionais, artísticas e educativas.
        </p>
        <Link to="/casting" className="btn">Ver chamadas de casting</Link>
      </section>

      <section className="card" style={{ marginTop: '3rem' }}>
        <p>
          Produtora cultural independente que une arte, entretenimento e impacto social,
          democratizando o acesso à cultura para jovens de territórios vulneráveis.
        </p>
      </section>

      <div className="grid-2">
        <div className="card stat">
          <div className="num">22</div>
          <div className="label">Média de dias no mercado</div>
        </div>
        <div className="card stat">
          <div className="num">86</div>
          <div className="label">Itens/projetos entregues</div>
        </div>
      </div>
    </div>
  );
}
