import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./clientes.css";

gsap.registerPlugin(ScrollTrigger);

const LOGOS = [
  { src: "newholland.png", alt: "New Holland", nome: "New Holland" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Dois" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Três" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Quatro" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Cinco" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Seis" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Sete" },
  { src: "newholland.png", alt: "New Holland", nome: "Empresa Oito" },
];

export default function Clientes() {
  const secaoRef         = useRef(null);
  const wrapperRef       = useRef(null);
  const souzaEsquerdaRef = useRef(null);
  const souzaDireitaRef  = useRef(null);
  const videoWrapRef     = useRef(null);
  const trackRef         = useRef(null);
  const carrosselRef     = useRef(null);
  const labelRef         = useRef(null);

  // ─── Carrossel automático infinito ───────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = track.querySelectorAll(".carrossel-item");
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    let x = 0;
    let rafId;
    const speed = 0.5;

    const animate = () => {
      x -= speed;
      const totalWidth = track.scrollWidth / 2;
      if (Math.abs(x) >= totalWidth) x = 0;
      track.style.transform = `translateX(${x}px)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const pause  = () => cancelAnimationFrame(rafId);
    const resume = () => { rafId = requestAnimationFrame(animate); };
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, []);

  // ─── GSAP: efeito de abertura do SOUZA no scroll ─────────────────────────
  useEffect(() => {
    const esquerda  = souzaEsquerdaRef.current;
    const direita   = souzaDireitaRef.current;
    const videoWrap = videoWrapRef.current;
    const secao     = secaoRef.current;
    const wrapper   = wrapperRef.current;
    const carrossel = carrosselRef.current;
    const label     = labelRef.current;

    if (!esquerda || !direita || !videoWrap || !secao || !wrapper) return;

    gsap.set(esquerda,  { xPercent: 0 });
    gsap.set(direita,   { xPercent: 0 });
    // Começa fechado — clip colado no centro, alinhado com as letras juntas
    gsap.set(videoWrap, { opacity: 1 });
    videoWrap.style.clipPath = "inset(0 50% 0 50%)";
    gsap.set(carrossel, { opacity: 1, y: 0 });
    gsap.set(label,     { opacity: 1, y: 0 });

    // Atualiza o clip-path do vídeo com base na posição real das letras a cada frame
    const atualizarClip = () => {
      const rootEl = videoWrap.parentElement;
      if (!rootEl) return;
      const rootRect = rootEl.getBoundingClientRect();
      const esqRect  = esquerda.getBoundingClientRect();
      const dirRect  = direita.getBoundingClientRect();

      // clipLeft  = quanto cortar da esquerda  → vai até a borda DIREITA do "SOU"
      // clipRight = quanto cortar da direita   → vai até a borda ESQUERDA do "ZA"
      const clipLeft  = Math.max(0, esqRect.right  - rootRect.left);
      const clipRight = Math.max(0, rootRect.right  - dirRect.left);

      // O vídeo só aparece no GAP entre as duas metades
      videoWrap.style.clipPath = `inset(0 ${clipRight}px 0 ${clipLeft}px)`;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        pin: secao,
        anticipatePin: 1,
        onUpdate: atualizarClip,
      },
    });

    tl
      // Carrossel sobe e some primeiro
      .to(carrossel, { opacity: 0, y: -30, ease: "power2.in", duration: 0.35 }, 0)
      // Label some logo depois
      .to(label,     { opacity: 0, y: -15, ease: "power2.in", duration: 0.3  }, 0.05)
      // Letras se abrem — o clip do vídeo acompanha via onUpdate
      .to(esquerda,  { xPercent: -105, ease: "power2.inOut", duration: 1 }, 0.1)
      .to(direita,   { xPercent:  105, ease: "power2.inOut", duration: 1 }, 0.1)
      // Letras somem com fade + leve escala quando o vídeo já está aberto
      .to([esquerda, direita], { opacity: 0, scale: 0.92, ease: "power2.in", duration: 0.35 }, 0.85);
    // Sem .to(videoWrap, opacity) — o clip-path já controla a abertura/fechamento

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "280vh", backgroundColor: "#011901" }}>
      <section className="clientes-secao" ref={secaoRef}>

        {/* ── Carrossel ── */}
        <div className="carrossel-viewport" ref={carrosselRef}>
          <div className="carrossel-track" ref={trackRef}>
            {LOGOS.map((logo, i) => (
              <div className="carrossel-item" key={i}>
                <div className="carrossel-card">
                  <div className="carrossel-img-wrap">
                    <img src={logo.src} alt={logo.alt} draggable="false" />
                  </div>
                  <span className="carrossel-nome">{logo.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="clientes-label-wrap" ref={labelRef}>
          <p className="clientes-label">Clientes que confiam na</p>
        </div>

        <div className="clientes-titulo-wrap">
          <div className="clientes-titulo-inner">
            <div className="clientes-titulo-souza clientes-souza-split-root">

              <div className="souza-video-wrap" ref={videoWrapRef}>
                <video
                  className="souza-video"
                  src="video.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              <span className="souza-metade souza-metade-esquerda" ref={souzaEsquerdaRef}>
                SOU
              </span>
              <span className="souza-metade souza-metade-direita" ref={souzaDireitaRef}>
                ZA
              </span>

            </div>
          </div>
        </div>

      </section>
    </div>
  );
}