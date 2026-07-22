import { useState, useEffect, useRef, useCallback } from "react";
import Comeco from "./paginas/comeco";
import Sobre from "./paginas/sobre";
import Trabalhos from "./paginas/trabalhos";
import Clientes from "./paginas/clientes";
import Footer from "./componentes/footer";
import MenuHamburguer from "./componentes/Menu";
import "./App.css";

//npm run deploy

//git add. 
//git commit -m ""
//git push origin main

// precisa bater com a duração da transição no App.css (.transicao-overlay)
const DURACAO_TRANSICAO = 550;

export default function App() {
  const [pagina, setPagina] = useState("home");
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [transicaoAtiva, setTransicaoAtiva] = useState(false);
  const alvoPendente = useRef(null);
  const introConcluidaRef = useRef(false);
  const transicaoTimers = useRef([]);
  // true quando a Home está sendo remontada por causa de uma volta da
  // página de Trabalhos — usado pra pular a intro (tela verde) da Comeco
  const voltandoDeTrabalhos = useRef(false);

  useEffect(() => {
    if (pagina === "home" && alvoPendente.current) {
      const alvo = alvoPendente.current;
      alvoPendente.current = null;
      requestAnimationFrame(() => {
        if (alvo === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const el = document.getElementById(alvo);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pagina]);

  // ── Controla quando o menu hambúrguer aparece/some ──
  useEffect(() => {
    // Na página de Trabalhos o menu fica sempre visível (não há seção "sobre" lá)
    if (pagina !== "home") {
      setMenuVisivel(true);
      return;
    }

    // Na Home: some durante a intro, aparece depois, e some de novo
    // enquanto a seção "Sobre" estiver na tela.
    setMenuVisivel(false);
    introConcluidaRef.current = false;

    const timer = setTimeout(() => {
      introConcluidaRef.current = true;
      setMenuVisivel(true);
    }, 5200);

    let observer;
    const sobreEl = document.getElementById("sobre");
    if (sobreEl) {
      observer = new IntersectionObserver(
        (entries) => {
          if (!introConcluidaRef.current) return;
          entries.forEach((entry) => {
            setMenuVisivel(!entry.isIntersecting);
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(sobreEl);
    }

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [pagina]);

  // ── Troca de página com transição (cortina cobre a tela, troca o
  // conteúdo por baixo, depois descobre) ──
  const trocarPagina = useCallback((novaPagina) => {
    setTransicaoAtiva(true);

    const t1 = setTimeout(() => {
      setPagina(novaPagina);
      // espera o próximo frame pra garantir que a página nova já foi
      // renderizada antes de começar a descobrir
      requestAnimationFrame(() => setTransicaoAtiva(false));
    }, DURACAO_TRANSICAO);

    transicaoTimers.current.push(t1);
  }, []);

  useEffect(() => {
    return () => {
      transicaoTimers.current.forEach(clearTimeout);
    };
  }, []);

  const aoNavegar = (destino) => {
    if (destino === "trabalhos") {
      if (pagina !== "trabalhos") trocarPagina("trabalhos");
      return;
    }

    if (pagina === "home") {
      if (destino === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(destino);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      alvoPendente.current = destino;
      voltandoDeTrabalhos.current = true;
      trocarPagina("home");
    }
  };

  const overlay = (
    <div
      className={`transicao-overlay ${transicaoAtiva ? "transicao-overlay--ativo" : ""}`}
      aria-hidden="true"
    />
  );

  if (pagina === "trabalhos") {
    return (
      <>
        {overlay}
        <MenuHamburguer aoNavegar={aoNavegar} visivel={menuVisivel} />
        <Trabalhos aoNavegar={aoNavegar} />
        <Footer />
      </>
    );
  }

  return (
    <>
      {overlay}
      <MenuHamburguer aoNavegar={aoNavegar} visivel={menuVisivel} />
      <Comeco aoNavegar={aoNavegar} pularIntro={voltandoDeTrabalhos.current} />
      <Sobre />
      <Clientes />
      <Footer />
    </>
  );
}