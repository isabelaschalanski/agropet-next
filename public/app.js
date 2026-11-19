/* AgroPet — lógica do site (carregada pelo app/page.js) */
/* =========================================================
   DADOS FIXOS
   ========================================================= */
const ANIMAIS = [
    { id: 'caes', nome: 'Cães', icone: '🐶', cor: 'amarelo', grupos: [
        { t: 'Ração', i: ['Ração Seca', 'Ração Úmida', 'Ração Natural', 'Ração para Filhotes'] },
        { t: 'Petiscos e Ossos', i: ['Bifinhos', 'Biscoitos', 'Ossos e Mordedores'] },
        { t: 'Farmácia', i: ['Antipulgas e Carrapatos', 'Vermífugos', 'Vitaminas'] },
        { t: 'Brinquedos', i: ['Bolinhas', 'Pelúcias', 'Cordas'] },
        { t: 'Coleiras e Guias', i: ['Coleiras', 'Guias', 'Peitorais'] },
        { t: 'Higiene e Beleza', i: ['Shampoos', 'Tapetes Higiênicos', 'Escovas'] },
        { t: 'Camas e Casinhas', i: ['Camas', 'Casinhas', 'Cobertores'] },
    ]},
    { id: 'gatos', nome: 'Gatos', icone: '🐱', cor: 'azul', grupos: [
        { t: 'Ração', i: ['Ração Seca', 'Sachês e Patês', 'Gatos Castrados'] },
        { t: 'Areia e Higiene', i: ['Areia Sanitária', 'Caixas de Areia', 'Pás'] },
        { t: 'Farmácia', i: ['Antipulgas', 'Vermífugos'] },
        { t: 'Arranhadores e Brinquedos', i: ['Arranhadores', 'Varinhas', 'Bolinhas'] },
        { t: 'Camas e Tocas', i: ['Camas', 'Tocas'] },
    ]},
    { id: 'passaros', nome: 'Pássaros', icone: '🐦', cor: 'rosa', outro: true, grupos: [
        { t: 'Alimentação', i: ['Alpiste', 'Mistura de Sementes', 'Farinhada'] },
        { t: 'Gaiolas e Viveiros', i: ['Gaiolas', 'Poleiros', 'Ninhos'] },
        { t: 'Comedouros e Bebedouros', i: ['Comedouros', 'Bebedouros'] },
        { t: 'Saúde', i: ['Vitaminas'] },
    ]},
    { id: 'peixes', nome: 'Peixes', icone: '🐟', cor: 'verde', outro: true, grupos: [
        { t: 'Alimentação', i: ['Ração em Flocos', 'Ração Granulada'] },
        { t: 'Aquários', i: ['Aquários', 'Kits Completos'] },
        { t: 'Equipamentos', i: ['Filtros', 'Termostatos', 'Bombas'] },
        { t: 'Tratamento da Água', i: ['Condicionadores', 'Testes de Água'] },
    ]},
    { id: 'roedores', nome: 'Roedores', icone: '🐹', cor: 'laranja', outro: true, grupos: [
        { t: 'Alimentação', i: ['Ração', 'Feno', 'Petiscos'] },
        { t: 'Gaiolas e Acessórios', i: ['Gaiolas', 'Rodas', 'Casinhas'] },
        { t: 'Higiene', i: ['Serragem', 'Substrato'] },
    ]},
    { id: 'bovinos', nome: 'Bovinos', icone: '🐄', cor: 'verde', agro: true, grupos: [
        { t: 'Nutrição', i: ['Sal Mineral', 'Ração', 'Suplemento Proteico'] },
        { t: 'Saúde', i: ['Vacinas', 'Vermífugos', 'Antibióticos'] },
        { t: 'Controle de Parasitas', i: ['Carrapaticidas', 'Mosquicidas'] },
        { t: 'Manejo', i: ['Brincos', 'Seringas', 'Cabrestos'] },
        { t: 'Cercas e Cochos', i: ['Eletrificadores', 'Arame', 'Cochos'] },
    ]},
    { id: 'equinos', nome: 'Equinos', icone: '🐴', cor: 'roxo', agro: true, grupos: [
        { t: 'Alimentação', i: ['Ração', 'Suplementos', 'Feno'] },
        { t: 'Selaria', i: ['Selas', 'Cabeçadas', 'Mantas'] },
        { t: 'Saúde', i: ['Vermífugos', 'Pomadas'] },
        { t: 'Higiene e Cascos', i: ['Escovas', 'Óleo para Cascos', 'Ferraduras'] },
    ]},
    { id: 'aves', nome: 'Aves de Criação', curto: 'Aves', icone: '🐔', cor: 'laranja', agro: true, grupos: [
        { t: 'Alimentação', i: ['Ração para Poedeiras', 'Ração para Corte', 'Milho'] },
        { t: 'Equipamentos', i: ['Bebedouros', 'Comedouros', 'Chocadeiras'] },
        { t: 'Saúde', i: ['Vitaminas', 'Desinfetantes'] },
    ]},
    { id: 'suinos', nome: 'Suínos', icone: '🐖', cor: 'rosa', agro: true, grupos: [
        { t: 'Alimentação', i: ['Ração', 'Núcleos'] },
        { t: 'Saúde', i: ['Vermífugos', 'Ferro para Leitões'] },
        { t: 'Manejo', i: ['Bebedouros', 'Comedouros'] },
    ]},
    { id: 'ovinos', nome: 'Ovinos e Caprinos', curto: 'Ovinos', icone: '🐑', cor: 'cinza', agro: true, grupos: [
        { t: 'Alimentação', i: ['Ração', 'Sal Mineral'] },
        { t: 'Saúde', i: ['Vermífugos'] },
        { t: 'Manejo', i: ['Tesouras de Tosquia', 'Brincos'] },
    ]},
];

const SERVICOS = [
    { id: 'banho', nome: 'Banho', desc: 'Shampoo neutro, secagem e perfume', preco: 45, icone: '🛁' },
    { id: 'tosa', nome: 'Tosa higiênica', desc: 'Patas, barriga e região íntima', preco: 35, icone: '✂️' },
    { id: 'completo', nome: 'Banho + Tosa completa', desc: 'Banho, tosa geral, unhas e ouvidos', preco: 80, icone: '✨' },
];
const PORTES = { 'Pequeno': 1, 'Médio': 1.3, 'Grande': 1.6 };
const EXTRAS = [
    { id: 'hidratacao', nome: 'Hidratação dos pelos', desc: 'Pelos macios e brilhantes', preco: 25, icone: '💧' },
    { id: 'unhas', nome: 'Corte de unhas', desc: 'Com lixamento', preco: 15, icone: '💅' },
    { id: 'dentes', nome: 'Escovação dos dentes', desc: 'Hálito fresquinho', preco: 15, icone: '🪥' },
    { id: 'perfume', nome: 'Perfume e lacinho', desc: 'Aquele charme final', preco: 10, icone: '🎀' },
];
const TIPOS_PET = { 'Cachorro': '🐶', 'Gato': '🐱' };
const extraPor = (id) => EXTRAS.find(x => x.id === id) || { nome: id, preco: 0 };
const HORARIOS = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30'];

const PLANOS = {
    basico: { nome: 'Básico', preco: 19.9, desconto: 5, beneficios: ['5% de desconto em todos os produtos', 'Ração entregue todo mês', 'Frete grátis na entrega da assinatura'] },
    premium: { nome: 'Premium', preco: 39.9, desconto: 10, beneficios: ['10% de desconto em todos os produtos', 'Ração entregue todo mês', 'Frete grátis em todos os pedidos', '1 banho grátis por mês', 'Prioridade no agendamento'] },
};

const STATUS_PEDIDO = ['Recebido', 'Em separação', 'Enviado', 'Entregue', 'Cancelado'];
const STATUS_AGENDA = ['Agendado', 'Concluído', 'Cancelado'];
const CORES = ['amarelo', 'azul', 'laranja', 'roxo', 'verde', 'rosa', 'cinza'];


/* =========================================================
   DADOS — vêm da API (app/api) e ficam numa cópia aqui no navegador.
   No navegador só ficam guardados o carrinho e o token de login.
   ========================================================= */
const CHAVE = 'agropet_local_v1';
const IMG_BANNER_PADRAO = '/img/banner-animais.jpg';
const IMG_BANHO_PADRAO = '/img/banner-banho.jpg';
const IMG_CLUBE_PADRAO = '/img/banner-clube.jpg';

let local = {};
try { local = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { local = {}; }

const db = {
    site: { pilula: '', titulo: '', texto: '', botao: '', frete: 0, freteGratisAcima: 0, imgSlides: ['', '', ''], imgAnimais: {} },
    produtos: [], usuarios: [], pedidos: [], agendamentos: [],
    carrinho: Array.isArray(local.carrinho) ? local.carrinho : [],
    sessao: local.sessao || null,          // { token, tipo: 'cliente' | 'admin', id }
};

// Guarda no navegador só o carrinho e o login
function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify({ carrinho: db.carrinho, sessao: db.sessao })); } catch (e) { /* sem armazenamento */ }
    atualizarTopo();
}

