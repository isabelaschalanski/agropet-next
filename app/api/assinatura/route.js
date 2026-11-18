// GET    /api/assinatura → minha assinatura
// POST   /api/assinatura  { plano: "premium", itens: [{ produtoId, qtd }], diaEntrega: 10 (0 = sem agendamento), pagamento }
// DELETE /api/assinatura → cancela
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../lib/api';
import { exigirLogin } from '../../../lib/auth';
import { PLANOS, DIAS_ENTREGA, PAGAMENTOS, proximaEntrega } from '../../../lib/regras';

const comItens = { itens: { include: { produto: true } } };
const resposta = (a) => a && { ...a, planoInfo: PLANOS[a.plano], proximaEntrega: a.ativa ? proximaEntrega(a.diaEntrega) : null };

export const GET = rota(async (req) => {
    const u = await exigirLogin(req);
    return Response.json(resposta(await prisma.assinatura.findUnique({ where: { clienteId: u.id }, include: comItens })));
});

export const POST = rota(async (req) => {
    const u = await exigirLogin(req);
    exigir(!u.admin, 'O admin não assina o Clube');
    const b = await lerCorpo(req);
    exigir(PLANOS[b.plano], 'Plano inválido');
    const dia = Number(b.diaEntrega || 0);
    exigir(dia === 0 || DIAS_ENTREGA.includes(dia), 'Dia de entrega inválido');
    exigir(PAGAMENTOS.includes(b.pagamento || 'Cartão de crédito'), 'Forma de pagamento inválida');
    const itens = dia ? (b.itens || []).map(i => ({ produtoId: Number(i.produtoId), qtd: Math.max(1, Number(i.qtd) || 1) })) : [];
    exigir(!dia || itens.length, 'Escolha pelo menos uma ração para a entrega mensal');
    if (itens.length) {
        const racoes = await prisma.produto.count({ where: { id: { in: itens.map(i => i.produtoId) }, ativo: true, categoria: { nome: { in: ['Ração', 'Alimentação', 'Nutrição'] } } } });
        exigir(racoes === itens.length, 'Só rações e alimentos podem entrar na assinatura');
    }
    const dados = { plano: b.plano, diaEntrega: dia, pagamento: b.pagamento || 'Cartão de crédito', ativa: true };
    const a = await prisma.$transaction(async (tx) => {
        const atual = await tx.assinatura.findUnique({ where: { clienteId: u.id } });
        if (atual) {
            await tx.itemAssinatura.deleteMany({ where: { assinaturaId: atual.id } });
            return tx.assinatura.update({
                where: { id: atual.id },
                data: { ...dados, ...(atual.ativa ? {} : { desde: new Date() }), itens: { create: itens } },
                include: comItens,
            });
        }
        return tx.assinatura.create({ data: { ...dados, clienteId: u.id, itens: { create: itens } }, include: comItens });
    });
    return Response.json(resposta(a), { status: 201 });
});

export const DELETE = rota(async (req) => {
    const u = await exigirLogin(req);
    const a = await prisma.assinatura.update({ where: { clienteId: u.id }, data: { ativa: false }, include: comItens });
    return Response.json(resposta(a));
});
