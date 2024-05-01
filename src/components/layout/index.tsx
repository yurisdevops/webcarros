import { Outlet } from "react-router-dom"; // Importa o componente Outlet do React Router para renderizar as rotas aninhadas
import { Header } from "../header"; // Importa o componente Header do diretório header

export function Layout() {
  // Componente para o layout da aplicação
  return (
    // Retorna a estrutura do layout
    <>
      <Header />
      {/* Renderiza o componente Header para exibir o cabeçalho de todas as
      páginas*/}
      <Outlet />{" "}
      {/* Renderiza o Outlet para renderizar as rotas aninhadas dentro
      do componente Layout*/}
    </>
  );
}

/**
 * *!Important*
 * TODO:Em resumo, o componente Layout é responsável por definir o layout básico da página, incluindo o cabeçalho e o conteúdo principal. Ele utiliza o Outlet do React Router para renderizar o conteúdo específico da rota atual. Isso é útil para criar um layout consistente em diferentes páginas da aplicação, mantendo a separação entre o cabeçalho e o conteúdo dinâmico.
 */
