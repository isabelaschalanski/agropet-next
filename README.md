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
| Banco de dados | PostgreSQL no [Supabase](https://supabase.com) |
| Acesso ao banco | [Prisma](https://www.prisma.io) |
| Linguagem | JavaScript |
| Estilo | CSS |
| Hospedagem | [Vercel](https://vercel.com) |

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

Crie um arquivo chamado `.env` na pasta principal do projeto. Peça para quem cuida do Supabase as duas linhas com os endereços do banco. Elas são assim:

```
DATABASE_URL="postgresql://postgres.xxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

> 🔒 Esse arquivo tem a senha do banco. Mande para os colegas por mensagem privada, **nunca** pelo GitHub.

**4. Prepare o Prisma**

```bash
npx prisma generate
```

**5. Rode o site**

```bash
npm run dev
```

Abra **http://localhost:3000** no navegador.

O banco é **um só, na internet**, igual para todo mundo: no seu computador, no dos colegas e no site publicado. Produto ou imagem que alguém muda pelo painel do admin aparece para todos na hora.

---

## 🗄️ Banco de dados (Supabase)

Só precisa fazer **uma vez**, e só **uma pessoa** faz:

```bash
npx prisma db push        # cria as tabelas no Supabase
node prisma/seed.mjs      # coloca os produtos, usuários e pedidos de exemplo
```

> ⚠️ O `seed.mjs` **apaga o banco inteiro**, para todo mundo, inclusive o site publicado. Só rode se quiserem voltar tudo ao começo, e combine com a equipe antes.

Se alguém mudar o `prisma/schema.prisma` (tabelas), essa pessoa roda `npx prisma db push` uma vez, e pronto. Não precisa do seed.

### Cópia de segurança do catálogo

```bash
node prisma/exportar.mjs
```

Copia os produtos, as imagens e os textos do site que estão no banco para o `prisma/dados.json`. Faça commit e push depois. Se alguém rodar o seed, o catálogo volta do jeito que estava nessa cópia.

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
│   ├── exportar.mjs     → cópia de segurança do catálogo
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

Se no que veio tiver mudança no `package.json` ou no `prisma/schema.prisma`, rode também `npm install`.

Depois de fazer suas mudanças:

```bash
git add .
git commit -m "descreva o que mudou"
git push
```

⚠️ **Não envie** o arquivo `.env`. Ele tem a senha do banco, e o `.gitignore` já impede que ele vá.

---

## 🌐 Site publicado (Vercel)

O site fica na Vercel, ligado a este repositório. **Todo `git push` na branch `main` publica a versão nova sozinho**, em 1 a 2 minutos. Antes de enviar, rode `npm run build`. Se der erro aqui, também dá na Vercel.
