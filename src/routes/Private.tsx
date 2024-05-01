import { ReactNode, useContext } from "react"; // Importa o tipo ReactNode e o hook useContext do pacote react
import { AuthContext } from "../context/AuthContext"; // Importa o contexto de autenticação AuthContext
import { Navigate } from "react-router-dom"; // Importa o componente Navigate do pacote react-router-dom

interface PrivateProps {
  children: ReactNode; // Define a interface PrivateProps com a propriedade children do tipo ReactNode
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = useContext(AuthContext); // Obtém as propriedades signed e loadingAuth do contexto de autenticação

  if (loadingAuth) {
    // Verifica se ainda estamos carregando as informações de autenticação
    return <div></div>; // Retorna um elemento vazio enquanto aguardamos o carregamento
  }

  if (!signed) {
    // Verifica se o usuário não está autenticado
    return <Navigate to="/login" />; // Redireciona o usuário para a rota de login
  }

  return children; // Retorna os componentes filhos se o usuário estiver autenticado
}

/**
 * *!Important*
 *TODO: Em resumo, o componente Private controla o acesso a rotas privadas verificando o estado de autenticação do usuário. Se o usuário estiver autenticado, ele permite o acesso às rotas privadas, caso contrário, ele redireciona o usuário para a página de login. Essa abordagem é comum em aplicações que possuem áreas restritas que só podem ser acessadas por usuários autenticados.
 */
