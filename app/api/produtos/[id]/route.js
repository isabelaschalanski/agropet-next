// GET /api/produtos/5 · PUT /api/produtos/5 (admin) · DELETE /api/produtos/5 (admin)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, ErroHttp } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';
import { produtoParaFront } from '../../../../lib/formatos';
import { dadosDoProduto } from '../validar';

export const GET = rota(async (req, ctx) => {
    const p = await prisma.produto.findUnique({ where: { id: await lerId(ctx) }, include: { animal: true, categoria: true } });
    if (!p) throw new ErroHttp(404, 'Produto não encontrado');
    return Response.json(produtoParaFront(p));
});

export const PUT = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const data = await dadosDoProduto(await lerCorpo(req), true);
    const p = await prisma.produto.update({ where: { id: await lerId(ctx) }, data, include: { animal: true, categoria: true } });
    return Response.json(produtoParaFront(p));
});

export const DELETE = rota(async (req, ctx) => {
    await exigirAdmin(req);
    await prisma.produto.delete({ where: { id: await lerId(ctx) } });
    return Response.json({ ok: true });
});
