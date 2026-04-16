# OR Agenda React

Front-end web da **OR Agenda**, desenvolvido em **React** com **TypeScript** e **Vite**, voltado para o fluxo público de agendamento online.

A aplicação consome a API da plataforma para exibir a página de agendamento de cada estabelecimento a partir de uma rota pública com **slug**, permitindo que o cliente escolha um serviço e inicie o processo de marcação de horário de forma simples e direta.

## Demonstração

Página publicada de exemplo:

**João Studio**  
https://olive-lion-189528.hostingersite.com/agendar/joao-studio

Exemplo de rota pública:

```bash
/agendar/joao-studio
```

## Sobre o projeto

Este repositório representa a camada de interface da OR Agenda para o agendamento público. Pelo material enviado, o fluxo atual foi estruturado para oferecer uma experiência clara para o cliente final, com foco em:

- identificação visual do estabelecimento
- início rápido do atendimento
- seleção de serviço
- interface objetiva e responsiva
- integração com a API de agendamentos

A implementação exibida no link usa o estabelecimento **João Studio** como exemplo real de publicação.

## Funcionalidades

- Página pública de agendamento por slug
- Interface amigável para início do atendimento
- Exibição de identidade visual do estabelecimento
- Seleção de serviços disponíveis
- Estrutura pronta para integração com a API da OR Agenda
- Configuração por variáveis de ambiente
- Build otimizada para produção

## Tecnologias utilizadas

Com base na estrutura do repositório, o projeto foi desenvolvido com:

- **React**
- **TypeScript**
- **Vite**
- **ESLint**
- **Variáveis de ambiente com `.env`**

## Estrutura do repositório

A estrutura principal apresentada no repositório é a seguinte:

```bash
.
├── public/
├── src/
├── .env
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Organização geral

- `public/`: arquivos estáticos
- `src/`: componentes, páginas, serviços, hooks e demais arquivos da aplicação
- `.env`: variáveis de ambiente
- `vite.config.ts`: configuração do Vite
- `eslint.config.js`: regras de lint

## Como executar o projeto localmente

> Como o conteúdo completo do `package.json` não foi aberto aqui, os comandos abaixo seguem o padrão mais comum para projetos em **Vite + React + TypeScript**.

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o arquivo `.env`

Exemplo:

```env
VITE_API_URL=http://localhost:8000/api
```

> Ajuste a URL conforme o endereço da sua API.

### 4. Executar em ambiente de desenvolvimento

```bash
npm run dev
```

### 5. Gerar build de produção

```bash
npm run build
```

## Integração com a API

O front-end foi pensado para funcionar em conjunto com a **API da OR Agenda**, centralizando no back-end as regras de negócio relacionadas aos agendamentos.

Entre os dados que normalmente podem ser carregados pela API, estão:

- dados públicos do estabelecimento
- serviços disponíveis
- horários e datas disponíveis
- informações do profissional ou empresa
- criação de novos agendamentos
- validações de disponibilidade

## Publicação

Como o projeto já foi publicado em ambiente de hospedagem compartilhada, o fluxo de deploy pode seguir um formato simples:

### Build

```bash
npm run build
```

### Upload

Após a build, envie o conteúdo da pasta `dist/` para a hospedagem.

### Suporte a rotas do React

Se a aplicação utilizar rotas internas no front-end, pode ser necessário adicionar um `.htaccess` para evitar erro 404 ao recarregar a página.

Exemplo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Observação

Se o projeto for publicado em subpasta, como por exemplo:

```bash
/agendar/
```

pode ser necessário ajustar:

- o `base` no `vite.config.ts`
- o `RewriteBase` no `.htaccess`
- os caminhos de assets
- a URL base da API no `.env`


## Autor

Desenvolvido por **Jonas Ferreira**.
