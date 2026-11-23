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

Crie um arquivo chamado `.env` na pasta principal do projeto. Peça para quem cuida do Supabase as linhas do banco e do Storage (onde ficam as fotos). Elas são assim:

```
DATABASE_URL="postgresql://postgres.xxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

Sem as duas últimas o site funciona, mas as fotos enviadas pelo painel vão como texto para dentro do banco em vez de irem para o Storage.

> 🔒 Esse arquivo tem a senha do banco e a chave do Storage. Mande para os colegas por mensagem privada, **nunca** pelo GitHub.

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

### Dados de exemplo (para mostrar o site em uso)

```bash
node prisma/popular.mjs           # adiciona 20 clientes, ~100 pedidos dos últimos 60 dias, agenda do Banho e Tosa e assinaturas
node prisma/popular.mjs apagar    # tira só esses dados de exemplo
```

Não apaga nada do que já existe. Os clientes de exemplo têm e-mail `@exemplo.com`, senha `123` e telefones de mentira. Uma pessoa só roda, uma vez. As datas contam a partir do dia em que roda: para "atualizar" antes de uma apresentação, rode `apagar` e depois rode de novo.

### Fotos (Supabase Storage)

As fotos enviadas pelo painel do admin (produtos, banners e animais) ficam no **Storage** do Supabase, numa pasta pública chamada `imagens`. No banco fica só o link. Quem faz isso é o `lib/imagens.js`, e a pasta `imagens` é criada sozinha no primeiro envio. Quando uma foto é trocada ou o produto é excluído, a foto antiga é apagada do Storage.

Para levar para o Storage as fotos que já estavam dentro do banco (rodar **uma vez**, uma pessoa só):

```bash
node prisma/mover-imagens.mjs
```

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
│   ├── layout.js        → estrutura geral (HTML) de todas as páginas
│   ├── globals.css      → estilos
│   ├── (loja)/          → páginas da loja: /, /loja/caes, /carrinho, /clube, /conta/pedidos...
│   ├── admin/           → páginas do gerenciamento: /admin, /admin/produtos, /admin/pedidos...
│   └── api/             → back-end (rotas da API)
├── components/
│   ├── Provedor.js      → dados da loja, login e carrinho (usado por todas as telas)
│   ├── loja/            → topo, rodapé, cartões de produto, imagens
│   ├── telas/           → telas da loja (início, carrinho, banho e tosa, clube, conta...)
│   └── admin/           → telas do gerenciamento (painel, produtos, pedidos...)
├── lib/                 → regras de negócio, login, banco e fotos (lib/front: funções das telas)
├── prisma/
│   ├── schema.prisma    → tabelas do banco
│   ├── seed.mjs         → dados iniciais
│   ├── exportar.mjs     → cópia de segurança do catálogo
│   ├── mover-imagens.mjs → leva para o Storage as fotos antigas que estavam no banco
│   ├── popular.mjs      → coloca (ou tira) clientes e pedidos de exemplo
│   ├── trocar-senha.mjs → troca a senha de uma conta (ex.: admin)
│   └── dados.json       → catálogo de produtos
├── public/
│   └── img/             → imagens dos banners
└── API.md               → documentação das rotas da API
```

**Onde mexer:** para mudar uma tela, procure o componente em `components/` (ex.: o carrinho está em `components/telas/Carrinho.js`). As páginas em `app/` só dizem qual tela aparece em cada endereço. Preços, descontos, frete e horários ficam em `lib/regras.js`, que o site e a API usam juntos.

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

As variáveis `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` também estão cadastradas na Vercel, em **Settings → Environments → Production**. Se elas mudarem (por exemplo, se trocar a senha do banco), atualize lá e publique de novo:

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
