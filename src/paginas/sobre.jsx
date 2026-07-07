import { useEffect, useRef, useCallback } from "react";
import "./sobre.css";

const CARDS = [
  {
    tag: "Experiência",
    title: "Tradição no mercado",
    desc: "Anos de experiência em montagem e manutenção industrial com excelência comprovada.",
    bg: "#e8e8e2",
    color: "#111111",
    icon: (
      <svg width="32" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    tag: "Qualidade",
    title: "Parcerias sólidas",
    desc: "Construímos relações duradouras com grandes empresas baseadas em confiança mútua.",
    bg: "#e8e8e2",
    color: "#111111",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    tag: "Confiança",
    title: "Soluções completas",
    desc: "Do planejamento à execução, entregamos resultados que superam expectativas.",
    bg: "#e8e8e2",
    color: "#111111",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
];

const GAP_OFFSETS  = [-1, 0, 1];
const FLIP_DELAYS  = [0, 0.12, 0.24];
const CARD_TILTS   = [-8, 3, -5];
const CARD_TY      = [12, -8, 6];

export default function Sobre() {
  const sectionRef    = useRef(null);
  const wrapRef       = useRef(null);
  const overlayRef    = useRef(null);
  const engrenagemRef = useRef(null);
  const hintRef       = useRef(null);
  const tituloRef     = useRef(null);
  const panelRefs     = useRef([]);
  const rafRef        = useRef(null);

  const lerp      = (a, b, t) => a + (b - a) * t;
  const clamp     = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
  const ease      = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
  const easeCubic = (t) => t*t*(3-2*t);

  const updateClip = useCallback(() => {
    const section = sectionRef.current;
    const wrap    = wrapRef.current;
    if (!section || !wrap) return;

    const sectionTop  = section.getBoundingClientRect().top + window.scrollY;
    const scrolled    = window.scrollY - sectionTop;
    const totalScroll = section.offsetHeight - window.innerHeight;
    const raw         = clamp(scrolled / totalScroll, 0, 1);

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // ── FASE 1 (0 → 0.45): wrapper inteiro abre (clip-path)
    const p1  = ease(clamp(raw / 0.45, 0, 1));
    const wPct = lerp(28, 98, p1);
    const hPct = lerp(55, 96, p1);
    const rb   = Math.round(lerp(48, 4, p1));
    const wPx  = Math.round(vw * wPct / 100);
    const hPx  = Math.round(vh * hPct / 100);
    const rt   = Math.round(lerp(Math.min(wPx, hPx) * 0.55, 8, p1));
    wrap.style.width        = `${wPx}px`;
    wrap.style.height       = `${hPx}px`;
    wrap.style.borderRadius = `${rt}px ${rt}px ${rb}px ${rb}px`;

    // ── FASE 3 (0.62 → 0.72): painéis se separam + gaps aparecem
    const pSplit = easeCubic(clamp((raw - 0.62) / 0.10, 0, 1));
    const gapPx  = Math.round(lerp(0, 4, pSplit));

    // ── FASE 3.5: recuo em Z — entra com a separação e some após o flip
    const pRecuo  = easeCubic(clamp((raw - 0.62) / 0.10, 0, 1));
    const pVolta  = easeCubic(clamp((raw - 0.80) / 0.14, 0, 1));
    const recuoZ  = lerp(0, -320, pRecuo) * (1 - pVolta);

    // ── FASE 2 (0.45 → 0.60): overlay + engrenagem aparecem e recuam junto com painéis
    const p2      = easeCubic(clamp((raw - 0.45) / 0.15, 0, 1));
    const fadeOut = 1 - easeCubic(clamp((raw - 0.68) / 0.10, 0, 1));
    const alpha   = p2 * fadeOut;
    if (overlayRef.current) {
      overlayRef.current.style.opacity   = alpha;
      overlayRef.current.style.transform = `translateZ(${recuoZ}px)`;
    }
    if (engrenagemRef.current) {
      engrenagemRef.current.style.opacity   = alpha;
      engrenagemRef.current.style.transform = `translateZ(${recuoZ}px)`;
    }

    // ── FASE 4 (0.72 → 1.0): cada painel vira
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const tx        = lerp(0, GAP_OFFSETS[i] * gapPx * 5, pSplit);
      const flipStart = 0.72 + FLIP_DELAYS[i] * 0.4;
      const flipP     = easeCubic(clamp((raw - flipStart) / 0.22, 0, 1));
      const deg       = lerp(0, 180, flipP);
      const settle    = easeCubic(clamp((flipP - 0.5) / 0.5, 0, 1));
      const tilt      = lerp(0, CARD_TILTS[i], settle);
      const ty        = lerp(0, CARD_TY[i], settle);
      const scale     = lerp(1, 0.65, settle);
      panel.style.transform = `translateX(${tx}px) translateZ(${recuoZ}px) rotateY(${deg}deg) rotateZ(${tilt}deg) translateY(${ty}px) scale(${scale})`;
    });

    // ── FASE 5 (0.92 → 1.0): título final aparece no topo
    if (tituloRef.current) {
      const pTitulo = easeCubic(clamp((raw - 0.92) / 0.08, 0, 1));
      tituloRef.current.style.opacity   = pTitulo;
      tituloRef.current.style.transform = `translateY(${lerp(-40, 0, pTitulo)}px)`;
    }

    // ── Dica de scroll
    if (hintRef.current) hintRef.current.classList.toggle("oculto", raw > 0.08);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateClip);
    };
    updateClip();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateClip, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateClip);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateClip]);

  return (
    <section className="secao-sobre" id="sobre" ref={sectionRef}>
      <div className="sobre-sticky">

        {/* TÍTULO FINAL — aparece no topo após os cards virarem */}
        <div
          ref={tituloRef}
          className="sobre-titulo-final"
          style={{ opacity: 0, transform: "translateY(-40px)" }}
        >
          Por que escolher a <span>Souza?</span>
        </div>

        {/* WRAPPER GERAL — abre com border-radius, contém tudo */}
        <div className="sobre-wrap" ref={wrapRef}>

          {/* PAINÉIS: cada um mostra fatia da imagem na frente e card atrás */}
          <div className="ssc-panels">
            {CARDS.map((card, i) => (
              <div
                key={i}
                className="ssc-panel"
                ref={(el) => (panelRefs.current[i] = el)}
              >
                {/* FRENTE: fatia da imagem */}
                <div className="ssc-front">
                  <div
                    className="ssc-img"
                    style={{
                      backgroundImage: "url('fundo.jpg')",
                      backgroundSize:  "300% auto",
                      backgroundPosition: `${i * 50}% 50%`,
                    }}
                  />
                </div>

                {/* VERSO: card colorido */}
                <div className="ssc-back" style={{ background: card.bg, color: card.color }}>
                  <div className="ssc-icon">{card.icon}</div>
                  <div className="ssc-bottom">
                    <span className="ssc-tag">{card.tag}</span>
                    <h3 className="ssc-title">{card.title}</h3>
                    <p className="ssc-desc">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* OVERLAY com nome + descrição (some antes do flip) */}
          <div className="sobre-overlay" ref={overlayRef} style={{ opacity: 0 }}>
            <div className="sobre-conteudo">
              <h1 className="sobre-nome">Anderson<br />Souza</h1>
              <p className="sobre-descricao">
                Com anos de experiência, a Souza Montagem Industrial é referência em
                excelência, manutenção e montagem industrial. Construímos parcerias com
                grandes empresas baseadas em dois pilares: qualidade e confiança.
              </p>
            </div>
          </div>

          {/* MÁSCARA — garante que o border-radius recorte os painéis 3D */}
          <div className="ssc-mask" />

          {/* ENGRENAGEM (some antes do flip) */}
          <div ref={engrenagemRef} className="sobre-engrenagem" style={{ opacity: 0 }}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M43.3 5.2l-3.1 9.5a32 32 0 0 0-8.3 3.4l-9.2-4.1-9.4 9.4 4.1 9.2a32 32 0 0 0-3.4 8.3l-9.5 3.1v13.3l9.5 3.1a32 32 0 0 0 3.4 8.3l-4.1 9.2 9.4 9.4 9.2-4.1a32 32 0 0 0 8.3 3.4l3.1 9.5h13.3l3.1-9.5a32 32 0 0 0 8.3-3.4l9.2 4.1 9.4-9.4-4.1-9.2a32 32 0 0 0 3.4-8.3l9.5-3.1V43.3l-9.5-3.1a32 32 0 0 0-3.4-8.3l4.1-9.2-9.4-9.4-9.2 4.1a32 32 0 0 0-8.3-3.4L56.7 5.2H43.3zM50 34a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
                fill="#4e922d"
              />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}