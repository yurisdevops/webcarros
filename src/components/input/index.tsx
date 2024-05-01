import { RegisterOptions, UseFormRegister } from "react-hook-form"; // Importa as interfaces RegisterOptions e UseFormRegister do react-hook-form

interface InputPros {
  // Define a interface InputPros para as propriedades do componente Input
  type: string; // Tipo do input (por exemplo, "text", "email", "password")
  placeholder: string; // Texto de placeholder para o input
  name: string; // Nome do input
  register: UseFormRegister<any>; //* register: UseFormRegister<any>;: Representa a função de registro do react-hook-form para o input. Essa função é usada para registrar o input no formulário e habilitar a validação e controle de estado fornecidos pelo react-hook-form.
  error?: string; //* error?: string;: É uma propriedade opcional que representa uma mensagem de erro que pode ser exibida ao lado do input, caso ocorra uma validação ou erro de formulário relacionado a este input.
  rules?: RegisterOptions; //* rules?: RegisterOptions;: Representa as regras de validação para o input. Essas regras são usadas para validar o valor inserido no input de acordo com critérios específicos, como obrigatoriedade, formato, tamanho máximo, etc. Esta propriedade é opcional, o que significa que as regras de validação podem ser fornecidas ou não, dependendo da necessidade de validação do input.
}

export function Input({
  // Componente funcional Input que recebe as propriedades especificadas na interface InputPros
  name, // Nome do input
  placeholder, // Texto de placeholder
  type, // Tipo do input
  register, // Função de registro do react-hook-form
  rules, // Regras de validação
  error, // Mensagem de erro (opcional)
}: InputPros) {
  // Destrutura as propriedades passadas para o componente
  return (
    // Retorna a estrutura do input
    <>
      <div>
        <input
          className="w-full border-2 rounded-md h-11 px-2" // Estilização do input
          type={type} // Define o tipo do input
          placeholder={placeholder} // Define o texto de placeholder
          {...register(name, rules)} //* {...register(name, rules)}: Utiliza o spread operator ({...}) para passar dinamicamente as propriedades name (nome do input) e rules (regras de validação) para a função register do react-hook-form, registrando o input no formulário e aplicando as regras de validação, se fornecidas.
          id={name} // Define o ID do input com base no nome
        />
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Renderiza a
        mensagem de erro se houver algum*/}
        {/*{error && <p className="text-red-500">{error}</p>}: Esta parte do código renderiza uma mensagem de erro condicionalmente. Se a propriedade error estiver presente e não for uma string vazia, então um parágrafo (<p>) com a mensagem de erro será renderizado. A mensagem de erro é exibida em vermelho (text-red-500) para chamar a atenção do usuário.*/}
      </div>
    </>
  );
}

/**
 * *!Important
 * TODO:Esse trecho de código encapsula a lógica de renderização do input e da mensagem de erro associada a ele, tornando-o reutilizável e facilitando a manutenção e estilização do componente Input.
 */
