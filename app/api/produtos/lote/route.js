// POST /api/produtos/lote (admin) { ids: [1, 2, 3], acao: "excluir" | "esconder" | "mostrar" }
//   ações em vários produtos de uma vez (seleção em massa do gerenciamento)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';
import { apagarImagem } from '../../../../lib/imagens';

export const POST = rota(async (req) => {
    await exigirAdmin(req);
    const { ids, acao } = await lerCorpo(req);
    const lista = Array.isArray(ids) ? ids.map(Number).filter(n => Number.isInteger(n) && n > 0) : [];
    exigir(lista.length > 0, 'Selecione ao menos um produto');
    exigir(['excluir', 'esconder', 'mostrar'].includes(acao), 'Ação inválida');
    const where = { id: { in: lista } };
    if (acao === 'excluir') {
        const fotos = (await prisma.produto.findMany({ where })).map(p => p.imagem);
        const r = await prisma.produto.deleteMany({ where });
        for (const f of fotos) await apagarImagem(f);
        return Response.json({ ok: true, quantidade: r.count });
    }
    const r = await prisma.produto.updateMany({ where, data: { ativo: acao === 'mostrar' } });
    return Response.json({ ok: true, quantidade: r.count });
});
