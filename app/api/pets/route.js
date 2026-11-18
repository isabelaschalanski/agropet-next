// GET /api/pets  → meus pets · POST /api/pets  { nome, tipo, porte, raca?, sexo?, nascimento? }
import { prisma } from '../../../lib/db';
import { rota, lerCorpo } from '../../../lib/api';
import { exigirLogin } from '../../../lib/auth';
import { dadosDoPet } from './validar';

export const GET = rota(async (req) => {
    const u = await exigirLogin(req);
    return Response.json(await prisma.pet.findMany({ where: { donoId: u.id }, orderBy: { id: 'asc' } }));
});

export const POST = rota(async (req) => {
    const u = await exigirLogin(req);
    const pet = await prisma.pet.create({ data: { ...dadosDoPet(await lerCorpo(req)), donoId: u.id } });
    return Response.json(pet, { status: 201 });
});
