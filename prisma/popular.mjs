// Coloca no banco clientes, pets, pedidos, agendamentos e assinaturas de exemplo,
// para o site parecer em uso (painel com gráficos, agenda cheia, histórico de pedidos...).
//
// Rodar:   node prisma/popular.mjs           → adiciona os dados de exemplo
//          node prisma/popular.mjs apagar    → tira só os dados de exemplo (o resto fica)
//
// NÃO apaga nada do que já existe (catálogo, admin, Maria, João, clientes de verdade).
// Os clientes de exemplo usam e-mails @exemplo.com, a senha 123 e telefones de mentira (90000-00xx).
// Rode uma vez só, por uma pessoa só. Se rodar de novo, ele avisa que já tem.
// As datas são contadas a partir de hoje: rodando de novo depois de "apagar", tudo fica atual.

import { scryptSync, randomBytes } from 'node:crypto';
import prismaPkg from '@prisma/client';

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();
const DOMINIO = '@exemplo.com';

// ---------- sorteio que sempre dá o mesmo resultado (os dados ficam iguais para todo mundo)
let semente = 20261122;
const aleatorio = () => { semente = (semente * 1103515245 + 12345) % 2147483648; return semente / 2147483648; };
const entre = (a, b) => a + Math.floor(aleatorio() * (b - a + 1));
const um = (lista) => lista[Math.floor(aleatorio() * lista.length)];
const chance = (p) => aleatorio() < p;
const arred = (v) => Math.round(v * 100) / 100;

