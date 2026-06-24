import { useState, useEffect } from "react";
import "./comeco.css";

const TITULO = "Souza, a empresa que só tende a inovar";

function EngrenagemQuadrante({ quadrante, fase }) {
  const clipMap = {
    tl: "polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)",
    tr: "polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)",
    bl: "polygon(0% 50%, 50% 50%, 50% 100%, 0% 100%)",
    br: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
  };

  return (
    <div className={`engrenagem-quadrante engrenagem-quadrante--${quadrante} engrenagem-quadrante--${fase}`}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ clipPath: clipMap[quadrante] }}
      >
        <path
          d="M43.3 5.2l-3.1 9.5a32 32 0 0 0-8.3 3.4l-9.2-4.1-9.4 9.4 4.1 9.2a32 32 0 0 0-3.4 8.3l-9.5 3.1v13.3l9.5 3.1a32 32 0 0 0 3.4 8.3l-4.1 9.2 9.4 9.4 9.2-4.1a32 32 0 0 0 8.3 3.4l3.1 9.5h13.3l3.1-9.5a32 32 0 0 0 8.3-3.4l9.2 4.1 9.4-9.4-4.1-9.2a32 32 0 0 0 3.4-8.3l9.5-3.1V43.3l-9.5-3.1a32 32 0 0 0-3.4-8.3l4.1-9.2-9.4-9.4-9.2 4.1a32 32 0 0 0-8.3-3.4L56.7 5.2H43.3zM50 34a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
          fill="#2d6a4f"
        />
      </svg>
    </div>
  );
}

export default function Comeco() {
  const [fase, setFase] = useState("visivel");
  const [faseFundo, setFaseFundo] = useState("baixo");
  const [faseTexto, setFaseTexto] = useState("visivel");
  const [menuAberto, setMenuAberto] = useState(false);
  const [hamburgerVisivel, setHamburgerVisivel] = useState(false);
  const [faseMarrelo, setFaseMarrelo] = useState(null); // null | 'descendo' | 'batendo' | 'subindo'
  const [sacudindo, setSacudindo] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setFase("subindo"), 4000);
    const t4 = setTimeout(() => {
      setFaseFundo("subindo");
      setFaseTexto("subindo");
    }, 5000);
    const t2 = setTimeout(() => setFase("sumiu"), 7300);
    const t3 = setTimeout(() => {
      setFaseFundo("chegou");
      document.body.style.overflow = "";
    }, 8200);
    const t5 = setTimeout(() => setHamburgerVisivel(true), 5200);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
    };
  }, []);

  const fundoClasse = [
    "comeco-fundo",
    faseFundo === "subindo" ? "comeco-fundo--subindo" : "",
    faseFundo === "chegou"  ? "comeco-fundo--chegou"  : "",
  ].filter(Boolean).join(" ");

  const rastroClasse = [
    "comeco-rastro",
    faseFundo === "subindo" ? "comeco-rastro--subindo" : "",
    faseFundo === "chegou"  ? "comeco-rastro--chegou"  : "",
  ].filter(Boolean).join(" ");

return (
    <section style={{ height: "100vh", position: "relative" }}>
      {/* ── Martelo ── */}
      {faseMarrelo && (
        <img
          src="martelo.png"
          alt=""
          aria-hidden="true"
          className={`comeco-martelo comeco-martelo--${faseMarrelo}`}
        />
      )}

      {/* ── Hambúrguer ── */}
      <button
        className={`comeco-hamburguer ${menuAberto ? "comeco-hamburguer--aberto" : ""} ${hamburgerVisivel ? "comeco-hamburguer--visivel" : ""} ${sacudindo ? "comeco-hamburguer--sacudindo" : ""}`}
        onClick={() => {

          if (menuAberto) { setMenuAberto(false); return; }
          // Sequência do martelo: desce devagar → pausa → bate → hambúrguer abre → martelo sobe
          setFaseMarrelo("descendo");
          setTimeout(() => setFaseMarrelo("batendo"), 700);
          setTimeout(() => { setSacudindo(true); setMenuAberto(true); }, 950);
          setTimeout(() => { setFaseMarrelo("subindo"); setSacudindo(false); }, 1150);
          setTimeout(() => setFaseMarrelo(null), 1700);
        }}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        <span className="comeco-hamburguer__linha" />
        <span className="comeco-hamburguer__linha" />
        <span className="comeco-hamburguer__linha" />
      </button>

      {/* ── Overlay escuro do menu ── */}
      <div
        className={`comeco-menu-overlay ${menuAberto ? "comeco-menu-overlay--ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
        aria-hidden="true"
      />

      {/* ── Menu Drawer ── */}
      <nav
        className={`comeco-menu ${menuAberto ? "comeco-menu--aberto" : ""}`}
        aria-label="Menu principal"
      >
        <div className="comeco-menu__linha-deco" aria-hidden="true" />
        <ul className="comeco-menu__lista">
          <li className="comeco-menu__item">
            <a href="#home" className="comeco-menu__link" onClick={() => setMenuAberto(false)}>Home</a>
          </li>
          <li className="comeco-menu__item">
            <a href="#sobre" className="comeco-menu__link" onClick={() => setMenuAberto(false)}>Sobre</a>
          </li>
          <li className="comeco-menu__item">
            <a href="#servicos" className="comeco-menu__link" onClick={() => setMenuAberto(false)}>Serviços</a>
          </li>
        </ul>
      </nav>

      {/* ── Texto SOUZA (z-index 1) ── */}
      <div
        className={`comeco-fundo-texto comeco-fundo-texto--${faseTexto}`}
        aria-hidden="true"
      >
        <div className="comeco-fundo-texto__inner">
          <span className="comeco-fundo-texto__souza">SOUZA</span>
          <span className="comeco-fundo-texto__sub">MONTAGEM INDUSTRIAL</span>
        </div>
      </div>

      {/* ── Rastro (z-index 1, atrás do industrial) ── */}
      <div className={rastroClasse} aria-hidden="true" />

      {/* ── Imagem industrial (z-index 2) ── */}
      <div className={fundoClasse} aria-hidden="true" />

      {/* ── Overlay verde ── */}
      {fase !== "sumiu" && (
        <div className={`comeco-overlay comeco-overlay--${fase}`}>
          <div className="comeco-linha comeco-linha--esquerda" />
          <div className="comeco-linha comeco-linha--meio" />
          <div className="comeco-linha comeco-linha--direita" />

          <div className={`engrenagem-wrapper engrenagem-wrapper--${fase}`}>
            <EngrenagemQuadrante quadrante="tl" fase={fase} />
            <EngrenagemQuadrante quadrante="tr" fase={fase} />
            <EngrenagemQuadrante quadrante="bl" fase={fase} />
            <EngrenagemQuadrante quadrante="br" fase={fase} />
          </div>

          <div className="comeco-centro">
            <div style={{ height: "clamp(52px, 7vw, 80px)" }} />
            <h1 className={`comeco-titulo comeco-titulo--${fase}`}>
              {TITULO.split(" ").map((palavra, i) => (
                <span
                  key={i}
                  className="comeco-palavra"
                  style={{ animationDelay: `${0.9 + i * 0.12}s` }}
                >
                  {palavra}
                </span>
              ))}
            </h1>
          </div>
        </div>
      )}


    </section>
  );
}