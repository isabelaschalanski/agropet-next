// GET    /api/admin/assinaturas (admin) → todas as assinaturas
// PATCH  /api/admin/assinaturas  { clienteId, ativa: false } (admin) → cancela a de um cliente
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../../lib/api';
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
    const { clienteId, ativa } = await lerCorpo(req);
    exigir(Number(clienteId) > 0, 'Informe o cliente');
    const a = await prisma.assinatura.update({ where: { clienteId: Number(clienteId) }, data: { ativa: !!ativa } });
    return Response.json(a);
});
