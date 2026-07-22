import { useState, useEffect } from "react";
import "../componentes/Menu.css";

const ITENS_MENU = [
  { label: "Home", destino: "home" },
  { label: "Sobre", destino: "sobre" },
  { label: "Trabalhos", destino: "trabalhos" },
  { label: "Serviços", destino: "servicos" },
];

export default function MenuHamburguer({ aoNavegar, visivel = true }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [ativo, setAtivo] = useState("home");

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

  const abrirOuFechar = () => setMenuAberto((atual) => !atual);

  const irPara = (destino) => {
    setMenuAberto(false);
    if (aoNavegar) aoNavegar(destino);
  };

  return (
    <>
      <div
        className={`comeco-btn comeco-btn-hamburguer ${menuAberto ? "comeco-btn-hamburguer--ativo" : ""} ${visivel ? "comeco-btn-hamburguer--visivel" : ""}`}
      >
        <button
          className="comeco-btn-click comeco-magnetic"
          onClick={abrirOuFechar}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          <div className="comeco-btn-fill" aria-hidden="true" />
          <div className="comeco-btn-text">
            <div className="comeco-btn-bars" aria-hidden="true" />
            <span className="comeco-btn-text-inner">Menu</span>
          </div>
        </button>
      </div>

      <div
        className={`comeco-fixed-nav-back ${menuAberto ? "comeco-fixed-nav-back--ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
        aria-hidden="true"
      />

      <nav
        className={`comeco-fixed-nav ${menuAberto ? "comeco-fixed-nav--ativo" : ""}`}
        aria-label="Menu principal"
      >
        <div className="comeco-fixed-nav-rounded-div" aria-hidden="true">
          <div className="comeco-rounded-div-wrap">
            <div className="comeco-rounded-div" />
          </div>
        </div>

        <div className="comeco-fixed-nav-inner">
          <div className="comeco-nav-row">
            <h5 className="comeco-nav-titulo">Navegação</h5>
            <div className="comeco-stripe" />
            <ul className="comeco-links-wrap">
              {ITENS_MENU.map((item, i) => (
                <li
                  className={`comeco-btn comeco-btn-link ${ativo === item.destino ? "comeco-btn-link--ativo" : ""}`}
                  key={item.destino}
                  style={{ transitionDelay: menuAberto ? `${0.03 + i * 0.03}s` : "0s" }}
                >
                  <a
                    href={`#${item.destino}`}
                    className="comeco-btn-click comeco-magnetic"
                    onClick={(e) => { e.preventDefault(); irPara(item.destino); }}
                  >
                    <span className="comeco-btn-text">
                      <span className="comeco-btn-text-inner">{item.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="comeco-social-row">
            <div className="comeco-stripe" />
            <div className="comeco-socials">
              <h5 className="comeco-nav-titulo">Redes sociais</h5>
              <ul>
                <li className="comeco-btn comeco-btn-link comeco-btn-link--externo">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="comeco-btn-click comeco-magnetic"
                  >
                    <span className="comeco-btn-text">
                      <span className="comeco-btn-text-inner">Instagram</span>
                    </span>
                  </a>
                </li>
                <li className="comeco-btn comeco-btn-link comeco-btn-link--externo">
                  <a
                    href="https://wa.me/554100000000"
                    target="_blank"
                    rel="noreferrer"
                    className="comeco-btn-click comeco-magnetic"
                  >
                    <span className="comeco-btn-text">
                      <span className="comeco-btn-text-inner">WhatsApp</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}