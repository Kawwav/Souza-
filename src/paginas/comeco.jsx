import { useState, useEffect, useRef, useCallback } from "react";
import MenuHamburguer from "../componentes/menu";
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

export default function Comeco({ aoNavegar, pularIntro = false }) {
  // Quando voltamos da página de Trabalhos, pulamos a introdução (tela
  // verde) e já nascemos no estado "final" dela.
  const [fase, setFase] = useState(pularIntro ? "sumiu" : "visivel");
  const [faseFundo, setFaseFundo] = useState(pularIntro ? "chegou" : "baixo");
  const [faseTexto, setFaseTexto] = useState("escondido");
  const [hamburgerVisivel, setHamburgerVisivel] = useState(pularIntro);

  const scrollWrapperRef = useRef(null);
  const rafRef           = useRef(null);

  // ── Sequência de imagens que substitui o vídeo ──
  // Ajuste TOTAL_FRAMES pro número real de arquivos gerados pelo ffmpeg
  // (veja o comando de extração nas instruções). O nome dos arquivos segue
  // o padrão frame-0001.jpg, frame-0002.jpg, ...
  const TOTAL_FRAMES = 141;
  const framesRef        = useRef([]);   // array de objetos Image()
  const carregadosRef    = useRef(0);
  const canvasRef        = useRef(null);
  const scrollHintRef    = useRef(null);
  const frameAtualRef    = useRef(-1);   // último índice desenhado (evita redesenhar à toa)
  const progressoRef     = useRef(0);    // progresso suavizado (0 a 1)
  const textoVisivelRef  = useRef(false); // se o texto SOUZA já está mostrado

  useEffect(() => {
    // Já chegamos no estado final (voltando de Trabalhos) — não roda a
    // sequência de animação da intro nem trava o scroll do body.
    if (pularIntro) return;

    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setFase("subindo"), 4000);
    const t4 = setTimeout(() => {
      setFaseFundo("subindo");
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

  // ── Pré-carrega todas as imagens da sequência assim que o componente monta ──
  useEffect(() => {
    let cancelado = false;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `${import.meta.env.BASE_URL}frames/frame-${num}.jpg`;
      img.onload = () => {
        if (cancelado) return;
        carregadosRef.current += 1;
        // assim que a primeira imagem chega, já desenha algo em vez de
        // deixar o canvas em branco
        if (carregadosRef.current === 1) desenharFrame(0);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Desenha a imagem de índice `progresso` (0 a 1) no canvas, imitando
  // object-fit: cover + object-position: 70% -70px ──
  const desenharFrame = useCallback((progresso) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;

    const indice = Math.round(progresso * (frames.length - 1));
    if (indice === frameAtualRef.current) return; // já é o frame desenhado

    const img = frames[indice];
    if (!img || !img.complete || !img.naturalWidth) return; // ainda não carregou

    frameAtualRef.current = indice;

    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // mesma lógica do object-fit: cover
    const escala = Math.max(cw / iw, ch / ih);
    const w = iw * escala;
    const h = ih * escala;

    // object-position: 70% -70px (horizontal em %, vertical em px fixo)
    const posX = 0.7;
    const deslocY = 40 * (window.devicePixelRatio || 1);

    let x = (cw - w) * posX;
    let y = (ch - h) / 2 + deslocY;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  }, []);

  // ── Ajusta a resolução do canvas ao tamanho real na tela (nítido em telas retina) ──
  const ajustarTamanhoCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    frameAtualRef.current = -1; // força redesenhar no próximo frame
  }, []);

  const calcularProgressoAlvo = useCallback(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return 0;

    const topoWrapper = wrapper.getBoundingClientRect().top + window.scrollY;
    const percorrido  = window.scrollY - topoWrapper;
    const totalScroll = wrapper.offsetHeight - window.innerHeight;
    return Math.min(Math.max(percorrido / totalScroll, 0), 1);
  }, []);

  // Loop contínuo em rAF: lê o scroll a cada frame e desenha a imagem
  // correspondente no canvas. Como drawImage é instantâneo (a imagem já
  // está em memória), não existe mais o delay de seek do vídeo — o
  // resultado acompanha o dedo/scroll sem travar.
  useEffect(() => {
    ajustarTamanhoCanvas();
    window.addEventListener("resize", ajustarTamanhoCanvas, { passive: true });

    const loop = () => {
      const alvo  = calcularProgressoAlvo();
      const atual = progressoRef.current;
      const diff  = alvo - atual;

      // suavização leve só pra tirar o serrilhado de scrolls com "soquinho"
      // (ex: trackpad/mouse wheel); pode subir pra 0.35~0.5 se quiser mais
      // "colado" ainda no dedo, ou baixar pra algo mais cinematográfico
      const FATOR_SUAVIZACAO = 0.25;
      const novo = Math.abs(diff) < 0.0015 ? alvo : atual + diff * FATOR_SUAVIZACAO;
      progressoRef.current = novo;

      desenharFrame(novo);

      // ── Indicador "role para baixo" some assim que o scroll começa ──
      if (scrollHintRef.current) {
        scrollHintRef.current.classList.toggle("comeco-scroll-hint--escondido", novo > 0.03);
      }

      // ── Texto "SOUZA / MONTAGEM INDUSTRIAL" aparece perto do final do
      // scroll das imagens (ajuste LIMIAR_TEXTO pra mudar o ponto exato) ──
      const LIMIAR_TEXTO = 0.55; // 0.85 = aparece nos últimos 15% do scroll
      const deveAparecer = novo >= LIMIAR_TEXTO;
      if (deveAparecer !== textoVisivelRef.current) {
        textoVisivelRef.current = deveAparecer;
        setFaseTexto(deveAparecer ? "subindo" : "saindo");
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("resize", ajustarTamanhoCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [calcularProgressoAlvo, desenharFrame, ajustarTamanhoCanvas]);

  const fundoClasse = [
    "comeco-fundo",
    faseFundo === "subindo" ? "comeco-fundo--subindo" : "",
    faseFundo === "chegou"  ? "comeco-fundo--chegou"  : "",
  ].filter(Boolean).join(" ");

return (
    <div ref={scrollWrapperRef} style={{ position: "relative", height: "300vh" }}>
    <section id="home" style={{ height: "100vh", position: "sticky", top: 0, overflow: "hidden" }}>
      {/* ── Menu hambúrguer (compartilhado com a página de Trabalhos) ── */}
      <MenuHamburguer aoNavegar={aoNavegar} visivel={hamburgerVisivel} />

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

      {/* ── Sequência de imagens do fundo (z-index 2) — avança só com o scroll ── */}
      <div className={fundoClasse} aria-hidden="true">
        <canvas ref={canvasRef} className="comeco-fundo__video" />
      </div>

      {/*Indicadorrole para baixo */}
      <div
        ref={scrollHintRef}
        className={`comeco-scroll-hint ${faseFundo === "chegou" ? "comeco-scroll-hint--visivel" : ""}`}
        aria-hidden="true"
      >
        <span className="comeco-scroll-hint__texto">Role para explorar</span>
        <span className="comeco-scroll-hint__mouse">
          <span className="comeco-scroll-hint__ponto" />
        </span>
      </div>

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
    </div>
  );
}