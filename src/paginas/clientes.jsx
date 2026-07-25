import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./clientes.css";

gsap.registerPlugin(ScrollTrigger);

const LOGOS = [
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
  { src: "newholland.png", alt: "New Holland"},
];

const TOTAL_FRAMES = 126;

export default function Clientes() {
  const secaoRef         = useRef(null);
  const wrapperRef       = useRef(null);
  const souzaEsquerdaRef = useRef(null);
  const souzaDireitaRef  = useRef(null);
  const videoWrapRef     = useRef(null);
  const videoCortinaRef  = useRef(null);
  const videoCortina2Ref = useRef(null);
  const trackRef         = useRef(null);
  const carrosselRef     = useRef(null);
  const labelRef         = useRef(null);
  const texto1Ref        = useRef(null);
  const texto2Ref        = useRef(null);
  const texto3Ref        = useRef(null);
  const canvasPrincipalRef = useRef(null);
  const canvasCortinaRef   = useRef(null);
  const canvasCortina2Ref  = useRef(null);
  const framesRef     = useRef([]); 
  const carregadosRef = useRef(0);
  const progressoRef  = useRef(0);  
  const ajustarCanvas = useCallback((canvas) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  const desenharEmCanvas = useCallback((canvas, img) => {
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    ajustarCanvas(canvas);
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const escala = Math.max(cw / iw, ch / ih);
    const w = iw * escala;
    const h = ih * escala;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  }, [ajustarCanvas]);

  const desenharFrame = useCallback((progresso) => {
    const frames = framesRef.current;
    if (!frames.length) return;

    const p = Math.min(Math.max(progresso, 0), 1);
    progressoRef.current = p;

    const indice = Math.round(p * (frames.length - 1));
    const img = frames[indice];
    if (!img || !img.complete || !img.naturalWidth) return;

    desenharEmCanvas(canvasPrincipalRef.current, img);
    desenharEmCanvas(canvasCortinaRef.current, img);
    desenharEmCanvas(canvasCortina2Ref.current, img);
  }, [desenharEmCanvas]);

  useEffect(() => {
    let cancelado = false;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `${import.meta.env.BASE_URL}frames-clientes/frame-${num}.jpg`;
      img.onload = () => {
        if (cancelado) return;
        carregadosRef.current += 1;
        if (carregadosRef.current === 1) desenharFrame(0);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => { cancelado = true; };
  }, [desenharFrame]);

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

  useEffect(() => {
    const esquerda      = souzaEsquerdaRef.current;
    const direita       = souzaDireitaRef.current;
    const videoWrap     = videoWrapRef.current;
    const videoCortina  = videoCortinaRef.current;
    const videoCortina2 = videoCortina2Ref.current;
    const secao         = secaoRef.current;
    const wrapper       = wrapperRef.current;
    const carrossel     = carrosselRef.current;
    const label         = labelRef.current;
    const texto1        = texto1Ref.current;
    const texto2        = texto2Ref.current;
    const texto3        = texto3Ref.current;

    if (!esquerda || !direita || !videoWrap || !secao || !wrapper) return;

    gsap.set(esquerda,  { xPercent: 0 });
    gsap.set(direita,   { xPercent: 0 });
    gsap.set(videoWrap, { opacity: 1, scale: 1, filter: "blur(0px)", transformOrigin: "50% 50%" });
    videoWrap.style.clipPath = "inset(0 50% 0 50%)";
    gsap.set(carrossel, { opacity: 1, y: 0 });
    gsap.set(label,     { opacity: 1, y: 0 });
    if (videoCortina)  gsap.set(videoCortina,  { y: "115vh" });
    if (videoCortina2) gsap.set(videoCortina2, { y: "115vh" });
    if (texto1) gsap.set(texto1, { opacity: 0, y: 10 });
    if (texto2) gsap.set(texto2, { opacity: 0, y: 10 });
    if (texto3) gsap.set(texto3, { opacity: 0, y: 10 });
    // Guarda a posição/largura "de repouso" (xPercent = 0) de cada metade.
    // Medido só quando necessário (mount/resize/refresh) — nunca durante o scroll.
    let baseRects = null;

    const medirBase = () => {
      const rootEl = videoWrap.parentElement;
      if (!rootEl) return;

      const prevEsq = gsap.getProperty(esquerda, "xPercent");
      const prevDir = gsap.getProperty(direita, "xPercent");

      // zera temporariamente para medir a posição de repouso
      gsap.set([esquerda, direita], { xPercent: 0 });

      const rootRect = rootEl.getBoundingClientRect();
      const esqRect  = esquerda.getBoundingClientRect();
      const dirRect  = direita.getBoundingClientRect();

      baseRects = {
        rootWidth: rootRect.width,
        esqRight: esqRect.right - rootRect.left, // borda direita de "SOU" em repouso
        esqWidth: esqRect.width,
        dirLeft: dirRect.left - rootRect.left,    // borda esquerda de "ZA" em repouso
        dirWidth: dirRect.width,
      };

      // devolve para a posição atual da timeline
      gsap.set(esquerda, { xPercent: prevEsq });
      gsap.set(direita,  { xPercent: prevDir });
    };

    const atualizarClip = () => {
      if (!baseRects) return;

      const xpEsq = gsap.getProperty(esquerda, "xPercent");
      const xpDir = gsap.getProperty(direita, "xPercent");

      const clipLeft = Math.max(
        0,
        baseRects.esqRight + (xpEsq / 100) * baseRects.esqWidth
      );
      const clipRight = Math.max(
        0,
        baseRects.rootWidth - (baseRects.dirLeft + (xpDir / 100) * baseRects.dirWidth)
      );

      videoWrap.style.clipPath = `inset(0 ${clipRight}px 0 ${clipLeft}px)`;
      const left  = `${clipLeft}px`;
      const width = `${Math.max(0, baseRects.rootWidth - clipLeft - clipRight)}px`;

      if (videoCortina) {
        videoCortina.style.left  = left;
        videoCortina.style.width = width;
      }
      if (videoCortina2) {
        videoCortina2.style.left  = left;
        videoCortina2.style.width = width;
      }

      // as cortinas mudam de largura a cada tick — redesenha o frame atual
      // nos 3 canvases pra acompanhar a nova resolução/enquadramento
      desenharFrame(progressoRef.current);
    };

    // espera a fonte Barlow Condensed carregar antes de medir,
    // senão a largura de "SOU"/"ZA" fica errada e o clip nasce desalinhado
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        medirBase();
        atualizarClip();
        ScrollTrigger.refresh();
      });
    } else {
      medirBase();
    }

    medirBase();
    atualizarClip();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        pin: secao,
        anticipatePin: 1,
        onUpdate: (self) => {
          atualizarClip();
          // sincroniza o "vídeo" (sequência de frames) com o progresso
          // suavizado do scrub — mesmo princípio da Comeco, mas usando o
          // progresso que o próprio GSAP já calcula
          desenharFrame(self.progress);
        },
        onRefresh: (self) => {
          medirBase();
          atualizarClip();
          desenharFrame(self.progress);
        },
      },
    });

    tl
      .to(carrossel, { opacity: 0, y: -30, ease: "power2.in", duration: 0.35 }, 0)
      .to(label,     { opacity: 0, y: -15, ease: "power2.in", duration: 0.3  }, 0.05)
      .to(esquerda,  { xPercent: -105, ease: "none", duration: 1 }, 0.1)
      .to(direita,   { xPercent:  105, ease: "none", duration: 1 }, 0.1)
      .to([esquerda, direita], { opacity: 0, scale: 0.92, ease: "power2.in", duration: 0.35 }, 1.1);


    if (texto1) {
      tl.to(texto1, { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 1.0)
        .to(texto1, { opacity: 0, y: -10, ease: "power2.in", duration: 0.3 }, 1.4);
    }

    if (videoCortina) {
      tl.to(videoCortina, {
        y: "0vh",
        ease: "power2.out",
        duration: 0.8,
      }, 1.5)
      .to(videoWrap, {
        scale: 0.88,
        filter: "blur(10px)",
        ease: "power2.out",
        duration: 0.8,
      }, 1.5);
    }

    if (texto2) {
      tl.to(texto2, { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 2.3)
        .to(texto2, { opacity: 0, y: -10, ease: "power2.in", duration: 0.3 }, 2.6);
    }

    if (videoCortina2) {
      tl.to(videoCortina2, {
        y: "0vh",
        ease: "power2.out",
        duration: 0.8,
      }, 2.7)
      .to(videoCortina, {
        scale: 0.88,
        filter: "blur(10px)",
        ease: "power2.out",
        duration: 0.8,
        transformOrigin: "50% 50%",
      }, 2.7);
    }

    if (texto3) {
      tl.to(texto3, { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 3.5);
    }

    // Recalcula em resize (mudança de largura de tela desloca as letras
    // e muda a resolução necessária dos canvases)
    const onResize = () => {
      medirBase();
      ScrollTrigger.refresh();
      atualizarClip();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [desenharFrame]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "630vh", backgroundColor: "#011901" }}>
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
                <canvas className="souza-video" ref={canvasPrincipalRef} />
              </div>
              <div className="souza-video-wrap-cortina" ref={videoCortinaRef}>
                <canvas className="souza-video-cortina" ref={canvasCortinaRef} />
              </div>
              <div className="souza-video-wrap-cortina souza-video-wrap-cortina-2" ref={videoCortina2Ref}>
                <canvas className="souza-video-cortina" ref={canvasCortina2Ref} />
              </div>

              <span className="souza-metade souza-metade-esquerda" ref={souzaEsquerdaRef}>
                SOU
              </span>
              <span className="souza-metade souza-metade-direita" ref={souzaDireitaRef}>
                ZA
              </span>
              <span className="souza-video-texto" ref={texto1Ref}>
                Manutenção Industrial
              </span>
              <span className="souza-video-texto" ref={texto2Ref}>
                Montagem Especializada
              </span>
              <span className="souza-video-texto" ref={texto3Ref}>
                Montagem de Portões
              </span>

            </div>
          </div>
        </div>

      </section>
    </div>
  );
}