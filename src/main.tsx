import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./App";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthContext";

import { register } from "swiper/element/bundle"; // Importando a função de registro do Swiper que é um biblioteca

register(); // Registrando o Swiper

// Importando os estilos CSS do Swiper e seus componentes
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Toaster } from "react-hot-toast"; // Importando o componente Toaster de react-hot-toast para notificações

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // Renderizando a aplicação na raiz do documento HTML
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={
        false
      } /* Componente Toaster para exibir notificações na parte superior direita */
    />
    <AuthProvider /* Provedor de autenticação envolvendo o provedor de roteamento - Context API */
    >
      <RouterProvider router={router} /* Roteador da aplicação */ />
    </AuthProvider>
  </React.StrictMode>
);
