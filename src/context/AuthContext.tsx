import { useState, useEffect, createContext, ReactNode } from "react"; // Importa os hooks e tipos necessários do React
import { auth } from "../services/firebaseConnection"; // Importa o objeto 'auth' da conexão com o Firebase
import { onAuthStateChanged } from "firebase/auth"; // Importa a função 'onAuthStateChanged' do Firebase para monitorar mudanças de autenticação

interface AuthContextData {
  // Define a interface para os dados do contexto de autenticação
  signed: boolean; // Indica se o usuário está autenticado
  loadingAuth: boolean; // Indica se está carregando a autenticação
  handleInfoUser: ({ name, email, uid }: UserProps) => void; // Função para lidar com informações do usuário
  user: UserProps | null; // Dados do usuário autenticado
}

interface AuthProviderProps {
  // Define a interface para as propriedades do provedor de autenticação
  children: ReactNode; // Componentes filhos a serem renderizados
}

interface UserProps {
  // Define a interface para as propriedades do usuário
  uid: string; // ID único do usuário
  name: string | null; // Nome do usuário (pode ser nulo)
  email: string | null; // E-mail do usuário (pode ser nulo)
}

export const AuthContext = createContext({} as AuthContextData); // Cria o contexto de autenticação com os dados definidos

function AuthProvider({ children }: AuthProviderProps) {
  // Componente do provedor de autenticação
  const [user, setUser] = useState<UserProps | null>(null); // Estado para armazenar os dados do usuário
  const [loadingAuth, setLoadingAuth] = useState(true); // Estado para controlar o carregamento da autenticação. O carregamento sempre começará com true pois estará sempre carregando até que algum ação de login seja executada

  useEffect(() => {
    // Efeito colateral para monitorar mudanças de autenticação
    const unsub = onAuthStateChanged(auth, (user) => {
      // Monitora as mudanças de autenticação do usuário
      if (user) {
        // Se o usuário estiver autenticado
        setUser({
          // Define os dados do usuário autenticado
          uid: user.uid,
          name: user?.displayName,
          email: user?.email,
        });
        setLoadingAuth(false); // Finaliza o carregamento da autenticação
      } else {
        // Se o usuário não estiver autenticado
        setUser(null); // Limpa os dados do usuário
        setLoadingAuth(false); // Finaliza o carregamento da autenticação
      }
    });

    return () => unsub(); // Retorna a função de limpeza para remover o observador de autenticação
  }, []); // Executa o efeito apenas uma vez ao montar o componente

  function handleInfoUser({ name, email, uid }: UserProps) {
    // Função para lidar com informações do usuário
    setUser({
      // Atualiza os dados do usuário
      name,
      email,
      uid,
    });
  }

  return (
    // Retorna o provedor de autenticação com os valores do contexto
    // Vale lembrar que o AuthContext está envolvendo toda a nossa aplicação por isso o useEffect para verificar se alguém online
    <AuthContext.Provider
      value={{ signed: !!user, loadingAuth, handleInfoUser, user }}
    >
      {/* Renderiza os componentes filhos */}
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; // Exporta o componente do provedor de autenticação

/**
 * *!Important*
 * TODO:Em resumo, este trecho de código define um contexto de autenticação em React, que permite compartilhar informações de autenticação e funções relacionadas com outros componentes da aplicação. O provedor (AuthProvider) gerencia o estado de autenticação e fornece os dados necessários para os componentes que estão dentro de sua árvore de renderização.
 */
