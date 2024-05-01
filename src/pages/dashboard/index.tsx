import { FiTrash2 } from "react-icons/fi";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

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

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]); //* Interface importada de home
  const [loadingImages, setLoadingImages] = useState<string[]>([]);

  const { user } = useContext(AuthContext); //* chamando o contextAPi

  useEffect(() => {
    if (!user?.uid) {
      //*Evitar que tente buscar algo caso não tenha o uid do usuário
      return;
    }
    loadCars(); //* chamando função
  }, [user]); //* O id precisa ficar sendo verificado pois os detalhes vão determinados a partir que o id chegar e ou mudar,

  function loadCars() {
    const carsRef = collection(db, "cars"); //* acessando a coleção usando o db como referencia de banco de dados e o (cars) como coleção
    const queryRef = query(carsRef, where("uid", "==", user?.uid)); //* se o uid cadastrado no cars for igual ao que vem do context api user.uid então fica armazenado dentro desta variavel queryREf

    getDocs(queryRef).then((snapshot) => {
      //* usamos o getDocs para pegar esse acesso
      let listCars = [] as CarsProps[]; //* criamos uma lista de objetos para receber os dados e tipamos como CarsProps pois irá receber a mesma quantidade de itens

      snapshot.forEach((doc) => {
        //* usamos neste caso o foreach para percorrer todo o array
        listCars.push({
          //* .push para adicionar ao listCars e abrindo {} para receber o objeto
          id: doc?.id,
          uid: doc.data()?.uid,
          name: doc.data()?.name,
          model: doc.data()?.model,
          year: doc.data()?.year,
          price: doc.data()?.price,
          city: doc.data()?.city,
          km: doc.data()?.km,
          image: doc.data()?.images,
          cambio: doc.data()?.cambio,
        });
      });

      setCars(listCars); //* enviando para useState
    });
  }

  async function handleDeleteCar(id: string) {
    //*esperamos receber algo que era o id do item
    const docRef = doc(db, "cars", id); //* armazenado dentro do dodRef o documento que vem do id direto do db no firebase
    await deleteDoc(docRef); //* uma promise e o deleteDoc usa o que foi armazenado no docRed para apagar o db no firebase o item clicado
    setCars(cars.filter((car) => car.id !== id)); //* usamos o filter para percorrer o array de cars e separar o que for diferente e excluir da tela. Nesta operação o filter retorna para o State todos os items que são iguais (car.id for igual ao id) e o que for diferente é excluir da tela
    toast.success("Carro deletado com sucesso!");
    console.log(id);
  }

  function handleImageLoad(id: string) {
    setLoadingImages([...loadingImages, id]); //* para evitar o delay na tela na hora da exibição da imagem nos usamos uma state e estão função que recebe tudo o que há dentro da usaState e mais o id que é enviando pelo style da img
  }

  return (
    <>
      <Container>
        <DashboardHeader />
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <section
              key={car.id}
              className="w-full bg-white rounded-lg relative"
            >
              <button
                onClick={() => handleDeleteCar(car.id)} //*função para deletar item dá mesma maneira que usamos o id para encontrar todos os itens do objeto carro tambem usamos para buscar todo o item e apagado do banco e da tela
                className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow "
              >
                <FiTrash2 size={26} color="#000" />
              </button>
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadingImages.includes(car.id) ? "none" : "block", //* usamos o .includes para verificar se ha incluso na state o car.id e se sim então a image recebe um display none caso não então é o block... Em caso de none ele mostra na dela a div com os parametros da class name dela
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 max-h-70"
                src={car.image[0].url}
                alt="imagem carro"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadingImages.includes(car.id) ? "block" : "none", //* usamos o .includes para verificar se ha incluso na state o car.id e se sim então a image recebe um display block caso não então é o none
                }}
              />
              <p className="font-bold mb-2 mt-1 px-2">{car.name}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">
                  Ano {car.year} | {car.km} {car.cambio}
                </span>

                <strong className="text-black font-medium text-xl">
                  R${" "}
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
      </Container>
    </>
  );
}
