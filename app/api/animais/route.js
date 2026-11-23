// GET /api/animais  → animais com as categorias (para montar o menu)
// PUT /api/animais  (admin) → troca a imagem de um animal   { id: "bovinos", imagem: "data:image/..." }
//   (a foto vai para o Supabase Storage e o banco guarda o link — veja lib/imagens.js)
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../lib/api';
import { exigirAdmin } from '../../../lib/auth';
import { salvarImagem, apagarImagem } from '../../../lib/imagens';

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
    const antes = await prisma.animal.findUnique({ where: { id } });
    exigir(antes, 'Animal não encontrado');
    const a = await prisma.animal.update({ where: { id }, data: { imagem: await salvarImagem(imagem, 'animais') } });
    if (antes.imagem !== a.imagem) await apagarImagem(antes.imagem);
    return Response.json(a);
});
