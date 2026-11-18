// GET /api/servicos  → serviços, adicionais, portes e horários do Banho e Tosa
import { prisma } from '../../../lib/db';
import { rota } from '../../../lib/api';
import { PORTES, HORARIOS } from '../../../lib/regras';

export const GET = rota(async () => {
    const [servicos, adicionais] = await Promise.all([prisma.servico.findMany(), prisma.adicional.findMany()]);
    return Response.json({ servicos, adicionais, portes: PORTES, horarios: HORARIOS });
});
