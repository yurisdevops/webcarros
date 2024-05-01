import { FiTrash, FiUpload } from "react-icons/fi"; //* Biblioteca de buttons
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { Input } from "../../../components/input";

import { useForm } from "react-hook-form";
import { z } from "zod"; //* Biblioteca Zod: O z na biblioteca Zod se refere ao objeto principal que você utiliza para definir seus esquemas de validação. Ao utilizar a biblioteca Zod, você pode criar um esquema de validação para seus dados usando o objeto z. Por exemplo, você pode definir um esquema que valida se um objeto possui uma determinada estrutura de propriedades ou se um valor é de um determinado tipo.

import { zodResolver } from "@hookform/resolvers/zod"; //*O zodResolver é um resolver de esquema de validação que você pode utilizar com o react-hook-form para validar os dados de um formulário com base em um esquema definido com a biblioteca Zod

import { ChangeEvent, useContext, useState } from "react";

import { AuthContext } from "../../../context/AuthContext"; //* Importando a context API

import { v4 as uuidV4 } from "uuid"; //* Biblioteca UUID: Neste caso estamos renomeando a função v4 para uuidV4, o que permite que a utilizamos com o nome uuidV4 em todo código. A função v4 é responsável por gerar UUIDs (Identificadores Únicos Universais) de forma aleatória.

import { storage, db } from "../../../services/firebaseConnection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

