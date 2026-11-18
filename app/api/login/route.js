// POST /api/login   { login: "maria@email.com", senha: "123" }  → { token, usuario }
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, ErroHttp } from '../../../lib/api';
import { conferirSenha, criarSessao, usuarioPublico } from '../../../lib/auth';

export const POST = rota(async (req) => {
    const { login, senha } = await lerCorpo(req);
    const u = await prisma.usuario.findUnique({ where: { email: String(login || '').trim().toLowerCase() } });
    if (!u || !conferirSenha(String(senha || ''), u.senhaHash)) throw new ErroHttp(401, 'E-mail/usuário ou senha incorretos');
    const token = await criarSessao(u.id);
    return Response.json({ token, usuario: usuarioPublico(u) });
});
