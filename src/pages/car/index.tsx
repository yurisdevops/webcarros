import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "../../services/firebaseConnection";
import { getDoc, doc } from "firebase/firestore";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react"; //*Biblioteca de carrossel de imagens

interface CarProps {
  //*Interface dos objetos do carros
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesCarProps[];
  fuel: string;
  transmission: string;
  color: string;
  plate: string;
}

interface ImagesCarProps {
  //* interface dos objetos das imagens
  uid: string;
  name: string;
  url: string;
}

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();
  const [slidePerView, setSlidePerView] = useState<number>(2); //* Valor definido para a quantidade de imagens que irão ser exibir no carrossel
  const navigate = useNavigate();

  useEffect(() => {
    loadCarDetails(); //* Chamando a função dentro do useEffect para carregar todos os dados e imagens dos carros da main da pagina
  }, [id]); //* O id precisa ficar sendo vericado pois os detalhes vão determinados a partir que o id chegar e ou mudar,

  async function loadCarDetails() {
    if (!id) {
      //*Faz a checagem se há algum id chegando e caso não haja a função não inicia
      return;
    }

    const docRef = doc(db, "cars", id); //* uso o doc e dentro a referencia do banco de dados (db), depois a coleção que é a (cars) e por ultimo a partir de qual obejto irei buscar os dados, que é o (id) vindo do params
    getDoc(docRef).then((snapshot) => {
      //* envio tudo para o getDocs e como ele é uma promessa precimos do .then
      if (!snapshot.data()) {
        //* checagem se algo dentro do data que é o que buscou acima na variavel docRef e caso não haja nada ele retorna para a page home
        navigate("/");
      }

      setCar({
        //* Mas caso haja algo em data então ele envia para o serCar os dados dentro de outro itens
        id: snapshot.id,
        name: snapshot.data()?.name,
        year: snapshot.data()?.year,
        city: snapshot.data()?.city,
        model: snapshot.data()?.model,
        uid: snapshot.data()?.uid,
        description: snapshot.data()?.description,
        created: snapshot.data()?.created,
        whatsapp: snapshot.data()?.whatsapp,
        price: snapshot.data()?.price,
        km: snapshot.data()?.km,
        owner: snapshot.data()?.owner,
        images: snapshot.data()?.images,
        transmission: snapshot.data()?.transmission,
        fuel: snapshot.data()?.fuel,
        color: snapshot.data()?.color,
        plate: snapshot.data()?.plate,
      });
    });
  }

  useEffect(() => {
    handleResize(); //* chamando a função que faz a checagem do tamanho de tela

    window.addEventListener("resize", handleResize); //* quando haver a mudança do tamanho de tela para menor de 720px a função é chamada

    return () => {
      window.removeEventListener("resize", handleResize); //* quando haver a mudança do tamanho de tela para maior de 720px a função é chamada novamente
    };

    function handleResize() {
      if (window.innerWidth < 720) {
        //*Se o tamanho da tela for menor que 720px então só vai exibir uma imagem
        setSlidePerView(1);
      } else {
        //* Se for maior então volta ao valor original de 2 que está predefinido na usestate
        setSlidePerView(2);
      }
    }
  }, []);

  return (
    <>
      <Container>
        {" "}
        {/*Foi pré definido como compoenente com o layout principal de todas aspaginas*/}
        {car && (
          /*condicional para exibir somento quando houver algo dentro do usestate car*/ <Swiper /* Biblioteca de carrossel*/
            slidesPerView={slidePerView}
            pagination={{ clickable: true }}
            navigation
          >
            {car?.images.map(
              (
                image /* percorrendo o map dentro do objeto images para exibir todas as imagens que foram armazenadas no firebase*/
              ) => (
                <SwiperSlide key={image.uid} /* Tipo de carrossel utilizado*/>
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
        {car /*condicional para exibir somento quando houver algo dentro do usestate car*/ && (
          <main className="bg-white w-full rounded-lg p-6 my-4">
            <div className=" mb-4 w-full flex flex-col  justify-between items-center sm:flex-row">
              <h1 className="font-bold sm:text-3xl text-black text-2xl mb-4">
                {car?.name}
              </h1>
              <h1 className="font-bold sm:text-3xl text-black text-lg">
                {car?.price}{" "}
              </h1>
            </div>
            <div className="flex flex-col gap-8 mb-4">
              <div>
                <p className="text-zinc-500">Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div className="flex flex-row gap-8">
                <div>
                  <p className="text-zinc-500">Ano</p>
                  <strong>{car?.year}</strong>
                </div>
                <div className="mb-2">
                  <p className="text-zinc-500">KM</p>
                  <strong>{car?.km} </strong>
                </div>
                <div className="mb-2">
                  <p className="text-zinc-500">Câmbio</p>
                  <strong>{car?.transmission} </strong>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div>
                  <p className="text-zinc-500">Combustível</p>
                  <strong>{car?.fuel}</strong>
                </div>
                <div className="mb-2">
                  <p className="text-zinc-500">Final da Placa</p>
                  <strong>{car?.plate} </strong>
                </div>
                <div className="mb-2">
                  <p className="text-zinc-500">Cor</p>
                  <strong>{car?.color} </strong>
                </div>
              </div>
            </div>
            <div className="mb-4">
              {" "}
              <strong>Descrição</strong>
              <p className="text-xs">{car?.description}</p>
            </div>

            <div className="mb-4">
              <strong>Telefone / Whatsapp</strong>
              <p>{car?.whatsapp}</p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-emerald-500 w-full h-10 rounded-lg text-white font-bold hover:bg-emerald-600 cursor-pointer">
              <a
                href={`https://api.whatsapp.com/send?phone=+55${car?.whatsapp}&text=Olá vi o anuncio do ${car?.name} no WebCarros e fiquei interessado.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Fale com o proprietário
              </a>

              <FaWhatsapp size={28} color="#fff" />
            </div>
          </main>
        )}
      </Container>
    </>
  );
}
