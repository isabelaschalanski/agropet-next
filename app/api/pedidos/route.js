// GET  /api/pedidos  → meus pedidos (o admin vê todos)
// POST /api/pedidos  { itens: [{ produtoId, qtd }], endereco: { rua, numero, bairro, cidade, cep }, pagamento }
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir, ErroHttp } from '../../../lib/api';
import { exigirLogin } from '../../../lib/auth';
import { calcularCarrinho, PAGAMENTOS } from '../../../lib/regras';

export const GET = rota(async (req) => {
    const u = await exigirLogin(req);
    const pedidos = await prisma.pedido.findMany({
        where: u.admin ? {} : { clienteId: u.id },
        include: { itens: true, cliente: { select: { nome: true, telefone: true } } },
        orderBy: { id: 'desc' },
    });
    return Response.json(pedidos);
});

export const POST = rota(async (req) => {
    const u = await exigirLogin(req);
    exigir(!u.admin, 'O admin não faz compras');
    const b = await lerCorpo(req);
    exigir(Array.isArray(b.itens) && b.itens.length, 'O carrinho está vazio');
    exigir(PAGAMENTOS.includes(b.pagamento), 'Forma de pagamento inválida');
    const e = b.endereco || {};
    for (const campo of ['rua', 'numero', 'bairro', 'cidade', 'cep']) exigir(String(e[campo] || '').trim(), 'Preencha o endereço completo');

    const pedido = await prisma.$transaction(async (tx) => {
        const produtos = await tx.produto.findMany({ where: { id: { in: b.itens.map(i => Number(i.produtoId)) } } });
        const lista = b.itens.map(i => {
            const produto = produtos.find(p => p.id === Number(i.produtoId));
            const qtd = Number(i.qtd);
            if (!produto || !produto.ativo) throw new ErroHttp(400, 'Um dos produtos não está mais disponível');
            if (!Number.isInteger(qtd) || qtd < 1) throw new ErroHttp(400, 'Quantidade inválida');
            if (qtd > produto.estoque) throw new ErroHttp(409, `Estoque insuficiente de ${produto.nome}`);
            return { produto, qtd };
        });
        const config = await tx.configuracaoSite.findUnique({ where: { id: 1 } });
        const t = calcularCarrinho(lista, u, config);
        for (const i of lista) await tx.produto.update({ where: { id: i.produto.id }, data: { estoque: { decrement: i.qtd } } });
        return tx.pedido.create({
            data: {
                clienteId: u.id, subtotal: t.subtotal, desconto: t.desconto, frete: t.frete, total: t.total, pagamento: b.pagamento,
                endereco: `${e.rua}, ${e.numero} — ${e.bairro}, ${e.cidade} (${e.cep})`,
                itens: { create: lista.map(i => ({ produtoId: i.produto.id, nome: i.produto.nome, preco: i.produto.preco, qtd: i.qtd })) },
            },
            include: { itens: true },
        });
    });
    return Response.json(pedido, { status: 201 });
});
