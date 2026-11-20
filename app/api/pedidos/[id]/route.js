// PATCH  /api/pedidos/1001  { status } e/ou (admin) { arquivado, observacao }
//   admin: qualquer status · cliente: só pode cancelar o próprio pedido enquanto ele está "Recebido"
//   ao cancelar, os itens voltam para o estoque
// DELETE /api/pedidos/1001 (admin) → apaga de vez (só pedidos arquivados)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, exigir, ErroHttp } from '../../../../lib/api';
import { exigirLogin, exigirAdmin } from '../../../../lib/auth';
import { STATUS_PEDIDO } from '../../../../lib/regras';

export const PATCH = rota(async (req, ctx) => {
    const u = await exigirLogin(req);
    const id = await lerId(ctx);
    const corpo = await lerCorpo(req);
    const { status } = corpo;
    const mudaStatus = status !== undefined;
    if (mudaStatus) exigir(STATUS_PEDIDO.includes(status), 'Status inválido');
    if (!u.admin) exigir(mudaStatus && corpo.arquivado === undefined && corpo.observacao === undefined, 'Você só pode cancelar o pedido');

    const atualizado = await prisma.$transaction(async (tx) => {
        const p = await tx.pedido.findUnique({ where: { id }, include: { itens: true } });
        if (!p || (!u.admin && p.clienteId !== u.id)) throw new ErroHttp(404, 'Pedido não encontrado');
        const data = {};
        if (mudaStatus) {
            if (!u.admin) {
                exigir(status === 'Cancelado', 'Você só pode cancelar o pedido');
                exigir(p.status !== 'Cancelado', 'Esse pedido já foi cancelado');
                exigir(p.status === 'Recebido', 'Esse pedido já está em separação e não pode mais ser cancelado. Fale com a loja.');
            }
            const mexer = (sinal) => Promise.all(p.itens.filter(i => i.produtoId).map(i =>
                tx.produto.update({ where: { id: i.produtoId }, data: { estoque: { increment: sinal * i.qtd } } })));
            if (status === 'Cancelado' && p.status !== 'Cancelado') await mexer(+1);
            if (p.status === 'Cancelado' && status !== 'Cancelado') await mexer(-1);
            data.status = status;
        }
        if (corpo.arquivado !== undefined) {
            const st = data.status || p.status;
            exigir(!corpo.arquivado || ['Entregue', 'Cancelado'].includes(st), 'Só dá para arquivar pedidos entregues ou cancelados');
            data.arquivado = !!corpo.arquivado;
        }
        if (corpo.observacao !== undefined) data.observacao = String(corpo.observacao).slice(0, 1000);
        return tx.pedido.update({ where: { id }, data, include: { itens: true } });
    });
    return Response.json(atualizado);
});

export const DELETE = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    const p = await prisma.pedido.findUnique({ where: { id } });
    if (!p) throw new ErroHttp(404, 'Pedido não encontrado');
    exigir(p.arquivado, 'Arquive o pedido antes de excluir');
    await prisma.pedido.delete({ where: { id } }); // os itens vão junto (onDelete: Cascade)
    return Response.json({ ok: true });
});
