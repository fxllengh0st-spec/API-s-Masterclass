
export interface TermDefinition {
  title: string;
  definition: string;
}

export const GLOSSARY: Record<string, { en: TermDefinition; pt: TermDefinition }> = {
  'api': {
    en: { title: 'API', definition: 'Application Programming Interface. A set of rules that allows different software applications to communicate with each other.' },
    pt: { title: 'API', definition: 'Interface de Programação de Aplicações. Um conjunto de regras que permite que diferentes aplicativos de software se comuniquem entre si.' }
  },
  'restful': {
    en: { title: 'RESTful', definition: 'An architectural style for APIs that uses standard HTTP methods (GET, POST, etc.) to manipulate resources represented as URIs.' },
    pt: { title: 'RESTful', definition: 'Um estilo de arquitetura para APIs que utiliza métodos HTTP padrão (GET, POST, etc.) para manipular recursos representados como URIs.' }
  },
  'proxy': {
    en: { title: 'Proxy', definition: 'A server that acts as an intermediary for requests from clients seeking resources from other servers.' },
    pt: { title: 'Proxy', definition: 'Um servidor que atua como intermediário para requisições de clientes que buscam recursos de outros servidores.' }
  },
  'cors': {
    en: { title: 'CORS', definition: 'Cross-Origin Resource Sharing. A browser security feature that restricts web pages from making requests to a different domain than the one that served the web page.' },
    pt: { title: 'CORS', definition: 'Compartilhamento de Recursos de Origem Cruzada. Uma segurança do navegador que restringe páginas web de fazerem requisições para domínios diferentes.' }
  },
  'json': {
    en: { title: 'JSON', definition: 'JavaScript Object Notation. A lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse.' },
    pt: { title: 'JSON', definition: 'Notação de Objetos JavaScript. Um formato leve de troca de dados que é fácil para humanos lerem e fácil para máquinas processarem.' }
  },
  'endpoint': {
    en: { title: 'Endpoint', definition: 'The specific URL path where an API can be accessed to retrieve or send data.' },
    pt: { title: 'Endpoint', definition: 'O caminho de URL específico onde uma API pode ser acessada para recuperar ou enviar dados.' }
  },
  'sandbox': {
    en: { title: 'Sandbox', definition: 'An isolated testing environment that enables users to run programs or execute files without affecting the application or production data.' },
    pt: { title: 'Sandbox', definition: 'Um ambiente de teste isolado que permite executar programas sem afetar a aplicação ou os dados de produção.' }
  },
  'mock': {
    en: { title: 'Mock', definition: 'A simulated version of an API response used for testing when the real service is unavailable or to avoid costs/side effects.' },
    pt: { title: 'Simulação (Mock)', definition: 'Uma versão simulada de uma resposta de API usada para testes quando o serviço real não está disponível.' }
  },
  'http': {
    en: { title: 'HTTP', definition: 'Hypertext Transfer Protocol. The foundation of any data exchange on the Web and a protocol used for transmitting hypermedia documents.' },
    pt: { title: 'HTTP', definition: 'Protocolo de Transferência de Hipertexto. A base de qualquer troca de dados na Web.' }
  },
  'backend': {
    en: { title: 'Backend', definition: 'The server-side of an application that handles logic, database interactions, and server-side functions.' },
    pt: { title: 'Backend', definition: 'O lado do servidor de uma aplicação que lida com lógica, banco de dados e funções internas.' }
  },
  'frontend': {
    en: { title: 'Frontend', definition: 'The client-side of an application that users interact with directly (the interface, buttons, and visuals).' },
    pt: { title: 'Frontend', definition: 'O lado do cliente de uma aplicação com o qual os usuários interagem diretamente (interface, botões).' }
  },
  'fetch': {
    en: { title: 'Fetch', definition: 'A modern JavaScript method used to make network requests to servers (like calling an API).' },
    pt: { title: 'Fetch', definition: 'Um método moderno do JavaScript usado para fazer requisições de rede (como chamar uma API).' }
  }
};
