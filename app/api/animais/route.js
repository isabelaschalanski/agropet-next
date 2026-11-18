// GET /api/animais  → animais com as categorias (para montar o menu)
// PUT /api/animais  (admin) → troca a imagem de um animal   { id: "bovinos", imagem: "data:image/..." }
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../lib/api';
import { exigirAdmin } from '../../../lib/auth';

export const GET = rota(async () => {
    const animais = await prisma.animal.findMany({
        orderBy: { ordem: 'asc' },
        include: { categorias: { orderBy: { ordem: 'asc' } } },
    });
    return Response.json(animais.map(a => ({
        ...a,
        categorias: a.categorias.map(c => ({ id: c.id, nome: c.nome, itens: c.itens ? c.itens.split('|') : [] })),
    })));
});

export const PUT = rota(async (req) => {
    await exigirAdmin(req);
    const { id, imagem } = await lerCorpo(req);
    exigir(typeof id === 'string', 'Informe o animal');
    const a = await prisma.animal.update({ where: { id }, data: { imagem: imagem || '' } });
    return Response.json(a);
});
