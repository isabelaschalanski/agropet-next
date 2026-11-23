// Troca a senha de uma conta direto no banco.
// Rodar:  node prisma/trocar-senha.mjs admin NovaSenha123
//         node prisma/trocar-senha.mjs maria@email.com 123
//
// Serve para trocar a senha do admin (que não tem tela de "Meus dados")
// ou para recuperar uma conta de teste que alguém alterou.

import { scryptSync, randomBytes } from 'node:crypto';
import prismaPkg from '@prisma/client';

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();
const [login, senha] = process.argv.slice(2);

if (!login || !senha) {
    console.log('Use assim:  node prisma/trocar-senha.mjs USUARIO NOVA_SENHA');
    process.exit(1);
}

// mesmo formato do lib/auth.js: "sal:hash"
const sal = randomBytes(16).toString('hex');
const senhaHash = `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`;

try {
    const u = await prisma.usuario.update({ where: { email: login.trim().toLowerCase() }, data: { senhaHash } });
    await prisma.sessao.deleteMany({ where: { usuarioId: u.id } }); // desconecta quem estava logado nessa conta
    console.log(`Senha de "${u.email}" trocada. Quem estava logado nessa conta foi desconectado.`);
} catch {
    console.log(`Não achei a conta "${login}".`);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
