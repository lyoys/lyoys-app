export default function Contato() {
  return (
    <div>
      <h1>Contate-nos</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Localização</h2>
        <p>
          QS 1 Lotes 34/36 — Taguatinga, Brasília - DF, 72036-004<br />
          Edifício Led Office, sala 903
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Horário de atendimento</h2>
        <p>Segunda a sexta, das 9h às 18h.</p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Fale com a gente</h2>
        <p>
          E-mail: <a href="mailto:lyoys.suporte@gmail.com">lyoys.suporte@gmail.com</a><br />
          Telefone/WhatsApp: (61) 98229-6866 · (61) 99613-9325
        </p>
        <a
          href="https://wa.me/5561982296866"
          target="_blank"
          rel="noreferrer"
          className="btn"
          style={{ marginRight: 8 }}
        >
          Chamar no WhatsApp
        </a>
        <a
          href="https://www.instagram.com/lyoys_produtora"
          target="_blank"
          rel="noreferrer"
          className="btn secondary"
        >
          Instagram
        </a>
      </div>
    </div>
  );
}
