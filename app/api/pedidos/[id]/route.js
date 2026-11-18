// PATCH /api/pedidos/1001  { status }  (admin) — ao cancelar, os itens voltam para o estoque
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, exigir, ErroHttp } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';
import { STATUS_PEDIDO } from '../../../../lib/regras';

export const PATCH = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    const { status } = await lerCorpo(req);
    exigir(STATUS_PEDIDO.includes(status), 'Status inválido');
    const atualizado = await prisma.$transaction(async (tx) => {
        const p = await tx.pedido.findUnique({ where: { id }, include: { itens: true } });
        if (!p) throw new ErroHttp(404, 'Pedido não encontrado');
        const mexer = (sinal) => Promise.all(p.itens.filter(i => i.produtoId).map(i =>
            tx.produto.update({ where: { id: i.produtoId }, data: { estoque: { increment: sinal * i.qtd } } })));
        if (status === 'Cancelado' && p.status !== 'Cancelado') await mexer(+1);
        if (p.status === 'Cancelado' && status !== 'Cancelado') await mexer(-1);
        return tx.pedido.update({ where: { id }, data: { status }, include: { itens: true } });
    });
    return Response.json(atualizado);
});
