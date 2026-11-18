// Login: senhas criptografadas e sessões por token
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { prisma } from './db';
import { ErroHttp } from './api';

export function hashSenha(senha) {
    const sal = randomBytes(16).toString('hex');
    return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`;
}

export function conferirSenha(senha, guardado) {
    const [sal, hash] = (guardado || '').split(':');
    if (!sal || !hash) return false;
    const teste = scryptSync(senha, sal, 64);
    const original = Buffer.from(hash, 'hex');
    return original.length === teste.length && timingSafeEqual(original, teste);
}

export async function criarSessao(usuarioId) {
    const token = randomBytes(24).toString('hex');
    await prisma.sessao.create({ data: { token, usuarioId } });
    return token;
}

export function tokenDa(requisicao) {
    const h = requisicao.headers.get('authorization') || '';
    return h.startsWith('Bearer ') ? h.slice(7).trim() : null;
}

// O front manda o token no cabeçalho:  Authorization: Bearer <token>
export async function usuarioDaRequisicao(requisicao) {
    const token = tokenDa(requisicao);
    if (!token) return null;
    const sessao = await prisma.sessao.findUnique({
        where: { token },
        include: { usuario: { include: { assinatura: { include: { itens: true } } } } },
    });
    return sessao ? sessao.usuario : null;
}

export async function exigirLogin(requisicao) {
    const u = await usuarioDaRequisicao(requisicao);
    if (!u) throw new ErroHttp(401, 'Faça login para continuar');
    return u;
}

export async function exigirAdmin(requisicao) {
    const u = await exigirLogin(requisicao);
    if (!u.admin) throw new ErroHttp(403, 'Acesso só para o gerenciamento');
    return u;
}

// Nunca devolve a senha para o front
export function usuarioPublico(u) {
    if (!u) return null;
    const { senhaHash, ...resto } = u;
    return resto;
}