// Chama a API. Ex.: await api('POST', '/pedidos', { ... })
async function api(metodo, caminho, corpo) {
    const resp = await fetch('/api' + caminho, {
        method: metodo,
        headers: { 'Content-Type': 'application/json', ...(db.sessao ? { Authorization: 'Bearer ' + db.sessao.token } : {}) },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    const dados = await resp.json().catch(() => null);
    if (resp.status === 401 && db.sessao) { db.sessao = null; salvar(); }
    if (!resp.ok) throw new Error((dados && dados.erro) || 'Não foi possível falar com o servidor');
    return dados;
}

// Roda uma ação que fala com a API e mostra o erro, se houver (não usar o nome "acao": já existe no clique)
function executar(fn) { return Promise.resolve().then(fn).catch((e) => aviso('⚠️ ' + e.message)); }

// ---- converte o formato da API para o formato que as telas usam
const soData = (d) => (d ? String(d).slice(0, 10) : '');
function assinaturaDaApi(a) {
    if (!a) return null;
    return { plano: a.plano, itens: (a.itens || []).map(i => ({ id: i.produtoId, qtd: i.qtd })), diaEntrega: a.diaEntrega, pagamento: a.pagamento, desde: soData(a.desde), ativa: a.ativa };
}
function usuarioDaApi(u) {
    return { id: u.id, nome: u.nome, email: u.email, telefone: u.telefone || '', criadoEm: soData(u.criadoEm), pets: u.pets || [], assinatura: assinaturaDaApi(u.assinatura) };
}
function pedidoDaApi(p) {
    return { ...p, data: soData(p.data), itens: p.itens.map(i => ({ id: i.produtoId, nome: i.nome, preco: i.preco, qtd: i.qtd })) };
}
function agendamentoDaApi(a) {
    return { ...a, pet: a.petNome, servico: a.servicoId, extras: a.adicionais || [] };
}

// Busca tudo o que as telas precisam
async function carregar() {
    const [config, animais, servicos] = await Promise.all([api('GET', '/config'), api('GET', '/animais'), api('GET', '/servicos')]);
    Object.assign(PLANOS, config.planos);
    const imgSlides = (config.imgSlides && config.imgSlides.length === 3) ? config.imgSlides : ['', '', ''];
    db.site = { ...config, imgSlides, imgAnimais: Object.fromEntries(animais.filter(a => a.imagem).map(a => [a.id, a.imagem])) };
    ANIMAIS.splice(0, ANIMAIS.length, ...animais.map(a => ({
        id: a.id, nome: a.nome, curto: a.curto || undefined, icone: a.icone, cor: a.cor, agro: a.agro, outro: a.outro,
        grupos: a.categorias.map(c => ({ t: c.nome, i: c.itens })),
    })));
    SERVICOS.splice(0, SERVICOS.length, ...servicos.servicos.map(x => ({ id: x.id, nome: x.nome, desc: x.descricao, preco: x.preco, icone: x.icone })));
    EXTRAS.splice(0, EXTRAS.length, ...servicos.adicionais.map(x => ({ id: x.id, nome: x.nome, desc: x.descricao, preco: x.preco, icone: x.icone })));

    if (db.sessao) {
        try {
            if (db.sessao.tipo === 'admin') {
                const [produtos, pedidos, agendamentos, clientes, assinaturas] = await Promise.all([
                    api('GET', '/produtos?todos=1'), api('GET', '/pedidos'), api('GET', '/agendamentos'), api('GET', '/admin/clientes'), api('GET', '/admin/assinaturas'),
                ]);
                db.produtos = produtos;
                db.pedidos = pedidos.map(pedidoDaApi).reverse();
                db.agendamentos = agendamentos.map(agendamentoDaApi);
                db.usuarios = clientes.map(c => usuarioDaApi({ ...c, assinatura: assinaturas.find(a => a.clienteId === c.id) || null }));
                return;
            }
            const [eu, pedidos, agendamentos] = await Promise.all([api('GET', '/eu'), api('GET', '/pedidos'), api('GET', '/agendamentos')]);
            db.usuarios = [usuarioDaApi(eu)];
            db.pedidos = pedidos.map(pedidoDaApi).reverse();
            db.agendamentos = agendamentos.map(agendamentoDaApi);
        } catch (e) {
            db.sessao = null; salvar();       // token vencido: volta a ser visitante
        }
    }
    if (!db.sessao) { db.usuarios = []; db.pedidos = []; db.agendamentos = []; }
    db.produtos = await api('GET', '/produtos');
    const ids = new Set(db.produtos.map(p => p.id));
    db.carrinho = db.carrinho.filter(i => ids.has(i.id));
}

// Recarrega os dados e redesenha a tela atual
async function sincronizar() { await carregar(); montarMenu(); rerenderMantendoRolagem(); }

/* =========================================================
   UTILITÁRIOS
   ========================================================= */
const $ = (s) => document.querySelector(s);
const dinheiro = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = (iso) => iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
const hojeISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const novoId = (lista) => lista.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const animalPor = (id) => ANIMAIS.find(a => a.id === id) || (id === 'agro' ? { id: 'agro', nome: 'Agro', icone: '🚜', grupos: [] } : { nome: id, icone: '🐾', grupos: [] });
const servicoPor = (id) => SERVICOS.find(s => s.id === id) || { nome: id };
const usuarioPor = (id) => db.usuarios.find(u => u.id === id);
const produtoPor = (id) => db.produtos.find(p => p.id === id);
const IMG_PADRAO = [IMG_BANNER_PADRAO, IMG_CLUBE_PADRAO, IMG_BANHO_PADRAO];
function imgSlide(i) { return db.site.imgSlides[i] || IMG_PADRAO[i]; }
function visualSlide(i, emojis) {
    const img = imgSlide(i);
    return img ? `<img class="slide-img" src="${img}" alt="">` : `<div class="bichos">${emojis.map(e => `<span>${e}</span>`).join('')}</div>`;
}
function iconeAnimal(a) { const img = db.site.imgAnimais[a.id]; return img ? `<img src="${img}" alt="${esc(a.nome)}">` : a.icone; }
function imgProduto(p) { return p.imagem ? `<img src="${p.imagem}" alt="${esc(p.nome)}">` : esc(p.icone); }
function esc(t) { return String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function usuarioLogado() { return db.sessao && db.sessao.tipo === 'cliente' ? usuarioPor(db.sessao.id) : null; }
function adminLogado() { return db.sessao && db.sessao.tipo === 'admin'; }
function planoAtivo(u) { return u && u.assinatura && u.assinatura.ativa ? PLANOS[u.assinatura.plano] : null; }

let tempoAviso;
function aviso(msg) {
    const el = $('#aviso');
    el.textContent = msg;
    el.classList.add('mostrar');
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(() => el.classList.remove('mostrar'), 2800);
}

let rotaVar = lerHash();
function lerHash() { const h = location.hash.replace(/^#\/?/, '').split('?')[0]; return h === 'inicio' ? '' : h; }
function ir(rota) {
    rotaVar = rota;
    try { location.hash = rota ? '#' + rota : '#inicio'; } catch (e) { /* visualizador sem hash */ }
    renderizar();
    window.scrollTo(0, 0);
}

let confirmarDepois = null;
function pedirConfirmacao(msg, fn) {
    confirmarDepois = fn;
    abrirModal(`<div class="modal-topo"><h2>Confirmar</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <p style="margin-bottom:20px">${esc(msg)}</p>
        <div class="modal-acoes"><button class="btn btn-borda" data-acao="fechar-modal">Não</button><button class="btn btn-azul" data-acao="sim-confirmar">Sim, confirmar</button></div>`);
}

/* =========================================================
   TOPO E MENU
   ========================================================= */
function itemMenuAnimal(a) {
    return `
        <li class="categoria" data-animal="${a.id}">
            <button type="button" class="cat-btn" data-acao="abrir-categoria">
                <span class="cat-icone">${a.icone}</span>${a.curto || a.nome}
            </button>
            <div class="painel">
                <ul class="painel-lista">
                    ${a.grupos.map(g => `
                    <li class="painel-item">
                        <button type="button" class="painel-item-btn" data-acao="filtrar" data-animal="${a.id}" data-categoria="${esc(g.t)}">
                            ${g.t} <span class="seta">›</span>
                        </button>
                        <div class="subpainel">
                            <h4>${g.t}</h4>
                            ${g.i.map(i => `<button class="link" data-acao="filtrar" data-animal="${a.id}" data-categoria="${esc(g.t)}">${i}</button>`).join('')}
                            <button class="link" style="font-weight:600;margin-top:6px" data-acao="filtrar" data-animal="${a.id}" data-categoria="${esc(g.t)}">Ver todos →</button>
                        </div>
                    </li>`).join('')}
                </ul>
                <button class="ver-tudo" data-acao="filtrar" data-animal="${a.id}">Ver tudo de ${a.nome} →</button>
            </div>
        </li>`;
}

function montarMenu() {
    const principais = ANIMAIS.filter(a => !a.outro);
    const outros = ANIMAIS.filter(a => a.outro);
    let html = principais.map(itemMenuAnimal).join('');
    html += `
        <li class="categoria" data-animal="outros-pets">
            <button type="button" class="cat-btn" data-acao="abrir-categoria">
                <span class="cat-icone">🐾</span>Outros Pets
            </button>
            <div class="painel">
                <ul class="painel-lista">
                    ${outros.map(a => `
                    <li class="painel-item">
                        <button type="button" class="painel-item-btn" data-acao="filtrar" data-animal="${a.id}">
                            <span>${a.icone}&nbsp; ${a.nome}</span> <span class="seta">›</span>
                        </button>
                        <div class="subpainel">
                            <h4>${a.icone} ${a.nome}</h4>
                            ${a.grupos.map(g => `<button class="link" data-acao="filtrar" data-animal="${a.id}" data-categoria="${esc(g.t)}">${g.t}</button>`).join('')}
                            <button class="link" style="font-weight:600;margin-top:6px" data-acao="filtrar" data-animal="${a.id}">Ver tudo de ${a.nome} →</button>
                        </div>
                    </li>`).join('')}
                </ul>
                <button class="ver-tudo" data-acao="filtrar" data-animal="outros-pets">Ver todos os Outros Pets →</button>
            </div>
        </li>`;
    html += `<li class="cat-espaco"></li>
             <li><a href="#clube" data-ir="clube" class="cat-link">⭐ Clube</a></li>
             <li><a href="#banho-e-tosa" data-ir="banho-e-tosa" class="cat-link">🛁 Banho e Tosa</a></li>`;
    $('#categorias').innerHTML = html;
}

function atualizarTopo() {
    const qtd = db.carrinho.reduce((s, i) => s + i.qtd, 0);
    $('#contador').textContent = qtd;
    const u = usuarioLogado();
    const cm = $('#contaMenu');
    if (!u && !adminLogado()) {
        cm.innerHTML = '<a href="#entrar" data-ir="entrar" class="btn btn-borda" id="btnEntrar">Entrar</a>';
    } else {
        const nome = adminLogado() ? 'Administrador' : u.nome;
        const sub = adminLogado() ? 'usuário: admin' : u.email;
        cm.innerHTML = `<div class="conta-drop">
            <button class="btn btn-borda" id="btnEntrar" data-acao="abrir-conta">${adminLogado() ? '⚙️ Admin' : '👤 <span class="btn-entrar-txt">' + esc(u.nome.split(' ')[0]) + '</span>'} ▾</button>
            <div class="drop">
                <div class="quem"><strong>${esc(nome)}</strong><small>${esc(sub)}</small></div>
                ${adminLogado()
                    ? '<a href="#admin" data-ir="admin">⚙️ Gerenciamento</a>'
                    : `<a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="pedidos">📦 Meus pedidos</a>
                       <a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="agendamentos">🛁 Meus agendamentos</a>
                       <a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="pets">🐾 Meus pets</a>
                       <a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="clube">⭐ Minha assinatura</a>
                       <a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="dados">👤 Meus dados</a>`}
            </div>
        </div>`;
    }
    $('#sairTopo').innerHTML = u ? '<button class="btn btn-borda" data-acao="sair" title="Sair da conta">↩ <span class="btn-entrar-txt">Sair</span></button>' : '';
    document.querySelectorAll('.categoria').forEach(c => {
        const r = rotaAtual();
        const ativo = c.dataset.animal === r || (c.dataset.animal === 'outros-pets' && !!animalPor(r).outro);
        c.querySelector('.cat-btn').classList.toggle('ativo', ativo);
    });
}

/* =========================================================
   LOJA (página inicial)
   ========================================================= */
let filtro = { busca: '' };

function produtosFiltrados() {
    const b = filtro.busca.trim().toLowerCase();
    const ativos = db.produtos.filter(p => p.ativo);
    if (b) return ativos.filter(p => p.nome.toLowerCase().includes(b) || p.categoria.toLowerCase().includes(b) || animalPor(p.animal).nome.toLowerCase().includes(b));
    // destaques: produtos com selo + o primeiro de cada animal
    const lista = ativos.filter(p => p.selo);
    ANIMAIS.forEach(a => { const p = ativos.find(x => x.animal === a.id && !lista.includes(x)); if (p) lista.push(p); });
    return lista.slice(0, 15);
}

function cardProduto(p) {
    const plano = planoAtivo(usuarioLogado());
    const esgotado = p.estoque <= 0;
    return `
    <article class="card">
        <div class="card-img cor-${p.cor}">
            ${p.selo ? `<span class="selo">${esc(p.selo)}</span>` : ''}
            ${esgotado ? '<span class="selo alerta">Esgotado</span>' : p.estoque <= 5 ? `<span class="selo alerta">Últimas ${p.estoque}</span>` : ''}
            ${imgProduto(p)}
        </div>
        <div class="card-info">
            <span class="tag">${animalPor(p.animal).nome} · ${esc(p.categoria)}</span>
            <h3>${esc(p.nome)}</h3>
            <span class="preco">${dinheiro(p.preco)}</span>
            ${plano ? `<span class="preco-clube">${dinheiro(p.preco * (1 - plano.desconto / 100))} no Clube ${plano.nome}</span>` : ''}
            <button class="btn btn-azul btn-bloco" data-acao="adicionar" data-id="${p.id}" ${esgotado ? 'disabled' : ''}>
                ${esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
            </button>
        </div>
    </article>`;
}

function cardMini(p) {
    const esgotado = p.estoque <= 0;
    return `
    <article class="mini">
        <div class="mini-img cor-${p.cor}">
            ${p.selo ? `<span class="selo">${esc(p.selo)}</span>` : ''}
            ${imgProduto(p)}
            <button class="mais" data-acao="adicionar" data-id="${p.id}" title="Adicionar ao carrinho" ${esgotado ? 'disabled' : ''}>+</button>
        </div>
        <div class="mini-info">
            <h3>${esc(p.nome)}</h3>
            <span class="preco">${dinheiro(p.preco)}</span>
            <span class="assin">${dinheiro(p.preco * 0.9)}<small>para assinantes ⭐</small></span>
        </div>
    </article>`;
}

function circuloCategoria(animal, grupo) {
    const p = db.produtos.find(x => x.ativo && x.animal === animal.id && x.categoria === grupo);
    return `<button class="circulo" data-acao="filtrar" data-animal="${animal.id}" data-categoria="${esc(grupo)}">
        <span class="bola cor-${p ? p.cor : animal.cor}">${p ? imgProduto(p) : iconeAnimal(animal)}</span><span>${esc(grupo)}</span></button>`;
}

function faixaRolagem(id, titulo, itens, link) {
    return `
    <section class="faixa">
        <div class="faixa-topo"><h2>${titulo}</h2>${link || ''}</div>
        <div class="rolagem-wrap">
            <button class="seta-rol esq" data-acao="rolar" data-alvo="${id}" data-dir="-1" aria-label="Voltar">‹</button>
            <div class="rolagem" id="${id}">${itens}</div>
            <button class="seta-rol dir" data-acao="rolar" data-alvo="${id}" data-dir="1" aria-label="Avançar">›</button>
        </div>
    </section>`;
}

let slideAtual = 0, timerSlide = null;
function irSlide(n) {
    const el = $('#slides');
    if (!el) return;
    const total = el.children.length;
    slideAtual = (n + total) % total;
    el.style.transform = `translateX(-${slideAtual * 100}%)`;
    document.querySelectorAll('.ponto').forEach((d, i) => d.classList.toggle('ativo', i === slideAtual));
}
function iniciarSlides() {
    clearInterval(timerSlide);
    timerSlide = setInterval(() => { if (!$('#slides')) { clearInterval(timerSlide); return; } irSlide(slideAtual + 1); }, 6000);
    irSlide(slideAtual);
    ajustarSetas();
}
function ajustarSetas() {
    document.querySelectorAll('.rolagem').forEach(r => {
        const sobra = r.scrollWidth > r.clientWidth + 4;
        r.parentElement.querySelectorAll('.seta-rol').forEach(b => { b.style.visibility = sobra ? 'visible' : 'hidden'; });
    });
}
window.addEventListener('resize', ajustarSetas);

function telaLoja() {
    const s = db.site;
    const b = filtro.busca.trim();
    if (b) {
        const lista = produtosFiltrados();
        return `
        <div class="container">
            <nav class="migalha"><a href="#inicio" data-ir="" data-acao="limpar-busca">Início</a> › Busca</nav>
            <div class="linha-titulo" style="margin-top:14px"><h1 class="titulo">Resultados para "${esc(b)}"</h1><span class="tag">${lista.length} ${lista.length === 1 ? 'produto' : 'produtos'}</span></div>
            ${lista.length ? `<div class="grade">${lista.map(cardProduto).join('')}</div>` : '<p class="vazio">Nenhum produto encontrado 🐾</p>'}
        </div>`;
    }
    const cao = animalPor('caes'), gato = animalPor('gatos');
    return `
    <div class="container">
        <section class="slider">
            <button class="seta-slide esq" data-acao="slide" data-dir="-1" aria-label="Anterior">‹</button>
            <div class="slides" id="slides">
                <div class="slide s1">
                    <div><span class="pilula">${esc(s.pilula)}</span><h1>${esc(s.titulo)}</h1><p>${esc(s.texto)}</p>
                    <a href="#produtos" class="btn btn-azul" data-acao="rolar-produtos">${esc(s.botao)}</a></div>
                    ${visualSlide(0, ['🐶', '🐱', '🐄', '🐴'])}
                </div>
                <div class="slide s2">
                    <div><span class="pilula">Clube AgroPet</span><h2>Até 10% off em tudo, todo mês</h2><p>Assine, receba a ração em casa no dia que escolher e economize em todas as compras.</p>
                    <a href="#clube" data-ir="clube" class="btn btn-azul">Conhecer o Clube</a></div>
                    ${visualSlide(1, ['⭐', '📦', '🐶', '🐱'])}
                </div>
                <div class="slide s3">
                    <div><span class="pilula">Banho e Tosa</span><h2>Seu pet cheiroso, com hora marcada</h2><p>Agende online em poucos cliques. Assinantes Premium ganham 1 banho por mês.</p>
                    <a href="#banho-e-tosa" data-ir="banho-e-tosa" class="btn btn-marrom">Agendar agora</a></div>
                    ${visualSlide(2, ['🐩', '🛁', '✂️', '🐈'])}
                </div>
            </div>
            <button class="seta-slide dir" data-acao="slide" data-dir="1" aria-label="Próximo">›</button>
            <div class="pontos">${[0, 1, 2].map(i => `<button class="ponto" data-acao="ir-slide" data-n="${i}" aria-label="Banner ${i + 1}"></button>`).join('')}</div>
        </section>

        <section class="beneficios">
            <div class="beneficio"><span class="ic">🚚</span><div><strong>Entrega rápida</strong><small>Em Santo Ângelo e região</small></div></div>
            <div class="beneficio"><span class="ic">📦</span><div><strong>Frete grátis</strong><small>Acima de ${dinheiro(s.freteGratisAcima)}</small></div></div>
            <div class="beneficio"><span class="ic">💳</span><div><strong>Até 3x sem juros</strong><small>No cartão de crédito</small></div></div>
            <div class="beneficio"><span class="ic">⭐</span><div><strong>Clube AgroPet</strong><small>Até 10% off para assinantes</small></div></div>
        </section>

        <div id="produtos">${faixaRolagem('rolRecomendados', 'Produtos recomendados', produtosFiltrados().map(cardMini).join(''))}</div>

        ${faixaRolagem('rolCaes', 'Tudo para cachorros', cao.grupos.map(g => circuloCategoria(cao, g.t)).join(''), '<button class="link-azul" data-acao="filtrar" data-animal="caes">Ver tudo →</button>')}
        ${faixaRolagem('rolGatos', 'Tudo para gatos', gato.grupos.map(g => circuloCategoria(gato, g.t)).join(''), '<button class="link-azul" data-acao="filtrar" data-animal="gatos">Ver tudo →</button>')}
        ${faixaRolagem('rolCampo', 'Tudo para o campo', ANIMAIS.filter(a => a.agro).map(a => `<button class="circulo" data-acao="filtrar" data-animal="${a.id}"><span class="bola cor-${a.cor}">${iconeAnimal(a)}</span><span>${a.nome}</span></button>`).join(''))}
        ${faixaRolagem('rolOutros', 'Outros pets', ANIMAIS.filter(a => a.outro).map(a => `<button class="circulo" data-acao="filtrar" data-animal="${a.id}"><span class="bola cor-${a.cor}">${iconeAnimal(a)}</span><span>${a.nome}</span></button>`).join(''), '<button class="link-azul" data-acao="filtrar" data-animal="outros-pets">Ver tudo →</button>')}

        <section class="faixa">
            <div class="faixa-topo"><h2>Cuidados essenciais</h2></div>
            <div class="cuidados">
                <div class="promo promo-banho">
                    <div>
                        <h3>Banho & Tosa</h3>
                        <p>Banho, tosa higiênica ou completa. Escolha o dia e o horário pela internet.</p>
                        <span class="cupom">Premium: 1 banho grátis/mês</span><br>
                        <a href="#agendar" data-ir="agendar" data-acao="novo-agendamento" class="btn">Agendar horário</a>
                    </div>
                    <span class="grande">🛁</span>
                </div>
                <div class="promo promo-clube">
                    <div>
                        <h3>Clube AgroPet</h3>
                        <p>A ração chega em casa todo mês e você ganha desconto em todas as compras.</p>
                        <span class="cupom">A partir de ${dinheiro(PLANOS.basico.preco)}/mês</span><br>
                        <a href="#clube" data-ir="clube" class="btn">Quero assinar</a>
                    </div>
                    <span class="grande">⭐</span>
                </div>
            </div>
        </section>
    </div>`;
}

function planosHTML() {
    const u = usuarioLogado();
    const atual = u && u.assinatura && u.assinatura.ativa ? u.assinatura.plano : null;
    return `<div class="planos">
        ${Object.entries(PLANOS).map(([id, pl]) => `
        <div class="plano ${id === 'premium' ? 'destaque' : ''}">
            ${id === 'premium' ? '<span class="selo">Mais popular</span>' : ''}
            <h3>${pl.nome}</h3>
            <p class="preco">${dinheiro(pl.preco)}<small>/mês</small></p>
            <ul>${pl.beneficios.map(b => `<li>${b}</li>`).join('')}</ul>
            ${atual === id
                ? '<button class="btn btn-borda btn-bloco" data-acao="alterar-assinatura">✓ Seu plano · alterar</button>'
                : `<button class="btn ${id === 'premium' ? 'btn-azul' : 'btn-marrom'} btn-bloco" data-acao="assinar" data-plano="${id}">Assinar ${pl.nome}</button>`}
        </div>`).join('')}
    </div>`;
}

/* =========================================================
   PÁGINA DO ANIMAL (com filtros ao lado)
   ========================================================= */
const FAIXAS = { ate50: ['Até R$ 50', 0, 50], de50a100: ['R$ 50 a R$ 100', 50, 100], de100a200: ['R$ 100 a R$ 200', 100, 200], acima200: ['Acima de R$ 200', 200, Infinity] };
const ORDENS = { relevancia: 'Mais relevantes', menor: 'Menor preço', maior: 'Maior preço', az: 'Nome de A-Z', za: 'Nome de Z-A', novos: 'Mais novos' };
let pag = novoPag('caes');
function novoPag(id) { return { id, categorias: [], pets: [], faixa: null, min: '', max: '', estoque: false, ofertas: false, ordem: 'relevancia', filtrosAbertos: false }; }
const ehPaginaAnimal = (r) => r === 'outros-pets' || ANIMAIS.some(a => a.id === r);

function abrirAnimal(id, categoria) {
    pag = novoPag(id);
    if (categoria) pag.categorias = [categoria];
    fecharMenus();
    $('#barra').classList.remove('aberta');
    ir(id);
}

function telaAnimal() {
    const id = rotaAtual();
    if (pag.id !== id) pag = novoPag(id);
    const outros = id === 'outros-pets';
    const animais = outros ? ANIMAIS.filter(a => a.outro) : [animalPor(id)];
    const ids = animais.map(a => a.id);
    const a0 = outros ? { nome: 'Outros Pets', icone: '🐾', cor: 'roxo' } : animais[0];
    const base = db.produtos.filter(p => p.ativo && ids.includes(p.animal));
    const grupos = [...new Set(animais.flatMap(a => a.grupos.map(g => g.t)))];

    let lista = base.filter(p =>
        (!pag.pets.length || pag.pets.includes(p.animal))
        && (!pag.categorias.length || pag.categorias.includes(p.categoria))
        && (!pag.estoque || p.estoque > 0)
        && (!pag.ofertas || p.selo));
    if (pag.faixa) { const [, mn, mx] = FAIXAS[pag.faixa]; lista = lista.filter(p => p.preco >= mn && p.preco < mx); }
    if (pag.min !== '') lista = lista.filter(p => p.preco >= +pag.min);
    if (pag.max !== '') lista = lista.filter(p => p.preco <= +pag.max);
    const ord = {
        relevancia: (a, b) => (!!b.selo - !!a.selo) || ((b.estoque > 0) - (a.estoque > 0)) || a.id - b.id,
        menor: (a, b) => a.preco - b.preco, maior: (a, b) => b.preco - a.preco,
        az: (a, b) => a.nome.localeCompare(b.nome), za: (a, b) => b.nome.localeCompare(a.nome), novos: (a, b) => b.id - a.id,
    };
    lista.sort(ord[pag.ordem]);

    const contar = (fn) => base.filter(fn).length;
    const pills = [
        ...pag.pets.map(v => [`${animalPor(v).icone} ${animalPor(v).nome}`, 'pet', v]),
        ...pag.categorias.map(v => [v, 'cat', v]),
        ...(pag.faixa ? [[FAIXAS[pag.faixa][0], 'faixa', '']] : []),
        ...(pag.min !== '' || pag.max !== '' ? [[`${pag.min !== '' ? 'de ' + dinheiro(+pag.min) : ''} ${pag.max !== '' ? 'até ' + dinheiro(+pag.max) : ''}`.trim(), 'preco', '']] : []),
        ...(pag.estoque ? [['Em estoque', 'estoque', '']] : []),
        ...(pag.ofertas ? [['Ofertas e novidades', 'ofertas', '']] : []),
    ];

    return `
    <div class="container">
        <nav class="migalha"><a href="#inicio" data-ir="">Início</a> › ${outros ? '' : animais[0].outro ? '<a href="#outros-pets" data-ir="outros-pets">Outros Pets</a> › ' : ''}<b>${a0.nome}</b></nav>

        <section class="cab-animal cor-${a0.cor}">
            <span class="cab-ic">${outros ? a0.icone : iconeAnimal(a0)}</span>
            <div>
                <h1>${a0.nome}</h1>
                <p>${base.length} produtos ${outros ? 'para pássaros, peixes e roedores' : 'com entrega rápida e desconto para assinantes do Clube'}.</p>
            </div>
        </section>

        <div class="atalhos">
            <button class="atalho ${!pag.categorias.length ? 'ativo' : ''}" data-acao="pag-atalho" data-cat="">Tudo</button>
            ${grupos.map(g => `<button class="atalho ${pag.categorias.length === 1 && pag.categorias[0] === g ? 'ativo' : ''}" data-acao="pag-atalho" data-cat="${esc(g)}">${esc(g)}</button>`).join('')}
        </div>

        <div class="loja-layout">
            <aside class="caixa filtros ${pag.filtrosAbertos ? 'aberto' : ''}">
                <div class="filtros-topo"><h3>Filtrar</h3>${pills.length ? '<button class="link-azul" data-acao="pag-limpar">Limpar filtros</button>' : ''}</div>
                ${outros ? `<div class="fgrupo"><h4>Pet</h4>
                    ${animais.map(a => `<label class="fop"><input type="checkbox" data-f="pet" value="${a.id}" ${pag.pets.includes(a.id) ? 'checked' : ''}>${a.icone} ${a.nome}<small>${contar(p => p.animal === a.id)}</small></label>`).join('')}
                </div>` : ''}
                <div class="fgrupo"><h4>Categorias</h4>
                    ${grupos.map(g => `<label class="fop"><input type="checkbox" data-f="cat" value="${esc(g)}" ${pag.categorias.includes(g) ? 'checked' : ''}>${esc(g)}<small>${contar(p => p.categoria === g)}</small></label>`).join('')}
                </div>
                <div class="fgrupo"><h4>Faixa de preço</h4>
                    ${Object.entries(FAIXAS).map(([k, [nome, mn, mx]]) => `<label class="fop"><input type="radio" name="faixa" data-f="faixa" value="${k}" ${pag.faixa === k ? 'checked' : ''}>${nome}<small>${contar(p => p.preco >= mn && p.preco < mx)}</small></label>`).join('')}
                    <div class="preco-livre">
                        <input type="number" min="0" placeholder="De R$" data-f="min" value="${pag.min}">
                        <input type="number" min="0" placeholder="Até R$" data-f="max" value="${pag.max}">
                    </div>
                </div>
                <div class="fgrupo"><h4>Disponibilidade</h4>
                    <label class="fop"><input type="checkbox" data-f="estoque" ${pag.estoque ? 'checked' : ''}>Somente em estoque<small>${contar(p => p.estoque > 0)}</small></label>
                </div>
                <div class="fgrupo"><h4>Promoções</h4>
                    <label class="fop"><input type="checkbox" data-f="ofertas" ${pag.ofertas ? 'checked' : ''}>Ofertas e novidades<small>${contar(p => p.selo)}</small></label>
                </div>
            </aside>

            <section>
                <div class="barra-res">
                    <div class="pills">
                        <button class="btn btn-borda btn-peq btn-filtros" data-acao="pag-mostrar-filtros">⚙️ Filtros${pills.length ? ' (' + pills.length + ')' : ''}</button>
                        <b>${lista.length} ${lista.length === 1 ? 'produto' : 'produtos'}</b>
                        ${pills.map(([t, tipo, v]) => `<span class="filtro-ativo">${esc(t)} <button data-acao="pag-remover" data-tipo="${tipo}" data-valor="${esc(v)}" title="Remover">✕</button></span>`).join('')}
                    </div>
                    <label class="ordem" style="flex-direction:row;font-weight:400">Ordenar por:
                        <select data-f="ordem">${Object.entries(ORDENS).map(([k, n]) => `<option value="${k}" ${pag.ordem === k ? 'selected' : ''}>${n}</option>`).join('')}</select>
                    </label>
                </div>
                ${lista.length ? `<div class="grade">${lista.map(cardProduto).join('')}</div>`
                    : `<div class="vazio">Nenhum produto com esses filtros 🐾<br><button class="btn btn-azul btn-peq" style="margin-top:14px" data-acao="pag-limpar">Limpar filtros</button></div>`}
            </section>
        </div>
    </div>`;
}

function rerenderMantendoRolagem() { const y = window.scrollY; renderizar(); window.scrollTo(0, y); }

/* =========================================================
   CARRINHO E FINALIZAÇÃO
   ========================================================= */
function calcularCarrinho() {
    const u = usuarioLogado();
    const plano = planoAtivo(u);
    const itens = db.carrinho.map(i => ({ ...i, p: produtoPor(i.id) })).filter(i => i.p);
    const subtotal = itens.reduce((s, i) => s + i.p.preco * i.qtd, 0);
    const desconto = plano ? subtotal * plano.desconto / 100 : 0;
    const freteGratis = (plano && u.assinatura.plano === 'premium') || subtotal - desconto >= db.site.freteGratisAcima;
    const frete = itens.length === 0 || freteGratis ? 0 : db.site.frete;
    return { itens, subtotal, desconto, frete, total: subtotal - desconto + frete, plano };
}

function resumoHTML(c, botao) {
    return `
    <div class="caixa">
        <h2>Resumo</h2>
        <div class="resumo-linha"><span>Subtotal</span><span>${dinheiro(c.subtotal)}</span></div>
        ${c.desconto ? `<div class="resumo-linha verde"><span>Desconto Clube ${c.plano.nome} (${c.plano.desconto}%)</span><span>− ${dinheiro(c.desconto)}</span></div>` : ''}
        <div class="resumo-linha"><span>Frete</span><span>${c.frete ? dinheiro(c.frete) : '<b class="verde">Grátis</b>'}</span></div>
        <div class="resumo-linha total"><span>Total</span><span>${dinheiro(c.total)}</span></div>
        ${!c.plano ? `<p class="nota azul" style="margin-top:14px">⭐ Assinantes do <a href="#clube" data-ir="clube">Clube AgroPet</a> pagam até 10% menos.</p>` : ''}
        ${c.frete ? `<p class="nota" style="margin-top:10px">🚚 Frete grátis em compras acima de ${dinheiro(db.site.freteGratisAcima)}.</p>` : ''}
        <div style="margin-top:18px">${botao}</div>
    </div>`;
}

function telaCarrinho() {
    const c = calcularCarrinho();
    if (!c.itens.length) return `
        <div class="container sucesso">
            <div class="grande">🛒</div>
            <h1>Seu carrinho está vazio</h1>
            <p>Que tal dar uma olhada nos produtos?</p>
            <a href="#inicio" data-ir="" class="btn btn-azul" style="margin-top:20px">Ver produtos</a>
        </div>`;
    return `
    <div class="container">
        <h1 class="titulo" style="margin-top:34px">Meu carrinho</h1>
        <div class="duas">
            <div class="caixa itens">
                ${c.itens.map(i => `
                <div class="item">
                    <div class="item-img cor-${i.p.cor}">${imgProduto(i.p)}</div>
                    <div class="item-info">
                        <strong>${esc(i.p.nome)}</strong>
                        <small>${dinheiro(i.p.preco)} cada · ${i.p.estoque} em estoque</small>
                    </div>
                    <div class="qtd">
                        <button data-acao="qtd" data-id="${i.id}" data-delta="-1">−</button>
                        <span>${i.qtd}</span>
                        <button data-acao="qtd" data-id="${i.id}" data-delta="1">+</button>
                    </div>
                    <strong style="min-width:96px;text-align:right">${dinheiro(i.p.preco * i.qtd)}</strong>
                    <button class="remover" data-acao="remover" data-id="${i.id}" title="Remover">🗑️</button>
                </div>`).join('')}
            </div>
            ${resumoHTML(c, '<a href="#finalizar" data-ir="finalizar" class="btn btn-azul btn-bloco">Finalizar compra</a><a href="#inicio" data-ir="" class="btn btn-borda btn-bloco" style="margin-top:10px">Continuar comprando</a>')}
        </div>
    </div>`;
}

let pagamentoEscolhido = 'Pix';
function telaFinalizar() {
    const c = calcularCarrinho();
    if (!c.itens.length) { ir('carrinho'); return ''; }
    const u = usuarioLogado();
    if (!u) { voltarPara = 'finalizar'; aviso('Entre ou crie uma conta para finalizar'); ir('entrar'); return ''; }
    const ultimo = [...db.pedidos].reverse().find(p => p.clienteId === u.id);
    return `
    <div class="container">
        <h1 class="titulo" style="margin-top:34px">Finalizar compra</h1>
        <div class="duas">
            <form class="caixa form" id="formFinalizar">
                <h2>Endereço de entrega</h2>
                <div class="form-linha tres">
                    <label>Rua<input name="rua" required value="${esc(ultimo ? ultimo.endereco.split(',')[0] : '')}"></label>
                    <label>Número<input name="numero" required></label>
                    <label>CEP<input name="cep" placeholder="98800-000" required></label>
                </div>
                <div class="form-linha">
                    <label>Bairro<input name="bairro" required></label>
                    <label>Cidade<input name="cidade" value="Santo Ângelo" required></label>
                </div>
                <h2 style="margin-top:10px">Pagamento</h2>
                <div class="opcoes">
                    ${['Pix', 'Cartão de crédito', 'Boleto'].map(m => `<button type="button" class="opcao ${m === pagamentoEscolhido ? 'sel' : ''}" data-acao="pagamento" data-valor="${m}">${m === 'Pix' ? '⚡' : m === 'Boleto' ? '🧾' : '💳'} ${m}</button>`).join('')}
                </div>
                <p class="nota">Pagamento simulado — nenhum valor é cobrado nesta demonstração.</p>
            </form>
            ${resumoHTML(c, '<button class="btn btn-azul btn-bloco" data-acao="confirmar-pedido">Confirmar pedido</button>')}
        </div>
    </div>`;
}

async function confirmarPedido() {
    const f = $('#formFinalizar');
    if (!f.reportValidity()) return;
    const d = Object.fromEntries(new FormData(f));
    const botao = $('[data-acao="confirmar-pedido"]');
    botao.disabled = true;
    try {
        const pedido = await api('POST', '/pedidos', {
            itens: db.carrinho.map(i => ({ produtoId: i.id, qtd: i.qtd })),
            pagamento: pagamentoEscolhido,
            endereco: { rua: d.rua, numero: d.numero, bairro: d.bairro, cidade: d.cidade, cep: d.cep },
        });
        db.carrinho = [];
        salvar();
        await carregar();
        ultimoPedido = pedido.id;
        ir('pedido-confirmado');
    } catch (e) { aviso('⚠️ ' + e.message); botao.disabled = false; }
}

let ultimoPedido = null;
function telaPedidoOk() {
    const p = db.pedidos.find(x => x.id === ultimoPedido);
    if (!p) { ir(''); return ''; }
    return `
    <div class="container sucesso">
        <div class="grande">🎉</div>
        <h1>Pedido nº ${p.id} confirmado!</h1>
        <p>Total de <b>${dinheiro(p.total)}</b> via ${p.pagamento}. Você pode acompanhar o status em Minha conta.</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap">
            <a href="#conta" data-ir="conta" class="btn btn-azul">Ver meus pedidos</a>
            <a href="#inicio" data-ir="" class="btn btn-borda">Voltar à loja</a>
        </div>
    </div>`;
}

/* =========================================================
   BANHO E TOSA
   ========================================================= */
let ag = novoAg();
function novoAg() { return { passo: 1, petId: null, servico: 'banho', extras: [], data: '', hora: null, ocupados: [] }; }
const petsDe = (u) => (u && u.pets) || [];
const petPor = (u, id) => petsDe(u).find(p => p.id === id);

function banhoGratisDisponivel(u, data) {
    if (!u || !planoAtivo(u) || u.assinatura.plano !== 'premium' || !data) return false;
    const mes = data.slice(0, 7);
    return !db.agendamentos.some(a => a.clienteId === u.id && a.status !== 'Cancelado' && a.gratis && a.data.slice(0, 7) === mes);
}

function calcAgenda(u) {
    const pet = petPor(u, ag.petId);
    const porte = pet ? pet.porte : 'Pequeno';
    const base = Math.round(servicoPor(ag.servico).preco * PORTES[porte]);
    const gratis = ag.servico === 'banho' && banhoGratisDisponivel(u, ag.data);
    const extras = ag.extras.reduce((s, id) => s + extraPor(id).preco, 0);
    return { pet, porte, base, gratis, extras, total: (gratis ? 0 : base) + extras };
}

/* ---- Página de apresentação ---- */
function telaBanho() {
    return `
    <div class="container">
        <section class="bt-hero">
            <div>
                <h1>Banho & Tosa</h1>
                <h2>O cuidado que o seu pet merece</h2>
                <p>Serviços completos e seguros para a higiene do seu melhor amigo, com hora marcada.</p>
                <a href="#agendar" data-ir="agendar" data-acao="novo-agendamento" class="btn btn-azul">Agendar agora →</a>
            </div>
            ${visualSlide(2, ['🐩', '🛁', '✂️', '🐈'])}
        </section>

        <div class="vantagens">
            <div class="vantagem"><span class="num">1 grátis</span><div><strong>banho por mês</strong><br><small style="color:var(--suave)">para assinantes do plano Premium</small></div></div>
            <div class="vantagem"><span class="num">⭐ Clube</span><div><strong>prioridade no agendamento</strong><br><small style="color:var(--suave)">e desconto em todos os produtos</small></div></div>
        </div>

        <section class="faixa">
            <div class="faixa-topo"><h2>Nossos serviços</h2></div>
            <div class="cards-serv">
                ${SERVICOS.map(sv => `<div class="card-serv"><span class="ic">${sv.icone}</span><h3>${sv.nome}</h3><p>${sv.desc}</p>
                    <span class="preco">a partir de ${dinheiro(sv.preco)}</span></div>`).join('')}
            </div>
            <p class="tag" style="margin-top:10px">Porte médio +30% · porte grande +60%</p>
        </section>

        <section class="faixa">
            <div class="faixa-topo"><h2>Que tal um cuidado adicional?</h2></div>
            <div class="extras-lista">
                ${EXTRAS.map(x => `<div class="extra-card"><span class="ic">${x.icone}</span><div><strong>${x.nome}</strong><small>${x.desc}</small><b style="color:var(--marrom)">+ ${dinheiro(x.preco)}</b></div></div>`).join('')}
            </div>
        </section>

        <section class="faixa faq">
            <div class="faixa-topo"><h2>Dúvidas frequentes</h2></div>
            <details><summary>Não consigo comparecer no horário marcado. O que eu faço?</summary><p>Cancele pelo site em Minha conta → Banho e Tosa e faça um novo agendamento. Não cobramos nada pelo cancelamento.</p></details>
            <details><summary>Quais animais vocês atendem?</summary><p>Cães e gatos de todos os portes. Para outros animais, fale com a gente pelo telefone.</p></details>
            <details><summary>Preciso levar alguma coisa?</summary><p>Só a coleira ou a caixa de transporte. Shampoo, toalha e perfume ficam por nossa conta.</p></details>
            <details><summary>Como funciona o banho grátis do Clube?</summary><p>Assinantes do plano Premium têm 1 banho por mês sem custo. Ele é aplicado automaticamente no agendamento.</p></details>
            <div class="ajuda"><div><strong>Precisa de ajuda?</strong><br><small>(55) 3312-0000 · segunda a sábado, das 8h às 18h</small></div><a href="#agendar" data-ir="agendar" data-acao="novo-agendamento" class="btn">Agendar agora</a></div>
        </section>
    </div>`;
}

/* ---- Agendamento em passos ---- */
const PASSOS = ['Pet', 'Serviço', 'Data e horário', 'Revisão'];

function telaAgendar() {
    const u = usuarioLogado();
    if (!u) { voltarPara = 'agendar'; aviso('Entre na sua conta para agendar'); ir('entrar'); return ''; }
    const c = calcAgenda(u);
    if (!c.pet && ag.passo > 1) ag.passo = 1;
    const pets = petsDe(u).filter(p => TIPOS_PET[p.tipo]);
    let corpo = '';
    if (ag.passo === 1) {
        corpo = pets.length ? `
            <h2>Qual pet vai tomar banho?</h2>
            <div class="pets-grade">
                ${pets.map(p => `<button class="pet-card ${ag.petId === p.id ? 'sel' : ''}" data-acao="ag-pet" data-id="${p.id}">
                    <span class="av">${TIPOS_PET[p.tipo]}</span><strong>${esc(p.nome)}</strong><small>${esc(p.raca || p.tipo)} · ${p.porte}</small></button>`).join('')}
                <button class="pet-card novo" data-acao="novo-pet"><span class="av">＋</span><strong>Cadastrar novo pet</strong></button>
            </div>`
        : `<div class="sem-pet"><div class="grande">🐶</div><h3>Você ainda não cadastrou nenhum pet</h3><p>Cadastre o seu pet para agendar o banho.</p>
            <button class="btn btn-azul" data-acao="novo-pet">＋ Cadastrar pet</button></div>`;
    }
    if (ag.passo === 2) {
        corpo = `<h2>Escolha o serviço para ${esc(c.pet.nome)}</h2>
            <div class="escolhas">
                ${SERVICOS.map(sv => { const v = Math.round(sv.preco * PORTES[c.porte]); return `<button class="escolha ${ag.servico === sv.id ? 'sel' : ''}" data-acao="ag-servico" data-valor="${sv.id}">
                    <span class="ic">${sv.icone}</span><div><strong>${sv.nome}</strong><small>${sv.desc}</small></div><span class="v">${dinheiro(v)}</span></button>`; }).join('')}
            </div>
            <h2 style="margin-top:22px">Adicionais <small style="color:var(--suave);font-weight:400;font-size:.9rem">(opcional)</small></h2>
            <div class="escolhas">
                ${EXTRAS.map(x => `<button class="escolha ${ag.extras.includes(x.id) ? 'sel' : ''}" data-acao="ag-extra" data-valor="${x.id}">
                    <span class="marca">${ag.extras.includes(x.id) ? '✓' : ''}</span><div><strong>${x.icone} ${x.nome}</strong><small>${x.desc}</small></div><span class="v">+ ${dinheiro(x.preco)}</span></button>`).join('')}
            </div>`;
    }
    if (ag.passo === 3) {
        const ocupados = ag.ocupados || [];
        const domingo = ag.data && new Date(ag.data + 'T12:00').getDay() === 0;
        corpo = `<h2>Quando fica melhor?</h2>
            <label style="max-width:300px">Data<input type="date" id="dataBanho" min="${hojeISO()}" value="${ag.data}"></label>
            ${domingo ? '<p class="erro" style="margin-top:10px">Não abrimos aos domingos. Escolha outro dia.</p>' : ''}
            ${ag.data && !domingo ? `<p style="font-weight:500;margin:18px 0 8px">Horários disponíveis</p>
            <div class="horarios">${HORARIOS.map(h => `<button class="opcao ${ag.hora === h ? 'sel' : ''}" data-acao="ag-hora" data-valor="${h}" ${ocupados.includes(h) ? 'disabled title="Ocupado"' : ''}>${h}</button>`).join('')}</div>` : ''}
            ${c.gratis ? '<p class="nota azul" style="margin-top:16px">⭐ Neste mês o seu banho é grátis pelo plano Premium.</p>' : ''}`;
    }
    if (ag.passo === 4) {
        corpo = `<h2>Confira o agendamento</h2>
            <div class="revisao">
                <div class="resumo-linha"><span>Pet</span><b>${TIPOS_PET[c.pet.tipo]} ${esc(c.pet.nome)} · ${c.porte}</b></div>
                <div class="resumo-linha"><span>Data</span><b>${dataBR(ag.data)} às ${ag.hora}</b></div>
                <div class="resumo-linha"><span>${servicoPor(ag.servico).nome}</span><b>${c.gratis ? `<s style="color:var(--suave);font-weight:400">${dinheiro(c.base)}</s> <span class="verde">Grátis ⭐</span>` : dinheiro(c.base)}</b></div>
                ${ag.extras.map(id => `<div class="resumo-linha"><span>${extraPor(id).nome}</span><b>${dinheiro(extraPor(id).preco)}</b></div>`).join('')}
                <div class="resumo-linha total"><span>Total</span><span>${dinheiro(c.total)}</span></div>
            </div>
            <p class="nota" style="margin-top:14px">O pagamento é feito na loja, no dia do atendimento.</p>`;
    }
    const domingoSel = ag.data && new Date(ag.data + 'T12:00').getDay() === 0;
    const pode = ag.passo === 1 ? !!c.pet : ag.passo === 2 ? !!ag.servico : ag.passo === 3 ? !!(ag.data && ag.hora && !domingoSel) : true;
    return `
    <div class="container wizard">
        <div class="wiz-topo"><button class="wiz-voltar" data-acao="ag-voltar" aria-label="Voltar">‹</button><h1>Agendamento</h1></div>
        <div class="progresso"><span style="width:${ag.passo * 25}%"></span></div>
        <p class="passo-txt">Passo ${ag.passo} de 4 · ${PASSOS[ag.passo - 1]}</p>
        <div class="caixa">${corpo}</div>
        <div class="wiz-rodape">
            <div class="total">${c.pet && ag.passo > 1 ? `<small>Total</small><b>${dinheiro(c.total)}</b>` : `<small>${c.pet ? esc(c.pet.nome) + ' selecionado' : 'Escolha um pet'}</small>`}</div>
            ${ag.passo < 4
                ? `<button class="btn btn-azul" data-acao="ag-continuar" ${pode ? '' : 'disabled'}>Continuar →</button>`
                : '<button class="btn btn-azul" data-acao="ag-confirmar">Confirmar agendamento</button>'}
        </div>
    </div>`;
}

async function confirmarAgenda() {
    const botao = $('[data-acao="ag-confirmar"]');
    botao.disabled = true;
    try {
        const a = await api('POST', '/agendamentos', { petId: ag.petId, servicoId: ag.servico, adicionais: ag.extras, data: ag.data, hora: ag.hora });
        await carregar();
        aviso(`🐾 ${a.petNome} agendado para ${dataBR(a.data)} às ${a.hora}`);
        ag = novoAg();
        contaAba = 'agendamentos'; subAgenda = 'proximos';
        ir('conta');
    } catch (e) {
        aviso('⚠️ ' + e.message); botao.disabled = false;
        if (/horário/i.test(e.message)) { ag.hora = null; ag.passo = 3; await buscarHorarios(); }
    }
}

async function buscarHorarios() {
    if (!ag.data) { ag.ocupados = []; return rerenderMantendoRolagem(); }
    const r = await api('GET', '/horarios?data=' + ag.data);
    ag.ocupados = [...r.ocupados, ...(r.passados || [])]; // ocupados ou que já passaram (hoje)
    if (ag.hora && ag.ocupados.includes(ag.hora)) ag.hora = null;
    rerenderMantendoRolagem();
}

/* ---- Cadastro de pet (janela) ---- */
function formPet(pet) {
    const novo = !pet;
    pet = pet || { nome: '', tipo: 'Cachorro', porte: 'Pequeno', raca: '', sexo: 'Macho', nascimento: '' };
    abrirModal(`
        <div class="modal-topo"><h2>${novo ? 'Cadastrar pet' : 'Editar pet'}</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <form class="form" id="formPet" data-id="${novo ? '' : pet.id}">
            <div class="form-linha">
                <label>Nome do pet *<input name="nome" value="${esc(pet.nome)}" required placeholder="Ex.: Thor"></label>
                <label>Tipo *<select name="tipo">${['Cachorro', 'Gato', 'Pássaro', 'Peixe', 'Roedor', 'Outro'].map(t => `<option ${t === pet.tipo ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
            </div>
            <div class="form-linha">
                <label>Porte *<select name="porte">${Object.keys(PORTES).map(t => `<option ${t === pet.porte ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
                <label>Sexo<select name="sexo">${['Macho', 'Fêmea'].map(t => `<option ${t === pet.sexo ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
            </div>
            <div class="form-linha">
                <label>Raça<input name="raca" value="${esc(pet.raca)}" placeholder="Ex.: Poodle, SRD"></label>
                <label>Data de nascimento<input type="date" name="nascimento" value="${pet.nascimento || ''}" max="${hojeISO()}"></label>
            </div>
            <div class="modal-acoes">
                <button type="button" class="btn btn-borda" data-acao="fechar-modal">Cancelar</button>
                <button class="btn btn-azul">${novo ? 'Cadastrar' : 'Salvar'}</button>
            </div>
        </form>`);
}

async function salvarPet(f) {
    const d = Object.fromEntries(new FormData(f));
    const dados = { nome: d.nome.trim(), tipo: d.tipo, porte: d.porte, sexo: d.sexo, raca: d.raca.trim(), nascimento: d.nascimento };
    try {
        const pet = f.dataset.id ? await api('PUT', '/pets/' + f.dataset.id, dados) : await api('POST', '/pets', dados);
        if (rotaAtual() === 'agendar' && TIPOS_PET[pet.tipo]) ag.petId = pet.id;
        fecharModal();
        await sincronizar();
        aviso(f.dataset.id ? 'Pet atualizado ✓' : `🐾 ${pet.nome} cadastrado!`);
    } catch (e) { aviso('⚠️ ' + e.message); }
}

/* =========================================================
   CLUBE
   ========================================================= */
function telaClube() {
    const u = usuarioLogado();
    const a = u && u.assinatura && u.assinatura.ativa ? u.assinatura : null;
    return `
    <div class="container">
        <section class="banner s2">
            <div class="banner-texto">
                <span class="pilula">Assinatura com benefícios</span>
                <h1>Clube AgroPet</h1>
                <p>A ração do seu pet chega todo mês na sua casa, com desconto em todos os produtos e vantagens no Banho e Tosa.</p>
            </div>
            ${visualSlide(1, ['⭐', '📦', '🐶', '🐱'])}
        </section>
        ${a ? `<p class="nota azul" style="margin-top:24px">Você é assinante <b>${PLANOS[a.plano].nome}</b> desde ${dataBR(a.desde)} · ${nomesItens(a)} · entrega: ${textoEntrega(a)}. <a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="clube">Gerenciar</a></p>` : ''}
        <section class="secao">${planosHTML()}</section>
    </div>`;
}

let assinar = { plano: 'premium', animal: 'todos', entrega: true, itens: [], dia: 10, pagamento: 'Cartão de crédito' };

function abrirAssinatura(plano) {
    assinar.plano = plano;
    if (!usuarioLogado()) { voltarPara = 'assinar'; aviso('Entre ou crie uma conta para assinar'); ir('entrar'); return; }
    ir('assinar');
}

function racoesDisponiveis() {
    return db.produtos.filter(p => p.ativo && p.estoque > 0 && (p.categoria === 'Ração' || p.categoria === 'Alimentação' || p.categoria === 'Nutrição'));
}

function totaisAssinatura() {
    const pl = PLANOS[assinar.plano];
    const itens = assinar.entrega ? assinar.itens.filter(i => produtoPor(i.id)).map(i => ({ ...i, p: produtoPor(i.id), preco: produtoPor(i.id).preco * (1 - pl.desconto / 100) })) : [];
    const racoes = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    return { pl, itens, racoes, total: pl.preco + racoes };
}

function telaAssinar() {
    const u = usuarioLogado();
    if (!u) { voltarPara = 'assinar'; ir('entrar'); return ''; }
    const t = totaisAssinatura();
    const pl = t.pl;
    const todas = racoesDisponiveis();
    const lista = todas.filter(r => assinar.animal === 'todos' || r.animal === assinar.animal);
    const animaisComRacao = ANIMAIS.filter(a => todas.some(r => r.animal === a.id));
    const atual = planoAtivo(u);
    const qtdDe = (id) => (assinar.itens.find(i => i.id === id) || {}).qtd || 0;
    let n = 1;
    const podeConfirmar = !assinar.entrega || t.itens.length > 0;
    return `
    <div class="container">
        <h1 class="titulo" style="margin-top:34px">⭐ ${atual ? 'Alterar assinatura' : 'Assinar o Clube AgroPet'}</h1>
        <div class="duas">
            <div class="etapas">
                <div class="caixa">
                    <div class="passo"><b>${n++}</b><h2>Escolha o plano</h2></div>
                    <div class="escolha-plano">
                        ${Object.entries(PLANOS).map(([id, p]) => `
                        <button class="plano-op ${assinar.plano === id ? 'sel' : ''}" data-acao="assinar-campo" data-campo="plano" data-valor="${id}">
                            <strong>${p.nome}</strong><span class="v">${dinheiro(p.preco)}<small style="font-weight:400;font-size:.9rem">/mês</small></span>
                            <span>${p.beneficios.join(' · ')}</span>
                        </button>`).join('')}
                    </div>
                </div>

                <div class="caixa">
                    <div class="passo"><b>${n++}</b><h2>Como você quer usar o Clube?</h2></div>
                    <div class="modo-entrega">
                        <button class="plano-op ${assinar.entrega ? 'sel' : ''}" data-acao="assinar-campo" data-campo="entrega" data-valor="sim">
                            <strong>📦 Entrega todo mês</strong><span>Escolha as rações e o dia; elas chegam sozinhas, com desconto.</span>
                        </button>
                        <button class="plano-op ${!assinar.entrega ? 'sel' : ''}" data-acao="assinar-campo" data-campo="entrega" data-valor="nao">
                            <strong>🛒 Sem agendamento</strong><span>Só os benefícios: desconto em tudo e você compra quando quiser.</span>
                        </button>
                    </div>
                </div>

                ${assinar.entrega ? `
                <div class="caixa">
                    <div class="passo"><b>${n++}</b><h2>Quais rações você quer receber?</h2></div>
                    <p style="color:var(--suave);margin:-6px 0 12px">Pode escolher mais de uma e a quantidade de cada.</p>
                    <div class="chips">
                        <button class="chip ${assinar.animal === 'todos' ? 'ativo' : ''}" data-acao="assinar-campo" data-campo="animal" data-valor="todos"><span class="ic cor-cinza">🐾</span>Todas</button>
                        ${animaisComRacao.map(a => `<button class="chip ${assinar.animal === a.id ? 'ativo' : ''}" data-acao="assinar-campo" data-campo="animal" data-valor="${a.id}"><span class="ic cor-${a.cor}">${a.icone}</span>${a.nome}</button>`).join('')}
                    </div>
                    <div class="racao-grade">
                        ${lista.map(r => { const q = qtdDe(r.id); return `
                        <div class="racao-card ${q ? 'sel' : ''}" data-acao="racao-alternar" data-id="${r.id}" role="button" tabindex="0">
                            <span class="marca">${q ? '✓' : ''}</span>
                            <span class="ri cor-${r.cor}">${imgProduto(r)}</span>
                            <span>${esc(r.nome)}</span>
                            <s>${dinheiro(r.preco)}</s>
                            <span class="pr">${dinheiro(r.preco * (1 - pl.desconto / 100))}</span>
                            ${q ? `<div class="qtd"><button data-acao="racao-qtd" data-id="${r.id}" data-delta="-1">−</button><span>${q}</span><button data-acao="racao-qtd" data-id="${r.id}" data-delta="1">+</button></div>` : ''}
                        </div>`; }).join('')}
                    </div>
                    ${!lista.length ? '<p class="vazio" style="margin-top:14px">Nenhuma ração disponível para esse bichinho.</p>' : ''}
                </div>

                <div class="caixa">
                    <div class="passo"><b>${n++}</b><h2>Dia da entrega</h2></div>
                    <div class="dias">
                        ${[5, 10, 15, 20, 25].map(d => `<button class="opcao ${assinar.dia === d ? 'sel' : ''}" data-acao="assinar-campo" data-campo="dia" data-valor="${d}">Dia ${d}</button>`).join('')}
                    </div>
                    <p class="nota" style="margin-top:14px">📦 A primeira entrega chega em <b>${dataBR(proximaEntrega(assinar.dia))}</b>. Depois, todo mês no mesmo dia.</p>
                </div>` : ''}

                <div class="caixa">
                    <div class="passo"><b>${n++}</b><h2>Forma de pagamento</h2></div>
                    <div class="opcoes">
                        ${['Cartão de crédito', 'Pix', 'Boleto'].map(m => `<button class="opcao ${assinar.pagamento === m ? 'sel' : ''}" data-acao="assinar-campo" data-campo="pagamento" data-valor="${m}">${m === 'Pix' ? '⚡' : m === 'Boleto' ? '🧾' : '💳'} ${m}</button>`).join('')}
                    </div>
                    <p class="nota" style="margin-top:14px">Cobrança mensal simulada — nenhum valor é cobrado nesta demonstração.</p>
                </div>
            </div>

            <div class="caixa lateral-resumo">
                <h2>Resumo da assinatura</h2>
                ${assinar.entrega ? (t.itens.length ? `<div class="lista-resumo">${t.itens.map(i => `
                    <div class="resumo-produto" style="margin:0"><span class="ri cor-${i.p.cor}">${imgProduto(i.p)}</span><div style="flex:1"><strong>${i.qtd}× ${esc(i.p.nome)}</strong><br><small style="color:var(--suave)">${dinheiro(i.preco)} cada</small></div><b>${dinheiro(i.preco * i.qtd)}</b></div>`).join('')}</div>`
                    : '<p class="nota" style="margin-bottom:12px">Escolha pelo menos uma ração para a entrega mensal.</p>') : '<p class="nota azul" style="margin-bottom:12px">🛒 Sem entrega agendada — você só paga o plano e tem desconto em todas as compras.</p>'}
                <div class="resumo-linha"><span>Plano ${pl.nome}</span><span>${dinheiro(pl.preco)}</span></div>
                ${assinar.entrega ? `<div class="resumo-linha"><span>Rações (${pl.desconto}% off)</span><span>${dinheiro(t.racoes)}</span></div>
                <div class="resumo-linha"><span>Frete</span><span class="verde"><b>Grátis</b></span></div>
                <div class="resumo-linha"><span>Entrega</span><span>todo dia ${assinar.dia}</span></div>` : ''}
                <div class="resumo-linha total"><span>Por mês</span><span>${dinheiro(t.total)}</span></div>
                <p class="nota azul" style="margin-top:14px">⭐ Além disso: ${pl.desconto}% de desconto em todas as compras${assinar.plano === 'premium' ? ', frete grátis sempre e 1 banho grátis por mês' : ''}.</p>
                <button class="btn btn-azul btn-bloco" style="margin-top:16px" data-acao="confirmar-assinatura" ${podeConfirmar ? '' : 'disabled'}>${atual ? 'Salvar alterações' : 'Confirmar assinatura'}</button>
                <a href="#clube" data-ir="clube" class="btn btn-borda btn-bloco" style="margin-top:10px">Voltar</a>
            </div>
        </div>
    </div>`;
}

function telaAssinaturaOk() {
    const u = usuarioLogado();
    const a = u && u.assinatura && u.assinatura.ativa ? u.assinatura : null;
    if (!a) { ir('clube'); return ''; }
    const pl = PLANOS[a.plano];
    return `
    <div class="container sucesso">
        <div class="grande">⭐</div>
        <h1>Bem-vindo ao Clube ${pl.nome}!</h1>
        <p>${a.diaEntrega ? `Sua entrega (${nomesItens(a)}) chega em <b>${dataBR(proximaEntrega(a.diaEntrega))}</b>.` : 'Você escolheu sem agendamento: compre quando quiser.'} A partir de agora você tem ${pl.desconto}% de desconto em todos os produtos.</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap">
            <a href="#conta" data-ir="conta" data-acao="ir-aba" data-aba="clube" class="btn btn-azul">Ver minha assinatura</a>
            <a href="#inicio" data-ir="" class="btn btn-borda">Ir às compras</a>
        </div>
    </div>`;
}

/* =========================================================
   ENTRAR / CADASTRO
   ========================================================= */
let abaEntrar = 'entrar';
let voltarPara = null;

function telaEntrar() {
    if (adminLogado()) { ir('admin'); return ''; }
    if (usuarioLogado()) { ir('conta'); return ''; }
    return `
    <div class="container">
        <div class="caixa entrar-box">
            <div style="text-align:center;margin-bottom:18px"><span class="logo">AgroPet</span></div>
            <div class="abas">
                <button class="${abaEntrar === 'entrar' ? 'ativo' : ''}" data-acao="aba-entrar" data-aba="entrar">Entrar</button>
                <button class="${abaEntrar === 'cadastro' ? 'ativo' : ''}" data-acao="aba-entrar" data-aba="cadastro">Criar conta</button>
            </div>
            ${abaEntrar === 'entrar' ? `
            <form class="form" id="formEntrar">
                <label>E-mail ou usuário<input name="login" required autocomplete="username"></label>
                <label>Senha<input name="senha" type="password" required autocomplete="current-password"></label>
                <p class="erro" id="erroEntrar"></p>
                <button class="btn btn-azul btn-bloco">Entrar</button>
                <p class="nota" style="font-size:.85rem">Demonstração — cliente: <b>maria@email.com</b> / <b>123</b> · gerenciamento: <b>admin</b> / <b>123</b></p>
            </form>` : `
            <form class="form" id="formCadastro">
                <label>Nome completo<input name="nome" required></label>
                <label>E-mail<input name="email" type="email" required></label>
                <label>Telefone<input name="telefone" placeholder="(55) 99999-0000"></label>
                <div class="form-linha">
                    <label>Senha<input name="senha" type="password" minlength="3" required></label>
                    <label>Repetir senha<input name="senha2" type="password" required></label>
                </div>
                <p class="erro" id="erroCadastro"></p>
                <button class="btn btn-azul btn-bloco">Criar conta</button>
            </form>`}
        </div>
    </div>`;
}

async function entrar(f) {
    const d = Object.fromEntries(new FormData(f));
    try {
        const r = await api('POST', '/login', { login: d.login, senha: d.senha });
        db.sessao = { token: r.token, tipo: r.usuario.admin ? 'admin' : 'cliente', id: r.usuario.id };
        salvar();
        await carregar();
        if (r.usuario.admin) { aviso('Bem-vindo ao gerenciamento ⚙️'); ir('admin'); return; }
        aviso(`Olá, ${r.usuario.nome.split(' ')[0]}! 🐾`);
        const destino = voltarPara; voltarPara = null;
        ir(destino || 'conta');
    } catch (e) { $('#erroEntrar').textContent = e.message; }
}

async function cadastrar(f) {
    const d = Object.fromEntries(new FormData(f));
    if (d.senha !== d.senha2) { $('#erroCadastro').textContent = 'As senhas não são iguais.'; return; }
    try {
        const r = await api('POST', '/cadastro', { nome: d.nome, email: d.email, telefone: d.telefone, senha: d.senha });
        db.sessao = { token: r.token, tipo: 'cliente', id: r.usuario.id };
        salvar();
        await carregar();
        aviso('Conta criada! Bem-vindo à AgroPet 🎉');
        const destino = voltarPara; voltarPara = null;
        ir(destino || 'conta');
    } catch (e) { $('#erroCadastro').textContent = e.message; }
}

/* =========================================================
   MINHA CONTA (cliente)
   ========================================================= */
let contaAba = 'pedidos';
let subAgenda = 'proximos';

function telaConta() {
    const u = usuarioLogado();
    if (!u) { ir('entrar'); return ''; }
    const abas = [['pedidos', '📦', 'Meus pedidos'], ['agendamentos', '🛁', 'Banho e Tosa'], ['pets', '🐾', 'Meus pets'], ['clube', '⭐', 'Clube AgroPet'], ['dados', '👤', 'Meus dados']];
    return `
    <div class="container area">
        <aside class="lateral">
            <div class="quem"><strong>${esc(u.nome)}</strong><small>${esc(u.email)}</small></div>
            ${abas.map(([id, ic, nome]) => `<button class="${contaAba === id ? 'ativo' : ''}" data-acao="conta-aba" data-aba="${id}">${ic} ${nome}</button>`).join('')}
            <button class="sair" data-acao="sair">↩ Sair</button>
        </aside>
        <section>${contaConteudo(u)}</section>
    </div>`;
}

function contaConteudo(u) {
    if (contaAba === 'pedidos') {
        const lista = db.pedidos.filter(p => p.clienteId === u.id).reverse();
        return `<div class="caixa"><h2>Meus pedidos</h2>${lista.length ? `
            <div class="tabela-wrap"><table>
                <tr><th>Nº</th><th>Data</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr>
                ${lista.map(p => `<tr><td>#${p.id}</td><td>${dataBR(p.data)}</td><td>${p.itens.map(i => `${i.qtd}× ${esc(i.nome)}`).join('<br>')}</td><td>${dinheiro(p.total)}</td><td><span class="status st-${p.status.replace(' ', '-')}">${p.status}</span></td>
                <td>${p.status === 'Recebido' ? `<button class="btn btn-perigo btn-peq" data-acao="cancelar-pedido" data-id="${p.id}">Cancelar</button>` : ''}</td></tr>`).join('')}
            </table></div>
            <p class="nota" style="margin-top:14px">Dá para cancelar o pedido enquanto ele está como <b>Recebido</b>. Depois que entra em separação, fale com a loja.</p>` : '<p class="vazio">Você ainda não fez nenhum pedido.</p>'}</div>`;
    }
    if (contaAba === 'agendamentos') {
        const meus = db.agendamentos.filter(a => a.clienteId === u.id);
        const prox = meus.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
        const ant = meus.filter(a => !prox.includes(a)).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
        const lista = subAgenda === 'proximos' ? prox : ant;
        return `<div class="caixa">
            <div class="barra-ferr"><h2 style="margin:0">Meus agendamentos</h2><a href="#agendar" data-ir="agendar" data-acao="novo-agendamento" class="btn btn-azul btn-peq">Agendar agora →</a></div>
            <div class="sub-abas"><button class="${subAgenda === 'proximos' ? 'ativo' : ''}" data-acao="sub-agenda" data-valor="proximos">Próximos (${prox.length})</button><button class="${subAgenda === 'anteriores' ? 'ativo' : ''}" data-acao="sub-agenda" data-valor="anteriores">Anteriores (${ant.length})</button></div>
            ${lista.length ? lista.map(a => `<div class="ag-card">
                <span class="av">${TIPOS_PET[a.especie] || '🐾'}</span>
                <div class="info"><strong>${esc(a.pet)} · ${servicoPor(a.servico).nome}</strong>
                <small>${dataBR(a.data)} às ${a.hora}${(a.extras || []).length ? ' · + ' + a.extras.map(x => extraPor(x).nome).join(', ') : ''}</small>
                <small>${dinheiro(a.valor)}${a.gratis ? ' · banho grátis ⭐' : ''}</small></div>
                <span class="status st-${a.status}">${a.status}</span>
                ${a.status === 'Agendado' ? `<button class="btn btn-perigo btn-peq" data-acao="cancelar-agenda" data-id="${a.id}">Cancelar</button>` : ''}
            </div>`).join('') : `<div class="sem-pet"><div class="grande">🛁</div><h3>${subAgenda === 'proximos' ? 'Ainda não há agendamentos' : 'Nenhum atendimento anterior'}</h3><p>Seus agendamentos vão aparecer aqui.</p></div>`}
        </div>`;
    }
    if (contaAba === 'pets') {
        const pets = petsDe(u);
        return `<div class="caixa">
            <div class="barra-ferr"><h2 style="margin:0">Meus pets</h2><button class="btn btn-azul btn-peq" data-acao="novo-pet">＋ Cadastrar pet</button></div>
            ${pets.length ? `<div class="lista-pets">${pets.map(p => `<div class="pet-card">
                <span class="av">${TIPOS_PET[p.tipo] || { 'Pássaro': '🐦', 'Peixe': '🐟', 'Roedor': '🐹' }[p.tipo] || '🐾'}</span>
                <strong>${esc(p.nome)}</strong><small>${esc(p.tipo)}${p.raca ? ' · ' + esc(p.raca) : ''} · ${p.porte}${p.sexo ? ' · ' + p.sexo : ''}</small>
                ${p.nascimento ? `<small>Nasceu em ${dataBR(p.nascimento)}</small>` : ''}
                <div class="acoes" style="margin-top:8px"><button class="btn btn-borda btn-peq" data-acao="editar-pet" data-id="${p.id}">Editar</button><button class="btn btn-perigo btn-peq" data-acao="excluir-pet" data-id="${p.id}">Excluir</button></div>
            </div>`).join('')}</div>`
            : '<div class="sem-pet"><div class="grande">🐶</div><h3>Você ainda não cadastrou nenhum pet</h3><p>Cadastre seus pets para agendar banho e tosa mais rápido.</p><button class="btn btn-azul" data-acao="novo-pet">＋ Cadastrar pet</button></div>'}
        </div>`;
    }
    if (contaAba === 'clube') {
        const a = u.assinatura && u.assinatura.ativa ? u.assinatura : null;
        if (!a) return `<div class="caixa"><h2>Clube AgroPet</h2><p style="margin-bottom:18px">Você ainda não é assinante.</p>${planosHTML()}</div>`;
        const pl = PLANOS[a.plano];
        return `<div class="caixa"><h2>Minha assinatura</h2>
            <div class="stats">
                <div class="stat"><span class="ic">⭐</span><small>Plano</small><strong>${pl.nome}</strong></div>
                <div class="stat"><span class="ic">💳</span><small>Mensalidade</small><strong>${dinheiro(pl.preco)}</strong></div>
                <div class="stat"><span class="ic">📦</span><small>Próxima entrega</small><strong>${a.diaEntrega ? dataBR(proximaEntrega(a.diaEntrega)) : 'Sem agendamento'}</strong></div>
            </div>
            <p style="margin-bottom:6px">Entrega mensal: <b>${nomesItens(a)}</b>${a.diaEntrega ? ` · todo dia ${a.diaEntrega}` : ''}</p>
            <p style="margin-bottom:18px">Assinante desde ${dataBR(a.desde)}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
                <button class="btn btn-azul" data-acao="alterar-assinatura">Alterar plano, ração ou entrega</button>
                <button class="btn btn-perigo" data-acao="cancelar-assinatura">Cancelar assinatura</button>
            </div></div>`;
    }
    return `<form class="caixa form" id="formDados" style="max-width:560px"><h2>Meus dados</h2>
        <label>Nome<input name="nome" value="${esc(u.nome)}" required></label>
        <label>E-mail<input name="email" type="email" value="${esc(u.email)}" required></label>
        <label>Telefone<input name="telefone" value="${esc(u.telefone)}"></label>
        <label>Nova senha <small style="color:var(--suave);font-weight:400">(deixe em branco para manter)</small><input name="senha" type="password"></label>
        <button class="btn btn-azul" style="align-self:flex-start">Salvar alterações</button>
    </form>`;
}

function itensAss(a) { return a.itens ? a.itens : (a.racaoId ? [{ id: a.racaoId, qtd: 1 }] : []); }
function nomesItens(a, sep = ', ') {
    const l = itensAss(a).filter(i => produtoPor(i.id)).map(i => `${i.qtd}× ${esc(produtoPor(i.id).nome)}`);
    return l.length ? l.join(sep) : 'Sem entrega mensal';
}
function textoEntrega(a) { return a.diaEntrega ? `todo dia ${a.diaEntrega} · próxima em ${dataBR(proximaEntrega(a.diaEntrega))}` : 'Sem agendamento'; }

function proximaEntrega(dia) {
    const h = new Date();
    let d = new Date(h.getFullYear(), h.getMonth(), dia);
    if (d <= h) d = new Date(h.getFullYear(), h.getMonth() + 1, dia);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* =========================================================
   GERENCIAMENTO (admin / 123)
   ========================================================= */
let adminAba = 'painel';
let buscaAdmin = '';

const ABAS_ADMIN = [['painel', '📊', 'Painel'], ['produtos', '📦', 'Produtos'], ['pedidos', '🧾', 'Pedidos'], ['agendamentos', '🛁', 'Banho e Tosa'], ['assinaturas', '⭐', 'Assinaturas'], ['clientes', '👥', 'Clientes'], ['site', '🎨', 'Configurar site']];

function telaAdmin() {
    if (!adminLogado()) { ir('entrar'); return ''; }
    const novosPedidos = db.pedidos.filter(p => p.status === 'Recebido').length;
    const proximos = db.agendamentos.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).length;
    const badges = { pedidos: novosPedidos, agendamentos: proximos };
    const aba = ABAS_ADMIN.find(x => x[0] === adminAba);
    return `
    <div class="adm">
        <aside class="adm-lat">
            <div class="adm-logo">AgroPet<small>Gerenciamento</small></div>
            ${ABAS_ADMIN.map(([id, ic, nome]) => `<button class="${adminAba === id ? 'ativo' : ''}" data-acao="admin-aba" data-aba="${id}">${ic} ${nome}${badges[id] ? `<span class="adm-badge">${badges[id]}</span>` : ''}</button>`).join('')}
        </aside>
        <div class="adm-corpo">
            <header class="adm-topo">
                <div><small>Gerenciamento da loja</small><h1>${aba[1]} ${aba[2]}</h1></div>
                <div class="adm-user"><span>👤</span>admin<button class="btn btn-azul" data-acao="sair">↩ Sair</button></div>
            </header>
            <section class="adm-conteudo" id="adminConteudo">${adminConteudo()}</section>
        </div>
    </div>`;
}

function adminConteudo() {
    switch (adminAba) {
        case 'painel': return adminPainel();
        case 'produtos': return adminProdutos();
        case 'pedidos': return adminPedidos();
        case 'agendamentos': return adminAgendamentos();
        case 'assinaturas': return adminAssinaturas();
        case 'clientes': return adminClientes();
        case 'site': return adminSite();
    }
}

function adminPainel() {
    const validos = db.pedidos.filter(p => p.status !== 'Cancelado');
    const faturamento = validos.reduce((s, p) => s + p.total, 0);
    const proximos = db.agendamentos.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const assinantes = db.usuarios.filter(u => u.assinatura && u.assinatura.ativa);
    const mensal = assinantes.reduce((s, u) => s + PLANOS[u.assinatura.plano].preco, 0);
    const baixo = db.produtos.filter(p => p.estoque <= 10).sort((a, b) => a.estoque - b.estoque);
    return `
    <div class="stats">
        <div class="stat"><span class="ic">💰</span><small>Faturamento</small><strong>${dinheiro(faturamento)}</strong></div>
        <div class="stat"><span class="ic">🧾</span><small>Pedidos</small><strong>${db.pedidos.length}</strong></div>
        <div class="stat"><span class="ic">🛁</span><small>Agendamentos futuros</small><strong>${proximos.length}</strong></div>
        <div class="stat"><span class="ic">⭐</span><small>Assinantes · ${dinheiro(mensal)}/mês</small><strong>${assinantes.length}</strong></div>
    </div>
    <div class="duas" style="grid-template-columns:1fr 1fr">
        <div class="caixa"><h2>Próximos banhos</h2>${proximos.length ? `<div class="tabela-wrap"><table>
            ${proximos.slice(0, 6).map(a => `<tr><td>${dataBR(a.data)} ${a.hora}</td><td>${esc(a.pet)}</td><td>${servicoPor(a.servico).nome}</td></tr>`).join('')}
        </table></div>` : '<p class="vazio">Nenhum agendamento.</p>'}</div>
        <div class="caixa"><h2>Estoque baixo</h2>${baixo.length ? `<div class="tabela-wrap"><table>
            ${baixo.slice(0, 6).map(p => `<tr><td>${esc(p.icone)} ${esc(p.nome)}</td><td style="color:${p.estoque <= 5 ? 'var(--vermelho)' : 'inherit'};font-weight:600">${p.estoque} un.</td></tr>`).join('')}
        </table></div>` : '<p class="vazio">Tudo certo com o estoque.</p>'}</div>
    </div>
    <div class="caixa" style="margin-top:24px"><h2>Últimos pedidos</h2>${tabelaPedidos([...db.pedidos].reverse().slice(0, 5))}</div>`;
}

function adminProdutos() {
    const b = buscaAdmin.toLowerCase();
    const lista = db.produtos.filter(p => !b || p.nome.toLowerCase().includes(b) || p.categoria.toLowerCase().includes(b));
    return `
    <div class="caixa">
        <div class="barra-ferr">
            <input id="buscaAdmin" placeholder="🔍 Buscar produto" value="${esc(buscaAdmin)}">
            <button class="btn btn-azul" data-acao="novo-produto">+ Novo produto</button>
        </div>
        <div class="tabela-wrap"><table>
            <tr><th></th><th>Produto</th><th>Animal</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ativo</th><th></th></tr>
            ${lista.map(p => `<tr>
                <td><span class="mini-ic cor-${p.cor}">${imgProduto(p)}</span></td>
                <td><strong>${esc(p.nome)}</strong>${p.selo ? `<br><small style="color:var(--azul-escuro)">${esc(p.selo)}</small>` : ''}</td>
                <td>${animalPor(p.animal).nome}</td>
                <td>${esc(p.categoria)}</td>
                <td>${dinheiro(p.preco)}</td>
                <td style="color:${p.estoque <= 5 ? 'var(--vermelho)' : 'inherit'};font-weight:600">${p.estoque}</td>
                <td><button class="interruptor ${p.ativo ? 'on' : ''}" data-acao="ativar-produto" data-id="${p.id}" title="Mostrar na loja"></button></td>
                <td><div class="acoes"><button class="btn btn-borda btn-peq" data-acao="editar-produto" data-id="${p.id}">Editar</button><button class="btn btn-perigo btn-peq" data-acao="excluir-produto" data-id="${p.id}">Excluir</button></div></td>
            </tr>`).join('')}
        </table></div>
        ${!lista.length ? '<p class="vazio">Nenhum produto encontrado.</p>' : ''}
    </div>`;
}

function formProduto(p) {
    const novo = !p;
    p = p || { nome: '', animal: 'caes', categoria: 'Ração', preco: '', estoque: '', icone: '🐾', cor: 'amarelo', selo: '', descricao: '', imagem: '', ativo: true };
    const grupos = animalPor(p.animal).grupos;
    abrirModal(`
        <div class="modal-topo"><h2>${novo ? 'Novo produto' : 'Editar produto'}</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <form class="form" id="formProduto" data-id="${novo ? '' : p.id}">
            <span style="font-weight:500">Foto do produto</span>
            <div class="foto-campo">
                <div class="foto-prev cor-${p.cor}" id="fotoPrev">${imgProduto(p)}</div>
                <div class="botoes">
                    <label class="btn btn-borda btn-peq">📷 ${p.imagem ? 'Trocar foto' : 'Escolher foto'}<input type="file" accept="image/*" id="inputFoto" hidden></label>
                    <button type="button" class="btn btn-perigo btn-peq" data-acao="remover-foto" id="btnRemoverFoto" style="${p.imagem ? '' : 'display:none'}">Remover foto</button>
                    <small>JPG ou PNG. Sem foto, aparece o emoji.</small>
                </div>
            </div>
            <input type="hidden" name="imagem" id="campoImagem" value="${esc(p.imagem || '')}">
            <label>Nome<input name="nome" value="${esc(p.nome)}" required></label>
            <div class="form-linha">
                <label>Animal<select name="animal" id="selAnimal">${ANIMAIS.map(a => `<option value="${a.id}" ${a.id === p.animal ? 'selected' : ''}>${a.icone} ${a.nome}</option>`).join('')}</select></label>
                <label>Categoria<select name="categoria" id="selCategoria">${grupos.map(g => `<option ${g.t === p.categoria ? 'selected' : ''}>${esc(g.t)}</option>`).join('')}</select></label>
            </div>
            <div class="form-linha">
                <label>Preço (R$)<input name="preco" type="number" step="0.01" min="0" value="${p.preco}" required></label>
                <label>Estoque<input name="estoque" type="number" min="0" step="1" value="${p.estoque}" required></label>
            </div>
            <div class="form-linha">
                <label>Ícone (emoji)<input name="icone" value="${esc(p.icone)}" maxlength="4" required></label>
                <label>Cor do fundo<select name="cor">${CORES.map(c => `<option ${c === p.cor ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
            </div>
            <label>Selo <small style="color:var(--suave);font-weight:400">(opcional — ex.: Oferta, Novo)</small><input name="selo" value="${esc(p.selo)}"></label>
            <label>Descrição<textarea name="descricao" rows="2">${esc(p.descricao)}</textarea></label>
            <div class="modal-acoes">
                <button type="button" class="btn btn-borda" data-acao="fechar-modal">Cancelar</button>
                <button class="btn btn-azul">${novo ? 'Cadastrar produto' : 'Salvar alterações'}</button>
            </div>
        </form>`);
}

async function salvarProduto(f) {
    const d = Object.fromEntries(new FormData(f));
    const dados = { nome: d.nome.trim(), animal: d.animal, categoria: d.categoria, preco: parseFloat(d.preco), estoque: parseInt(d.estoque, 10), icone: d.icone.trim(), cor: d.cor, selo: d.selo.trim(), descricao: d.descricao.trim(), imagem: d.imagem || '' };
    try {
        if (f.dataset.id) await api('PUT', '/produtos/' + f.dataset.id, dados);
        else await api('POST', '/produtos', dados);
        fecharModal();
        await sincronizar();
        aviso(f.dataset.id ? 'Produto atualizado ✓' : 'Produto cadastrado ✓');
    } catch (e) { aviso('⚠️ ' + e.message); }
}

function tabelaPedidos(lista, editavel = false) {
    if (!lista.length) return '<p class="vazio">Nenhum pedido.</p>';
    return `<div class="tabela-wrap"><table>
        <tr><th>Nº</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Pagamento</th><th>Status</th></tr>
        ${lista.map(p => `<tr>
            <td>#${p.id}</td><td>${dataBR(p.data)}</td><td>${esc((usuarioPor(p.clienteId) || {}).nome || '—')}</td>
            <td>${p.itens.map(i => `${i.qtd}× ${esc(i.nome)}`).join('<br>')}</td>
            <td><strong>${dinheiro(p.total)}</strong></td><td>${p.pagamento}</td>
            <td>${editavel ? `<select data-acao-change="status-pedido" data-id="${p.id}">${STATUS_PEDIDO.map(s => `<option ${s === p.status ? 'selected' : ''}>${s}</option>`).join('')}</select>` : `<span class="status st-${p.status.replace(' ', '-')}">${p.status}</span>`}</td>
        </tr>`).join('')}
    </table></div>`;
}

function adminPedidos() {
    return `<div class="caixa">${tabelaPedidos([...db.pedidos].reverse(), true)}
        <p class="nota" style="margin-top:14px">Ao cancelar um pedido, os itens voltam para o estoque.</p></div>`;
}

function adminAgendamentos() {
    const lista = [...db.agendamentos].sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    return `<div class="caixa">${lista.length ? `<div class="tabela-wrap"><table>
        <tr><th>Data</th><th>Pet</th><th>Porte</th><th>Serviço</th><th>Cliente</th><th>Valor</th><th>Status</th></tr>
        ${lista.map(a => `<tr><td>${dataBR(a.data)} às ${a.hora}</td><td>${esc(a.pet)} <small style="color:var(--suave)">${a.especie}</small></td><td>${a.porte}</td><td>${servicoPor(a.servico).nome}${(a.extras || []).length ? `<br><small style="color:var(--suave)">+ ${a.extras.map(x => extraPor(x).nome).join(', ')}</small>` : ''}</td>
        <td>${esc((usuarioPor(a.clienteId) || {}).nome || '—')}<br><small style="color:var(--suave)">${esc((usuarioPor(a.clienteId) || {}).telefone || '')}</small></td>
        <td>${a.gratis ? 'Grátis ⭐' : dinheiro(a.valor)}</td>
        <td><select data-acao-change="status-agenda" data-id="${a.id}">${STATUS_AGENDA.map(s => `<option ${s === a.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('')}
    </table></div>` : '<p class="vazio">Nenhum agendamento.</p>'}</div>`;
}

function adminAssinaturas() {
    const lista = db.usuarios.filter(u => u.assinatura);
    return `<div class="caixa">${lista.length ? `<div class="tabela-wrap"><table>
        <tr><th>Cliente</th><th>Plano</th><th>Rações</th><th>Entrega</th><th>Desde</th><th>Status</th><th></th></tr>
        ${lista.map(u => { const a = u.assinatura; return `<tr><td>${esc(u.nome)}</td><td>${PLANOS[a.plano].nome} · ${dinheiro(PLANOS[a.plano].preco)}</td>
        <td>${nomesItens(a, '<br>')}</td><td>${!a.ativa ? '—' : a.diaEntrega ? 'Dia ' + a.diaEntrega + ' · próx. ' + dataBR(proximaEntrega(a.diaEntrega)) : 'Sem agendamento'}</td><td>${dataBR(a.desde)}</td>
        <td><span class="status st-${a.ativa ? 'Ativa' : 'Cancelada'}">${a.ativa ? 'Ativa' : 'Cancelada'}</span></td>
        <td>${a.ativa ? `<button class="btn btn-perigo btn-peq" data-acao="admin-cancelar-assinatura" data-id="${u.id}">Cancelar</button>` : ''}</td></tr>`; }).join('')}
    </table></div>` : '<p class="vazio">Nenhum assinante ainda.</p>'}</div>`;
}

function adminClientes() {
    return `<div class="caixa">${db.usuarios.length ? `<div class="tabela-wrap"><table>
        <tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Pedidos</th><th>Total gasto</th><th>Plano</th><th>Cliente desde</th></tr>
        ${db.usuarios.map(u => { const peds = db.pedidos.filter(p => p.clienteId === u.id && p.status !== 'Cancelado'); return `<tr>
        <td><strong>${esc(u.nome)}</strong></td><td>${esc(u.email)}</td><td>${esc(u.telefone)}</td><td>${peds.length}</td><td>${dinheiro(peds.reduce((s, p) => s + p.total, 0))}</td>
        <td>${planoAtivo(u) ? '⭐ ' + planoAtivo(u).nome : '—'}</td><td>${dataBR(u.criadoEm)}</td></tr>`; }).join('')}
    </table></div>` : '<p class="vazio">Nenhum cliente.</p>'}</div>`;
}

function adminSite() {
    const s = db.site;
    return `
    <form class="caixa form" id="formSite" style="max-width:680px">
        <h2>Banner da página inicial</h2>
        <label>Etiqueta<input name="pilula" value="${esc(s.pilula)}"></label>
        <label>Título<input name="titulo" value="${esc(s.titulo)}" required></label>
        <label>Texto<textarea name="texto" rows="2">${esc(s.texto)}</textarea></label>
        <label>Texto do botão<input name="botao" value="${esc(s.botao)}"></label>
        <h2 style="margin-top:8px">Entrega</h2>
        <div class="form-linha">
            <label>Valor do frete (R$)<input name="frete" type="number" step="0.01" min="0" value="${s.frete}"></label>
            <label>Frete grátis acima de (R$)<input name="freteGratisAcima" type="number" step="0.01" min="0" value="${s.freteGratisAcima}"></label>
        </div>
        <button class="btn btn-azul" style="align-self:flex-start">Salvar configurações</button>
    </form>
    <div class="caixa" style="margin-top:20px">
        <h2>Imagens dos banners</h2>
        <p style="color:var(--suave);margin:-8px 0 14px">Troque os emojis do lado direito de cada banner por uma imagem. Imagens com fundo branco ficam mais bonitas.</p>
        <div class="lista-imgs">
            ${['Banner principal', 'Banner do Clube', 'Banner do Banho e Tosa'].map((nome, i) => {
                const img = imgSlide(i);
                const propria = !!s.imgSlides[i];
                return `<div class="linha-img">
                    <span class="img-prev contem">${img ? `<img src="${img}" alt="">` : ['🐶🐱', '⭐📦', '🐩🛁'][i]}</span>
                    <div class="txt"><strong>${nome}</strong><small>${propria ? 'Imagem enviada por você' : IMG_PADRAO[i] ? 'Usando a foto padrão' : 'Usando emojis'}</small></div>
                    <div class="acoes">
                        <label class="btn btn-borda btn-peq" style="flex-direction:row">📷 Trocar imagem<input type="file" accept="image/*" hidden data-upload="slide" data-i="${i}"></label>
                        ${propria ? `<button class="btn btn-perigo btn-peq" data-acao="img-slide-padrao" data-i="${i}">${IMG_PADRAO[i] ? 'Voltar à foto padrão' : 'Voltar aos emojis'}</button>` : ''}
                    </div>
                </div>`; }).join('')}
        </div>
    </div>
    <div class="caixa" style="margin-top:20px">
        <h2>Imagens dos animais</h2>
        <p style="color:var(--suave);margin:-8px 0 14px">Aparecem nos círculos da página inicial e no topo da página de cada animal.</p>
        <div class="grade-imgs">
            ${ANIMAIS.map(a => `<div class="linha-img">
                <span class="img-prev redondo cor-${a.cor}">${iconeAnimal(a)}</span>
                <div class="txt"><strong>${a.nome}</strong><small>${s.imgAnimais[a.id] ? 'Com imagem' : 'Emoji ' + a.icone}</small></div>
                <div class="acoes">
                    <label class="btn btn-borda btn-peq" style="flex-direction:row" title="Trocar imagem">📷<input type="file" accept="image/*" hidden data-upload="animal" data-animal="${a.id}"></label>
                    ${s.imgAnimais[a.id] ? `<button class="btn btn-perigo btn-peq" data-acao="img-animal-remover" data-animal="${a.id}" title="Voltar ao emoji">✕</button>` : ''}
                </div>
            </div>`).join('')}
        </div>
    </div>
    <div class="caixa" style="max-width:680px;margin-top:20px">
        <h2>Dados de demonstração</h2>
        <p>Para apagar tudo e voltar aos dados iniciais, rode no terminal do projeto:</p>
        <pre style="background:var(--fundo);padding:12px 16px;border-radius:10px;margin-top:10px">node prisma/seed.mjs</pre>
    </div>`;
}

/* =========================================================
   MODAL
   ========================================================= */
function abrirModal(html) { $('#modal').innerHTML = `<div class="fundo-modal" data-acao="fundo-modal"><div class="modal">${html}</div></div>`; }
function fecharModal() { $('#modal').innerHTML = ''; }

/* =========================================================
   ROTAS
   ========================================================= */
function rotaAtual() { return rotaVar; }

const ROTAS = {
    '': telaLoja,
    'carrinho': telaCarrinho,
    'finalizar': telaFinalizar,
    'pedido-confirmado': telaPedidoOk,
    'banho-e-tosa': telaBanho,
    'agendar': telaAgendar,
    'clube': telaClube,
    'assinar': telaAssinar,
    'assinatura-confirmada': telaAssinaturaOk,
    'entrar': telaEntrar,
    'conta': telaConta,
    'admin': telaAdmin,
};

function renderizar() {
    if (adminLogado() && rotaAtual() !== 'admin') { ir('admin'); return; }
    const rota = rotaAtual();
    if (rota === 'produtos') { ir(''); return; }
    const tela = ROTAS[rota] || (ehPaginaAnimal(rota) ? telaAnimal : telaLoja);
    const html = tela();
    if (html === '' && rota !== '') return;
    document.body.classList.toggle('modo-admin', tela === telaAdmin);
    $('#app').innerHTML = html;
    if (tela === telaLoja) iniciarSlides();
    atualizarTopo();
    fecharMenus();
}

function fecharMenus() {
    document.querySelectorAll('.categoria.aberta').forEach(c => c.classList.remove('aberta'));
    document.querySelectorAll('.painel-item.aberto').forEach(c => c.classList.remove('aberto'));
}

function rolarProdutos() {
    setTimeout(() => { const el = $('#produtos'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
}

window.addEventListener('hashchange', () => {
    const h = lerHash();
    if (h !== rotaVar) { rotaVar = h; renderizar(); window.scrollTo(0, 0); }
});

/* =========================================================
   CLIQUES (um só "ouvinte" para o site todo)
   ========================================================= */
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-acao]');
    const link = e.target.closest('[data-ir]');
    if (!e.target.closest('.categoria')) fecharMenus();
    if (!e.target.closest('.conta-drop')) document.querySelectorAll('.conta-drop.aberto').forEach(d => d.classList.remove('aberto'));
    if (link) {
        e.preventDefault();
        if (link.dataset.ir === '' && filtro.busca) { filtro.busca = ''; $('#busca').value = ''; }
        if (el && el.dataset.acao === 'entrar-voltar') voltarPara = el.dataset.voltar;
        if (el && el.dataset.acao === 'ir-aba') contaAba = el.dataset.aba;
        if (el && el.dataset.acao === 'novo-agendamento') ag = novoAg();
        $('#barra').classList.remove('aberta');
        ir(link.dataset.ir);
        return;
    }
    if (!el) return;
    const acao = el.dataset.acao;
    const id = el.dataset.id ? +el.dataset.id : null;

    switch (acao) {
        case 'abrir-conta': el.parentElement.classList.toggle('aberto'); break;
        case 'abrir-categoria': {
            const li = el.parentElement;
            if (window.innerWidth > 720) { abrirAnimal(li.dataset.animal); break; }
            const estava = li.classList.contains('aberta');
            fecharMenus();
            if (!estava) li.classList.add('aberta');
            break;
        }
        case 'filtrar': {
            // no celular, tocar no grupo abre as opções em vez de filtrar direto
            if (el.classList.contains('painel-item-btn') && window.innerWidth <= 720 && !el.parentElement.classList.contains('aberto')) {
                el.parentElement.classList.add('aberto'); break;
            }
            abrirAnimal(el.dataset.animal, el.dataset.categoria || null);
            break;
        }
        case 'pag-atalho': pag.categorias = el.dataset.cat ? [el.dataset.cat] : []; rerenderMantendoRolagem(); break;
        case 'pag-limpar': pag = { ...novoPag(pag.id), ordem: pag.ordem }; rerenderMantendoRolagem(); break;
        case 'pag-mostrar-filtros': pag.filtrosAbertos = !pag.filtrosAbertos; rerenderMantendoRolagem(); break;
        case 'pag-remover': {
            const t = el.dataset.tipo, v = el.dataset.valor;
            if (t === 'pet') pag.pets = pag.pets.filter(x => x !== v);
            if (t === 'cat') pag.categorias = pag.categorias.filter(x => x !== v);
            if (t === 'faixa') pag.faixa = null;
            if (t === 'preco') { pag.min = ''; pag.max = ''; }
            if (t === 'estoque') pag.estoque = false;
            if (t === 'ofertas') pag.ofertas = false;
            rerenderMantendoRolagem();
            break;
        }
        case 'rolar-produtos': e.preventDefault(); rolarProdutos(); break;
        case 'rolar': { const alvo = document.getElementById(el.dataset.alvo); alvo.scrollBy({ left: +el.dataset.dir * alvo.clientWidth * 0.8, behavior: 'smooth' }); break; }
        case 'slide': irSlide(slideAtual + +el.dataset.dir); iniciarSlides(); break;
        case 'ir-slide': irSlide(+el.dataset.n); iniciarSlides(); break;
        case 'adicionar': {
            const p = produtoPor(id);
            const item = db.carrinho.find(i => i.id === id);
            const atual = item ? item.qtd : 0;
            if (atual + 1 > p.estoque) { aviso('Quantidade máxima em estoque'); break; }
            if (item) item.qtd++; else db.carrinho.push({ id, qtd: 1 });
            salvar();
            aviso(`🛒 ${p.nome} adicionado`);
            break;
        }
        case 'qtd': {
            const item = db.carrinho.find(i => i.id === id);
            const novo = item.qtd + +el.dataset.delta;
            if (novo > produtoPor(id).estoque) { aviso('Quantidade máxima em estoque'); break; }
            if (novo <= 0) db.carrinho = db.carrinho.filter(i => i.id !== id); else item.qtd = novo;
            salvar(); renderizar();
            break;
        }
        case 'remover': db.carrinho = db.carrinho.filter(i => i.id !== id); salvar(); renderizar(); break;
        case 'pagamento': pagamentoEscolhido = el.dataset.valor; document.querySelectorAll('[data-acao="pagamento"]').forEach(b => b.classList.toggle('sel', b === el)); break;
        case 'confirmar-pedido': if (!el.disabled) confirmarPedido(); break;

        case 'novo-agendamento': ag = novoAg(); break;
        case 'ag-pet': ag.petId = id; rerenderMantendoRolagem(); break;
        case 'ag-servico': ag.servico = el.dataset.valor; rerenderMantendoRolagem(); break;
        case 'ag-extra': { const v = el.dataset.valor; ag.extras = ag.extras.includes(v) ? ag.extras.filter(x => x !== v) : [...ag.extras, v]; rerenderMantendoRolagem(); break; }
        case 'ag-hora': if (!el.disabled) { ag.hora = el.dataset.valor; rerenderMantendoRolagem(); } break;
        case 'ag-continuar': ag.passo++; renderizar(); window.scrollTo(0, 0); break;
        case 'ag-voltar': if (ag.passo > 1) { ag.passo--; renderizar(); } else ir('banho-e-tosa'); break;
        case 'ag-confirmar': if (!el.disabled) confirmarAgenda(); break;
        case 'novo-pet': formPet(null); break;
        case 'editar-pet': formPet(petPor(usuarioLogado(), id)); break;
        case 'excluir-pet': pedirConfirmacao(`Excluir ${petPor(usuarioLogado(), id).nome} dos seus pets?`, () => executar(async () => { await api('DELETE', '/pets/' + id); await sincronizar(); aviso('Pet excluído'); })); break;
        case 'sub-agenda': subAgenda = el.dataset.valor; rerenderMantendoRolagem(); break;
        case 'cancelar-pedido':
            pedirConfirmacao('Cancelar este pedido? Os itens voltam para a loja.', () => executar(async () => { await api('PATCH', '/pedidos/' + id, { status: 'Cancelado' }); await sincronizar(); aviso('Pedido cancelado'); }));
            break;
        case 'cancelar-agenda':
            pedirConfirmacao('Cancelar este agendamento?', () => executar(async () => { await api('PATCH', '/agendamentos/' + id, { status: 'Cancelado' }); await sincronizar(); aviso('Agendamento cancelado'); }));
            break;
        case 'entrar-voltar': voltarPara = el.dataset.voltar; break;

        case 'assinar': abrirAssinatura(el.dataset.plano); break;
        case 'alterar-assinatura': {
            const a = usuarioLogado().assinatura;
            assinar = { plano: a.plano, animal: 'todos', entrega: !!a.diaEntrega, itens: itensAss(a).map(i => ({ ...i })), dia: a.diaEntrega || 10, pagamento: a.pagamento || 'Cartão de crédito' };
            ir('assinar');
            break;
        }
        case 'assinar-campo': {
            const c = el.dataset.campo;
            if (c === 'dia') assinar.dia = +el.dataset.valor;
            else if (c === 'entrega') assinar.entrega = el.dataset.valor === 'sim';
            else assinar[c] = el.dataset.valor;
            const y = window.scrollY;
            renderizar();
            window.scrollTo(0, y);
            break;
        }
        case 'racao-alternar': {
            const i = assinar.itens.findIndex(x => x.id === id);
            if (i >= 0) assinar.itens.splice(i, 1); else assinar.itens.push({ id, qtd: 1 });
            const y = window.scrollY; renderizar(); window.scrollTo(0, y);
            break;
        }
        case 'racao-qtd': {
            const item = assinar.itens.find(x => x.id === id);
            item.qtd += +el.dataset.delta;
            if (item.qtd <= 0) assinar.itens = assinar.itens.filter(x => x.id !== id);
            const y = window.scrollY; renderizar(); window.scrollTo(0, y);
            break;
        }
        case 'confirmar-assinatura': {
            if (el.disabled) break;
            const u = usuarioLogado();
            const antes = u.assinatura && u.assinatura.ativa;
            el.disabled = true;
            executar(async () => {
                await api('POST', '/assinatura', {
                    plano: assinar.plano, pagamento: assinar.pagamento,
                    diaEntrega: assinar.entrega ? assinar.dia : 0,
                    itens: assinar.entrega ? assinar.itens.map(i => ({ produtoId: i.id, qtd: i.qtd })) : [],
                });
                await carregar();
                if (antes) { aviso('Assinatura atualizada ✓'); contaAba = 'clube'; ir('conta'); }
                else ir('assinatura-confirmada');
            }).finally(() => { el.disabled = false; });
            break;
        }
        case 'cancelar-assinatura':
            pedirConfirmacao('Tem certeza que quer cancelar a assinatura?', () => executar(async () => { await api('DELETE', '/assinatura'); await sincronizar(); aviso('Assinatura cancelada'); }));
            break;

        case 'aba-entrar': abaEntrar = el.dataset.aba; renderizar(); break;
        case 'conta-aba': contaAba = el.dataset.aba; renderizar(); break;
        case 'ir-aba': contaAba = el.dataset.aba; break;
        case 'sair':
            executar(async () => {
                try { await api('POST', '/logout'); } catch (e) { /* já estava fora */ }
                db.sessao = null; salvar();
                await carregar(); montarMenu();
                aviso('Até logo! 👋'); ir('');
            });
            break;

        case 'admin-aba': adminAba = el.dataset.aba; buscaAdmin = ''; renderizar(); break;
        case 'novo-produto': formProduto(null); break;
        case 'editar-produto': formProduto(produtoPor(id)); break;
        case 'excluir-produto':
            pedirConfirmacao(`Excluir "${produtoPor(id).nome}"?`, () => executar(async () => { await api('DELETE', '/produtos/' + id); await sincronizar(); aviso('Produto excluído'); }));
            break;
        case 'ativar-produto': { const p = produtoPor(id); executar(async () => { await api('PUT', '/produtos/' + id, { ativo: !p.ativo }); await sincronizar(); aviso(!p.ativo ? 'Produto visível na loja' : 'Produto escondido da loja'); }); break; }
        case 'admin-cancelar-assinatura':
            pedirConfirmacao('Cancelar a assinatura deste cliente?', () => executar(async () => { await api('PATCH', '/admin/assinaturas', { clienteId: id, ativa: false }); await sincronizar(); aviso('Assinatura cancelada'); }));
            break;

        case 'fundo-modal': if (e.target === el) fecharModal(); break;
        case 'fechar-modal': fecharModal(); break;
        case 'img-slide-padrao': {
            const imgs = [...db.site.imgSlides]; imgs[+el.dataset.i] = '';
            executar(async () => { await api('PUT', '/config', { imgSlides: imgs }); await sincronizar(); aviso('Imagem do banner restaurada'); });
            break;
        }
        case 'img-animal-remover':
            executar(async () => { await api('PUT', '/animais', { id: el.dataset.animal, imagem: '' }); await sincronizar(); aviso('Voltou para o emoji'); });
            break;
        case 'remover-foto':
            $('#campoImagem').value = ''; $('#inputFoto').value = '';
            $('#fotoPrev').textContent = $('#formProduto').icone.value || '🐾';
            el.style.display = 'none';
            break;
        case 'sim-confirmar': { const fn = confirmarDepois; confirmarDepois = null; fecharModal(); if (fn) fn(); break; }
    }
});

/* Diminui a foto para no máximo 600px (assim cabe no armazenamento do navegador) */
function reduzirImagem(arquivo, pronto, max = 600) {
    if (!arquivo.type.startsWith('image/')) { aviso('Escolha um arquivo de imagem'); return; }
    const leitor = new FileReader();
    leitor.onload = () => {
        const img = new Image();
        img.onload = () => {
            const escala = Math.min(1, max / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * escala); c.height = Math.round(img.height * escala);
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
            ctx.drawImage(img, 0, 0, c.width, c.height);
            pronto(c.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => aviso('Não foi possível abrir essa imagem');
        img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
}

/* Formulários */
document.addEventListener('submit', (e) => {
    const f = e.target;
    e.preventDefault();
    if (f.id === 'formEntrar') entrar(f);
    else if (f.id === 'formCadastro') cadastrar(f);
    else if (f.id === 'formProduto') salvarProduto(f);
    else if (f.id === 'formPet') salvarPet(f);
    else if (f.id === 'formSite') {
        const d = Object.fromEntries(new FormData(f));
        executar(async () => {
            await api('PUT', '/config', { pilula: d.pilula, titulo: d.titulo, texto: d.texto, botao: d.botao, frete: parseFloat(d.frete) || 0, freteGratisAcima: parseFloat(d.freteGratisAcima) || 0 });
            await sincronizar(); aviso('Configurações salvas ✓');
        });
    } else if (f.id === 'formDados') {
        const d = Object.fromEntries(new FormData(f));
        executar(async () => {
            await api('PUT', '/eu', { nome: d.nome, email: d.email, telefone: d.telefone, ...(d.senha ? { senha: d.senha } : {}) });
            await sincronizar(); aviso('Dados atualizados ✓');
        });
    }
});

/* Campos que mudam valor */
document.addEventListener('change', (e) => {
    const el = e.target;
    const f = el.dataset.f;
    if (f) {
        const alterna = (lista, v) => lista.includes(v) ? lista.filter(x => x !== v) : [...lista, v];
        if (f === 'cat') pag.categorias = alterna(pag.categorias, el.value);
        if (f === 'pet') pag.pets = alterna(pag.pets, el.value);
        if (f === 'faixa') { pag.faixa = el.value; pag.min = ''; pag.max = ''; }
        if (f === 'min' || f === 'max') { pag[f] = el.value; pag.faixa = null; }
        if (f === 'estoque') pag.estoque = el.checked;
        if (f === 'ofertas') pag.ofertas = el.checked;
        if (f === 'ordem') pag.ordem = el.value;
        rerenderMantendoRolagem();
        return;
    }
    if (el.id === 'dataBanho') { ag.data = el.value; ag.hora = null; ag.ocupados = []; executar(buscarHorarios); return; }
    if (el.dataset.upload && el.files[0]) {
        const tipo = el.dataset.upload;
        reduzirImagem(el.files[0], (url) => executar(async () => {
            if (tipo === 'slide') { const imgs = [...db.site.imgSlides]; imgs[+el.dataset.i] = url; await api('PUT', '/config', { imgSlides: imgs }); }
            if (tipo === 'animal') await api('PUT', '/animais', { id: el.dataset.animal, imagem: url });
            await sincronizar(); aviso('Imagem atualizada ✓');
        }), tipo === 'slide' ? 700 : 300);
        return;
    }
    if (el.id === 'inputFoto' && el.files[0]) {
        reduzirImagem(el.files[0], (url) => {
            $('#campoImagem').value = url;
            $('#fotoPrev').innerHTML = `<img src="${url}" alt="">`;
            $('#btnRemoverFoto').style.display = '';
        });
    }
    if (el.id === 'selAnimal') {
        $('#selCategoria').innerHTML = animalPor(el.value).grupos.map(g => `<option>${esc(g.t)}</option>`).join('');
    }
    const ac = el.dataset.acaoChange;
    if (ac === 'status-pedido') {
        const id = +el.dataset.id, status = el.value;
        executar(async () => { await api('PATCH', '/pedidos/' + id, { status }); await sincronizar(); aviso(`Pedido #${id}: ${status}`); });
    }
    if (ac === 'status-agenda') {
        const a = db.agendamentos.find(x => x.id === +el.dataset.id), status = el.value;
        executar(async () => { await api('PATCH', '/agendamentos/' + a.id, { status }); await sincronizar(); aviso(`Agendamento de ${a.pet}: ${status}`); });
    }
});

/* Busca do topo e do admin */
document.addEventListener('input', (e) => {
    if (e.target.id === 'busca') {
        filtro.busca = e.target.value;
        if (rotaAtual() !== '') { ir(''); $('#busca').focus(); }
        else renderizar();
    }
    if (e.target.id === 'buscaAdmin') {
        buscaAdmin = e.target.value;
        const pos = e.target.selectionStart;
        $('#adminConteudo').innerHTML = adminConteudo();
        const inp = $('#buscaAdmin'); inp.focus(); inp.setSelectionRange(pos, pos);
    }
});

$('#menuBtn').addEventListener('click', () => $('#barra').classList.toggle('aberta'));

/* Início */
/* Início: busca os dados na API e desenha o site */
(async function iniciar() {
    $('#app').innerHTML = '<div class="container sucesso"><div class="grande">🐾</div><p>Carregando...</p></div>';
    try {
        await carregar();
    } catch (e) {
        $('#app').innerHTML = `<div class="container sucesso"><div class="grande">⚠️</div><h1>Não foi possível carregar a loja</h1><p>${esc(e.message)}. Confira se o "npm run dev" está rodando e se o banco foi criado (npx prisma migrate dev e node prisma/seed.mjs).</p></div>`;
        return;
    }
    montarMenu();
    renderizar();
})();
