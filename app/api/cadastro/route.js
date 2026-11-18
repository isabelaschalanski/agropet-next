// POST /api/cadastro   { nome, email, telefone, senha }  → { token, usuario }
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../lib/api';
import { hashSenha, criarSessao, usuarioPublico } from '../../../lib/auth';

export const POST = rota(async (req) => {
    const b = await lerCorpo(req);
    const email = String(b.email || '').trim().toLowerCase();
    exigir(b.nome && String(b.nome).trim(), 'Informe o nome');
    exigir(/^\S+@\S+\.\S+$/.test(email), 'E-mail inválido');
    exigir(String(b.senha || '').length >= 3, 'A senha precisa ter pelo menos 3 caracteres');
    exigir(!(await prisma.usuario.findUnique({ where: { email } })), 'Já existe uma conta com esse e-mail', 409);
    const u = await prisma.usuario.create({ data: { nome: String(b.nome).trim(), email, telefone: String(b.telefone || ''), senhaHash: hashSenha(String(b.senha)) } });
    const token = await criarSessao(u.id);
    return Response.json({ token, usuario: usuarioPublico(u) }, { status: 201 });
});
