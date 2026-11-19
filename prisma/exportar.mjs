// Copia o catálogo que está no banco para o prisma/dados.json.
// Rodar:  node prisma/exportar.mjs
//
// Para que serve: o que você muda pelo painel do admin (produtos, categorias, imagens dos banners e dos animais,
// textos da página inicial, frete, serviços) fica só no SEU banco (prisma/dev.db), que não vai para o GitHub.
// Rodando este script, essas mudanças vão para o dados.json. Aí é só fazer commit e push, e os colegas
// recebem com  git pull  +  node prisma/seed.mjs
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
    console.log('Agora:  git add .   →   git commit -m "produtos atualizados"   →   git push');
}

main()
    .catch((e) => { console.error(e.message || e); process.exit(1); })
    .finally(() => prisma.$disconnect());
