import { useRef, useState, useCallback } from "react";
import "./clientes.css";

const LOGOS = [
  { src: "newholland.png", alt: "New Holland", nome: "New Holland" },
  { src: "newholland.png", alt: "New Holland", nome: "empresa2" },
  { src: "newholland.png", alt: "New Holland", nome: "New Hollad" },
  { src: "newholland.png", alt: "New Holland", nome: "empresa2123" },
  { src: "newholland.png", alt: "New Holland", nome: "123d" },
  { src: "newholland.png", alt: "New Holland", nome: "1231nd" },
  { src: "newholland.png", alt: "New Holland", nome: "asdawdd" },
  { src: "newholland.png", alt: "New Holland", nome: "N123gand" },
];

function splitLetters(word, className, delaysFn) {
  const letters = word.split("");
  const count = letters.length;
  const center = (count - 1) / 2;
  return letters.map((char, i) => {
    const dist = Math.abs(i - center);
    const delay = delaysFn(dist);
    return (
      <span
        // a key inclui a palavra inteira: isso garante que o React
        // desmonte/remonte os spans ao trocar de nome, em vez de
        // reciclar o mesmo elemento DOM (o que impedia o reset de
        // posição em "switch-prewait" de funcionar de forma confiável)
        key={`${word}-${i}`}
        className={`letra ${className}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });
}

const arcDelay = (dist) => dist * 55;

// Duração real da transição CSS de cada letra (precisa bater com
// `.letra { transition: transform 0.55s ... }` no clientes.css)
const TRANSITION_MS = 550;

// Calcula o delay máximo (arcDelay) que uma letra de uma palavra recebe,
// ou seja, o delay da letra mais distante do centro
function getMaxArcDelay(word) {
  const count = word.length;
  const center = (count - 1) / 2;
  const maxDist = Math.max(center, count - 1 - center);
  return arcDelay(maxDist);
}

// Tempo total que a palavra leva pra terminar de sair de vista
// (delay da letra mais lenta + duração da transição + uma margem de segurança)
function getExitDuration(word) {
  return getMaxArcDelay(word) + TRANSITION_MS + 30;
}

// Fases da animação do título
// "idle"           → Souza visível (Y:0), cliente abaixo (Y:100%)
// "client-visible" → cliente visível (Y:0), Souza acima (Y:-100%)
// "switch-out"     → cliente sai subindo (Y:-100%), igual ao Souza
// "switch-prewait" → novo nome posicionado embaixo (Y:100%) sem transição
// "switch-in"      → novo nome entra vindo de baixo (Y:0)

export default function Clientes() {
  const secaoRef = useRef(null);
  const tituloWrapRef = useRef(null);

  // phase controla o que o CSS renderiza
  const [phase, setPhase] = useState("idle");
  const [clienteNome, setClienteNome] = useState("New Holland");

  // refs para evitar closure stale
  const phaseRef = useRef("idle");
  const currentNomeRef = useRef(null); // null = nenhum ativo
  const t1 = useRef(null);
  const t2 = useRef(null);

  const clearTimers = () => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
  };

  const setPhaseSync = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const handleLogoEnter = useCallback((nome) => {
    // Já está nesse nome → não faz nada
    if (currentNomeRef.current === nome) return;

    clearTimers();

    const prevNome = currentNomeRef.current;
    currentNomeRef.current = nome;

    if (prevNome === null) {
      // ── Primeira entrada: nenhum cliente ativo ──
      // Souza sobe, cliente vem de baixo para cima
      setClienteNome(nome);
      secaoRef.current?.classList.add("animating");
      tituloWrapRef.current?.classList.add("animating");
      setPhaseSync("client-visible");
    } else {
      // ── Troca entre clientes ──
      // 1. Nome atual sobe (igual ao Souza)
      setPhaseSync("switch-out");

      // duração real da saída: precisa esperar a letra mais lenta
      // (a mais distante do centro) terminar a transição CSS
      const saidaDuration = getExitDuration(prevNome);

      // 2. Posiciona novo nome embaixo SEM transição
      t1.current = setTimeout(() => {
        setClienteNome(nome);
        setPhaseSync("switch-prewait");

        // 3. Força reflow e anima para cima (vindo de baixo)
        t2.current = setTimeout(() => {
          setPhaseSync("switch-in");
        }, 30);
      }, saidaDuration);
    }
  }, []);

  const handleLogoLeave = useCallback(() => {
    clearTimers();
    currentNomeRef.current = null;
    setPhaseSync("idle");
    secaoRef.current?.classList.remove("animating");
    tituloWrapRef.current?.classList.remove("animating");
  }, []);

  return (
    <section className="clientes-secao" ref={secaoRef}>

      <div className="clientes-logos-row">
        {LOGOS.map((logo, i) => (
          <div
            className="clientes-logo-pill"
            key={i}
            onMouseEnter={() => handleLogoEnter(logo.nome)}
            onMouseLeave={handleLogoLeave}
          >
            <img src={logo.src} alt={logo.alt} draggable="false" />
          </div>
        ))}
      </div>

      <div className="clientes-label-wrap">
        <p className="clientes-label">Clientes que confiam na</p>
      </div>

      <div
        className={`clientes-titulo-wrap phase-${phase}`}
        ref={tituloWrapRef}
      >
        <div className="clientes-titulo-inner">

          <div className="clientes-titulo-souza">
            {splitLetters("Souza", "letra-souza", arcDelay)}
          </div>

          <div className="clientes-titulo-cliente">
            {splitLetters(clienteNome, "letra-cliente", arcDelay)}
          </div>

        </div>
      </div>

    </section>
  );
}