function hashSenha(senha) {
    const sal = randomBytes(16).toString('hex');
    return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`;
}
const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function dia(n) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d; }
// data e hora de um pedido feito "n" dias atrás (entre 9h e 19h)
function momento(n) { const d = dia(-n); d.setHours(entre(9, 19), entre(0, 59), 0, 0); return d > new Date() ? new Date(Date.now() - 60000 * entre(5, 90)) : d; }

// ---------- pessoas de exemplo
const CLIENTES = [
    ['Ana Paula Fischer', 'Rua Marechal Floriano', 'Centro'], ['Bruno Kessler', 'Av. Venâncio Aires', 'Centro'],
    ['Carla Mendes', 'Rua Antunes Ribas', 'Centro'], ['Diego Schneider', 'Rua Três de Outubro', 'Dido'],
    ['Eduarda Rossi', 'Rua Bento Gonçalves', 'Harmonia'], ['Fernando Wolff', 'Av. Brasil', 'Missões'],
    ['Gabriela Lopes', 'Rua Sete de Setembro', 'Centro'], ['Henrique Bauer', 'Rua Florêncio de Abreu', 'Pippi'],
    ['Isadora Klein', 'Rua Tiradentes', 'Haller'], ['Jorge Dalla Rosa', 'Estrada Linha Pinhal', 'Interior'],
    ['Larissa Machado', 'Rua Duque de Caxias', 'Centro'], ['Marcos Friedrich', 'Rua Sepé Tiaraju', 'São Carlos'],
    ['Natália Peixoto', 'Rua Rio Grande do Sul', 'Aliança'], ['Otávio Hoffmann', 'Estrada Rincão dos Mendes', 'Interior'],
    ['Patrícia Zanella', 'Rua Getúlio Vargas', 'Centro'], ['Rafael Becker', 'Rua Silva Jardim', 'Oliveira'],
    ['Sabrina Weber', 'Rua Mauá', 'Centro'], ['Tiago Brum', 'Av. Rio Grande do Sul', 'Missões'],
    ['Vanessa Correa', 'Rua Barão do Rio Branco', 'Kurtz'], ['William Steffens', 'Linha Cascata', 'Interior'],
];
const NOMES_CAES = ['Bob', 'Mel', 'Pipoca', 'Fred', 'Amora', 'Toby', 'Bidu', 'Nina', 'Zeus', 'Pandora', 'Paçoca', 'Marley', 'Belinha', 'Rex'];
const NOMES_GATOS = ['Frajola', 'Mingau', 'Salem', 'Lua', 'Tom', 'Pérola', 'Garfield', 'Nala', 'Chico', 'Mia'];
const RACAS_CAES = ['SRD', 'Shih Tzu', 'Poodle', 'Labrador', 'Golden Retriever', 'Yorkshire', 'Border Collie', 'Pinscher', 'Lhasa Apso', 'Pastor Alemão'];
const RACAS_GATOS = ['SRD', 'Siamês', 'Persa', 'Maine Coon', 'Angorá'];
const OUTROS = [['Piu', 'Pássaro', 'Calopsita'], ['Nemo', 'Peixe', 'Betta'], ['Pingo', 'Roedor', 'Hamster'], ['Kiwi', 'Pássaro', 'Periquito']];
const OBS_CLIENTE = ['Prefere receber à tarde.', 'Cliente antigo da loja física.', 'Pede para avisar pelo WhatsApp antes de entregar.', 'Tem chácara no interior: compra ração em quantidade.', 'O cachorro tem pele sensível: usar shampoo neutro.'];
const OBS_PEDIDO = ['Entregar depois das 14h.', 'Deixar na portaria.', 'Cliente pediu nota fiscal no CPF.', 'Ligar antes de sair para entrega.'];
const PAGAMENTOS = ['Pix', 'Pix', 'Pix', 'Cartão de crédito', 'Cartão de crédito', 'Boleto'];
const HORARIOS = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30'];
const PORTES = { Pequeno: 1, 'Médio': 1.3, Grande: 1.6 };

// Clientes de exemplo (confere o e-mail aqui também, para nunca pegar outra conta)
async function exemplos() {
    const lista = await prisma.usuario.findMany({ where: { email: { endsWith: DOMINIO }, admin: false } });
    return lista.filter(u => u.email.endsWith(DOMINIO) && !u.admin);
}

async function apagar() {
    const ids = (await exemplos()).map(u => u.id);
    if (!ids.length) { console.log('Não há dados de exemplo para apagar.'); return; }
    const where = { clienteId: { in: ids } };
    const ag = await prisma.agendamento.deleteMany({ where });
    const ped = await prisma.pedido.deleteMany({ where });                   // os itens vão junto
    await prisma.usuario.deleteMany({ where: { id: { in: ids } } });          // pets, assinaturas e sessões vão junto
    console.log(`Apagados: ${ids.length} clientes de exemplo, ${ped.count} pedidos e ${ag.count} agendamentos.`);
}

async function popular() {
    if ((await exemplos()).length) {
        console.log('Os dados de exemplo já estão no banco. Para refazer:  node prisma/popular.mjs apagar  e depois rode de novo.');
        return;
    }
    const config = await prisma.configuracaoSite.findUnique({ where: { id: 1 } });
    const produtos = await prisma.produto.findMany({ where: { ativo: true }, include: { categoria: true } });
    const servicos = await prisma.servico.findMany();
    const adicionais = await prisma.adicional.findMany();
    if (!produtos.length || !config) { console.log('O catálogo está vazio. Rode o seed antes.'); return; }
    const racoes = produtos.filter(p => ['Ração', 'Alimentação', 'Nutrição'].includes(p.categoria.nome));
    const deCao = produtos.filter(p => p.animalId === 'caes'), deGato = produtos.filter(p => p.animalId === 'gatos');
    const agro = produtos.filter(p => !['caes', 'gatos'].includes(p.animalId));
    const senhaHash = hashSenha('123');

    // ---------- clientes, pets e assinaturas
    console.log('Clientes e pets...');
    const clientes = [];
    for (let i = 0; i < CLIENTES.length; i++) {
        const [nome, rua, bairro] = CLIENTES[i];
        const primeiro = nome.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const sobrenome = nome.split(' ').slice(-1)[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const pets = [];
        const nPets = entre(1, 3);
        for (let k = 0; k < nPets; k++) {
            const r = aleatorio();
            if (r < 0.55) pets.push({ nome: um(NOMES_CAES), tipo: 'Cachorro', porte: um(['Pequeno', 'Pequeno', 'Médio', 'Grande']), raca: um(RACAS_CAES), sexo: um(['Macho', 'Fêmea']), nascimento: isoLocal(dia(-entre(200, 3600))) });
            else if (r < 0.9) pets.push({ nome: um(NOMES_GATOS), tipo: 'Gato', porte: 'Pequeno', raca: um(RACAS_GATOS), sexo: um(['Macho', 'Fêmea']), nascimento: isoLocal(dia(-entre(200, 3000))) });
            else { const [n, t, raca] = um(OUTROS); pets.push({ nome: n, tipo: t, porte: 'Pequeno', raca, sexo: um(['Macho', 'Fêmea']) }); }
        }
        const u = await prisma.usuario.create({
            data: {
                nome, email: `${primeiro}.${sobrenome}${DOMINIO}`, senhaHash, criadoEm: dia(-entre(5, 120)),
                telefone: `(55) 90000-${String(i + 1).padStart(4, '0')}`, // número de mentira (não mande WhatsApp para ele)
                observacoes: chance(0.25) ? um(OBS_CLIENTE) : '',
                pets: { create: pets },
            },
            include: { pets: true },
        });
        u.endereco = `${rua}, ${entre(10, 2400)} — ${bairro}, Santo Ângelo (98800-000)`;
        u.interior = bairro === 'Interior';
        clientes.push(u);
    }

    console.log('Assinaturas do Clube...');
    const PLANOS = { basico: 5, premium: 10 };
    const assinantes = [[0, 'premium', 10], [2, 'premium', 5], [5, 'basico', 15], [8, 'premium', 20], [11, 'basico', 0], [14, 'premium', 10], [17, 'basico', 25]];
    for (const [i, plano, diaEntrega] of assinantes) {
        const c = clientes[i];
        const itens = diaEntrega ? [{ produtoId: um(racoes).id, qtd: entre(1, 2) }] : [];
        if (diaEntrega && chance(0.4)) { const r = um(racoes); if (!itens.some(x => x.produtoId === r.id)) itens.push({ produtoId: r.id, qtd: 1 }); }
        await prisma.assinatura.create({ data: { clienteId: c.id, plano, diaEntrega, pagamento: um(['Cartão de crédito', 'Pix']), desde: dia(-entre(10, 70)), itens: { create: itens } } });
        c.plano = plano;
    }
    // uma assinatura cancelada (aparece na aba "Canceladas")
    await prisma.assinatura.create({ data: { clienteId: clientes[19].id, plano: 'basico', diaEntrega: 0, ativa: false, desde: dia(-80) } });

    // ---------- pedidos dos últimos 60 dias (um pouco mais nos últimos 30, para o painel mostrar crescimento)
    console.log('Pedidos...');
    let nPedidos = 0;
    for (let n = 59; n >= 0; n--) {
        const quantos = n < 30 ? entre(1, 3) : entre(1, 2);
        for (let k = 0; k < quantos; k++) {
            const c = um(clientes);
            const temCao = c.pets.some(p => p.tipo === 'Cachorro'), temGato = c.pets.some(p => p.tipo === 'Gato');
            const fonte = c.interior ? agro : temCao && temGato ? um([deCao, deGato]) : temGato ? deGato : temCao ? deCao : produtos;
            const escolhidos = new Map();
            const nItens = entre(1, 4);
            for (let j = 0; j < nItens; j++) {
                const p = j === 0 && chance(0.6) ? um(racoes.filter(r => fonte.includes(r)).concat(fonte.length ? [] : racoes)) || um(fonte) : um(fonte);
                if (p) escolhidos.set(p.id, { p, qtd: (escolhidos.get(p.id)?.qtd || 0) + (p.preco < 30 ? entre(1, 3) : 1) });
            }
            const itens = [...escolhidos.values()];
            const subtotal = arred(itens.reduce((s, i) => s + i.p.preco * i.qtd, 0));
            const desconto = c.plano ? arred(subtotal * PLANOS[c.plano] / 100) : 0;
            const frete = c.plano === 'premium' || subtotal - desconto >= config.freteGratisAcima ? 0 : config.frete;
            let status = 'Entregue';
            if (n === 0) status = 'Recebido';
            else if (n === 1) status = um(['Recebido', 'Em separação']);
            else if (n <= 3) status = um(['Em separação', 'Enviado']);
            else if (n <= 6) status = um(['Enviado', 'Entregue', 'Entregue']);
            if (n > 1 && chance(0.07)) status = 'Cancelado';
            await prisma.pedido.create({
                data: {
                    clienteId: c.id, data: momento(n), subtotal, desconto, frete, total: arred(subtotal - desconto + frete),
                    pagamento: um(PAGAMENTOS), endereco: c.endereco, status,
                    observacao: chance(0.12) ? um(OBS_PEDIDO) : '',
                    arquivado: n > 40 && chance(0.5),                     // pedidos antigos já arquivados
                    itens: { create: itens.map(i => ({ produtoId: i.p.id, nome: i.p.nome, preco: i.p.preco, qtd: i.qtd })) },
                },
            });
            nPedidos++;
        }
    }

    // ---------- Banho e Tosa: últimos 30 dias e próximos 10
    console.log('Agendamentos...');
    const ocupadas = new Set((await prisma.agendamento.findMany({ where: { vaga: { not: null } } })).map(a => a.vaga));
    const comPet = clientes.filter(c => c.pets.some(p => ['Cachorro', 'Gato'].includes(p.tipo)));
    const gratisNoMes = new Set();
    let nAgenda = 0;
    for (let n = -30; n <= 10; n++) {
        const d = dia(n);
        if (d.getDay() === 0) continue;                                     // domingo fechado
        const data = isoLocal(d);
        const quantos = n < 0 ? entre(1, 4) : n === 0 ? 4 : entre(1, 3);
        const horas = [...HORARIOS].sort(() => aleatorio() - 0.5).slice(0, quantos).sort();
        for (const hora of horas) {
            const vagaTexto = `${data} ${hora}`;
            if (ocupadas.has(vagaTexto)) continue;
            const c = um(comPet);
            const pet = um(c.pets.filter(p => ['Cachorro', 'Gato'].includes(p.tipo)));
            const servico = um(pet.tipo === 'Gato' ? ['banho', 'banho', 'tosa'] : ['banho', 'completo', 'completo', 'tosa']);
            const sv = servicos.find(s => s.id === servico) || servicos[0];
            const extras = chance(0.45) ? [um(adicionais)] : [];
            const base = Math.round(sv.preco * (PORTES[pet.porte] || 1));
            const chaveMes = c.id + data.slice(0, 7);
            const gratis = c.plano === 'premium' && sv.id === 'banho' && !gratisNoMes.has(chaveMes);
            if (gratis) gratisNoMes.add(chaveMes);
            const passado = n < 0 || (n === 0 && hora < '12:00');
            const status = passado ? (chance(0.1) ? 'Cancelado' : 'Concluído') : (chance(0.05) ? 'Cancelado' : 'Agendado');
            await prisma.agendamento.create({
                data: {
                    clienteId: c.id, petId: pet.id, petNome: pet.nome, especie: pet.tipo, porte: pet.porte,
                    servicoId: sv.id, adicionais: extras.map(x => x.id).join(','), data, hora,
                    valor: arred((gratis ? 0 : base) + extras.reduce((s, x) => s + x.preco, 0)), gratis, status,
                    arquivado: n < -20 && status !== 'Agendado' && chance(0.5),
                    vaga: status === 'Cancelado' ? null : vagaTexto,
                    criadoEm: dia(Math.min(n, 0) - entre(1, 6)),
                },
            });
            if (status !== 'Cancelado') ocupadas.add(vagaTexto);
            nAgenda++;
        }
    }
    console.log(`Pronto! ${clientes.length} clientes (senha 123), ${nPedidos} pedidos, ${nAgenda} agendamentos e ${assinantes.length + 1} assinaturas de exemplo.`);
}

try {
    if (process.argv[2] === 'apagar') await apagar(); else await popular();
} catch (e) {
    console.error('Parou com erro:', e.message);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
