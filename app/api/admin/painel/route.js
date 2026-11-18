// GET /api/admin/painel (admin) → números do painel
import { prisma } from '../../../../lib/db';
import { rota } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';
import { PLANOS, hojeISO, arred } from '../../../../lib/regras';

export const GET = rota(async (req) => {
    await exigirAdmin(req);
    const [validos, totalPedidos, proximos, assinantes, estoqueBaixo, ultimosPedidos] = await Promise.all([
        prisma.pedido.findMany({ where: { status: { not: 'Cancelado' } }, select: { total: true } }),
        prisma.pedido.count(),
        prisma.agendamento.findMany({ where: { status: 'Agendado', data: { gte: hojeISO() } }, orderBy: [{ data: 'asc' }, { hora: 'asc' }], take: 6, include: { servico: true } }),
        prisma.assinatura.findMany({ where: { ativa: true }, select: { plano: true } }),
        prisma.produto.findMany({ where: { estoque: { lte: 10 } }, orderBy: { estoque: 'asc' }, take: 6 }),
        prisma.pedido.findMany({ orderBy: { id: 'desc' }, take: 5, include: { itens: true, cliente: { select: { nome: true } } } }),
    ]);
    return Response.json({
        faturamento: arred(validos.reduce((s, p) => s + p.total, 0)),
        pedidos: totalPedidos,
        novosPedidos: await prisma.pedido.count({ where: { status: 'Recebido' } }),
        agendamentosFuturos: await prisma.agendamento.count({ where: { status: 'Agendado', data: { gte: hojeISO() } } }),
        assinantes: assinantes.length,
        receitaMensalClube: arred(assinantes.reduce((s, a) => s + PLANOS[a.plano].preco, 0)),
        proximosBanhos: proximos,
        estoqueBaixo,
        ultimosPedidos,
    });
});
