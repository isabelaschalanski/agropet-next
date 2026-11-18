// GET /api/eu  → dados de quem está logado (com assinatura e pets)
// PUT /api/eu  { nome, email, telefone, senha? }  → atualiza os dados
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../lib/api';
import { exigirLogin, usuarioPublico, hashSenha } from '../../../lib/auth';
import { PLANOS, proximaEntrega } from '../../../lib/regras';

export const GET = rota(async (req) => {
    const u = await exigirLogin(req);
    const completo = await prisma.usuario.findUnique({
        where: { id: u.id },
        include: { pets: true, assinatura: { include: { itens: { include: { produto: true } } } } },
    });
    const a = completo.assinatura;
    return Response.json({
        ...usuarioPublico(completo),
        assinatura: a ? { ...a, planoInfo: PLANOS[a.plano], proximaEntrega: a.ativa ? proximaEntrega(a.diaEntrega) : null } : null,
    });
});

export const PUT = rota(async (req) => {
    const u = await exigirLogin(req);
    const b = await lerCorpo(req);
    const data = {};
    if (b.nome !== undefined) { exigir(String(b.nome).trim(), 'Informe o nome'); data.nome = String(b.nome).trim(); }
    if (b.telefone !== undefined) data.telefone = String(b.telefone);
    if (b.email !== undefined) {
        const email = String(b.email).trim().toLowerCase();
        const outro = await prisma.usuario.findUnique({ where: { email } });
        exigir(!outro || outro.id === u.id, 'Esse e-mail já está em uso', 409);
        data.email = email;
    }
    if (b.senha) data.senhaHash = hashSenha(String(b.senha));
    const novo = await prisma.usuario.update({ where: { id: u.id }, data });
    return Response.json(usuarioPublico(novo));
});
