import "./footer.css";

function HoverTexto({ texto }) {
  const letras = Array.from(texto);
  const total = letras.length;

  return (
    <span className="footer-hover-texto" aria-hidden="true">
      {letras.map((letra, i) => (
        <span
          className="footer-hover-letra"
          style={{ "--i": i, "--n": total }}
          key={i}
        >
          <span className="footer-hover-linha footer-hover-normal">
            {letra === " " ? "\u00A0" : letra}
          </span>
          <span className="footer-hover-linha footer-hover-alt">
            {letra === " " ? "\u00A0" : letra}
          </span>
        </span>
      ))}
    </span>
  );
}

const COLUNAS = [
  {
    titulo: "Localização",
    linhas: ["Curitiba, PR", "Brasil"],
  },
  {
    titulo: "Contato",
    linhas: [{ texto: "+55 41 00000-0000", href: "tel:+554100000000" }],
  },
  {
    titulo: "E-mail",
    linhas: [{ texto: "contato@souza.com.br", href: "mailto:contato@souza.com.br" }],
  },
  {
    titulo: "Social",
    linhas: [
      { texto: "Instagram", href: "https://instagram.com" },
      { texto: "whatsapp", href: "https://linkedin.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer-secao">
      <div className="footer-topo">
        <div className="footer-topo-esquerda">
          <p className="footer-eyebrow">Entre em contato</p>
          <h3 className="footer-subtitulo">Vamos trabalhar juntos</h3>
          <p className="footer-descricao">
            Tem uma montagem, manutenção ou projeto industrial que precisa
            sair do papel? Fale com a nossa equipe e vamos colocar a mão na
            massa.
          </p>
          <a
            className="footer-cta footer-hover-target"
            href="mailto:contato@souza.com.br"
            aria-label="Contato"
          >
            <span className="footer-cta-texto">
              <HoverTexto texto="Contato" />
            </span>
            <span className="footer-cta-circulo">↗</span>
          </a>
        </div>

        <h2 className="footer-titulo">
          <span className="footer-titulo-linha">Tem um</span>
          <span className="footer-titulo-linha footer-titulo-destaque">
            projeto de montagem
          </span>
          <span className="footer-titulo-linha">em mente?</span>
        </h2>
      </div>

      <div className="footer-linha" />

      <div className="footer-baixo">
        {COLUNAS.map((coluna) => (
          <div className="footer-coluna" key={coluna.titulo}>
            <p className="footer-coluna-titulo">{coluna.titulo}</p>
            <div className="footer-coluna-valores">
              {coluna.linhas.map((linha, i) =>
                typeof linha === "string" ? (
                  <p className="footer-coluna-valor" key={i}>
                    {linha}
                  </p>
                ) : (
                  <a
                    className="footer-coluna-valor footer-coluna-link footer-hover-target"
                    href={linha.href}
                    key={i}
                    aria-label={linha.texto}
                    target={linha.href.startsWith("http") ? "_blank" : undefined}
                    rel={linha.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <HoverTexto texto={linha.texto} />
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-copyright">
        <span>© {new Date().getFullYear()} Souza Montagens Industriais</span>
        <span>Todos os direitos reservados</span>
      </div>
    </footer>
  );
}