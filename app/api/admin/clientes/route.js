// GET /api/admin/clientes (admin) → clientes com total gasto e plano
import { prisma } from '../../../../lib/db';
import { rota } from '../../../../lib/api';
import { exigirAdmin, usuarioPublico } from '../../../../lib/auth';
import { PLANOS, arred } from '../../../../lib/regras';

export const GET = rota(async (req) => {
    await exigirAdmin(req);
    const clientes = await prisma.usuario.findMany({
        where: { admin: false },
        include: { pedidos: { where: { status: { not: 'Cancelado' } }, select: { total: true } }, assinatura: true, pets: true },
        orderBy: { id: 'asc' },
    });
    return Response.json(clientes.map(c => ({
        ...usuarioPublico(c), pedidos: undefined,
        qtdPedidos: c.pedidos.length,
        totalGasto: arred(c.pedidos.reduce((s, p) => s + p.total, 0)),
        plano: c.assinatura && c.assinatura.ativa ? PLANOS[c.assinatura.plano].nome : null,
    })));
});
