// POST /api/carrinho   { itens: [{ produtoId, qtd }] }  → subtotal, desconto do Clube, frete e total
// (o carrinho em si fica no navegador; o servidor só confere preços e estoque)
import { prisma } from '../../../lib/db';
import { rota, lerCorpo } from '../../../lib/api';
import { usuarioDaRequisicao } from '../../../lib/auth';
import { calcularCarrinho } from '../../../lib/regras';
import { produtoParaFront } from '../../../lib/formatos';

export const POST = rota(async (req) => {
    const { itens = [] } = await lerCorpo(req);
    const u = await usuarioDaRequisicao(req);
    const config = await prisma.configuracaoSite.findUnique({ where: { id: 1 } });
    const produtos = await prisma.produto.findMany({ where: { id: { in: itens.map(i => Number(i.produtoId)) }, ativo: true } });
    const lista = itens
        .map(i => ({ produto: produtos.find(p => p.id === Number(i.produtoId)), qtd: Math.max(1, Number(i.qtd) || 1) }))
        .filter(i => i.produto);
    return Response.json({
        itens: lista.map(i => ({ produto: produtoParaFront(i.produto), qtd: i.qtd, semEstoque: i.qtd > i.produto.estoque })),
        ...calcularCarrinho(lista, u, config),
    });
});
