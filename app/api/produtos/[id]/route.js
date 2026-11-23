// GET /api/produtos/5 · PUT /api/produtos/5 (admin) · DELETE /api/produtos/5 (admin)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, ErroHttp } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';
import { produtoParaFront } from '../../../../lib/formatos';
import { dadosDoProduto } from '../validar';
import { apagarImagem } from '../../../../lib/imagens';

export const GET = rota(async (req, ctx) => {
    const p = await prisma.produto.findUnique({ where: { id: await lerId(ctx) }, include: { animal: true, categoria: true } });
    if (!p) throw new ErroHttp(404, 'Produto não encontrado');
    return Response.json(produtoParaFront(p));
});

export const PUT = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    const antes = await prisma.produto.findUnique({ where: { id } });
    if (!antes) throw new ErroHttp(404, 'Produto não encontrado');
    const data = await dadosDoProduto(await lerCorpo(req), true);
    const p = await prisma.produto.update({ where: { id }, data, include: { animal: true, categoria: true } });
    if (data.imagem !== undefined && antes.imagem !== p.imagem) await apagarImagem(antes.imagem); // foto trocada: apaga a antiga
    return Response.json(produtoParaFront(p));
});

export const DELETE = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const p = await prisma.produto.delete({ where: { id: await lerId(ctx) } });
    await apagarImagem(p.imagem);
    return Response.json({ ok: true });
});
