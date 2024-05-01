import { ReactNode } from "react";

// Interface que define as propriedades esperadas pelo componente Container
interface ContainerProps {
  children: ReactNode; // Prop children do tipo ReactNode
}

// Componente funcional Container que recebe as propriedades definidas na interface ContainerProps
export function Container({ children }: ContainerProps) {
  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4">{children}</div>{" "}
      {/* Div que renderiza os children dentro */}
    </>
  );
}

/**
 * *!Important*
 * TODO:Em resumo, o componente Container é responsável por renderizar um <div> com largura máxima de 7xl, centralizado na página e com um padding de 4. Ele recebe outros componentes ou elementos React como filhos e os renderiza dentro deste <div>. Isso é útil para criar um layout de contêiner reutilizável em diferentes partes da aplicação.
 */
