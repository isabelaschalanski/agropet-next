// GET    /api/admin/assinaturas (admin) → todas as assinaturas
// PATCH  /api/admin/assinaturas  { clienteId, ativa: false } (admin) → cancela a de um cliente
//                                 { clienteId, arquivada: true }        → guarda no histórico (só canceladas)
// DELETE /api/admin/assinaturas?clienteId=3 (admin) → apaga de vez (só arquivadas)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, exigir, ErroHttp } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';
import { PLANOS, proximaEntrega } from '../../../../lib/regras';

export const GET = rota(async (req) => {
    await exigirAdmin(req);
    const lista = await prisma.assinatura.findMany({
        include: { cliente: { select: { nome: true, email: true } }, itens: { include: { produto: { select: { nome: true } } } } },
        orderBy: { desde: 'desc' },
    });
    return Response.json(lista.map(a => ({ ...a, planoInfo: PLANOS[a.plano], proximaEntrega: a.ativa ? proximaEntrega(a.diaEntrega) : null })));
});

export const PATCH = rota(async (req) => {
    await exigirAdmin(req);
    const b = await lerCorpo(req);
    exigir(Number(b.clienteId) > 0, 'Informe o cliente');
    const atual = await prisma.assinatura.findUnique({ where: { clienteId: Number(b.clienteId) } });
    if (!atual) throw new ErroHttp(404, 'Assinatura não encontrada');
    const data = {};
    if (b.ativa !== undefined) { data.ativa = !!b.ativa; if (data.ativa) data.arquivada = false; }
    if (b.arquivada !== undefined) {
        exigir(!b.arquivada || !(data.ativa ?? atual.ativa), 'Só dá para arquivar assinaturas canceladas');
        data.arquivada = !!b.arquivada;
    }
    const a = await prisma.assinatura.update({ where: { clienteId: Number(b.clienteId) }, data });
    return Response.json(a);
});

export const DELETE = rota(async (req) => {
    await exigirAdmin(req);
    const clienteId = Number(new URL(req.url).searchParams.get('clienteId'));
    exigir(clienteId > 0, 'Informe o cliente');
    const a = await prisma.assinatura.findUnique({ where: { clienteId } });
    if (!a) throw new ErroHttp(404, 'Assinatura não encontrada');
    exigir(a.arquivada, 'Arquive a assinatura antes de excluir');
    await prisma.assinatura.delete({ where: { clienteId } }); // as rações escolhidas vão junto
    return Response.json({ ok: true });
});
