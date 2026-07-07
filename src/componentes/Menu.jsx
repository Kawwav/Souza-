import { useState } from "react";
import "../paginas/comeco.css";

export default function MenuHamburguer({ aoNavegar, visivel = true }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [faseMarrelo, setFaseMarrelo] = useState(null); // null | 'descendo' | 'batendo' | 'subindo'
  const [sacudindo, setSacudindo] = useState(false);

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
        <ul className="comeco-menu__lista">
          <li className="comeco-menu__item">
            <a href="#home" className="comeco-menu__link" onClick={(e) => { e.preventDefault(); irPara("home"); }}>Home</a>
          </li>
          <li className="comeco-menu__item">
            <a href="#sobre" className="comeco-menu__link" onClick={(e) => { e.preventDefault(); irPara("sobre"); }}>Sobre</a>
          </li>
          <li className="comeco-menu__item">
            <a href="#trabalhos" className="comeco-menu__link" onClick={(e) => { e.preventDefault(); irPara("trabalhos"); }}>Trabalhos</a>
          </li>
          <li className="comeco-menu__item">
            <a href="#servicos" className="comeco-menu__link" onClick={(e) => { e.preventDefault(); irPara("servicos"); }}>Serviços</a>
          </li>
        </ul>
      </nav>
    </>
  );
}