import { Link } from "react-router-dom"; // Importa o componente Link do React Router para navegação
import { auth } from "../../services/firebaseConnection"; // Importa o objeto 'auth' da conexão com o Firebase
import { signOut } from "firebase/auth"; // Importa a função 'signOut' do Firebase para sair da autenticação

export function DashboardHeader() {
  // Componente para o cabeçalho do painel de controle
  async function handleLogout() {
    // Função assíncrona para lidar com o logout do usuário
    await signOut(auth); // Executa o logout do usuário utilizando o objeto 'auth'
  }

  return (
    // Retorna a estrutura do cabeçalho do painel de controle
    <>
      <div className="w-full flex h-10 bg-red-600 text-white font-medium items-center gap-4 px-4 mb-4 rounded-lg">
        <Link to={"/dashboard"} className="hover:text-gray-800 duration-700">
          {" "}
          {/* Link para a página do painel de controle*/}
          Dashboard
          {/* Texto exibido para acessar o painel de controle*/}
        </Link>
        <Link
          to={"/dashboard/new"}
          className="hover:text-gray-800 duration-700"
        >
          Cadastrar Carro {/* Link para a página de cadastro de carro*/}
        </Link>

        <button
          className="ml-auto hover:text-gray-800 duration-700"
          onClick={handleLogout} // Evento de clique para executar o logout ao clicar no botão
        >
          Sair {/* Botão para sair da autenticação*/}
        </button>
      </div>
    </>
  );
}

/**
 * *!Important*
 * TODO:Em resumo, o componente DashboardHeader representa o cabeçalho da página do painel de controle e inclui links de navegação para diferentes partes do painel, bem como um botão para fazer logout do usuário autenticado. Ele utiliza o React Router para gerenciar a navegação e o Firebase para lidar com a autenticação e logout do usuário. Ele é utilizável apenas quando o usuário está logado.
 */
