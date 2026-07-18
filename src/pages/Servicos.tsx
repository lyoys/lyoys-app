const grupos = [
  {
    titulo: 'Comunicação e marca',
    itens: [
      'Criação de Identidade Visual',
      'Marketing e Redes Sociais',
      'Pacote mensal ou unitário de reels institucionais',
      'Criação de sites institucionais'
    ]
  },
  {
    titulo: 'Produção cultural',
    itens: ['Produção Cultural', 'Oficinas Formativas', 'Curadoria e Desenvolvimento de Projetos']
  },
  {
    titulo: 'Produções',
    itens: ['Produção Executiva']
  }
];

export default function Servicos() {
  return (
    <div>
      <h1>Nossos serviços</h1>
      {grupos.map((g) => (
        <section key={g.titulo}>
          <h2>{g.titulo}</h2>
          <div className="card">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {g.itens.map((i) => (
                <li key={i} style={{ marginBottom: 6 }}>{i}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <div className="card">
        <p>Quer contratar um desses serviços ou tirar uma dúvida? Fale com a gente.</p>
        <a href="mailto:lyoys.suporte@gmail.com" className="btn">Entrar em contato</a>
      </div>
    </div>
  );
}
