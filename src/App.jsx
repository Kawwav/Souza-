import Comeco from "./paginas/comeco";
import Sobre from "./paginas/sobre";
import Clientes from "./paginas/clientes";
import Footer from "./componentes/footer";

//npm run deploy

//git add. 
//git commit -m ""
//git push origin main

export default function App() {
  return (
    <>
      <Comeco />
      <Sobre />
      <Clientes />
      <Footer />
    </>
  );
}