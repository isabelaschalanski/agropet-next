// POST /api/logout  → apaga a sessão
import { prisma } from '../../../lib/db';
import { rota } from '../../../lib/api';
import { tokenDa } from '../../../lib/auth';

export const POST = rota(async (req) => {
    const token = tokenDa(req);
    if (token) await prisma.sessao.deleteMany({ where: { token } });
    return Response.json({ ok: true });
});
