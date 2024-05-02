import Logo from "../../assets/logo.svg"; // Importa o logo do site

import { Container } from "../../components/container"; // Importa o componente Container
import { Input } from "../../components/input"; // Importa o componente Input
import { Link, useNavigate } from "react-router-dom"; // Importa o Link e useNavigate do react-router-dom

import { useForm } from "react-hook-form"; // Importa o hook useForm do react-hook-form
import { z } from "zod"; // Importa z do pacote zod
import { zodResolver } from "@hookform/resolvers/zod"; // Importa zodResolver do pacote @hookform/resolvers/zod

import { auth } from "../../services/firebaseConnection"; // Importa a instância de autenticação do Firebase
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"; // Importa funções relacionadas à autenticação do Firebase

import { useContext, useEffect } from "react"; // Importa o hook useContext e useEffect do React
import { AuthContext } from "../../context/AuthContext"; // Importa o contexto de autenticação
import toast from "react-hot-toast"; // Importa a biblioteca para exibir mensagens de toast

const schema = z.object({
  // Define um schema de validação com zod
  name: z
    .string()
    .min(10, "Digite seu nome e sobrenome")
    .nonempty("O campo name é obrigatório"),
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z
    .string()
    .min(8, "A senha deve conter no mínimo 8 caracteres")
    .nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>; // Define o tipo FormData com base no schema

export function Register() {
  // Define o componente de registro
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    // Inicializa o hook useForm com o schema de validação
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const navigate = useNavigate(); // Obtém a função de navegação do react-router

  const { handleInfoUser } = useContext(AuthContext); // Obtém a função handleInfoUser do contexto de autenticação = Context Api

  async function onSubmit(data: FormData) {
    // Função chamada ao submeter o formulário de registro
    createUserWithEmailAndPassword(auth, data.email, data.password) // Cria um novo usuário com email e senha
      .then(async (user) => {
        /**
         * *!Important*
         * TODO: Dessa forma, ao chamar updateProfile com esses parâmetros, o nome fornecido no formulário de registro é associado ao perfil do usuário recém-criado, permitindo que o nome seja exibido corretamente em outras partes da aplicação que utilizam essa informação.
         */
        await updateProfile(user.user, {
          /**
           * @firebase updateProfile
           ** user.user: Este é o objeto de usuário retornado ao criar um novo usuário com createUserWithEmailAndPassword. Ele contém informações sobre o usuário, como o ID único (UID) e outras propriedades.
           */
          // Atualiza o perfil do usuário com o nome
          displayName: data.name,
          /**
           * @method displayName
           ** { displayName: data.name }: Este é um objeto contendo a propriedade displayName, que é usada para atualizar o nome de exibição do usuário no perfil. O valor data.name é o nome fornecido no formulário de registro.
           */
        });
        handleInfoUser({
          // Atualiza as informações do usuário no contexto de autenticação
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });
        toast.success("Cadastrado com sucesso! Bem-vindo ao WebCarros"); // Exibe mensagem de sucesso
        navigate("/dashboard", { replace: true }); // Navega para a página de dashboard
        // O parâmetro { replace: true } indica que a rota atual no histórico de navegação será substituída pela nova rota ("/dashboard"),
      })
      .catch((err) => {
        toast.error("Erro ao cadastrar!"); // Exibe mensagem de erro em caso de falha no cadastro
        console.log(err.message); // Registra o erro no console
      });
  }

  useEffect(() => {
    // Efeito colateral para realizar logout ao montar o componente
    // Só de acessar a página de register o login é feito automático
    async function handleLogout() {
      await signOut(auth); // Realiza o logout do usuário
    }
    handleLogout();
  }, []);

  return (
    <>
      <Container>
        {" "}
        {/* Renderiza o componente Container*/}
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
          <Link to={"/"} className="mb-6 max-w-sm w-full">
            {" "}
            {/* Link para a página inicial*/}
            <img src={Logo} alt="logo do site" className="w-full" />
          </Link>

          <form
            onSubmit={handleSubmit(onSubmit)} // Submete o formulário ao clicar no botão de cadastro
            className="bg-white max-w-xl w-full rounded-lg p-4"
          >
            {/* Campo de nome */}
            <div className="mb-3">
              <Input
                type="text"
                placeholder="Digite o seu nome"
                name="name"
                error={errors.name?.message}
                register={register}
              />
            </div>
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
              className="bg-zinc-900 w-full rounded-md h-10 mb-2 text-white font-medium hover:bg-red-600 duration-500"
            >
              Cadastrar
            </button>
            {/* Link para a página de login */}
            <span>
              {" "}
              Já possuí conta?{" "}
              <Link to={"/login"} className="text-red-600 font-medium">
                Faça o login
              </Link>
            </span>
          </form>
        </div>
      </Container>
    </>
  );
}
