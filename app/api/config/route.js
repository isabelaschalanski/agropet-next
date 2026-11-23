// GET /api/config → textos e imagens do site · PUT /api/config (admin) → salva
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../lib/api';
import { exigirAdmin } from '../../../lib/auth';
import { configParaFront } from '../../../lib/formatos';
import { PLANOS } from '../../../lib/regras';
import { salvarImagem, apagarImagem } from '../../../lib/imagens';

export const GET = rota(async () => {
    const c = await prisma.configuracaoSite.findUnique({ where: { id: 1 } });
    return Response.json({ ...configParaFront(c), planos: PLANOS });
});

export const PUT = rota(async (req) => {
    await exigirAdmin(req);
    const b = await lerCorpo(req);
    const data = {};
    for (const campo of ['pilula', 'titulo', 'texto', 'botao']) if (b[campo] !== undefined) data[campo] = String(b[campo]);
    for (const campo of ['frete', 'freteGratisAcima']) if (b[campo] !== undefined) { exigir(Number(b[campo]) >= 0, 'Valor inválido'); data[campo] = Number(b[campo]); }
    let antigas = [];
    if (b.imgSlides !== undefined) {
        exigir(Array.isArray(b.imgSlides) && b.imgSlides.length === 3, 'imgSlides precisa ter 3 imagens');
        antigas = configParaFront(await prisma.configuracaoSite.findUnique({ where: { id: 1 } })).imgSlides;
        const novas = [];
        for (const img of b.imgSlides) novas.push(await salvarImagem(img, 'banners')); // fotos novas vão para o Storage
        data.imgSlides = JSON.stringify(novas);
    }
    const c = await prisma.configuracaoSite.update({ where: { id: 1 }, data });
    const ficaram = configParaFront(c).imgSlides;
    for (const img of antigas) if (!ficaram.includes(img)) await apagarImagem(img); // banner trocado: apaga a foto antiga
    return Response.json(configParaFront(c));
});
