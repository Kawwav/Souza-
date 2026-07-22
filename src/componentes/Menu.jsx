import { useState, useEffect } from "react";
import "../paginas/comeco.css";

const ITENS_MENU = [
  { label: "Home", destino: "home" },
  { label: "Sobre", destino: "sobre" },
  { label: "Trabalhos", destino: "trabalhos" },
  { label: "Serviços", destino: "servicos" },
];

export default function MenuHamburguer({ aoNavegar, visivel = true }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [faseMarrelo, setFaseMarrelo] = useState(null); // null | 'descendo' | 'batendo' | 'subindo'
  const [sacudindo, setSacudindo] = useState(false);
  const [ativo, setAtivo] = useState("home");

  // ── Scroll-spy: observa as seções da página pra saber onde estamos
  useEffect(() => {
    const ids = ITENS_MENU.map((item) => item.destino);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setAtivo(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const abrirOuFechar = () => {
    if (menuAberto) { setMenuAberto(false); return; }
    // Sequência do martelo: desce devagar → pausa → bate → hambúrguer abre → martelo sobe
    setFaseMarrelo("descendo");
    setTimeout(() => setFaseMarrelo("batendo"), 700);
    setTimeout(() => { setSacudindo(true); setMenuAberto(true); }, 950);
    setTimeout(() => { setFaseMarrelo("subindo"); setSacudindo(false); }, 1150);
    setTimeout(() => setFaseMarrelo(null), 1700);
  };

  const irPara = (destino) => {
    setMenuAberto(false);
    if (aoNavegar) aoNavegar(destino);
  };

  return (
    <>
      {faseMarrelo && (
        <img
          src="martelo.png"
          alt=""
          aria-hidden="true"
          className={`comeco-martelo comeco-martelo--${faseMarrelo}`}
        />
      )}

      <button
        className={`comeco-hamburguer ${menuAberto ? "comeco-hamburguer--aberto" : ""} ${visivel ? "comeco-hamburguer--visivel" : ""} ${sacudindo ? "comeco-hamburguer--sacudindo" : ""}`}
        onClick={abrirOuFechar}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        <span className="comeco-hamburguer__linha" />
        <span className="comeco-hamburguer__linha" />
        <span className="comeco-hamburguer__linha" />
      </button>
      <div
        className={`comeco-menu-overlay ${menuAberto ? "comeco-menu-overlay--ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
        aria-hidden="true"
      />

      <nav
        className={`comeco-menu ${menuAberto ? "comeco-menu--aberto" : ""}`}
        aria-label="Menu principal"
      >
        <div className="comeco-menu__linha-deco" aria-hidden="true" />

        <div className="comeco-menu__topo">
          <span className="comeco-menu__rotulo">Navegação</span>
        </div>

        <ul className="comeco-menu__lista">
          {ITENS_MENU.map((item) => (
            <li className="comeco-menu__item" key={item.destino}>
              <a
                href={`#${item.destino}`}
                className={`comeco-menu__link ${ativo === item.destino ? "comeco-menu__link--ativo" : ""}`}
                onClick={(e) => { e.preventDefault(); irPara(item.destino); }}
              >
                <span className="comeco-menu__ponto" aria-hidden="true" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="comeco-menu__rodape">
          <span className="comeco-menu__rotulo">Redes sociais</span>
          <div className="comeco-menu__socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/554100000000" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </nav>
    </>
  );
}