import { useState, useEffect, useRef } from "react";
import Comeco from "./paginas/comeco";
import Sobre from "./paginas/sobre";
import Trabalhos from "./paginas/trabalhos";
import Clientes from "./paginas/clientes";
import Footer from "./componentes/footer";

//npm run deploy

//git add. 
//git commit -m ""
//git push origin main

export default function App() {
  const [pagina, setPagina] = useState("home"); 
  const alvoPendente = useRef(null); 

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
  const aoNavegar = (destino) => {
    if (destino === "trabalhos") {
      setPagina("trabalhos");
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
      setPagina("home");
    }
  };

  if (pagina === "trabalhos") {
    return (
      <>
        <Trabalhos aoNavegar={aoNavegar} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Comeco aoNavegar={aoNavegar} />
      <Sobre />
      <Clientes />
      <Footer />
    </>
  );
}