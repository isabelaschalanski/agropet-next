// GET    /api/admin/clientes/3 (admin) → ficha completa: dados, pets, pedidos, agendamentos, assinatura
// PUT    /api/admin/clientes/3 (admin) { nome, email, telefone, observacoes }
// DELETE /api/admin/clientes/3 (admin) → apaga o cliente e TUDO dele (pets, pedidos, agendamentos, assinatura)
import { prisma } from '../../../../../lib/db';
import { rota, lerCorpo, lerId, exigir, ErroHttp } from '../../../../../lib/api';
import { exigirAdmin, usuarioPublico } from '../../../../../lib/auth';
import { agendamentoParaFront } from '../../../../../lib/formatos';

async function buscarCliente(id) {
    const c = await prisma.usuario.findUnique({ where: { id } });
    if (!c || c.admin) throw new ErroHttp(404, 'Cliente não encontrado');
    return c;
}

export const GET = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    await buscarCliente(id);
    const c = await prisma.usuario.findUnique({
        where: { id },
        include: {
            pets: true,
            pedidos: { include: { itens: true }, orderBy: { data: 'desc' } },
            agendamentos: { include: { servico: true }, orderBy: [{ data: 'desc' }, { hora: 'desc' }] },
            assinatura: { include: { itens: { include: { produto: { select: { nome: true } } } } } },
        },
    });
    return Response.json({ ...usuarioPublico(c), agendamentos: c.agendamentos.map(agendamentoParaFront) });
});

export const PUT = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    await buscarCliente(id);
    const b = await lerCorpo(req);
    const data = {};
    if (b.nome !== undefined) { exigir(String(b.nome).trim().length >= 2, 'Informe o nome'); data.nome = String(b.nome).trim(); }
    if (b.email !== undefined) {
        const email = String(b.email).trim().toLowerCase();
        exigir(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'E-mail inválido');
        const outro = await prisma.usuario.findUnique({ where: { email } });
        exigir(!outro || outro.id === id, 'Esse e-mail já é de outra conta');
        data.email = email;
    }
    if (b.telefone !== undefined) data.telefone = String(b.telefone).trim().slice(0, 30);
    if (b.observacoes !== undefined) data.observacoes = String(b.observacoes).slice(0, 2000);
    const c = await prisma.usuario.update({ where: { id }, data });
    return Response.json(usuarioPublico(c));
});

export const DELETE = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    await buscarCliente(id);
    await prisma.$transaction([
        prisma.agendamento.deleteMany({ where: { clienteId: id } }),
        prisma.pedido.deleteMany({ where: { clienteId: id } }),     // itens vão junto
        prisma.usuario.delete({ where: { id } }),                   // pets, assinatura e sessões vão junto
    ]);
    return Response.json({ ok: true });
});
