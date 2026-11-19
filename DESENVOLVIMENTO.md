# 👩‍💻 AgroPet — Guia de desenvolvimento

Instruções para a equipe: como rodar o projeto, como funciona o banco e como trabalhar junto.
Para conhecer o projeto, veja o [README](README.md). Para a explicação completa (pastas, banco, erros comuns), veja o PDF **Manual da equipe**.

- **Site publicado:** o endereço está no painel da Vercel e no manual da equipe
- **Repositório:** https://github.com/isabelaschalanski/agropet-next

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
| Administrador | `admin` | a senha está com a equipe (troque com `node prisma/trocar-senha.mjs admin NOVA_SENHA`) |
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

As variáveis `DATABASE_URL` e `DIRECT_URL` também estão cadastradas na Vercel, em **Settings → Environments → Production**. Se elas mudarem (por exemplo, se trocar a senha do banco), atualize lá e publique de novo:

```bash
git commit --allow-empty -m "publicar de novo"
git push
```

---

## 🧹 Dados x código

| O que muda | Onde fica | Como chega no site publicado |
|---|---|---|
| Produtos, imagens, pedidos, agendamentos, textos do painel "Configurar site" | banco (Supabase) | na hora, sem commit |
| Código (telas, cores, regras) | arquivos do projeto (GitHub) | `git push` |
