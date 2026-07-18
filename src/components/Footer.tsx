export default function Footer() {
  return (
    <footer className="footer">
      <p>
        <strong>Lyoys Entertainment</strong><br />
        QS 1 Lotes 34/36, Edifício Led Office, sala 903 — Águas Claras, Taguatinga - DF, 72036-004
      </p>
      <p>
        E-mail: <a href="mailto:lyoys.suporte@gmail.com">lyoys.suporte@gmail.com</a><br />
        (61) 98229-6866 · (61) 99613-9325
      </p>
      <p>
        <a href="https://www.instagram.com/lyoys_produtora" target="_blank" rel="noreferrer">
          @lyoys_produtora
        </a>
      </p>
      <p>© {new Date().getFullYear()} Lyoys / 61.585.516/0001-30. Todos os direitos reservados.</p>
    </footer>
  );
}