const schema = z.object({
  //* Nesta const schema: Aqui é feita a validação e aqui usamos o objeto z de zod para fazer a validação.
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O Ano do carro é obrigatório"),
  km: z.string().nonempty("O KM do carro é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  cambio: z.string().nonempty("O tipo cambio é obrigatório"),
  whatsapp: z
    .string()
    .min(1, "O Telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Numero de telefone invalido.",
    }), //*Na biblioteca Zod, além de usar o método `.refine()` para aplicar uma validação personalizada a um esquema, você também pode fornecer um objeto de opções como segundo argumento para personalizar a mensagem de erro que será exibida caso a validação falhe.   No exemplo fornecido, além da expressão regular `^(\d{11,12})$` que valida se o valor contém entre 11 e 12 dígitos numéricos, foi adicionado um objeto de opções com a propriedade `message` definida como "Numero de telefone invalido.". Isso significa que, se a validação falhar e o valor não corresponder ao padrão especificado, a mensagem de erro exibida será "Numero de telefone invalido.". Portanto, ao usar `.refine((value) => /^(\d{11,12})$/.test(value), { message: "Numero de telefone invalido." })` em um esquema Zod, você está aplicando a mesma validação de comprimento de dígitos numéricos, mas agora com uma mensagem de erro personalizada para ser exibida caso a validação falhe.
  description: z.string().nonempty("A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;
//* Tipando o FormData: Aqui estamos criando um type que usa o objeto z mas desta veZ como o (Z.INFER => O método z.infer da biblioteca Zod é uma funcionalidade que permite inferir automaticamente o tipo TypeScript correspondente a um esquema de validação definido com Zod. Isso é especialmente útil quando você deseja extrair o tipo de dados validados por um esquema Zod sem a necessidade de definir manualmente o tipo.) Aqui o z.infer é utilizado para extrair automaticamente o tipo FormData com base no esquema schema. Isso significa que o tipo FormData será equivalente ao objeto validado pelo esquema, ou seja, terá todas as propriedades. EX: name, model, year, km e etc... todos do tipo string

interface ImageItemProps {
  //* Criando uma tipagem para receber as imagens que irão ser cadastradas
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  /**
   * *!Important*
   * TODO: Em resumo, esse trecho de código está configurando e gerenciando um formulário com validação de dados usando o React Hook Form, com um esquema de validação Zod e acionando a validação a cada mudança nos campos do formulário. Os métodos `register`, `handleSubmit`, `formState` e `reset` são utilizados para interagir com o formulário e seus dados.
   */

  /**
   ** Neste trecho de código, está sendo utilizado o hook `useForm` de uma biblioteca de formulários (provavelmente o React Hook Form) para gerenciar um formulário. Vamos explicar cada parte do código:

 *@const { register, handleSubmit, formState: { errors }, reset } 
   ** `register`: é uma função que permite registrar os campos do formulário, vinculando-os ao estado interno do formulário.
   ** `handleSubmit`: é uma função que será chamada quando o formulário for submetido, permitindo o envio dos dados do formulário.
   ** `formState: { errors }`: é um objeto que contém os erros de validação dos campos do formulário. Se um campo não passar na validação, o erro correspondente será armazenado neste objeto.
   ** `reset`: é uma função que permite redefinir o formulário, limpando os valores dos campos.

  *?useForm<FormData> ({ resolver: zodResolver(schema), mode: "onChange" });`
   ** `useForm<FormData>`: é um hook que inicializa o formulário e retorna os métodos e estados necessários para gerenciar o formulário.
   ** `resolver: zodResolver(schema)`: define o resolver a ser usado para validar os dados do formulário. Neste caso, está sendo utilizado o `zodResolver` com um esquema de validação `schema`.
   ** `mode: "onChange"`: define o modo de validação do formulário. Neste caso, a validação será acionada a cada mudança nos campos do formulário (quando o valor de um campo é alterado).
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    //* O use form está recebendo a tipagem do FormData, logo recebendo também todos os objetos
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { user } = useContext(AuthContext); //* Acesso ao user do Context API

  const [carImage, setCarImage] = useState<ImageItemProps[]>([]); //* useState utilizada para receber os dados das imagens e foi tipada para receber os dados dessa interface: uid, name, url e previewUrl

  function onSumbit(data: FormData) {
    /**
      //*data: FormData
      //*data é o nome do parâmetro que a função espera receber.
      //*FormData é o tipo de dado que o parâmetro data deve ser. Neste caso, FormData é provavelmente um objeto que contém os dados do formulário que será submetido.
  */
    if (carImage.length === 0) {
      //*Este trecho de código é uma instrução condicional if que verifica se o comprimento da array carImage é igual a zero. Se a condição for verdadeira, ou seja, se não houver imagens na array carImage, o código dentro do bloco de instruções do if será executado... O toast é executado e o return faz com o que o comando pare.
      toast.error("Adicione uma imagem");
      return;
    }

    //* ----------------------------------------------------------------

    //* Depois do if acima que as operações abaixo são iniciadas, ou seja, primeiro tem que ser feita a verificação da condicional

    const carListImages = carImage.map((car) => {
      //* Const carListImages: Foi criada para desconstruir os dados das imagens e so receber o uid, name e url e não o previewUrl. A const recebe o useState e faz utilização no map para percorrer tudo e fazer a desconstrução
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    addDoc(collection(db, "cars"), {
      name: data.name.toUpperCase(),
      model: data.model,
      year: data.year,
      km: data.km,
      price: data.price,
      city: data.city,
      whatsapp: data.whatsapp,
      description: data.description,
      cambio: data.cambio,
      createdAt: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        console.log("Cadastrado");
        reset();
        setCarImage([]);
        toast.success("Carro cadastrado com sucesso!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Falha ao cadastrar o carro...");
      });

    /**Neste trecho de código, está sendo utilizado o Firestore, que é um banco de dados NoSQL fornecido pelo Firebase. Aqui está uma explicação do que cada parte desse código faz:

1. `addDoc(collection(db, "cars"), { ... })`
   - `addDoc`: é um método do Firestore que é usado para adicionar um novo documento a uma coleção.
   - `collection(db, "cars")`: define a coleção onde o novo documento será adicionado. Neste caso, está sendo adicionado um novo documento à coleção "cars" no banco de dados Firestore.
   - `{ ... }`: é um objeto contendo os dados a serem salvos no novo documento. Os dados estão sendo extraídos do objeto `data` que provavelmente contém os dados do formulário submetido.

2. `.then(() => { ... })`
   - `reset()`: é uma função que provavelmente limpa o formulário, redefinindo os valores dos campos para os valores iniciais.
   - `setCarImage([])`: limpa a array `carImage`, possivelmente removendo as imagens que foram enviadas.

Em resumo, este trecho de código adiciona um novo documento à coleção "cars" no Firestore com os dados do formulário submetido, exibe mensagens de sucesso ou erro, e limpa o formulário e a array de imagens dependendo do resultado da operação. */
  }
  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    /**
      //*Função handleFile:
      
      @Evento @de @Mudança @ChangeEvent 
      //*A função handleFile é um callback que responde ao evento de mudança em um elemento <input> do tipo arquivo (ChangeEvent<HTMLInputElement>). Isso significa que ela será executada quando o usuário selecionar um arquivo usando um elemento de entrada de arquivo HTML.

      @Verificação @de @Arquivo
      //*Verifica se e.target.files existe e se e.target.files[0] está definido. Isso garante que pelo menos um arquivo tenha sido selecionado antes de continuar.

      @Obtenção @da @Imagem
      //*Se um arquivo foi selecionado, a função obtém o primeiro arquivo selecionado e o armazena na variável image.

      @Verificação @do @Tipo @de @Imagem
      //*Verifica se o tipo de arquivo é JPEG, PNG ou WEBP. Se for um desses tipos, prossegue para o próximo passo. Caso contrário, exibe um alerta informando ao usuário que apenas JPEG ou PNG são permitidos e retorna da função.

      @Envio @para @o @Banco @de @Imagens
      //*Se o tipo de imagem for válido, a função handleUpLoad é chamada e passa o arquivo de imagem como argumento.
     */

    if (e.target.files && e.target.files[0]) {
      //* --> @Verificação @de @Arquivo
      const image = e.target.files[0]; //* --> @Obtenção @da @Imagem

      if (
        //* --> @Verificação @do @Tipo @de @Imagem
        image.type === "image/jpeg" ||
        image.type === "image/png" ||
        "image/webp"
      ) {
        handleUpLoad(image); //* --> @Envio @para @o @Banco @de @Imagens
      } else {
        toast.error("Formato de imagem inválido... Apenas JPEG ou PNG ou Webp");
        return;
      }
    }
  }
  async function handleUpLoad(image: File) {
    /**
        //*Função handleUpLoad:

        @Verificação @de @Usuário
        //*Verifica se há um usuário autenticado. Se não houver, a função retorna, interrompendo o processo de upload.

        @Obtenção @de @IDs @Únicos
        //*Obtém o ID único do usuário autenticado e gera um novo ID único para a imagem a ser enviada.

        @Referência @de @Upload
        //*Cria uma referência para o local de armazenamento da imagem no Firebase Storage, utilizando o ID do usuário e o ID da imagem.

        @Upload @da @Imagem
        //*Realiza o upload dos bytes da imagem para o Firebase Storage na localização especificada.
        //*Ou seja, usa a const uploadRef que contém o local para onde as imagens devem ir e depois da vírgula o arquivo que será enviado para este local. 

        @Obtenção @da @URL @de @Download
        //* snapshot.ref: snapshot é o objeto retornado após o upload do arquivo para o armazenamento. A propriedade ref contém uma referência ao local onde o arquivo foi armazenado.
        //*getDownloadURL(snapshot.ref): getDownloadURL é uma função que recebe a referência do arquivo no armazenamento e retorna uma promessa (promise) que será resolvida com a URL de download do arquivo.
        //*.then((downloadUrl) => { ... }): O método then é utilizado para encadear uma função que será executada após a resolução da promessa retornada por getDownloadURL. Quando a URL de download estiver disponível, a função especificada dentro de then será executada e receberá a URL de download como argumento (no caso, downloadUrl).
        //*Em resumo, a expressão getDownloadURL(snapshot.ref).then((downloadUrl) => { ... }) realiza as seguintes operações:
        //*Obtém a URL de download do arquivo que foi armazenado no storage do firebase.
        //*Quando a URL de download estiver disponível, executa a função especificada dentro de then e passa a URL de download como argumento para essa função.

        @Atualização @da @Interface @de @Usuário
        //*Cria um objeto representando a imagem carregada, incluindo seu ID, nome, URL de visualização e URL de download.
        //*Atualiza o estado da lista de imagens (setCarImage) adicionando a nova imagem à lista existente.
   */

    if (!user?.uid) {
      //* --> @Verificação @de @Usuário
      return;
    }

    const currentUid = user?.uid; //* --> @Obtenção @de @IDs @Únicos
    const uidImage = uuidV4(); //* --> @Obtenção @de @IDs @Únicos

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`); //* --> @Referência @de @Upload

    uploadBytes(uploadRef, image).then((snapshot) => {
      //* --> @Upload @da @Imagem
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        //* -->  @Obtenção @da @URL @de @Download
        console.log(snapshot.ref);
        console.log(downloadUrl);

        const imageItem = {
          uid: currentUid,
          name: uidImage,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        console.log(imageItem?.previewUrl);

        setCarImage((images) => [...images, imageItem]); //* --> @Atualização @da @Interface @de @Usuário
      });
    });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    /**
        @Definição @da @Função @e @Parâmetros
        - A função `handleDeleteImage` é declarada como uma função assíncrona, o que significa que ela pode conter operações assíncronas, como chamadas de API ou operações de I/O.
        - Ela recebe um parâmetro `item` do tipo `ImageItemProps`, que parece representar uma imagem a ser deletada.

        @Construção @do @Caminho @da @Imagem
        - É construído o caminho da imagem a ser deletada utilizando o ID (`uid`) e o nome (`name`) do item passado como parâmetro.
        - O caminho resultante é armazenado na variável `imagePath`.

        @Referência @ao @Objeto @de @Imagem @no @Armazenamento
        - Utilizando a função `ref` do Firebase Storage, é criada uma referência ao objeto de imagem no armazenamento, usando o caminho da imagem calculado anteriormente. Storage é onde as imagens estão sendo armazenadas.
        - Essa referência é armazenada na variável `imageRef`.

        @Tentativa @de @Deleção @da @Imagem
        - É feita uma tentativa de deletar o objeto de imagem utilizando a função `deleteObject` do Firebase Storage.
        - Como essa é uma operação assíncrona, utilizamos `await` para aguardar a conclusão da operação antes de prosseguir.

        @Atualização @do @Estado @e @Feedback @ao @Usuário
        - Se a deleção for bem-sucedida, ou seja, se a imagem for deletada,  o estado `carImage` é atualizado filtrando o array para remover o item deletado.
        - Um feedback de sucesso é exibido ao usuário utilizando uma notificação ou toast, indicando que a imagem foi deletada com sucesso.
        - Se ocorrer algum erro durante o processo de deleção, ele será capturado pelo bloco `catch` e impresso no console para fins de depuração.
     */
    const imagePath = `images/${item.uid}/${item.name}`; //* --> @Construção @do @Caminho @da @Imagem

    const imageRef = ref(storage, imagePath); //* --> @Referência @ao @Objeto @de @Imagem @no @Armazenamento

    try {
      await deleteObject(imageRef); //* --> @Tentativa @de @Deleção @da @Imagem

      setCarImage(carImage.filter((car) => car.url !== item.url)); //* --> @Atualização @do @Estado @e @Feedback @ao @Usuário

      toast.success("Imagem deletada");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Container>
        <DashboardHeader />
        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
          <button className="border-2 rounded-lg w-48 flex justify-center items-center cursor-pointer border-gray-600  h-32 md:w-48">
            <div className="absolute cursor-pointer">
              <FiUpload size={30} color="#000" />
            </div>
            <div className="cursor-pointer after:">
              <input
                type="file"
                accept="image/*"
                className="opacity-0 cursor-pointer"
                onChange={handleFile}
                /**
                 * @function onChange(handleFile)
                 * *O evento onChange={handleFile} está sendo associado ao elemento. Quando um arquivo é selecionado pelo usuário, o evento onChange é acionado e a função handleFile é chamada para lidar com a seleção do arquivo.
                 */
              />
            </div>
          </button>
          {carImage.map((item) => (
            <div
              key={item.name}
              className="w-full h-32 flex items-center justify-center relative"
            >
              <button
                className="absolute"
                onClick={() => handleDeleteImage(item)}
              >
                <FiTrash size={28} color="#fff" />
              </button>
              <img
                src={item.previewUrl}
                alt="imagem do carro"
                className="rounded-lg w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
          <form className="w-full" onSubmit={handleSubmit(onSumbit)}>
            <div className="mb-3">
              <p className="mb-2 font-medium">Nome do Carro</p>
              <Input
                type="text"
                register={register}
                /**
                 * @method register
                 ** A propriedade register={register} está sendo passada para o componente, possivelmente para realizar o registro do campo de entrada no formulário. O register pode ser uma função ou objeto utilizado para gerenciar o estado do formulário.
                 */
                name="name"
                error={errors.name?.message}
                /**
                 * @method error
                 ** A propriedade error={errors.name?.message} pode ser utilizada para exibir mensagens de erro relacionadas ao campo de entrada. Se houver um erro associado ao campo "name", a mensagem de erro será exibida. A notação errors.name?.message indica que estamos verificando se há um erro específico para o campo "name" e, se houver, exibimos a mensagem de erro.
                 */
                placeholder=" EX: Onix 1.0"
              />
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium">Modelo do Carro</p>
              <Input
                type="text"
                register={register}
                name="model"
                error={errors.model?.message}
                placeholder=" EX: 1.0 FLEX PLUS Manual"
              />
            </div>
            <div className="flex w-ful mb-3 flex-row items-center gap-4">
              <div className="w-full">
                <p className="mb-2 font-medium">Ano do Carro</p>
                <Input
                  type="text"
                  register={register}
                  name="year"
                  error={errors.year?.message}
                  placeholder=" EX: 2015/2016"
                />
              </div>
              <div className="w-full">
                <p className="mb-2 font-medium">KM RODADOS</p>
                <Input
                  type="text"
                  register={register}
                  name="km"
                  error={errors.km?.message}
                  placeholder=" EX: 104.000km"
                />
              </div>
            </div>
            <div className="flex w-ful mb-3 flex-row items-center gap-4">
              <div className="w-full">
                <p className="mb-2 font-medium">Telefone / Whatsapp</p>
                <Input
                  type="text"
                  register={register}
                  name="whatsapp"
                  error={errors.whatsapp?.message}
                  placeholder=" EX: 21990352415"
                />
              </div>
              <div className="w-full">
                <p className="mb-2 font-medium">Cidade</p>
                <Input
                  type="text"
                  register={register}
                  name="city"
                  error={errors.city?.message}
                  placeholder=" EX: Rio de Janeiro, RJ"
                />
              </div>
            </div>
            <div className="flex w-ful mb-3 flex-row items-center gap-4">
              <div className="w-full">
                <p className="mb-2 font-medium">Valor do Veículo</p>
                <Input
                  type="text"
                  register={register}
                  name="price"
                  error={errors.price?.message}
                  placeholder="EX: R$ 54.000"
                />
              </div>
              <div className="w-full">
                <p className="mb-2 font-medium">Câmbio</p>
                <Input
                  type="text"
                  register={register}
                  name="cambio"
                  error={errors.cambio?.message}
                  placeholder=" EX: Automático"
                />
              </div>
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium">Descrição</p>
              <textarea
                className="border-2 w-full rounded-md h-24 px-2"
                {...register("description")}
                name="description"
                id="description"
                placeholder="Digite a descrição completa do veículo"
              />
              {errors.description && (
                <p className="mb-1 text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="rounded-md bg-zinc-900 w-full h-10 text-white font-medium"
            >
              Adicionar
            </button>
          </form>
        </div>
      </Container>
    </>
  );
}
