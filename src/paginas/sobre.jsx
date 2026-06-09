import { useEffect, useRef } from "react";
import "./sobre.css";

/* ── DisplayCard inline ── */
function DisplayCard({
  className = "",
  icon,
  title = "Featured",
  description = "Discover amazing content",
  date = "",
  ...props 
}) {
  return (
    <div className={`sobre-display-card ${className}`} {...props}>
      <div className="sobre-display-card-top">
        <span className="sobre-display-card-icon">{icon}</span>
        <p className="sobre-display-card-title">{title}</p>
      </div>
      <p className="sobre-display-card-desc">{description}</p>
      {date && <p className="sobre-display-card-date">{date}</p>}
    </div>
  );
}

// Ícones SVG genéricos e bonitos para cada um dos seus 5 pilares
// Dados atualizados com os 5 tópicos exatos
const displayCards = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Equipe Técnica",
    description: "Equipe técnica especializada",
    date: "Profissionais Qualificados",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Compromisso",
    description: "Cumprimento rigoroso de prazos",
    date: "Eficiência Pontual",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Segurança",
    description: "Segurança como prioridade",
    date: "Normas Regulamentares",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    title: "Foco no Cliente",
    description: "Atendimento personalizado",
    date: "Suporte Dedicado",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Engenharia",
    description: "Padrões e boas práticas industriais",
    date: "Controle de Qualidade",
  },
];

  useEffect(() => {
    const scene = spiralSceneRef.current;
    if (!scene) return;

    const cards = [...scene.querySelectorAll('.sobre-display-card')];
    const lerp = (a, b, t) => a + (b - a) * t;

    const onScroll = () => {
      const section = document.getElementById('sobre');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1,
        (-rect.top + vh * 0.2) / (rect.height * 0.7)
      ));

      cards.forEach((card, i) => {
        const stepX = 180;
        const stepY = 85;
        const stepZ = -40;
        const startX = i * stepX;
        const startY = i * stepY;
        const startZ = i * stepZ;
        const startRy = i === 0 ? 0 : -10;
        const totalStepsShift = progress * (cards.length - 1);
        const tx = startX - (totalStepsShift * stepX);
        const ty = startY - (totalStepsShift * stepY);
        const tz = startZ - (totalStepsShift * stepZ);
        const ry = startRy - (totalStepsShift * -6);
        const rx = -4;
        card.style.transform = `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) rotateX(${rx}deg)`;
        
        card.style.zIndex = Math.round(500 - Math.abs(tx));

      
        const absX = Math.abs(tx);
        if (absX < 60) {
          card.style.opacity = "1";
          card.style.filter = "grayscale(0) blur(0px)";
          card.style.borderColor = "rgba(120, 220, 70, 0.8)";
        } else {
     
          const fade = Math.max(0.25, 1 - (absX - 60) / 280);
          card.style.opacity = `${fade}`;
          card.style.filter = `grayscale(${0.75 * (1 - fade)})`;
          card.style.borderColor = "rgba(69, 147, 30, 0.35)";
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

export default function Sobre() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const spiralSceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let time = 0;

    const wavePalette = [
      { offset: 0, amplitude: 70, frequency: 0.003, color: "rgba(69,147,30,0.75)", opacity: 0.45 },
      { offset: Math.PI / 2, amplitude: 90, frequency: 0.0026, color: "rgba(78,146,45,0.65)", opacity: 0.35 },
      { offset: Math.PI, amplitude: 60, frequency: 0.0034, color: "rgba(30,90,10,0.60)", opacity: 0.30 },
      { offset: Math.PI * 1.5, amplitude: 80, frequency: 0.0022, color: "rgba(100,180,50,0.30)", opacity: 0.22 },
      { offset: Math.PI * 2, amplitude: 55, frequency: 0.004, color: "rgba(20,60,5,0.50)", opacity: 0.20 },
    ];

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouseInfluence = prefersReducedMotion ? 10 : 70;
    const influenceRadius = prefersReducedMotion ? 160 : 320;
    const smoothing = prefersReducedMotion ? 0.04 : 0.1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const recenterMouse = () => {
      const c = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = { ...c };
      targetMouseRef.current = { ...c };
    };

    const handleResize = () => { resizeCanvas(); recenterMouse(); };
    const handleMouseMove = (e) => { targetMouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseLeave = () => recenterMouse();

    resizeCanvas();
    recenterMouse();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const drawWave = (wave) => {
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = canvas.height / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect =
          influence * mouseInfluence *
          Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          mouseEffect;

        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 1;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#011901");
      gradient.addColorStop(1, "#021f02");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      wavePalette.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const scene = spiralSceneRef.current;
    if (!scene) return;

    const cards = [...scene.querySelectorAll('.sobre-display-card')];
    const lerp = (a, b, t) => a + (b - a) * t;

    const onScroll = () => {
      const section = document.getElementById('sobre');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      
      const progress = Math.max(0, Math.min(1,
        (-rect.top + vh * 0.25) / (rect.height * 0.65)
      ));

      cards.forEach((card, i) => {
        const cardOffset = i * 0.18; 
        const rawP = Math.max(0, Math.min(1, (progress - cardOffset) / (1 - (cards.length - 1) * 0.08)));
        const p = rawP * rawP * (3 - 2 * rawP);
        const startX = i * 165;
        const startY = i * 75;
        const startZ = -i * 50;
        const startRy = i === 0 ? 0 : -12;
        const startRx = -4;
        const finalY = (i - 2) * 75;
        const finalZ = -Math.abs(i - 2) * 40;
        const finalRy = (i - 2) * -12;
        const finalRx = -4;
        const tx = lerp(startX, finalX, p);
        const ty = lerp(startY, finalY, p);
        const tz = lerp(startZ, finalZ, p);
        const ry = lerp(startRy, finalRy, p);
        const rx = lerp(startRx, finalRx, p);

        card.style.transform = `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) rotateX(${rx}deg)`;

        card.style.zIndex = Math.round(100 + tz);

        const distanceFromCenter = Math.abs(tx);
        if (distanceFromCenter > 250) {
          card.style.opacity = `${lerp(1, 0.35, (distanceFromCenter - 250) / 200)}`;
          card.style.filter = "grayscale(0.6)";
        } else {
          card.style.opacity = "1";
          card.style.filter = "grayscale(0)";
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="sobre" className="sobre-container">
      <canvas ref={canvasRef} className="sobre-canvas" aria-hidden="true" />

      <div className="sobre-content">
        {/* Badge topo */}
        <div className="sobre-badge">
          ANDERSON SOUZA
        </div>

        <h1 className="sobre-titulo">
          Tradição e confiança no<br />
          <span className="sobre-titulo-destaque">mercado industrial</span>
        </h1>

        <p className="sobre-subtitulo">
          Com anos de experiência, a Souza Montagem Industrial é referência em excelência, manutenção e montagem industrial. Construímos parcerias com grandes empresas baseadas em dois pilares: qualidade e confiança.
        </p>

        <div className="sobre-botoes">
          <a href="#contato" className="sobre-btn-primary">
            FALE CONOSCO <span className="sobre-btn-arrow">→</span>
          </a>
          <a href="#imoveis" className="sobre-btn-secondary">
            VER TRABALHOS
          </a>
        </div>

        <ul className="sobre-pills">
          {["QUALIDADE", "ÉTICA", "SEGURANÇA"].map((p) => (
            <li key={p} className="sobre-pill">{p}</li>
          ))}
        </ul>

        <div className="sobre-stats">
          {[
            { label: "Anos de experiência", valor: "20+" },
            { label: "CLIENTES", valor: "1.000+" },
            { label: "CIDADES", valor: "850+" },
          ].map(({ label, valor }) => (
            <div key={label} className="sobre-stat">
              <span className="sobre-stat-label">{label}</span>
              <span className="sobre-stat-valor">{valor}</span>
            </div>
          ))}
        </div>
        
        <div className="sobre-display-cards-wrapper">
          <div className="sobre-spiral-scene" ref={spiralSceneRef}>
            {displayCards.map((card, i) => (
              <DisplayCard key={i} {...card} data-index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}