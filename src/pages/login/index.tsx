// Importa o componente de logo a partir de um arquivo SVG
import Logo from "../../assets/logo.svg";

// Importa o hook useEffect do React
import { useEffect } from "react";

// Importa componentes personalizados Container, Input e funcionalidades de navegação do React Router
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";

// Importa hooks e resolvers do react-hook-form e zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Importa funções de autenticação do Firebase
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

// Importa a biblioteca de notificações toast
import toast from "react-hot-toast";

// Define um schema de validação utilizando zod
const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});

// Define o tipo de dados esperado pelo formulário com base no schema
type FormData = z.infer<typeof schema>;

// Componente funcional Login
export function Login() {
  // Utiliza o hook useForm para gerenciar o estado do formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Utiliza o hook useNavigate para navegação
  const navigate = useNavigate();

  // Função chamada ao enviar o formulário
  function onSubmit(data: FormData) {
    // Autentica o usuário com email e senha
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        console.log(user);
        // Exibe uma mensagem de sucesso e redireciona para a página de dashboard
        toast.success("Logado com sucesso");
        navigate("/dashboard", { replace: true });
        // O parâmetro { replace: true } indica que a rota atual no histórico de navegação será substituída pela nova rota ("/dashboard"),
      })
      .catch((error) => {
        console.log(error.message);
        // Exibe uma mensagem de erro em caso de falha na autenticação
        toast.error("Email ou senha inválida(o)");
      });
  }

  // Efeito colateral para realizar logout ao montar o componente
  useEffect(() => {
    async function handleLogout() {
      await signOut(auth); //A linha await signOut(auth); está chamando a função signOut para realizar o logout do usuário autenticado.
    }
    handleLogout();
  }, []);

  // Renderiza o componente
  return (
    <>
      <Container>
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
          {/* Link para a página inicial */}
          <Link to={"/"} className="mb-6 max-w-sm w-full">
            {/* Exibe o logo do site */}
            <img src={Logo} alt="logo do site" className="w-full" />
          </Link>

          {/* Formulário de login */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white max-w-xl w-full rounded-lg p-4"
          >
            {/* Campo de email */}
            <div className="mb-3">
              <Input
                type="email"
                placeholder="Digite o seu email"
                name="email"
                error={errors.email?.message}
                register={register}
              />
            </div>
            {/* Campo de senha */}
            <div className="mb-3">
              <Input
                type="password"
                placeholder="Digite a sua senha"
                name="password"
                error={errors.password?.message}
                register={register}
              />
            </div>

            {/* Botão de submissão do formulário */}
            <button
              type="submit"
              className="bg-zinc-900 w-full rounded-md mb-2 h-10 text-white font-medium hover:bg-red-600 duration-500"
            >
              Acessar
            </button>
            {/* Link para a página de registro */}
            <span>
              {" "}
              Não tem conta?{" "}
              <Link to={"/register"} className="text-red-600 font-medium">
                Cadastre-se
              </Link>
            </span>
          </form>
        </div>
      </Container>
    </>
  );
}
