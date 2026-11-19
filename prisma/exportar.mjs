// Copia o catálogo que está no banco para o prisma/dados.json.
// Rodar:  node prisma/exportar.mjs
//
// Para que serve: é uma cópia de segurança do catálogo. O que foi cadastrado pelo painel do admin
// (produtos, categorias, imagens, textos da página inicial, frete, serviços) vai para o dados.json,
// que fica guardado no GitHub. Se alguém rodar o seed, o catálogo volta igual a essa cópia.
//
// Não exporta usuários, pets, pedidos, agendamentos nem assinaturas (são dados de teste; o seed recria).

import { writeFileSync } from 'node:fs';
import prismaPkg from '@prisma/client';

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();
const arquivo = new URL('./dados.json', import.meta.url);

// tira os campos que o banco gera sozinho (o seed cria de novo)
const sem = (obj, ...campos) => { const o = { ...obj }; campos.forEach(c => delete o[c]); return o; };

async function main() {
    const config = await prisma.configuracaoSite.findUnique({ where: { id: 1 } });
    if (!config) throw new Error('O banco está vazio. Rode antes:  node prisma/seed.mjs');

    const animais = await prisma.animal.findMany({
        orderBy: { ordem: 'asc' },
        include: { categorias: { orderBy: { ordem: 'asc' } } },
    });
    const produtos = await prisma.produto.findMany({ orderBy: { id: 'asc' }, include: { categoria: true } });
    const servicos = await prisma.servico.findMany();
    const adicionais = await prisma.adicional.findMany();

    const dados = {
        config: sem(config, 'id'),
        animais: animais.map(a => ({ ...a, categorias: a.categorias.map(c => sem(c, 'id', 'animalId')) })),
        produtos: produtos.map(p => ({ ...sem(p, 'id', 'categoriaId', 'criadoEm', 'categoria'), categoria: p.categoria.nome })),
        servicos,
        adicionais,
    };

    writeFileSync(arquivo, JSON.stringify(dados, null, 1) + '\n');

    const comFoto = produtos.filter(p => p.imagem).length;
    console.log(`Pronto! dados.json atualizado: ${animais.length} animais, ${produtos.length} produtos (${comFoto} com foto), ` +
        `${servicos.length} serviços, ${adicionais.length} adicionais.`);
    console.log('Se não gostou, volte o arquivo como estava:  git checkout -- prisma/dados.json');
    console.log('Agora:  git add .   →   git commit -m "copia do catalogo"   →   git push');
}

main()
    .catch((e) => { console.error(e.message || e); process.exit(1); })
    .finally(() => prisma.$disconnect());
