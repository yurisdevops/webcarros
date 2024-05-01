import { Container } from "../../components/container";
import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

//* Definição das interfaces para representar os dados dos carros e das imagens
export interface CarsProps {
  id: string;
  uid: string;
  name: string;
  model: string;
  year: number;
  price: number | string;
  city: string;
  km: string;
  image: CarImageProps[];
  cambio: string;
}

export interface CarImageProps {
  uid: string;
  name: string;
  url: string;
}

//* Componente funcional Home
export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]); //* Estado para armazenar os carros
  const [loading, setLoading] = useState<string[]>([]); //* Estado para controlar o carregamento das imagens
  const [input, setInput] = useState(""); //* Estado para armazenar o valor do input de busca

  useEffect(() => {
    loadCars(); //* Carrega os carros ao montar o componente
  }, []);

  //* Função para carregar os carros do banco de dados
  function loadCars() {
    /**
     * *!Important*
     * TODO:Em resumo, esse trecho de código realiza uma operação assíncrona para obter os documentos de uma coleção no Firestore, itera sobre esses documentos, extrai os dados relevantes de cada um, cria objetos de carros e atualiza o estado cars com a lista de carros obtida. Isso permite exibir os carros correspondentes na interface da sua aplicação.
     */
    /**
     * @carsRef
      **const carsRef = collection(db, "cars");:

       ** Nesta linha, estamos criando uma referência à coleção "cars" no Firestore.
       ** O parâmetro db representa a instância do Firestore que foi importada do arquivo de conexão com o Firebase.
       **  A função collection() recebe dois argumentos: a instância do Firestore (db) e o nome da coleção que queremos acessar, neste caso, "cars".
       ** Dessa forma, carsRef se torna uma referência à coleção de carros no Firestore.

        @queryRef       
       ** const queryRef = query(carsRef, orderBy("createdAt", "desc"));:

       ** Nesta linha, estamos criando uma consulta para ordenar os documentos da coleção "cars" por um campo específico, neste caso, "createdAt", em ordem descendente.
       ** A função query() recebe dois argumentos: a referência à coleção de carros (carsRef) e a operação de ordenação que desejamos aplicar.
       ** A função orderBy() indica que queremos ordenar os documentos com base no campo "createdAt" (que provavelmente representa a data de criação) e em ordem descendente (do mais recente para o mais antigo).
       ** Portanto, queryRef se torna a consulta que será realizada para obter os documentos da coleção "cars" ordenados pela data de criação de forma descendente.
     */
    const carsRef = collection(db, "cars"); //* --> @carsRef
    const queryRef = query(carsRef, orderBy("createdAt", "desc")); //* --> @queryRef

    getDocs(queryRef).then((snapshot) => {
      /**
         * @firebase getDocs
         ** getDocs() é um método utilizado para obter os documentos de uma coleção ou de uma consulta no Firestore.
        ** queryRef provavelmente é uma referência à consulta que foi criada anteriormente para buscar carros com base em determinados critérios.
        
        * @then snapshot
        ** O método then() é usado para lidar com a resolução da promessa retornada por getDocs(), ou seja, quando os documentos são obtidos com sucesso.
        ** O parâmetro snapshot é o objeto que contém os documentos retornados pela consulta.
       */
      let listCars = [] as CarsProps[];
      /**
         @let listCars
          ** Uma lista vazia chamada listCars é inicializada para armazenar os carros que serão obtidos da consulta.
          ** A lista é tipada como um array de objetos do tipo CarsProps, que provavelmente é a interface que define a estrutura de um carro na sua aplicação.
      */

      snapshot.forEach((doc) => {
        /**
         *TODO: querySnapshot.forEach
         ** Para cada documento retornado na consulta (representado por doc), o código dentro da função de callback forEach() será executado.
         **Os dados relevantes de cada documento, como ID, nome, modelo, ano, preço, cidade, quilometragem e imagem, são extraídos utilizando doc.data() e adicionados a um novo objeto de carro.
         */

        listCars.push({
          /**
           * @let listCars.push
           ** Para cada documento, um novo objeto de carro é criado com os dados extraídos do documento e é adicionado à lista listCars utilizando o método push().
           */
          id: doc.id,
          uid: doc.data().uid,
          name: doc.data().name,
          model: doc.data().model,
          year: doc.data().year,
          price: doc.data().price,
          city: doc.data().city,
          km: doc.data().km,
          image: doc.data().images,
          cambio: doc.data().cambio,
        });
      });

      setCars(listCars);
      /**
       * TODO: setCars
       ** Após percorrer todos os documentos e adicionar os carros à lista listCars, o estado cars é atualizado com essa lista de carros.
       ** Isso fará com que a interface da aplicação seja atualizada para exibir os carros obtidos da consulta.
       */
    });
  }

  // Função para marcar o carregamento de uma imagem
  function handleImageLoad(id: string) {
    /**
     * *!Important*
     * TODO: Em resumo, a função handleImageLoad é responsável por adicionar um novo id ao estado loading, indicando que a imagem correspondente a esse id está sendo carregada. Isso pode ser útil para exibir um indicador de carregamento na interface enquanto a imagem está sendo carregada.
     */
    /**
     * @function handleImageLoad
     ** Aqui estamos definindo uma função chamada handleImageLoad que recebe um parâmetro id do tipo string.
     ** Essa função provavelmente é responsável por lidar com o carregamento de uma imagem específica identificada pelo id.
     */
    setLoading([...loading, id]);
    /**
     * @useState setLoading
     **  Dentro da função, estamos atualizando o estado loading com um novo array que inclui o id recebido como parâmetro.
     **  O operador spread ... é utilizado para criar uma cópia do array loading existente e adicionar o novo id ao final desse array.
     **  Essa abordagem de atualização do estado é comum em aplicações React para garantir a imutabilidade dos estados.
     */
  }

  // Função assíncrona para buscar carros com base no input de busca
  async function handleSearchCar() {
    /**
     * *!Important*
     *TODO: Em resumo, esse trecho de código realiza uma consulta no Firestore para buscar carros com base no nome, itera sobre os documentos retornados, extrai os dados relevantes de cada documento e atualiza o estado cars com a lista de carros obtida. Isso permite exibir os carros correspondentes na interface da sua aplicação.
     */
    if (input === "") {
      loadCars(); //* Se o input estiver vazio, e clicarmos no button ele carrega todos os carros
      return;
    }

    setCars([]); // Limpa a lista de carros
    setLoading([]); // Limpa o estado de carregamento

    const q = query(
      /**
       * @const q
       ** Aqui estamos criando uma consulta q para a coleção "cars" no Firestore.
       ** A função query() é utilizada para criar uma consulta composta, que pode incluir filtros, ordenação e outras operações.
       ** Estamos filtrando os carros com base no nome, buscando por nomes que comecem com o valor do input em caixa alta e que terminem com o valor do input em caixa alta, utilizando os operadores >= e <= respectivamente. Isso permite buscar por nomes que contenham o valor do input em qualquer parte do nome.
       */

      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()), // Busca por nomes que comecem com o valor do input em caixa alta
      where("name", "<=", input.toUpperCase() + "\uf8ff") // Busca por nomes que terminem com o valor do input em caixa alta
    );
    const querySnapshot = await getDocs(q);
    /**
     * @const querySnapshot
     ** Em seguida, estamos executando a consulta q utilizando getDocs(q) para obter um querySnapshot que contém os documentos que correspondem à consulta.
     ** O uso da palavra-chave await indica que essa operação é assíncrona e estamos aguardando a resolução da promessa retornada por getDocs(q).
     */

    let listCars = [] as CarsProps[];
    /**
       @let listCars
        ** Uma lista vazia chamada listCars é inicializada para armazenar os carros que serão obtidos da consulta.
        ** A lista é tipada como um array de objetos do tipo CarsProps, que provavelmente é a interface que define a estrutura de um carro na sua aplicação.
    */

    querySnapshot.forEach((doc) => {
      /**
       *TODO: querySnapshot.forEach
       ** Para cada documento retornado na consulta (representado por doc), o código dentro da função de callback forEach() será executado.
       **Os dados relevantes de cada documento, como ID, nome, modelo, ano, preço, cidade, quilometragem e imagem, são extraídos utilizando doc.data() e adicionados a um novo objeto de carro.
       */
      listCars.push({
        /**
         * @let listCars.push
         ** Para cada documento, um novo objeto de carro é criado com os dados extraídos do documento e é adicionado à lista listCars utilizando o método push().
         */
        id: doc.id,
        uid: doc.data().uid,
        name: doc.data().name,
        model: doc.data().model,
        year: doc.data().year,
        price: doc.data().price,
        city: doc.data().city,
        km: doc.data().km,
        image: doc.data().images,
        cambio: doc.data().cambio,
      });
    });
    setCars(listCars);
    /**
     * TODO: setCars
     ** Após percorrer todos os documentos e adicionar os carros à lista listCars, o estado cars é atualizado com essa lista de carros.
     ** Isso fará com que a interface da aplicação seja atualizada para exibir os carros obtidos da consulta.
     */
  }

  return (
    <>
      <Container>
        <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
          <input
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
            placeholder=" Digite o nome do carro"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSearchCar}
            className="bg-red-500 h-9 px-8 rounded-lg font-medium text-lg text-white"
          >
            Buscar
          </button>
        </section>
        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Carros Novos e usados de todo o Brasil
        </h1>
        <div>
          <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {cars.map((car) => (
              <section key={car.id} className="w-full bg-white rounded-lg mb-6">
                <Link to={`/car/${car.id}`}>
                  <div
                    className="w-full h-72 rounded-lg bg-slate-200"
                    style={{
                      display: loading.includes(car.id) ? "none" : "block",
                      /**
                       * !O estilo inline display: loading.includes(car.id) ? "none" : "block" controla a exibição do elemento com base na presença do car.id no array loading. Se o car.id estiver no array loading, o elemento será ocultado (display: none), caso contrário, será exibido (display: block).
                       */
                      /**
                       * @condicional
                       ** Em resumo, esses elementos <div> e <img> são utilizados para exibir uma imagem de um carro na interface da aplicação, controlando a exibição com base no estado de carregamento das imagens.  O <div> é exibido enquanto a imagem está sendo carregada, e a <img> é exibida após o carregamento da imagem, permitindo uma transição suave na interface.
                       */
                    }}
                  ></div>
                  <img
                    className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 duration-500"
                    src={car.image[0].url}
                    alt="imagem do carro"
                    onLoad={() => handleImageLoad(car.id)}
                    style={{
                      display: loading.includes(car.id) ? "block" : "none",
                      /**
                       * !O estilo inline display: loading.includes(car.id) ? "block" : "none" controla a exibição da imagem com base na presença do car.id no array loading. Se o car.id estiver no array loading, a imagem será exibida (display: block), caso contrário, será ocultada (display: none).
                       */
                    }}
                  />
                </Link>
                <p className="font-bold mb-2 mt-1 px-2">{car.name}</p>
                <div className="flex flex-col px-2">
                  <span className="text-zinc-700 mb-2">
                    Ano {car.year} | {car.km}
                  </span>
                  <span className="mb-4 text-zinc-700">
                    {car.cambio}
                  </span>
                  <strong className="text-black font-medium text-xl">
                    {car.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </div>
                <div className="w-full bg-slate-200 h-px my-2"></div>
                <div className="px-2 mb-2">
                  <span className="text-zinc-700">{car.city}</span>
                </div>
              </section>
            ))}
          </main>
        </div>
      </Container>
    </>
  );
}
