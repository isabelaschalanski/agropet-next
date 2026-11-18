# API da AgroPet

Todas as rotas ficam em `http://localhost:3000/api/...` e respondem em **JSON**.
Quando algo dá errado, a resposta vem assim: `{ "erro": "mensagem" }`, com o código HTTP certo (400, 401, 403, 404, 409).

## Login

1. O front chama `POST /api/login` e recebe um **token**.
2. Guarda o token (por exemplo, no `localStorage`).
3. Nas rotas que precisam de login, manda o cabeçalho `Authorization: Bearer <token>`.

```js
const r = await fetch('/api/pedidos', { headers: { Authorization: 'Bearer ' + token } });
const pedidos = await r.json();
```

Logins de teste: **admin / 123** · **maria@email.com / 123** · **joao@email.com / 123**

Legenda: 🔓 = aberta · 👤 = precisa de login · ⚙️ = só admin

## Contas

| Método | Rota | Corpo (JSON) | O que faz |
|---|---|---|---|
| POST 🔓 | `/api/login` | `{ login, senha }` | Entra e devolve `{ token, usuario }` |
| POST 🔓 | `/api/cadastro` | `{ nome, email, telefone, senha }` | Cria conta e já entra |
| POST 👤 | `/api/logout` | — | Sai (apaga o token) |
| GET 👤 | `/api/eu` | — | Dados de quem está logado, com `pets` e `assinatura` |
| PUT 👤 | `/api/eu` | `{ nome, email, telefone, senha? }` | Atualiza os dados |

## Loja

| Método | Rota | Corpo / parâmetros | O que faz |
|---|---|---|---|
| GET 🔓 | `/api/animais` | — | Animais e categorias (monta o menu) |
| PUT ⚙️ | `/api/animais` | `{ id, imagem }` | Troca a imagem de um animal |
| GET 🔓 | `/api/produtos` | `?animal=gatos` `?animal=agro` `?animal=outros-pets` `?categoria=Ração` `?busca=sal` `?destaques=1` `?todos=1` (admin, inclui escondidos) | Lista produtos |
| GET 🔓 | `/api/produtos/5` | — | Um produto |
| POST ⚙️ | `/api/produtos` | `{ nome, preco, estoque, animal, categoria, icone, cor, selo, descricao, imagem }` | Cadastra |
| PUT ⚙️ | `/api/produtos/5` | só os campos que mudaram (ex.: `{ ativo: false }`) | Edita |
| DELETE ⚙️ | `/api/produtos/5` | — | Exclui |
| POST 🔓 | `/api/carrinho` | `{ itens: [{ produtoId, qtd }] }` | Calcula subtotal, desconto do Clube, frete e total |
| GET 👤 | `/api/pedidos` | — | Meus pedidos (o admin vê todos) |
| POST 👤 | `/api/pedidos` | `{ itens: [{ produtoId, qtd }], pagamento: "Pix", endereco: { rua, numero, bairro, cidade, cep } }` | Fecha a compra e baixa o estoque |
| PATCH ⚙️ | `/api/pedidos/1001` | `{ status }` | Muda o status (Recebido, Em separação, Enviado, Entregue, Cancelado). Cancelar devolve o estoque |

## Clube AgroPet

| Método | Rota | Corpo | O que faz |
|---|---|---|---|
| GET 🔓 | `/api/config` | — | Inclui `planos` (preços e benefícios) |
| GET 👤 | `/api/assinatura` | — | Minha assinatura |
| POST 👤 | `/api/assinatura` | `{ plano: "premium", diaEntrega: 10, itens: [{ produtoId, qtd }], pagamento }` | Assina ou altera. `diaEntrega: 0` = sem agendamento (sem itens) |
| DELETE 👤 | `/api/assinatura` | — | Cancela |

## Banho e Tosa

| Método | Rota | Corpo / parâmetros | O que faz |
|---|---|---|---|
| GET 🔓 | `/api/servicos` | — | Serviços, adicionais, portes e horários |
| GET 🔓 | `/api/horarios` | `?data=2026-11-20` | Horários livres e ocupados (domingo = fechado) |
| GET 👤 | `/api/pets` | — | Meus pets |
| POST 👤 | `/api/pets` | `{ nome, tipo, porte, raca?, sexo?, nascimento? }` | Cadastra pet |
| PUT / DELETE 👤 | `/api/pets/3` | (PUT) mesmos campos | Edita / exclui pet |
| GET 👤 | `/api/agendamentos` | — | Meus agendamentos (o admin vê todos) |
| POST 👤 | `/api/agendamentos` | `{ petId, servicoId: "banho", adicionais: ["unhas"], data, hora }` | Agenda. O banho grátis do Premium entra sozinho |
| PATCH 👤 | `/api/agendamentos/7` | `{ status }` | Cliente: só `Cancelado`. Admin: Agendado, Concluído, Cancelado |

## Gerenciamento (admin)

| Método | Rota | O que faz |
|---|---|---|
| GET ⚙️ | `/api/admin/painel` | Faturamento, pedidos, próximos banhos, estoque baixo, últimos pedidos |
| GET ⚙️ | `/api/admin/clientes` | Clientes com total gasto e plano |
| GET ⚙️ | `/api/admin/assinaturas` | Todas as assinaturas |
| PATCH ⚙️ | `/api/admin/assinaturas` | `{ clienteId, ativa: false }` cancela a de um cliente |
| PUT ⚙️ | `/api/config` | `{ pilula, titulo, texto, botao, frete, freteGratisAcima, imgSlides: ["", "", ""] }` |

## Onde fica cada coisa

```
app/api/...        rotas (back)
lib/db.js          conexão com o banco
lib/auth.js        senhas e login
lib/regras.js      preços, descontos, frete, horários
lib/formatos.js    formato dos dados que vão para o front
prisma/schema.prisma   tabelas
prisma/seed.mjs        dados de exemplo  →  node prisma/seed.mjs
```
