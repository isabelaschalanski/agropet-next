# 🐾 AgroPet

Pet shop e agropecuária online, feito como trabalho acadêmico do curso de Ciência da Computação da URI – Santo Ângelo.

O site tem três partes principais:

- **Loja** – venda avulsa de produtos, organizada por tipo de animal (Cães, Gatos, Outros Pets e animais agro), com filtros na lateral.
- **Clube AgroPet** – assinatura mensal de rações, com planos Básico e Premium e descontos e benefícios para os assinantes.
- **Banho e Tosa** – agendamento online para cães e gatos, com escolha de serviço, adicionais, data e horário.

Além disso, existe uma **área de administração**, separada da loja. Nela é possível gerenciar produtos, pedidos, agendamentos, clientes, assinaturas e as imagens do site.

---

## 🛠️ Tecnologias

| Parte | Tecnologia |
|---|---|
| Framework (front e back) | [Next.js](https://nextjs.org) |
| Banco de dados | SQLite |
| Acesso ao banco | [Prisma](https://www.prisma.io) |
| Linguagem | JavaScript |
| Estilo | CSS |

---

## 🚀 Como rodar o projeto

Antes, instale o [Node.js](https://nodejs.org) (versão LTS) e o [Git](https://git-scm.com).

**1. Baixe o projeto**

```bash
git clone https://github.com/isabelaschalanski/agropet-next.git
cd agropet-next
```

**2. Instale as dependências**

```bash
npm install
```

**3. Crie o arquivo `.env`**

Crie um arquivo chamado `.env` na pasta principal do projeto, com esta linha:

```
DATABASE_URL="file:./dev.db"
```

**4. Crie o banco e coloque os dados iniciais**

```bash
npx prisma db push
node prisma/seed.mjs
```

**5. Rode o site**

```bash
npm run dev
```

Abra **http://localhost:3000** no navegador.

> Para voltar o banco ao estado inicial, rode de novo `node prisma/seed.mjs`.

---

## 👤 Usuários de teste

| Tipo | Usuário | Senha |
|---|---|---|
| Administrador | `admin` | `123` |
| Cliente (assinante Premium) | `maria@email.com` | `123` |
| Cliente | `joao@email.com` | `123` |

---

## 📁 Estrutura das pastas

```
agropet-next/
├── app/
│   ├── page.js          → página do site
│   ├── layout.js        → estrutura geral (HTML)
│   ├── globals.css      → estilos
│   └── api/             → back-end (rotas da API)
├── lib/                 → regras de negócio, login e banco
├── prisma/
│   ├── schema.prisma    → tabelas do banco
│   ├── seed.mjs         → dados iniciais
│   └── dados.json       → catálogo de produtos
├── public/
│   ├── app.js           → funcionamento do site (front-end)
│   ├── img/             → imagens dos banners
│   └── teste-api.html   → página de testes da API
└── API.md               → documentação das rotas da API
```

Os testes da API ficam em **http://localhost:3000/teste-api.html** (com o site rodando).

---

## 🤝 Trabalhando em equipe

Antes de começar a mexer, pegue o que os outros enviaram:

```bash
git pull
```

Depois de fazer suas mudanças:

```bash
git add .
git commit -m "descreva o que mudou"
git push
```

⚠️ **Não envie** o arquivo `.env` nem o `prisma/dev.db`. Cada pessoa tem os seus, e o `.gitignore` já cuida disso.
