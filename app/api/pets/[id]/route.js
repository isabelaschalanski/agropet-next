// PUT /api/pets/3 · DELETE /api/pets/3   (só o dono)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, ErroHttp } from '../../../../lib/api';
import { exigirLogin } from '../../../../lib/auth';
import { dadosDoPet } from '../validar';

async function meuPet(req, ctx) {
    const u = await exigirLogin(req);
    const pet = await prisma.pet.findUnique({ where: { id: await lerId(ctx) } });
    if (!pet || pet.donoId !== u.id) throw new ErroHttp(404, 'Pet não encontrado');
    return pet;
}

export const PUT = rota(async (req, ctx) => {
    const pet = await meuPet(req, ctx);
    return Response.json(await prisma.pet.update({ where: { id: pet.id }, data: dadosDoPet(await lerCorpo(req)) }));
});

export const DELETE = rota(async (req, ctx) => {
    const pet = await meuPet(req, ctx);
    await prisma.pet.delete({ where: { id: pet.id } });
    return Response.json({ ok: true });
});
