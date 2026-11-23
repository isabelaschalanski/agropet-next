// GET  /api/produtos?animal=gatos&categoria=Ração&busca=areia&destaques=1&todos=1
// POST /api/produtos  (admin) → cadastra produto
import { prisma } from '../../../lib/db';
import { rota, lerCorpo } from '../../../lib/api';
import { usuarioDaRequisicao, exigirAdmin } from '../../../lib/auth';
import { produtoParaFront } from '../../../lib/formatos';
import { dadosDoProduto } from './validar';
import { semAcento } from '../../../lib/front/util';

export const GET = rota(async (req) => {
    const q = new URL(req.url).searchParams;
    const animal = q.get('animal');
    const categoria = q.get('categoria');
    const busca = (q.get('busca') || '').trim();
    const u = q.get('todos') ? await usuarioDaRequisicao(req) : null;

    const where = {};
    if (!(u && u.admin)) where.ativo = true;                 // só o admin vê os escondidos
    if (animal === 'agro') where.animal = { agro: true };
    else if (animal === 'outros-pets') where.animal = { outro: true };
    else if (animal) where.animalId = animal;
    if (categoria) where.categoria = { nome: categoria };
    let produtos = await prisma.produto.findMany({ where, include: { animal: true, categoria: true }, orderBy: { id: 'asc' } });

    // Busca sem diferenciar acento nem maiúscula ("racao" acha "Ração"). O catálogo é pequeno,
    // então dá para filtrar aqui mesmo, depois de buscar no banco.
    if (busca) {
        const termo = semAcento(busca);
        produtos = produtos.filter(p => [p.nome, p.categoria.nome, p.animal.nome].some(t => semAcento(t).includes(termo)));
    }

    if (q.get('destaques')) {                                // com selo + o primeiro de cada animal
        const lista = produtos.filter(p => p.selo);
        const vistos = new Set(lista.map(p => p.animalId));
        for (const p of produtos) if (!vistos.has(p.animalId)) { lista.push(p); vistos.add(p.animalId); }
        produtos = lista.slice(0, 15);
    }
    return Response.json(produtos.map(produtoParaFront));
});

export const POST = rota(async (req) => {
    await exigirAdmin(req);
    const data = await dadosDoProduto(await lerCorpo(req));
    const p = await prisma.produto.create({ data, include: { animal: true, categoria: true } });
    return Response.json(produtoParaFront(p), { status: 201 });
});
