# API Masterclass

Uma plataforma interativa e didática para aprender integração de APIs na prática. O projeto inclui um diretório de 20 APIs públicas, um sandbox para testes em tempo real, um tutorial passo-a-passo e um **Tutor IA** integrado (Powered by Google Gemini).

## 🛠 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   npm (geralmente vem com o Node.js) ou yarn

## 🚀 Como rodar localmente

1.  **Clone o repositório** (se baixou os arquivos, pule para o passo 2).

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure a Chave da API (Gemini)**:
    *   Crie um arquivo `.env` na raiz do projeto.
    *   Adicione sua chave da API do Google Gemini:
    ```env
    API_KEY=sua_chave_aqui_AIzaSy...
    ```
    > **Nota:** Sem essa chave, o Tutor IA não funcionará, mas o restante do site sim.

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
5.  Abra o navegador no link exibido (geralmente `http://localhost:5173`).

## 📦 Deploy na Vercel

Este projeto está configurado para ser implantado facilmente na Vercel.

1.  Faça o push do código para um repositório no **GitHub**.
2.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard) e clique em **"Add New..."** -> **"Project"**.
3.  Importe o seu repositório do GitHub.
4.  Nas configurações de deploy (**Configure Project**):
    *   **Framework Preset:** Vite
    *   **Root Directory:** `./` (deixe padrão)
5.  **Environment Variables** (Importante):
    *   Adicione uma variável chamada `API_KEY`.
    *   Cole sua chave do Google Gemini AI Studio como valor.
6.  Clique em **Deploy**.

## 🧩 Estrutura do Projeto

*   **`/components`**: Componentes reutilizáveis (Layout, ApiPreview, AiTutor).
*   **`/pages`**: Páginas principais (Home, Tutorial, ApiGuide).
*   **`/services`**: Lógica de execução das APIs (`apiRunner.ts`).
*   **`/utils`**: Traduções e utilitários.
*   **`/context`**: Gerenciamento de estado global (Tema, Idioma).

## ⚠️ Observações Técnicas

*   **Estilização:** O projeto utiliza Tailwind CSS via CDN no `index.html` para simplicidade neste ambiente, mas a estrutura React suporta importação de CSS padrão.
*   **Roteamento:** Foi implementado um `HashRouter` leve personalizado (`App.tsx`) para garantir compatibilidade total sem depender de configurações complexas de servidor para Single Page Applications (SPA).

---
Desenvolvido com React, TypeScript, Vite e Google Gemini API.