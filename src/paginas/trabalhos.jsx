import { useState, useRef, useEffect } from "react";
import "./trabalhos.css";

// TODO: substitua pelos trabalhos reais da Souza
const TRABALHOS = [
  { cliente: "New Holland", local: "Curitiba, PR", servico: "Manutenção Industrial", ano: 2024, imagem: "1.jpg" },
  { cliente: "New Holland", local: "Curitiba, PR", servico: "Manutenção Industrial", ano: 2024, imagem: "2.jpg" },
  { cliente: "New Holland", local: "Curitiba, PR", servico: "Manutenção Industrial", ano: 2024, imagem: "3.jpg" },
  { cliente: "New Holland", local: "Curitiba, PR", servico: "Manutenção Industrial", ano: 2024, imagem: "4.avif" },
  { cliente: "New Holland", local: "Curitiba, PR", servico: "Manutenção Industrial", ano: 2024, imagem: "5.jpg" },
  { cliente: "New Holland", local: "Curitiba, PR", servico: "Manutenção Industrial", ano: 2024, imagem: "6.webp" },
];

function IconLista() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="6"  x2="20" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconGrade() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="4"  width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4"  width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4"  y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Faz o ícone dentro do botão "seguir" o cursor com um leve efeito magnético
function useMouseFollow(strength = 0.35) {
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const icon = btn.querySelector("svg");
    if (!icon) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    icon.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = (e) => {
    const icon = e.currentTarget.querySelector("svg");
    if (!icon) return;
    icon.style.transform = "translate(0px, 0px)";
  };

  return { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}

const DURACAO_SAIDA = 850;   // precisa bater com trabalhosItemSai no CSS
const DURACAO_ENTRADA = 1000; // precisa bater com trabalhosItemEntra no CSS
const ATRASO_POR_ITEM = 60;  // precisa bater com --i * 60ms no CSS

export default function Trabalhos() {
  const [visao, setVisao] = useState("lista");         // visão alvo (usada nos botões ativos)
  const [visaoExibida, setVisaoExibida] = useState("lista"); // o que está de fato renderizado
  const [fase, setFase] = useState("idle"); // "idle" | "saindo" | "entrando"
  const mouseFollow = useMouseFollow(0.3);
  const transicaoTimers = useRef([]);

  const trocarVisao = (nova) => {
    if (nova === visao || fase !== "idle") return;

    setVisao(nova);
    setFase("saindo");

    // tempo de saída = animação + maior atraso escalonado entre os itens
    const maiorAtraso = (TRABALHOS.length - 1) * ATRASO_POR_ITEM;
    const t1 = setTimeout(() => {
      setVisaoExibida(nova);
      setFase("entrando");

      const t2 = setTimeout(() => {
        setFase("idle");
      }, DURACAO_ENTRADA + maiorAtraso);
      transicaoTimers.current.push(t2);
    }, DURACAO_SAIDA + maiorAtraso);
    transicaoTimers.current.push(t1);
  };

  const listaRef = useRef(null);
  const caixaRef = useRef(null);
  const imagemRefA = useRef(null);
  const imagemRefB = useRef(null);
  // Guarda qual das duas imagens está ativa no momento (ou null se nenhuma)
  const imagemAtivaRef = useRef(null);

  // Move a caixa cinza para acompanhar o cursor dentro da lista
  // (só a caixa se move/aparece; as imagens ficam paradas dentro dela)
  const handleListaMouseMove = (e) => {
    const container = listaRef.current;
    const caixa = caixaRef.current;
    if (!container || !caixa) return;
    const rect = container.getBoundingClientRect();
    caixa.style.left = `${e.clientX - rect.left}px`;
    caixa.style.top = `${e.clientY - rect.top}px`;
  };

  // Ao trocar de item: a caixa cinza permanece parada, só a imagem
  // atual sobe e some enquanto a nova sobe do chão e ocupa o lugar
  const handleItemMouseEnter = (src) => {
    const caixa = caixaRef.current;
    const imgA = imagemRefA.current;
    const imgB = imagemRefB.current;
    if (!caixa || !imgA || !imgB) return;

    caixa.classList.add("trabalhos-hover-caixa--ativa");

    const atual = imagemAtivaRef.current;

    if (!atual) {
      // Primeira imagem: só aparece no lugar
      imgA.src = src;
      imgA.classList.remove("trabalhos-hover-imagem--saindo", "trabalhos-hover-imagem--entrando");
      imgA.classList.add("trabalhos-hover-imagem--ativa");
      imagemAtivaRef.current = imgA;
      return;
    }

    const proxima = atual === imgA ? imgB : imgA;

    // A imagem atual sobe e desaparece
    atual.classList.remove("trabalhos-hover-imagem--ativa");
    atual.classList.add("trabalhos-hover-imagem--saindo");

    // A próxima imagem parte de baixo (do "chão") ainda invisível
    proxima.src = src;
    proxima.classList.remove("trabalhos-hover-imagem--saindo");
    proxima.classList.add("trabalhos-hover-imagem--entrando");

    // Força o navegador a aplicar o estado "entrando" antes de animar até "ativa"
    void proxima.offsetWidth;

    proxima.classList.remove("trabalhos-hover-imagem--entrando");
    proxima.classList.add("trabalhos-hover-imagem--ativa");

    imagemAtivaRef.current = proxima;
  };

  // Esconde a caixa cinza (e a imagem ativa) ao sair da lista por completo
  const handleListaMouseLeave = () => {
    const caixa = caixaRef.current;
    if (caixa) {
      caixa.classList.remove("trabalhos-hover-caixa--ativa");
    }
    const atual = imagemAtivaRef.current;
    if (atual) {
      atual.classList.remove("trabalhos-hover-imagem--ativa", "trabalhos-hover-imagem--entrando", "trabalhos-hover-imagem--saindo");
    }
    imagemAtivaRef.current = null;
  };

  useEffect(() => {
    return () => {
      transicaoTimers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="trabalhos-secao" id="trabalhos">

      {/* ── Topo: título + botões de visão ── */}
      <div className="trabalhos-topo">
        <h2 className="trabalhos-titulo">
          <span>Soluções em montagem industrial</span>
          <span>com excelência</span>
        </h2>

        <div className="trabalhos-toggle">
          <button
            type="button"
            className={`trabalhos-toggle-btn ${visao === "lista" ? "trabalhos-toggle-btn--ativo" : ""}`}
            onClick={() => trocarVisao("lista")}
            onMouseMove={mouseFollow.onMouseMove}
            onMouseLeave={mouseFollow.onMouseLeave}
            aria-label="Ver como lista"
            aria-pressed={visao === "lista"}
            disabled={fase !== "idle"}
          >
            <IconLista />
          </button>
          <button
            type="button"
            className={`trabalhos-toggle-btn ${visao === "grade" ? "trabalhos-toggle-btn--ativo" : ""}`}
            onClick={() => trocarVisao("grade")}
            onMouseMove={mouseFollow.onMouseMove}
            onMouseLeave={mouseFollow.onMouseLeave}
            aria-label="Ver como grade"
            aria-pressed={visao === "grade"}
            disabled={fase !== "idle"}
          >
            <IconGrade />
          </button>
        </div>
      </div>

      {/* ── Visão em lista ── */}
      {visaoExibida === "lista" && (
        <>
          <div className="trabalhos-cabecalho">
            <span>Cliente</span>
            <span>Localização</span>
            <span>Serviço</span>
            <span>Ano</span>
          </div>

          <div
            className={`trabalhos-lista ${fase === "saindo" ? "trabalhos-lista--saindo" : ""} ${fase === "entrando" ? "trabalhos-lista--entrando" : ""}`}
            ref={listaRef}
            onMouseMove={handleListaMouseMove}
            onMouseLeave={handleListaMouseLeave}
          >
            {TRABALHOS.map((t, i) => (
              <div
                className="trabalhos-item"
                key={i}
                style={{ "--i": i }}
                onMouseEnter={() => handleItemMouseEnter(t.imagem)}
              >
                <h3 className="trabalhos-item-cliente">{t.cliente}</h3>
                <span className="trabalhos-item-local">{t.local}</span>
                <span className="trabalhos-item-servico">{t.servico}</span>
                <span className="trabalhos-item-ano">{t.ano}</span>
              </div>
            ))}

            <div className="trabalhos-hover-caixa" ref={caixaRef}>
              <img
                src={TRABALHOS[0].imagem}
                alt=""
                className="trabalhos-hover-imagem"
                ref={imagemRefA}
              />
              <img
                src={TRABALHOS[0].imagem}
                alt=""
                className="trabalhos-hover-imagem"
                ref={imagemRefB}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Visão em grade ── */}
      {visaoExibida === "grade" && (
        <div className={`trabalhos-grade ${fase === "saindo" ? "trabalhos-grade--saindo" : ""} ${fase === "entrando" ? "trabalhos-grade--entrando" : ""}`}>
          {TRABALHOS.map((t, i) => (
            <div className="trabalhos-card" key={i} style={{ "--i": i }}>
              <div className="trabalhos-card-imagem-wrap">
                <img src={t.imagem} alt={t.cliente} className="trabalhos-card-imagem" />
              </div>
              <h3 className="trabalhos-card-cliente">{t.cliente}</h3>
              <div className="trabalhos-card-linha" />
              <div className="trabalhos-card-rodape">
                <span className="trabalhos-card-servico">{t.servico}</span>
                <span className="trabalhos-card-ano">{t.ano}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}