// Coloca os dados de exemplo no banco (os mesmos da prévia).
// Rodar:  node prisma/seed.mjs
// ATENÇÃO: apaga tudo o que estiver no banco antes de colocar os dados.

import { readFileSync } from 'node:fs';
import { scryptSync, randomBytes } from 'node:crypto';
import prismaPkg from '@prisma/client';

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();
const dados = JSON.parse(readFileSync(new URL('./dados.json', import.meta.url), 'utf8'));

function hashSenha(senha) {
    const sal = randomBytes(16).toString('hex');
    return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`;
}
function diaISO(n) {
    const d = new Date(); d.setDate(d.getDate() + n);
    if (n > 0 && d.getDay() === 0) d.setDate(d.getDate() + 1); // não marca domingo
    return d.toISOString().slice(0, 10);
}
function diasAtras(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

async function main() {
    console.log('Limpando o banco...');
    await prisma.sessao.deleteMany();
    await prisma.agendamento.deleteMany();
    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.itemAssinatura.deleteMany();
    await prisma.assinatura.deleteMany();
    await prisma.pet.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.produto.deleteMany();
    await prisma.categoria.deleteMany();
    await prisma.animal.deleteMany();
    await prisma.servico.deleteMany();
    await prisma.adicional.deleteMany();
    await prisma.configuracaoSite.deleteMany();

    console.log('Configurações, animais e categorias...');
    await prisma.configuracaoSite.create({ data: { id: 1, ...dados.config } });
    for (const a of dados.animais) {
        const { categorias, ...animal } = a;
        await prisma.animal.create({ data: { ...animal, categorias: { create: categorias } } });
    }

    console.log('Produtos...');
    const cats = await prisma.categoria.findMany();
    const idCategoria = (animalId, nome) => cats.find(c => c.animalId === animalId && c.nome === nome).id;
    const idsProdutos = [];
    for (const p of dados.produtos) {
        const { categoria, ...prod } = p;
        const criado = await prisma.produto.create({ data: { ...prod, categoriaId: idCategoria(p.animalId, categoria) } });
        idsProdutos.push(criado.id); // idsProdutos[0] = produto 1 da prévia, e assim por diante
    }
    const prod = (n) => idsProdutos[n - 1];

    console.log('Banho e Tosa...');
    await prisma.servico.createMany({ data: dados.servicos });
    await prisma.adicional.createMany({ data: dados.adicionais });

    console.log('Usuários, pets e assinatura...');
    await prisma.usuario.create({ data: { nome: 'Administrador', email: 'admin', senhaHash: hashSenha('123'), admin: true } });
    const maria = await prisma.usuario.create({
        data: {
            nome: 'Maria Souza', email: 'maria@email.com', senhaHash: hashSenha('123'), telefone: '(55) 99999-1234', criadoEm: diasAtras(30),
            pets: { create: [
                { nome: 'Thor', tipo: 'Cachorro', porte: 'Grande', raca: 'Golden Retriever', sexo: 'Macho', nascimento: '2021-03-10' },
                { nome: 'Luna', tipo: 'Gato', porte: 'Pequeno', raca: 'SRD', sexo: 'Fêmea', nascimento: '2022-08-01' },
            ] },
            assinatura: { create: { plano: 'premium', diaEntrega: 10, desde: diasAtras(20), itens: { create: [{ produtoId: prod(1), qtd: 1 }, { produtoId: prod(3), qtd: 6 }] } } },
        },
        include: { pets: true },
    });
    const joao = await prisma.usuario.create({
        data: {
            nome: 'João Lima', email: 'joao@email.com', senhaHash: hashSenha('123'), telefone: '(55) 98888-4321', criadoEm: diasAtras(12),
            pets: { create: [{ nome: 'Mimi', tipo: 'Gato', porte: 'Pequeno', raca: 'Siamês', sexo: 'Fêmea' }] },
        },
        include: { pets: true },
    });

    console.log('Pedidos e agendamentos...');
    await prisma.pedido.create({ data: {
        clienteId: maria.id, data: diasAtras(3), subtotal: 191.7, desconto: 19.17, frete: 0, total: 172.53, pagamento: 'Pix',
        endereco: 'Rua Antunes Ribas, 123 — Centro, Santo Ângelo', status: 'Enviado',
        itens: { create: [{ produtoId: prod(13), nome: 'Ração Gatos Castrados 10kg', preco: 159.9, qtd: 1 }, { produtoId: prod(17), nome: 'Varinha com Penas', preco: 15.9, qtd: 2 }] },
    } });
    await prisma.pedido.create({ data: {
        clienteId: joao.id, data: diasAtras(1), subtotal: 38.7, desconto: 0, frete: 14.9, total: 53.6, pagamento: 'Cartão de crédito',
        endereco: 'Av. Brasil, 900 — Missões, Santo Ângelo', status: 'Recebido',
        itens: { create: [{ produtoId: prod(7), nome: 'Bolinha de Borracha', preco: 12.9, qtd: 3 }] },
    } });
    const [thor, luna] = maria.pets;
    const [mimi] = joao.pets;
    await prisma.agendamento.createMany({ data: [
        { clienteId: maria.id, petId: thor.id, petNome: 'Thor', especie: 'Cachorro', porte: 'Grande', servicoId: 'completo', adicionais: 'hidratacao', data: diaISO(2), hora: '09:30', valor: 153 },
        { clienteId: joao.id, petId: mimi.id, petNome: 'Mimi', especie: 'Gato', porte: 'Pequeno', servicoId: 'banho', data: diaISO(2), hora: '13:30', valor: 45 },
        { clienteId: maria.id, petId: luna.id, petNome: 'Luna', especie: 'Gato', porte: 'Pequeno', servicoId: 'banho', adicionais: 'unhas', data: diaISO(-15), hora: '11:00', valor: 15, gratis: true, status: 'Concluído' },
    ] });

    console.log(`Pronto! ${idsProdutos.length} produtos, 3 usuários (admin / maria@email.com / joao@email.com — senha 123).`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
