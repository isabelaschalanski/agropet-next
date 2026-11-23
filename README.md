# 🐾 AgroPet — Pet Shop e Agropecuária Online

Loja online de produtos para pets e para o campo, com clube de assinatura e agendamento de banho e tosa.

---

## 📌 Sobre o projeto

A AgroPet é uma loja online que junta **pet shop** e **agropecuária**. O site atende tanto quem tem cães e gatos quanto quem cria animais de produção, como bovinos, equinos e aves.

O site tem três serviços principais:

| | Serviço | O que faz |
|---|---|---|
| 🛒 | **Loja** | Venda de produtos organizados por tipo de animal, com filtros, busca e carrinho |
| ⭐ | **Clube AgroPet** | Assinatura mensal de ração, com desconto em toda a loja e outros benefícios |
| 🛁 | **Banho e Tosa** | Agendamento online para cães e gatos, com escolha de serviço, data e horário |

Além disso, tem uma **área de gerenciamento** separada, onde o administrador cuida dos produtos, pedidos, agendamentos, clientes e da aparência do site.

> Os pagamentos são **simulados**: nenhum valor é cobrado de verdade.

---

## 🧪 Experimente

Para conhecer a loja como cliente, use uma das contas de demonstração ou crie a sua em **Entrar → Cadastrar**:

| Conta | Usuário | Senha | O que dá para ver |
|---|---|---|---|
| 👩 Cliente assinante | `maria@email.com` | `123` | Clube Premium, pets cadastrados, pedidos e agendamentos |
| 👨 Cliente comum | `joao@email.com` | `123` | Conta sem assinatura, para comparar preços e frete |

A área de gerenciamento é restrita à equipe da loja.

### Um passeio pelo site

1. **Navegue pela loja:** escolha um animal no menu (ex.: Gatos ou Bovinos), use os filtros da lateral e a busca no topo.
2. **Entre como Maria** e adicione produtos ao carrinho. O desconto de 10% do plano Premium e o frete grátis aparecem sozinhos.
3. **Finalize o pedido** e veja em **Minha conta → Meus pedidos**. Enquanto está "Recebido", o pedido pode ser cancelado.
4. **Agende um banho** em **Banho e Tosa**: escolha o pet, o serviço, os adicionais, a data e o horário. Horários já ocupados aparecem bloqueados.
5. **Conheça o Clube AgroPet:** compare os planos, escolha as rações e o dia de entrega.

---

## ✨ Funcionalidades

### Para o cliente
- **Loja por animal:** Cães, Gatos, Bovinos, Equinos, Aves, Suínos, Ovinos e Outros Pets (Peixes, Pássaros, Roedores)
- Página de cada animal com **filtros** por categoria e faixa de preço, além de **busca** geral
- **Carrinho** com cálculo de desconto e frete (grátis em compras acima de R$ 199)
- **Finalização da compra** com endereço e forma de pagamento (Pix, cartão ou boleto)
- **Clube AgroPet** com dois planos:
  - **Básico** (R$ 19,90/mês): 5% de desconto e ração entregue todo mês
  - **Premium** (R$ 39,90/mês): 10% de desconto, frete grátis em tudo e 1 banho grátis por mês
- **Banho e Tosa:** serviços com preço por porte do pet, adicionais, horários livres em tempo real e nada aos domingos
- **Minha conta:** pedidos (com cancelamento), agendamentos (com cancelamento), cadastro de pets, assinatura e dados pessoais

### Para o administrador
- **Painel** com faturamento, pedidos, próximos agendamentos e assinantes
- **Produtos:** cadastrar, editar e excluir, com foto, estoque e selo (Oferta, Novo, Mais vendido)
- **Pedidos e agendamentos:** acompanhar e mudar o status
- **Assinaturas e clientes:** ver quem assina e cancelar assinaturas
- **Configurar site:** textos e imagens da página inicial, ícones dos animais e valor do frete

### Regras de segurança
- Senhas guardadas com criptografia (**scrypt**), nunca em texto puro
- Login por **token de sessão**: cada rota da API confere quem está pedindo
- O cliente só vê e altera os próprios dados. O administrador não tem acesso à área de compras.
- Estoque conferido no servidor. Dois clientes nunca conseguem o mesmo horário de banho, nem clicando ao mesmo tempo.

---

## 🛠️ Tecnologias

| Parte | Tecnologia |
|---|---|
| Framework (front-end e back-end) | **Next.js** (JavaScript) |
| Banco de dados | **PostgreSQL** no **Supabase** |
| Acesso ao banco | **Prisma** (ORM) |
| Estilo | CSS puro |
| Hospedagem | **Vercel** (publica automaticamente a cada atualização no GitHub) |

### Como as partes se conectam

```
 Navegador  ──►  Next.js na Vercel  ──►  Prisma  ──►  PostgreSQL no Supabase
 (telas)         (páginas + API)                        (produtos, pedidos, clientes...)
```

- **Front-end:** as telas do site, em React. Cada tela é um componente em `components/` e cada página tem seu próprio endereço em `app/` (ex.: `/clube`, `/loja/caes`, `/admin/pedidos`). Estilos em `app/globals.css`.
- **Back-end:** a API em `app/api/`, com 21 rotas (produtos, pedidos, agendamentos, login…). As regras do negócio ficam em `lib/`.
- **Banco:** 14 tabelas, definidas em `prisma/schema.prisma`

A documentação de todas as rotas da API está em **[API.md](API.md)**.

---

## 👩‍💻 Rodando o projeto

As instruções de instalação, banco de dados e publicação estão em **[DESENVOLVIMENTO.md](DESENVOLVIMENTO.md)**.

---

Projeto desenvolvido por estudantes de Ciência da Computação da URI – Santo Ângelo (RS).
