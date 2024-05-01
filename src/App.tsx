import { createBrowserRouter } from "react-router-dom"; // Importa a função createBrowserRouter do pacote react-router-dom
import { Home } from "./pages/home"; // Importa o componente Home da pasta pages/home
import { Dashboard } from "./pages/dashboard"; // Importa o componente Dashboard da pasta pages/dashboard
import { Login } from "./pages/login"; // Importa o componente Login da pasta pages/login
import { Register } from "./pages/register"; // Importa o componente Register da pasta pages/register
import { CarDetail } from "./pages/car"; // Importa o componente CarDetail da pasta pages/car
import { New } from "./pages/dashboard/new"; // Importa o componente New da pasta pages/dashboard/new
import { Layout } from "./components/layout"; // Importa o componente Layout da pasta components/layout
import { Private } from "./routes/Private"; // Importa o componente Private da pasta routes/Private

// Cria as rotas da aplicação utilizando o createBrowserRouter
const router = createBrowserRouter([
  {
    element: <Layout />, // Define o elemento Layout como raiz da rota e envolve dos as páginas dentro do childreb
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarDetail />,
      },
      {
        path: "/dashboard",
        element: (
          <Private /* Utiliza o componente Private para controlar o acesso */>
            <Dashboard /* Define o componente Dashboard a ser renderizado nessa rota*/
            />
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Private /* Utiliza o componente Private para controlar o acesso */>
            <New /* Define o componente New a ser renderizado nessa rota*/ />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login", // Define o caminho da rota como "/login" e como podemos ver ele está fora do Layout pois não receberá o header como as outras pages
    element: <Login />, // Define o componente Login a ser renderizado nessa rota
  },
  {
    path: "/register", // Define o caminho da rota como "/register" e como podemos ver ele está fora do Layout pois não receberá o header como as outras pages
    element: <Register />, // Define o componente Register a ser renderizado nessa rota
  },
]);

export { router };

/**
 * ?Neste código, estamos criando as rotas da aplicação utilizando o createBrowserRouter do react-router-dom. Aqui está o passo a passo do funcionamento do código:

    **Importamos os componentes necessários para as páginas da aplicação, como Home, Dashboard, Login, Register, CarDetail, New e Layout.
    **Importamos o componente Private que controla o acesso a rotas privadas.
    **Criamos as rotas da aplicação usando o createBrowserRouter.
    **Definimos a estrutura das rotas, onde cada rota possui um element que representa o componente a ser renderizado e opcionalmente um children que contém rotas aninhadas.
    **Para a rota raiz ("/"), definimos o componente Layout como elemento raiz e o componente Home como conteúdo a ser renderizado.
    **Para a rota "/dashboard", utilizamos o componente Private para controlar o acesso ao componente Dashboard.
    **Para a rota "/car/:id", renderizamos o componente CarDetail.
    **Para a rota "/dashboard/new", utilizamos o componente Private para controlar o acesso ao componente New.
    **Definimos as rotas "/login" e "/register" para renderizar os componentes Login e Register, respectivamente.
    **Exportamos as rotas da aplicação para serem utilizadas em outro lugar.
    *TODO:Dessa forma, o código define a estrutura de navegação da aplicação, especificando quais componentes devem ser renderizados em cada rota e controlando o acesso a rotas privadas com o componente Private.
 */
