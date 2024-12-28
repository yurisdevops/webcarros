# WebCarros

> Plataforma web para compra e venda de veículos, inspirada no WebMotors.

O **WebCarros** é uma aplicação moderna que conecta compradores e vendedores de veículos de forma simples e eficiente. Desenvolvido com foco na experiência do usuário, o projeto oferece recursos avançados e uma interface amigável.

## Índice

- [Descrição do Projeto](#descrição-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Futuras Implementações](#futuras-implementações)
- [Contato](#contato)

## Descrição do Projeto

O **WebCarros** é uma aplicação que facilita a compra e venda de veículos por meio de uma interface intuitiva e responsiva. A plataforma permite:

- Navegar por uma lista de veículos disponíveis.
- Realizar cadastros e logins com autenticação segura.
- Validar dados de forma precisa ao cadastrar novos veículos ou usuários.

## Funcionalidades

- **Listagem de Veículos:** Visualize informações detalhadas sobre veículos disponíveis para compra.
- **Autenticação de Usuários:** Cadastro e login com autenticação via Firebase.
- **Validação de Formulários:** Garantia de dados consistentes usando **Zod**.
- **Notificações Elegantes:** Feedback visual com **React Toastify**.
- **Interface Responsiva:** Navegação otimizada para dispositivos móveis e desktops.

## Tecnologias Utilizadas

- **Vite:** Build rápido e eficiente para aplicações modernas.
- **React:** Biblioteca para construção de interfaces dinâmicas.
- **TypeScript:** Superset do JavaScript com tipagem estática.
- **Zod:** Biblioteca para validação de dados.
- **Firebase:** Autenticação e banco de dados em tempo real.
- **React Toastify:** Exibição de notificações interativas.

## Como Usar

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/webcarros.git
cd webcarros
```

### 2. Instalar Dependências

Com `npm`:

```bash
npm install
```

Com `yarn`:

```bash
yarn install
```

### 3. Configurar o Firebase

- Crie um projeto no [Firebase](https://firebase.google.com/).
- Adicione as credenciais no arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=SEU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=SEU_APP_ID
```

### 4. Executar o Projeto

Com `npm`:

```bash
npm run dev
```

Com `yarn`:

```bash
yarn dev
```

Acesse a aplicação no navegador: `http://localhost:5173`.

## Scripts Disponíveis

- **`npm run dev`**: Inicia o servidor de desenvolvimento.
- **`npm run build`**: Gera os arquivos para produção.
- **`npm run preview`**: Visualiza a aplicação após o build.

## Estrutura do Projeto

- **`src/components`**: Componentes reutilizáveis.
- **`src/pages`**: Páginas principais da aplicação.
- **`src/services`**: Configuração de serviços externos (ex.: Firebase).
- **`src/styles`**: Estilos globais e específicos.
- **`src/utils`**: Funções utilitárias.

## Futuras Implementações

- **Filtros Avançados:** Busque veículos por preço, marca, modelo, etc.
- **Integração com APIs de Preços:** Avaliação automática do valor de mercado.
- **Sistema de Chat:** Comunicação entre compradores e vendedores.

## Contato

Desenvolvido por [Yuri Souza](https://github.com/yuridevops). Entre em contato para dúvidas ou sugestões!

---

### 🚗 **Encontre ou venda seu carro ideal no WebCarros!**
```
