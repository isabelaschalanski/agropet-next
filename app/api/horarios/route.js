// GET /api/horarios?data=2026-11-20  → horários livres e ocupados do dia
import { prisma } from '../../../lib/db';
import { rota, exigir } from '../../../lib/api';
import { HORARIOS, ehDomingo } from '../../../lib/regras';

export const GET = rota(async (req) => {
    const data = new URL(req.url).searchParams.get('data') || '';
    exigir(/^\d{4}-\d{2}-\d{2}$/.test(data), 'Informe a data no formato AAAA-MM-DD');
    if (ehDomingo(data)) return Response.json({ data, fechado: true, livres: [], ocupados: [] });
    const marcados = await prisma.agendamento.findMany({ where: { data, status: { not: 'Cancelado' } }, select: { hora: true } });
    const ocupados = marcados.map(a => a.hora);
    return Response.json({ data, fechado: false, livres: HORARIOS.filter(h => !ocupados.includes(h)), ocupados });
});
