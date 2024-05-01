import { Link } from "react-router-dom"; // Importa o componente Link do react-router-dom para criar links na aplicação
import Logo from "../../assets/logo.svg"; // Importa o arquivo de imagem do logo
import { FiLogIn, FiUser } from "react-icons/fi"; // Importa os ícones de login e usuário do pacote react-icons
import { useContext } from "react"; // Importa o hook useContext do React para acessar o contexto
import { AuthContext } from "../../context/AuthContext"; // Importa o contexto de autenticação

export function Header() {
  // Declaração do componente funcional Header
  const { loadingAuth, signed } = useContext(AuthContext); // Obtém os valores de loadingAuth e signed do contexto AuthContext

  return (
    <>
      {" "}
      {/* Fragmento React para envolver múltiplos elementos*/}
      <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow-sm mb-4">
        {" "}
        {/* Div principal com classes de estilização*/}
        <header className="flex w-full items-center justify-between max-w-7xl px-4 mx-auto">
          {" "}
          {/* Cabeçalho com classes de estilização*/}
          <Link to={""}>
            {" "}
            {/* Link para a página inicial*/}
            <img src={Logo} alt="Logo do site" />{" "}
            {/* Imagem do logo com atributo*/}
          </Link>
          {!loadingAuth &&
            !signed && ( // Renderização condicional do link de login se não houver autenticação em andamento e o usuário não estiver autenticado
              <Link to={"/login"}>
                <div className="border-2 rounded-full p-1 border-gray-900">
                  {" "}
                  {/* Div com classes de estilização para o ícone de login*/}
                  <FiLogIn size={22} /> {/* Ícone de login com tamanho 22*/}
                </div>
              </Link>
            )}
          {!loadingAuth &&
            signed && ( // Renderização condicional do link do painel se não houver autenticação em andamento e o usuário estiver autenticado
              <Link to={"/dashboard"}>
                <div className="border-2 rounded-full p-1 border-gray-900">
                  {" "}
                  {/* Div com classes de estilização para o ícone de usuário*/}
                  <FiUser size={22} /> {/* Ícone de usuário com tamanho 22*/}
                </div>
              </Link>
            )}
        </header>
      </div>
    </>
  );
}

/**
 * *!Important*
 * TODO:Este componente Header renderiza um cabeçalho que contém o logo do site e um ícone de login ou de usuário, dependendo do estado de autenticação do usuário. A renderização do ícone é condicional com base nas variáveis loadingAuth e signed obtidas do contexto AuthContext.
 */
