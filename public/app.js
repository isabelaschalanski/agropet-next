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
    return { plano: a.plano, itens: (a.itens || []).map(i => ({ id: i.produtoId, qtd: i.qtd })), diaEntrega: a.diaEntrega, pagamento: a.pagamento, desde: soData(a.desde), ativa: a.ativa, arquivada: !!a.arquivada };
}
function usuarioDaApi(u) {
    return { id: u.id, nome: u.nome, email: u.email, telefone: u.telefone || '', observacoes: u.observacoes || '', criadoEm: soData(u.criadoEm), pets: u.pets || [], assinatura: assinaturaDaApi(u.assinatura) };
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
                    <strong class="item-total">${dinheiro(i.p.preco * i.qtd)}</strong>
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
                <p class="nota" style="font-size:.85rem">Demonstração — cliente: <b>maria@email.com</b> / <b>123</b></p>
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

/* =========================================================
   GERENCIAMENTO (área do admin)
   ========================================================= */
// Menu lateral, agrupado: [grupo, [[id, ícone, nome, subtítulo], ...]]
const GRUPOS_ADMIN = [
    ['Gerenciamento', [
        ['painel', '📊', 'Painel', 'Gerencie sua loja de forma simples e eficiente.'],
        ['produtos', '📦', 'Produtos', 'Catálogo, estoque e o que aparece na loja.'],
        ['pedidos', '🧾', 'Pedidos', 'Acompanhe e despache as compras.'],
        ['agendamentos', '🛁', 'Banho e Tosa', 'Agenda de banhos, remarcações e confirmações.'],
        ['assinaturas', '⭐', 'Assinaturas', 'Assinantes do Clube AgroPet.'],
    ]],
    ['Cadastros', [['clientes', '👥', 'Clientes', 'Quem compra na AgroPet: contatos, pets e histórico.']]],
    ['Personalização', [['site', '🎨', 'Configurar site', 'Textos, imagens, frete e dados de teste.']]],
];
const ABAS_ADMIN = GRUPOS_ADMIN.flatMap(g => g[1]);

// Estado das telas do gerenciamento (abas, filtros, seleção)
const ADM = {
    periodo: 30,
    pedidosAba: 'andamento', agAba: 'agendados', assAba: 'ativas',
    busca: { pedidos: '', agendamentos: '', clientes: '', assinaturas: '' },
    prod: { busca: '', animal: '', categoria: '', status: '', pagina: 1 },
    sel: new Set(),
    novoAg: null, editAg: null,
};
let buscaAdmin = ''; // (mantido por compatibilidade)
const POR_PAGINA = 15;

// ---------- etiquetas de status ----------
const BADGE_PEDIDO = { 'Recebido': ['amarelo', '⏳'], 'Em separação': ['azul', '📦'], 'Enviado': ['azul', '🚚'], 'Entregue': ['verde', '✓'], 'Cancelado': ['vermelho', '✕'] };
const BADGE_AGENDA = { 'Agendado': ['azul', '📅'], 'Concluído': ['verde', '✓'], 'Cancelado': ['vermelho', '✕'] };
const PROXIMO_PEDIDO = { 'Recebido': ['Em separação', 'Separar'], 'Em separação': ['Enviado', 'Enviar'], 'Enviado': ['Entregue', 'Entregue ✓'] };
function badge(texto, cor, icone = '') { return `<span class="badge b-${cor}">${icone ? `<i>${icone}</i>` : ''}${esc(texto)}</span>`; }
function badgePedido(s) { const [c, i] = BADGE_PEDIDO[s] || ['cinza', '']; return badge(s, c, i); }
function badgeAgenda(s) { const [c, i] = BADGE_AGENDA[s] || ['cinza', '']; return badge(s, c, i); }
function badgeEstoque(n) { return n <= 5 ? badge(n + ' un.', 'vermelho') : n <= 10 ? badge(n + ' un.', 'amarelo') : `<span class="num-estoque">${n}</span>`; }
const iconePet = (especie) => ({ Cachorro: '🐶', Gato: '🐱', Pássaro: '🐦', Peixe: '🐟', Roedor: '🐹' }[especie] || '🐾');
const iniciais = (nome) => String(nome || '?').split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
const nomeCliente = (id) => (usuarioPor(id) || {}).nome || '—';

// datas
const isoDe = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function diasAtras(n) { const d = new Date(); d.setDate(d.getDate() - n); return isoDe(d); }
const diaMes = (iso) => iso.slice(8, 10) + '/' + iso.slice(5, 7);

// WhatsApp: link com mensagem pronta (o número vira só dígitos, com 55 do Brasil na frente)
function linkWhats(telefone, texto) {
    let n = String(telefone || '').replace(/\D/g, '');
    if (!n) return '';
    if (n.length <= 11) n = '55' + n;
    return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}
function textoConfirmacao(a) {
    const u = usuarioPor(a.clienteId) || {};
    return `Olá, ${(u.nome || '').split(' ')[0]}! 🐾 Confirmando o ${servicoPor(a.servico).nome} do ${a.pet} na AgroPet em ${dataBR(a.data)} às ${a.hora}. ` +
        `Valor: ${a.gratis ? 'grátis (Clube Premium)' : dinheiro(a.valor)}. Qualquer coisa, é só responder aqui. Até lá!`;
}

// ---------- números do painel ----------
function vendasDoDia(iso) {
    const loja = db.pedidos.filter(p => p.status !== 'Cancelado' && p.data === iso).reduce((s, p) => s + p.total, 0);
    const banho = db.agendamentos.filter(a => a.status !== 'Cancelado' && a.data === iso && a.data <= hojeISO()).reduce((s, a) => s + a.valor, 0);
    return { loja, banho, total: loja + banho };
}
function vendasPeriodo(de, ate) { // de/ate = dias atrás (inclusivo)
    let loja = 0, banho = 0;
    for (let i = ate; i >= de; i--) { const v = vendasDoDia(diasAtras(i)); loja += v.loja; banho += v.banho; }
    return { loja, banho, total: loja + banho };
}
function assinantesAtivos() { return db.usuarios.filter(u => u.assinatura && u.assinatura.ativa); }
function mensalidades() { return assinantesAtivos().reduce((s, u) => s + PLANOS[u.assinatura.plano].preco, 0); }

/* ---------- tela base ---------- */
function telaAdmin() {
    if (!adminLogado()) { ir('entrar'); return ''; }
    const novosPedidos = db.pedidos.filter(p => p.status === 'Recebido').length;
    const proximos = db.agendamentos.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).length;
    const badges = { pedidos: novosPedidos, agendamentos: proximos };
    const aba = ABAS_ADMIN.find(x => x[0] === adminAba) || ABAS_ADMIN[0];
    const titulo = adminAba === 'painel'
        ? `<div class="adm-ola"><span class="pata">🐾</span><div><h1>Bem-vindo ao seu painel!</h1><small>${aba[3]}</small></div></div>`
        : `<div class="adm-ola"><span class="pata">${aba[1]}</span><div><h1>${aba[2]}</h1><small>${aba[3]}</small></div></div>`;
    return `
    <div class="adm">
        <div class="adm-fundo" data-acao="admin-menu"></div>
        <aside class="adm-lat">
            <div class="adm-logo"><span class="pata">🐾</span>AgroPet<small>Gerenciamento</small></div>
            ${GRUPOS_ADMIN.map(([grupo, abas]) => `
                <div class="adm-grupo">${grupo}</div>
                ${abas.map(([id, ic, nome]) => `<button class="${adminAba === id ? 'ativo' : ''}" data-acao="admin-aba" data-aba="${id}"><span class="ic">${ic}</span>${nome}${badges[id] ? `<span class="adm-badge">${badges[id]}</span>` : ''}</button>`).join('')}
            `).join('')}
            <div class="adm-espaco"></div>
            ${ilustracaoPets()}
        </aside>
        <div class="adm-corpo">
            <header class="adm-topo">
                <div class="adm-titulo">
                    <button class="adm-menu-btn" data-acao="admin-menu" aria-label="Abrir menu">☰</button>
                    ${titulo}
                </div>
                <div class="adm-user"><span>👤</span>admin<button class="btn btn-musgo" data-acao="sair">↩ Sair</button></div>
            </header>
            <section class="adm-conteudo" id="adminConteudo">${adminConteudo()}</section>
        </div>
    </div>
    <div class="adm-tip" id="admTip"></div>`;
}

// desenho discreto no pé do menu (cachorro e gato em traço)
function ilustracaoPets() {
    return `<svg class="adm-ilustra" viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M30 120 C26 92 34 70 58 66 C82 70 90 92 86 120"/>
        <path d="M38 52 C30 40 32 22 46 18 C52 28 50 40 48 48"/><path d="M78 52 C86 40 84 22 70 18 C64 28 66 40 68 48"/>
        <path d="M40 54 C40 38 76 38 76 54 C76 70 66 78 58 78 C50 78 40 70 40 54Z"/>
        <circle cx="51" cy="54" r="1.6" fill="currentColor"/><circle cx="65" cy="54" r="1.6" fill="currentColor"/>
        <path d="M55 63 L58 66 L61 63"/><path d="M58 66 L58 69 M54 71 C56 73 60 73 62 71"/>
        <path d="M110 120 C106 98 112 84 132 82 C152 84 158 98 154 120"/>
        <path d="M114 62 L112 40 L126 52"/><path d="M150 62 L152 40 L138 52"/>
        <path d="M114 64 C114 50 150 50 150 64 C150 78 142 86 132 86 C122 86 114 78 114 64Z"/>
        <path d="M124 64 C126 62 128 62 129 64"/><path d="M135 64 C136 62 138 62 140 64"/>
        <path d="M130 71 L132 73 L134 71"/><path d="M118 72 L104 70 M118 76 L104 78 M146 72 L160 70 M146 76 L160 78"/>
        <path d="M154 112 C172 112 178 98 170 90"/>
    </svg>`;
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
    return '';
}
function redesenharAdmin() {
    const y = window.scrollY;
    const c = $('#adminConteudo');
    if (c && rotaAtual() === 'admin') { c.innerHTML = adminConteudo(); window.scrollTo(0, y); }
    else renderizar();
}

/* =========================================================
   PAINEL
   ========================================================= */
function adminPainel() {
    const atual = vendasPeriodo(0, 29), anterior = vendasPeriodo(30, 59);
    const cresc = anterior.total > 0 ? Math.round((atual.total - anterior.total) / anterior.total * 100) : null;
    const aguardando = db.pedidos.filter(p => p.status === 'Recebido').length;
    const proximos = db.agendamentos.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const ass = assinantesAtivos();
    const baixo = db.produtos.filter(p => p.estoque <= 10).sort((a, b) => a.estoque - b.estoque);

    return `
    <div class="kpis">
        <div class="kpi"><span class="kpi-ic">💰</span><div><small>Vendas · 30 dias</small><strong>${dinheiro(atual.total)}</strong>
            <p>${cresc === null ? 'Loja + Banho e Tosa' : `<b class="${cresc >= 0 ? 'sobe' : 'desce'}">${cresc >= 0 ? '↑' : '↓'} ${Math.abs(cresc)}%</b> vs. 30 dias anteriores`}</p></div></div>
        <div class="kpi"><span class="kpi-ic">🛍️</span><div><small>Pedidos</small><strong>${db.pedidos.length}</strong><p>${aguardando ? `<b class="alerta">${aguardando} aguardando separação</b>` : 'Nenhum aguardando'}</p></div></div>
        <div class="kpi"><span class="kpi-ic">📅</span><div><small>Agendamentos futuros</small><strong>${proximos.length}</strong><p>${proximos[0] ? `Próximo: ${diaMes(proximos[0].data)} às ${proximos[0].hora}` : 'Agenda livre'}</p></div></div>
        <div class="kpi"><span class="kpi-ic">⭐</span><div><small>Assinantes ativos</small><strong>${ass.length}</strong><p>Mensalidades: ${dinheiro(mensalidades())}/mês</p></div></div>
    </div>

    <div class="adm-linha l-graf">
        <div class="caixa">
            <div class="caixa-topo"><h2>📈 Faturamento</h2>
                <div class="seg">${[7, 30].map(n => `<button class="${ADM.periodo === n ? 'ativo' : ''}" data-acao="adm-periodo" data-n="${n}">${n} dias</button>`).join('')}</div>
            </div>
            ${graficoBarras(ADM.periodo)}
        </div>
        <div class="caixa">
            <div class="caixa-topo"><h2>🥧 De onde vem a receita</h2></div>
            ${graficoRosca()}
        </div>
    </div>

    <div class="adm-linha">
        <div class="caixa">
            <div class="caixa-topo"><h2>🐾 Próximos banhos</h2><a class="ver" data-acao="admin-aba" data-aba="agendamentos">Ver agenda →</a></div>
            ${proximos.length ? `<div class="lista-adm">${proximos.slice(0, 4).map(a => `
                <div class="li-adm">
                    <span class="avatar pet">${iconePet(a.especie)}</span>
                    <div class="li-txt"><small>${dataBR(a.data)} · ${a.hora}</small><b>${esc(a.pet)}</b><span>${servicoPor(a.servico).nome}</span></div>
                    ${badgeAgenda(a.status)}
                </div>`).join('')}</div>` : '<p class="vazio">Nenhum banho marcado.</p>'}
        </div>
        <div class="caixa">
            <div class="caixa-topo"><h2>📦 Alertas de estoque</h2><a class="ver" data-acao="adm-ver-estoque">Ver produtos →</a></div>
            ${baixo.length ? `<div class="lista-adm">${baixo.slice(0, 4).map(p => `
                <div class="li-adm">
                    <span class="avatar prod cor-${p.cor}">${imgProduto(p)}</span>
                    <div class="li-txt"><b>${esc(p.nome)}</b><span>${p.estoque <= 5 ? 'Estoque crítico' : 'Estoque baixo'} · ${animalPor(p.animal).nome}</span></div>
                    ${badgeEstoque(p.estoque)}
                </div>`).join('')}</div>` : '<p class="vazio">Tudo certo com o estoque. ✓</p>'}
        </div>
    </div>

    <div class="adm-linha l-rank">
        <div class="caixa">
            <div class="caixa-topo"><h2>🏆 Mais vendidos · 30 dias</h2></div>
            ${rankingVendas()}
        </div>
        <div class="caixa">
            <div class="caixa-topo"><h2>🧾 Últimos pedidos</h2><a class="ver" data-acao="admin-aba" data-aba="pedidos">Ver todos os pedidos →</a></div>
            ${tabelaPedidosResumo(db.pedidos.slice(0, 5))}
        </div>
    </div>`;
}

// Gráfico de barras: vendas por dia (Loja + Banho e Tosa)
function graficoBarras(n) {
    const dias = Array.from({ length: n }, (_, i) => diasAtras(n - 1 - i));
    const valores = dias.map(d => vendasDoDia(d));
    const max = Math.max(...valores.map(v => v.total), 1);
    const topo = Math.ceil(max / 50) * 50 || 50;
    const W = 640, H = 220, esq = 52, dir = 8, cima = 12, baixo = 26;
    const largura = (W - esq - dir) / n, barra = Math.max(4, Math.min(34, largura - (n > 10 ? 3 : 12)));
    const y = (v) => cima + (H - cima - baixo) * (1 - v / topo);
    const linhas = [0, 0.5, 1].map(f => `<line x1="${esq}" x2="${W - dir}" y1="${y(topo * f)}" y2="${y(topo * f)}" class="grade-l"/><text x="${esq - 8}" y="${y(topo * f) + 4}" class="eixo" text-anchor="end">${(topo * f).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</text>`).join('');
    const total = valores.reduce((s, v) => s + v.total, 0);
    const barras = dias.map((d, i) => {
        const v = valores[i], x = esq + i * largura + (largura - barra) / 2, h = (H - cima - baixo) - (y(v.total) - cima);
        const r = Math.min(4, barra / 2, h);
        const caminho = h > 0 ? `M${x},${y(0)} V${y(v.total) + r} Q${x},${y(v.total)} ${x + r},${y(v.total)} H${x + barra - r} Q${x + barra},${y(v.total)} ${x + barra},${y(v.total) + r} V${y(0)} Z` : '';
        const rotulo = (n <= 7 || i % 5 === 0 || i === n - 1) ? `<text x="${x + barra / 2}" y="${H - 8}" class="eixo" text-anchor="middle">${diaMes(d)}</text>` : '';
        const tip = `${dataBR(d)}<br><b>${dinheiro(v.total)}</b><br>Loja ${dinheiro(v.loja)} · Banho ${dinheiro(v.banho)}`;
        return `${caminho ? `<path d="${caminho}" class="barra-v"/>` : ''}${rotulo}<rect x="${esq + i * largura}" y="${cima}" width="${largura}" height="${H - cima - baixo}" class="alvo" data-tip="${esc(tip)}"/>`;
    }).join('');
    return `<div class="grafico">
        <p class="graf-resumo">${dinheiro(total)} <span>em ${n} dias · Loja + Banho e Tosa</span></p>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Vendas por dia nos últimos ${n} dias">${linhas}<line x1="${esq}" x2="${W - dir}" y1="${y(0)}" y2="${y(0)}" class="base-l"/>${barras}</svg>
    </div>`;
}

// Rosca: Loja x Banho e Tosa x Assinaturas (30 dias)
const CORES_RECEITA = ['#a24e1f', '#5f9e3f', '#3a78b5']; // terracota, verde, azul (paleta conferida para daltonismo)
function graficoRosca() {
    const v = vendasPeriodo(0, 29);
    const partes = [['Loja (produtos)', v.loja], ['Banho e Tosa', v.banho], ['Assinaturas', mensalidades()]];
    const total = partes.reduce((s, p) => s + p[1], 0);
    if (!total) return '<p class="vazio">Ainda não há vendas nos últimos 30 dias.</p>';
    const R = 62, C = 2 * Math.PI * R, gap = partes.filter(p => p[1] > 0).length > 1 ? 3 : 0;
    let acum = 0;
    const arcos = partes.map(([nome, val], i) => {
        if (!val) return '';
        const comp = val / total * C;
        const s = `<circle r="${R}" cx="90" cy="90" fill="none" stroke="${CORES_RECEITA[i]}" stroke-width="24" stroke-dasharray="${Math.max(comp - gap, 0.1)} ${C}" stroke-dashoffset="${-acum}" transform="rotate(-90 90 90)" class="fatia" data-tip="${esc(`${nome}<br><b>${dinheiro(val)}</b> · ${Math.round(val / total * 100)}%`)}"/>`;
        acum += comp; return s;
    }).join('');
    return `<div class="rosca">
        <svg viewBox="0 0 180 180" role="img" aria-label="Receita dos últimos 30 dias por origem">${arcos}
            <text x="90" y="86" text-anchor="middle" class="rosca-v">${dinheiro(total).replace(',00', '')}</text><text x="90" y="104" text-anchor="middle" class="eixo">30 dias</text></svg>
        <ul class="legenda">${partes.map(([nome, val], i) => `<li><i style="background:${CORES_RECEITA[i]}"></i><span>${nome}</span><b>${dinheiro(val)}</b><small>${Math.round(val / total * 100)}%</small></li>`).join('')}</ul>
    </div>
    <p class="graf-nota">Assinaturas = mensalidades ativas de um mês.</p>`;
}

// Ranking: produtos mais vendidos e serviço mais pedido nos últimos 30 dias
function rankingVendas() {
    const desde = diasAtras(29);
    const qtd = {};
    db.pedidos.filter(p => p.status !== 'Cancelado' && p.data >= desde).forEach(p => p.itens.forEach(i => { qtd[i.nome] = (qtd[i.nome] || 0) + i.qtd; }));
    const top = Object.entries(qtd).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const serv = {};
    db.agendamentos.filter(a => a.status !== 'Cancelado' && a.data >= desde).forEach(a => { serv[a.servico] = (serv[a.servico] || 0) + 1; });
    const topServ = Object.entries(serv).sort((a, b) => b[1] - a[1])[0];
    if (!top.length && !topServ) return '<p class="vazio">Nenhuma venda nos últimos 30 dias.</p>';
    const max = top.length ? top[0][1] : 1;
    return `<ol class="ranking">${top.map(([nome, n], i) => `
        <li><span class="pos">${i + 1}</span><div class="rk"><div class="rk-nome"><span>${esc(nome)}</span><b>${n} un.</b></div><div class="rk-barra"><i style="width:${Math.max(6, n / max * 100)}%"></i></div></div></li>`).join('')}
    </ol>
    ${topServ ? `<p class="rk-serv">🛁 Serviço mais pedido: <b>${servicoPor(topServ[0]).nome}</b> (${topServ[1]}×)</p>` : ''}`;
}

function tabelaPedidosResumo(lista) {
    if (!lista.length) return '<p class="vazio">Nenhum pedido ainda.</p>';
    return `<div class="tabela-wrap"><table class="t-adm">
        <tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Status</th></tr>
        ${lista.map(p => `<tr class="clicavel" data-acao="adm-ver-pedido" data-id="${p.id}"><td><b>#${String(p.id).padStart(3, '0')}</b></td><td>${esc(nomeCliente(p.clienteId))}</td><td>${dataBR(p.data)}</td><td><b>${dinheiro(p.total)}</b></td><td>${badgePedido(p.status)}</td></tr>`).join('')}
    </table></div>`;
}

/* =========================================================
   PRODUTOS
   ========================================================= */
function produtosFiltrados() {
    const f = ADM.prod, b = f.busca.toLowerCase();
    return db.produtos.filter(p =>
        (!b || p.nome.toLowerCase().includes(b) || p.categoria.toLowerCase().includes(b)) &&
        (!f.animal || p.animal === f.animal) &&
        (!f.categoria || p.categoria === f.categoria) &&
        (!f.status || (f.status === 'visiveis' ? p.ativo : f.status === 'escondidos' ? !p.ativo : p.estoque <= 10)));
}
function adminProdutos() {
    const f = ADM.prod;
    const lista = produtosFiltrados();
    const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    f.pagina = Math.min(f.pagina, paginas);
    const pag = lista.slice((f.pagina - 1) * POR_PAGINA, f.pagina * POR_PAGINA);
    const cats = [...new Set(db.produtos.filter(p => !f.animal || p.animal === f.animal).map(p => p.categoria))].sort();
    for (const id of [...ADM.sel]) if (!produtoPor(id)) ADM.sel.delete(id);
    const todosMarcados = pag.length && pag.every(p => ADM.sel.has(p.id));
    return `
    <div class="caixa">
        <div class="ferramentas">
            <input class="busca-adm" data-adm-busca="prod" placeholder="🔍 Buscar produto" value="${esc(f.busca)}">
            <select data-adm-filtro="animal"><option value="">Todos os animais</option>${ANIMAIS.map(a => `<option value="${a.id}" ${f.animal === a.id ? 'selected' : ''}>${a.icone} ${a.nome}</option>`).join('')}</select>
            <select data-adm-filtro="categoria"><option value="">Todas as categorias</option>${cats.map(c => `<option ${f.categoria === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
            <select data-adm-filtro="status">${[['', 'Todos'], ['visiveis', 'Na loja'], ['escondidos', 'Escondidos'], ['estoque', 'Estoque baixo']].map(([v, t]) => `<option value="${v}" ${f.status === v ? 'selected' : ''}>${t}</option>`).join('')}</select>
            <button class="btn btn-musgo" data-acao="novo-produto">+ Novo produto</button>
        </div>
        ${ADM.sel.size ? `<div class="barra-lote"><b>${ADM.sel.size} selecionado${ADM.sel.size > 1 ? 's' : ''}</b>
            <button class="btn btn-borda btn-peq" data-acao="adm-lote" data-lote="mostrar">👁️ Mostrar na loja</button>
            <button class="btn btn-borda btn-peq" data-acao="adm-lote" data-lote="esconder">🙈 Esconder</button>
            <button class="btn btn-perigo btn-peq" data-acao="adm-lote" data-lote="excluir">🗑️ Excluir</button>
            <button class="link-btn" data-acao="adm-lote-limpar">Limpar seleção</button></div>` : ''}
        ${pag.length ? `<div class="tabela-wrap"><table class="t-adm">
            <tr><th class="ck"><input type="checkbox" data-adm-check="pagina" ${todosMarcados ? 'checked' : ''} aria-label="Selecionar a página"></th><th></th><th>Produto</th><th>Animal</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Na loja</th><th></th></tr>
            ${pag.map(p => `<tr class="${ADM.sel.has(p.id) ? 'marcada' : ''}">
                <td class="ck"><input type="checkbox" data-adm-check="${p.id}" ${ADM.sel.has(p.id) ? 'checked' : ''} aria-label="Selecionar ${esc(p.nome)}"></td>
                <td><span class="mini-ic cor-${p.cor}">${imgProduto(p)}</span></td>
                <td><b>${esc(p.nome)}</b>${p.selo ? `<br>${badge(p.selo, 'caramelo')}` : ''}</td>
                <td>${animalPor(p.animal).nome}</td>
                <td>${esc(p.categoria)}</td>
                <td><b>${dinheiro(p.preco)}</b></td>
                <td>${badgeEstoque(p.estoque)}</td>
                <td><button class="interruptor ${p.ativo ? 'on' : ''}" data-acao="ativar-produto" data-id="${p.id}" title="${p.ativo ? 'Visível na loja' : 'Escondido da loja'}"></button></td>
                <td><div class="acoes"><button class="ic-btn" data-acao="editar-produto" data-id="${p.id}" title="Editar">✏️</button><button class="ic-btn perigo" data-acao="excluir-produto" data-id="${p.id}" title="Excluir">🗑️</button></div></td>
            </tr>`).join('')}
        </table></div>` : '<p class="vazio">Nenhum produto encontrado com esses filtros.</p>'}
        ${paginacao(lista.length, f.pagina, paginas)}
    </div>`;
}
function paginacao(total, atual, paginas) {
    if (!total) return '';
    const de = (atual - 1) * POR_PAGINA + 1, ate = Math.min(total, atual * POR_PAGINA);
    const nums = [];
    for (let i = 1; i <= paginas; i++) if (i === 1 || i === paginas || Math.abs(i - atual) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…');
    return `<div class="paginacao"><span>Mostrando ${de}–${ate} de ${total}</span>
        ${paginas > 1 ? `<div><button data-acao="adm-pagina" data-p="${atual - 1}" ${atual === 1 ? 'disabled' : ''}>‹</button>
        ${nums.map(n => n === '…' ? '<span class="ret">…</span>' : `<button class="${n === atual ? 'ativo' : ''}" data-acao="adm-pagina" data-p="${n}">${n}</button>`).join('')}
        <button data-acao="adm-pagina" data-p="${atual + 1}" ${atual === paginas ? 'disabled' : ''}>›</button></div>` : ''}</div>`;
}

/* =========================================================
   PEDIDOS
   ========================================================= */
const ABAS_PEDIDOS = [
    ['andamento', 'Em andamento', p => !p.arquivado && !['Entregue', 'Cancelado'].includes(p.status)],
    ['historico', 'Histórico', p => !p.arquivado && ['Entregue', 'Cancelado'].includes(p.status)],
    ['arquivados', 'Arquivados', p => p.arquivado],
];
function abasLista(abas, atual, lista, acao) {
    return `<div class="abas-adm">${abas.map(([id, nome, f]) => `<button class="${atual === id ? 'ativo' : ''}" data-acao="${acao}" data-aba="${id}">${nome}<span>${lista.filter(f).length}</span></button>`).join('')}</div>`;
}
function adminPedidos() {
    const aba = ABAS_PEDIDOS.find(a => a[0] === ADM.pedidosAba);
    const b = ADM.busca.pedidos.toLowerCase().replace('#', '');
    const lista = db.pedidos.filter(aba[2]).filter(p => !b || String(p.id).includes(b) || nomeCliente(p.clienteId).toLowerCase().includes(b));
    const textoVazio = { andamento: 'Nenhum pedido esperando ação. 🎉', historico: 'Nenhum pedido entregue ou cancelado.', arquivados: 'Nenhum pedido arquivado.' }[aba[0]];
    return `
    <div class="caixa">
        <div class="ferramentas">${abasLista(ABAS_PEDIDOS, ADM.pedidosAba, db.pedidos, 'adm-aba-pedidos')}
            <input class="busca-adm" data-adm-busca="pedidos" placeholder="🔍 Nº do pedido ou cliente" value="${esc(ADM.busca.pedidos)}"></div>
        ${lista.length ? `<div class="tabela-wrap"><table class="t-adm">
            <tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr>
            ${lista.map(p => {
                const prox = PROXIMO_PEDIDO[p.status];
                const nItens = p.itens.reduce((s, i) => s + i.qtd, 0);
                return `<tr>
                <td><b>#${String(p.id).padStart(3, '0')}</b></td><td>${dataBR(p.data)}</td><td>${esc(nomeCliente(p.clienteId))}</td>
                <td title="${esc(p.itens.map(i => `${i.qtd}× ${i.nome}`).join(', '))}">${nItens} ${nItens === 1 ? 'item' : 'itens'}<br><small class="suave">${esc(p.itens[0] ? p.itens[0].nome : '')}${p.itens.length > 1 ? ' e +' + (p.itens.length - 1) : ''}</small></td>
                <td><b>${dinheiro(p.total)}</b><br><small class="suave">${esc(p.pagamento)}</small></td>
                <td>${badgePedido(p.status)}${p.observacao ? ' <span title="Tem observação">📝</span>' : ''}</td>
                <td><div class="acoes">
                    ${prox && !p.arquivado ? `<button class="btn btn-musgo btn-peq" data-acao="adm-avancar-pedido" data-id="${p.id}">${prox[1]}</button>` : ''}
                    <button class="btn btn-borda btn-peq" data-acao="adm-ver-pedido" data-id="${p.id}">Ver</button>
                    ${ADM.pedidosAba === 'historico' ? `<button class="ic-btn" data-acao="adm-arquivar-pedido" data-id="${p.id}" title="Arquivar">🗄️</button>` : ''}
                    ${ADM.pedidosAba === 'arquivados' ? `<button class="ic-btn" data-acao="adm-desarquivar-pedido" data-id="${p.id}" title="Voltar ao histórico">↩️</button><button class="ic-btn perigo" data-acao="adm-excluir-pedido" data-id="${p.id}" title="Excluir de vez">🗑️</button>` : ''}
                </div></td></tr>`; }).join('')}
        </table></div>` : `<p class="vazio">${b ? 'Nenhum pedido encontrado.' : textoVazio}</p>`}
        ${ADM.pedidosAba === 'historico' && lista.length ? `<div class="rodape-lista"><button class="btn btn-borda btn-peq" data-acao="adm-arquivar-todos-pedidos">🗄️ Arquivar todos do histórico</button></div>` : ''}
        <p class="nota" style="margin-top:14px">Arquivados saem das listas, mas continuam contando no faturamento. Ao cancelar um pedido, os itens voltam para o estoque.</p>
    </div>`;
}

function verPedido(id) {
    const p = db.pedidos.find(x => x.id === id);
    if (!p) return;
    const u = usuarioPor(p.clienteId) || {};
    const zap = linkWhats(u.telefone, `Olá, ${(u.nome || '').split(' ')[0]}! Aqui é da AgroPet 🐾 Sobre o seu pedido #${String(p.id).padStart(3, '0')}: `);
    abrirModal(`
        <div class="modal-topo"><h2>Pedido #${String(p.id).padStart(3, '0')} ${badgePedido(p.status)}</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <div class="ficha">
            <div class="ficha-bloco"><small>Cliente</small><b>${esc(u.nome || '—')}</b><span>${esc(u.email || '')}${u.telefone ? ' · ' + esc(u.telefone) : ''}</span>
                ${zap ? `<a class="link-zap" href="${zap}" target="_blank" rel="noopener">💬 Falar no WhatsApp</a>` : ''}</div>
            <div class="ficha-bloco"><small>Entrega</small><b>${esc(p.endereco || '—')}</b><span>Pedido em ${dataBR(p.data)} · ${esc(p.pagamento)}</span></div>
        </div>
        <table class="t-adm t-itens">
            <tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr>
            ${p.itens.map(i => `<tr><td>${esc(i.nome)}</td><td>${i.qtd}</td><td>${dinheiro(i.preco)}</td><td>${dinheiro(i.preco * i.qtd)}</td></tr>`).join('')}
            <tr class="tot"><td colspan="3">Subtotal</td><td>${dinheiro(p.subtotal)}</td></tr>
            ${p.desconto ? `<tr class="tot"><td colspan="3">Desconto do Clube</td><td>− ${dinheiro(p.desconto)}</td></tr>` : ''}
            <tr class="tot"><td colspan="3">Frete</td><td>${p.frete ? dinheiro(p.frete) : 'Grátis'}</td></tr>
            <tr class="tot total"><td colspan="3">Total</td><td>${dinheiro(p.total)}</td></tr>
        </table>
        <form class="form" id="formObsPedido" data-id="${p.id}">
            <label>Observação interna <small class="suave">(só a loja vê)</small><textarea name="observacao" rows="2" placeholder="Ex.: entregar depois das 14h">${esc(p.observacao || '')}</textarea></label>
            <button class="btn btn-borda btn-peq" style="align-self:flex-start">Salvar observação</button>
        </form>
        <div class="status-linha"><small>Mudar status:</small>${STATUS_PEDIDO.map(s => `<button class="chip-st ${s === p.status ? 'ativo' : ''}" data-acao="adm-status-pedido" data-id="${p.id}" data-status="${s}">${s}</button>`).join('')}</div>
        <div class="modal-acoes">
            <button class="btn btn-borda" data-acao="adm-imprimir" data-tipo="etiqueta" data-id="${p.id}">🏷️ Etiqueta</button>
            <button class="btn btn-borda" data-acao="adm-imprimir" data-tipo="comprovante" data-id="${p.id}">🖨️ Comprovante</button>
            <button class="btn btn-musgo" data-acao="fechar-modal">Fechar</button>
        </div>`);
}

// Imprime comprovante ou etiqueta (abre a janela de impressão do navegador)
function imprimirPedido(id, tipo) {
    const p = db.pedidos.find(x => x.id === id);
    const u = usuarioPor(p.clienteId) || {};
    const num = String(p.id).padStart(3, '0');
    const estilo = `body{font-family:Arial,sans-serif;color:#3f2d24;margin:24px} h1{font-size:22px;margin:0 0 4px;color:#6e4b3a} table{width:100%;border-collapse:collapse;margin-top:14px} td,th{padding:6px 4px;border-bottom:1px solid #ddd;text-align:left;font-size:13px} .r{text-align:right} .tot td{font-weight:bold;border:none} small{color:#8a7666} .etq{border:2px dashed #6e4b3a;border-radius:10px;padding:18px 22px;width:360px} .etq h2{margin:0 0 10px;font-size:15px;color:#8a7666;text-transform:uppercase;letter-spacing:1px} .etq b{font-size:20px} .etq p{margin:6px 0;font-size:15px}`;
    const corpo = tipo === 'etiqueta'
        ? `<div class="etq"><h2>🐾 AgroPet · Pedido #${num}</h2><p>Para:</p><b>${esc(u.nome || '')}</b><p>${esc(p.endereco)}</p>${u.telefone ? `<p>Tel.: ${esc(u.telefone)}</p>` : ''}<p><small>${p.itens.reduce((s, i) => s + i.qtd, 0)} itens · ${dataBR(p.data)}</small></p></div>`
        : `<h1>AgroPet 🐾</h1><small>Comprovante do pedido #${num} · ${dataBR(p.data)}</small>
           <p><b>Cliente:</b> ${esc(u.nome || '')} ${u.email ? '· ' + esc(u.email) : ''}<br><b>Entrega:</b> ${esc(p.endereco)}<br><b>Pagamento:</b> ${esc(p.pagamento)} · <b>Status:</b> ${esc(p.status)}</p>
           <table><tr><th>Item</th><th>Qtd</th><th class="r">Preço</th><th class="r">Subtotal</th></tr>
           ${p.itens.map(i => `<tr><td>${esc(i.nome)}</td><td>${i.qtd}</td><td class="r">${dinheiro(i.preco)}</td><td class="r">${dinheiro(i.preco * i.qtd)}</td></tr>`).join('')}
           <tr class="tot"><td colspan="3" class="r">Subtotal</td><td class="r">${dinheiro(p.subtotal)}</td></tr>
           ${p.desconto ? `<tr class="tot"><td colspan="3" class="r">Desconto</td><td class="r">− ${dinheiro(p.desconto)}</td></tr>` : ''}
           <tr class="tot"><td colspan="3" class="r">Frete</td><td class="r">${p.frete ? dinheiro(p.frete) : 'Grátis'}</td></tr>
           <tr class="tot"><td colspan="3" class="r">Total</td><td class="r">${dinheiro(p.total)}</td></tr></table>
           <p style="margin-top:30px"><small>AgroPet · Santo Ângelo – RS · (55) 3312-0000</small></p>`;
    const fr = document.createElement('iframe');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    document.body.appendChild(fr);
    const doc = fr.contentWindow.document;
    doc.open(); doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pedido #${num}</title><style>${estilo}</style></head><body>${corpo}</body></html>`); doc.close();
    setTimeout(() => { fr.contentWindow.focus(); fr.contentWindow.print(); setTimeout(() => fr.remove(), 1000); }, 200);
}

/* =========================================================
   BANHO E TOSA
   ========================================================= */
const ABAS_AGENDA = [
    ['agendados', 'Agendados', a => !a.arquivado && a.status === 'Agendado'],
    ['historico', 'Histórico', a => !a.arquivado && a.status !== 'Agendado'],
    ['arquivados', 'Arquivados', a => a.arquivado],
];
function adminAgendamentos() {
    const aba = ABAS_AGENDA.find(a => a[0] === ADM.agAba);
    const b = ADM.busca.agendamentos.toLowerCase();
    let lista = db.agendamentos.filter(aba[2]).filter(a => !b || a.pet.toLowerCase().includes(b) || nomeCliente(a.clienteId).toLowerCase().includes(b));
    lista = lista.sort((x, y) => (x.data + x.hora).localeCompare(y.data + y.hora));
    if (ADM.agAba !== 'agendados') lista.reverse();
    const textoVazio = { agendados: 'Nenhum banho marcado.', historico: 'Nenhum agendamento concluído ou cancelado.', arquivados: 'Nada arquivado.' }[aba[0]];
    return `
    <div class="caixa">
        <div class="ferramentas">${abasLista(ABAS_AGENDA, ADM.agAba, db.agendamentos, 'adm-aba-agenda')}
            <input class="busca-adm" data-adm-busca="agendamentos" placeholder="🔍 Pet ou cliente" value="${esc(ADM.busca.agendamentos)}">
            <button class="btn btn-musgo" data-acao="adm-novo-agendamento">+ Novo agendamento</button></div>
        ${lista.length ? `<div class="tabela-wrap"><table class="t-adm">
            <tr><th>Quando</th><th>Pet</th><th>Serviço</th><th>Cliente</th><th>Valor</th><th>Status</th><th></th></tr>
            ${lista.map(a => { const u = usuarioPor(a.clienteId) || {}; const zap = linkWhats(u.telefone, textoConfirmacao(a)); return `<tr>
                <td><b>${dataBR(a.data)}</b><br><small class="suave">${a.hora}${a.data === hojeISO() ? ' · hoje' : ''}</small></td>
                <td><div class="pet-cel"><span class="avatar pet peq">${iconePet(a.especie)}</span><div><b>${esc(a.pet)}</b><br><small class="suave">${a.especie} · ${a.porte}</small></div></div></td>
                <td>${servicoPor(a.servico).nome}${(a.extras || []).length ? `<br><small class="suave">+ ${a.extras.map(x => extraPor(x).nome).join(', ')}</small>` : ''}</td>
                <td>${esc(u.nome || '—')}<br><small class="suave nw">${esc(u.telefone || 'sem telefone')}</small></td>
                <td><b>${a.gratis ? 'Grátis ⭐' : dinheiro(a.valor)}</b></td>
                <td>${badgeAgenda(a.status)}</td>
                <td><div class="acoes">
                    ${a.status === 'Agendado' && !a.arquivado ? `
                        <button class="btn btn-musgo btn-peq" data-acao="adm-concluir-agenda" data-id="${a.id}">✓ Concluir</button>
                        <button class="ic-btn" data-acao="adm-editar-agenda" data-id="${a.id}" title="Remarcar ou trocar serviço">✏️</button>
                        ${zap ? `<a class="ic-btn zap" href="${zap}" target="_blank" rel="noopener" title="Confirmar pelo WhatsApp">💬</a>` : `<span class="ic-btn off" title="Cliente sem telefone">💬</span>`}
                        <button class="ic-btn perigo" data-acao="adm-cancelar-agenda" data-id="${a.id}" title="Cancelar">✕</button>` : ''}
                    ${ADM.agAba === 'historico' ? `<button class="ic-btn" data-acao="adm-arquivar-agenda" data-id="${a.id}" title="Arquivar">🗄️</button>` : ''}
                    ${ADM.agAba === 'arquivados' ? `<button class="ic-btn" data-acao="adm-desarquivar-agenda" data-id="${a.id}" title="Voltar ao histórico">↩️</button><button class="ic-btn perigo" data-acao="adm-excluir-agenda" data-id="${a.id}" title="Excluir de vez">🗑️</button>` : ''}
                </div></td></tr>`; }).join('')}
        </table></div>` : `<p class="vazio">${b ? 'Nenhum agendamento encontrado.' : textoVazio}</p>`}
        ${ADM.agAba === 'historico' && lista.length ? `<div class="rodape-lista"><button class="btn btn-borda btn-peq" data-acao="adm-arquivar-todos-agenda">🗄️ Arquivar todo o histórico</button></div>` : ''}
    </div>`;
}

// Modal de novo agendamento / remarcação. Usa ADM.novoAg ou ADM.editAg
function modalAgenda() {
    const novo = !!ADM.novoAg;
    const s = novo ? ADM.novoAg : ADM.editAg;
    const clientes = db.usuarios.filter(u => (u.pets || []).some(p => TIPOS_BANHO_FRONT.includes(p.tipo)));
    const cli = novo ? usuarioPor(s.clienteId) : null;
    const pets = cli ? cli.pets.filter(p => TIPOS_BANHO_FRONT.includes(p.tipo)) : [];
    const pet = novo ? pets.find(p => p.id === s.petId) : null;
    const porte = novo ? (pet && pet.porte) : s.porte;
    const preco = (sv) => Math.round(sv.preco * (PORTES[porte] || 1));
    const valor = porte ? SERVICOS.filter(x => x.id === s.servicoId).reduce((t, sv) => t + preco(sv), 0) + s.adicionais.reduce((t, id) => t + extraPor(id).preco, 0) : 0;
    abrirModal(`
        <div class="modal-topo"><h2>${novo ? '+ Novo agendamento' : `Remarcar · ${esc(s.pet)}`}</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <div class="form">
            ${novo ? `<div class="form-linha">
                <label>Cliente<select data-ag-campo="clienteId"><option value="">Escolha…</option>${clientes.map(u => `<option value="${u.id}" ${u.id === s.clienteId ? 'selected' : ''}>${esc(u.nome)}</option>`).join('')}</select></label>
                <label>Pet<select data-ag-campo="petId" ${cli ? '' : 'disabled'}><option value="">${cli ? 'Escolha…' : 'Escolha o cliente antes'}</option>${pets.map(p => `<option value="${p.id}" ${p.id === s.petId ? 'selected' : ''}>${iconePet(p.tipo)} ${esc(p.nome)} · ${p.porte}</option>`).join('')}</select></label>
            </div>
            ${!clientes.length ? '<p class="nota">Nenhum cliente com cachorro ou gato cadastrado.</p>' : ''}` : ''}
            <span class="rot">Serviço</span>
            <div class="opcoes-adm">${SERVICOS.map(sv => `<button type="button" class="op-adm ${sv.id === s.servicoId ? 'ativo' : ''}" data-acao="adm-ag-servico" data-v="${sv.id}">${sv.icone} ${sv.nome}${porte ? `<small>${dinheiro(preco(sv))}</small>` : ''}</button>`).join('')}</div>
            <span class="rot">Adicionais</span>
            <div class="opcoes-adm">${EXTRAS.map(x => `<button type="button" class="op-adm ${s.adicionais.includes(x.id) ? 'ativo' : ''}" data-acao="adm-ag-extra" data-v="${x.id}">${x.icone} ${x.nome}<small>+ ${dinheiro(x.preco)}</small></button>`).join('')}</div>
            <label style="max-width:240px">Data<input type="date" data-ag-campo="data" min="${hojeISO()}" value="${s.data}"></label>
            <span class="rot">Horário</span>
            ${!s.data ? '<p class="suave">Escolha a data para ver os horários livres.</p>'
                : s.fechado ? '<p class="nota">Não abrimos aos domingos.</p>'
                : `<div class="horas-adm">${HORARIOS.map(h => { const livre = s.livres.includes(h) || (!novo && s.data === s.dataOriginal && h === s.horaOriginal); return `<button type="button" class="${h === s.hora ? 'ativo' : ''}" data-acao="adm-ag-hora" data-v="${h}" ${livre ? '' : 'disabled'}>${h}</button>`; }).join('')}</div>`}
            <div class="ag-total"><span>Valor estimado</span><b>${porte ? dinheiro(valor) : '—'}</b></div>
            <div class="modal-acoes">
                <button type="button" class="btn btn-borda" data-acao="fechar-modal">Cancelar</button>
                <button type="button" class="btn btn-musgo" data-acao="adm-ag-salvar" ${(novo ? s.petId : true) && s.data && s.hora ? '' : 'disabled'}>${novo ? 'Agendar' : 'Salvar alterações'}</button>
            </div>
        </div>`);
}
const TIPOS_BANHO_FRONT = ['Cachorro', 'Gato'];
async function carregarHorariosAdm(s) {
    s.livres = []; s.fechado = false;
    if (!s.data) return;
    const r = await api('GET', '/horarios?data=' + s.data);
    s.livres = r.livres; s.fechado = r.fechado;
    if (s.hora && !s.livres.includes(s.hora) && !(s.data === s.dataOriginal && s.hora === s.horaOriginal)) s.hora = '';
}

/* =========================================================
   ASSINATURAS
   ========================================================= */
const ABAS_ASS = [
    ['ativas', 'Ativas', u => u.assinatura.ativa],
    ['canceladas', 'Canceladas', u => !u.assinatura.ativa && !u.assinatura.arquivada],
    ['arquivadas', 'Arquivadas', u => !u.assinatura.ativa && u.assinatura.arquivada],
];
function adminAssinaturas() {
    const todos = db.usuarios.filter(u => u.assinatura);
    const aba = ABAS_ASS.find(a => a[0] === ADM.assAba);
    const b = ADM.busca.assinaturas.toLowerCase();
    const lista = todos.filter(aba[2]).filter(u => !b || u.nome.toLowerCase().includes(b));
    return `
    <div class="kpis kpis-3">
        <div class="kpi"><span class="kpi-ic">⭐</span><div><small>Assinantes ativos</small><strong>${assinantesAtivos().length}</strong></div></div>
        <div class="kpi"><span class="kpi-ic">💳</span><div><small>Mensalidades</small><strong>${dinheiro(mensalidades())}</strong><p>por mês</p></div></div>
        <div class="kpi"><span class="kpi-ic">📦</span><div><small>Com entrega mensal</small><strong>${assinantesAtivos().filter(u => u.assinatura.diaEntrega).length}</strong></div></div>
    </div>
    <div class="caixa">
        <div class="ferramentas">${abasLista(ABAS_ASS, ADM.assAba, todos, 'adm-aba-ass')}
            <input class="busca-adm" data-adm-busca="assinaturas" placeholder="🔍 Cliente" value="${esc(ADM.busca.assinaturas)}"></div>
        ${lista.length ? `<div class="tabela-wrap"><table class="t-adm">
            <tr><th>Cliente</th><th>Plano</th><th>Rações</th><th>Entrega</th><th>Desde</th><th>Status</th><th></th></tr>
            ${lista.map(u => { const a = u.assinatura; return `<tr>
                <td><b>${esc(u.nome)}</b><br><small class="suave">${esc(u.email)}</small></td>
                <td>${PLANOS[a.plano].nome}<br><small class="suave">${dinheiro(PLANOS[a.plano].preco)}/mês</small></td>
                <td>${a.itens.length ? nomesItens(a, '<br>') : '<span class="suave">—</span>'}</td>
                <td>${!a.ativa ? '—' : a.diaEntrega ? `Dia ${a.diaEntrega}<br><small class="suave">próx. ${dataBR(proximaEntrega(a.diaEntrega))}</small>` : '<span class="suave">Sem entrega</span>'}</td>
                <td>${dataBR(a.desde)}</td>
                <td>${a.ativa ? badge('Ativa', 'verde', '✓') : a.arquivada ? badge('Arquivada', 'cinza') : badge('Cancelada', 'vermelho', '✕')}</td>
                <td><div class="acoes">
                    ${a.ativa ? `<button class="btn btn-perigo btn-peq" data-acao="admin-cancelar-assinatura" data-id="${u.id}">Cancelar</button>` : ''}
                    ${!a.ativa && !a.arquivada ? `<button class="ic-btn" data-acao="adm-arquivar-ass" data-id="${u.id}" title="Arquivar">🗄️</button>` : ''}
                    ${a.arquivada ? `<button class="ic-btn" data-acao="adm-desarquivar-ass" data-id="${u.id}" title="Voltar para canceladas">↩️</button><button class="ic-btn perigo" data-acao="adm-excluir-ass" data-id="${u.id}" title="Excluir de vez">🗑️</button>` : ''}
                </div></td></tr>`; }).join('')}
        </table></div>` : `<p class="vazio">${b ? 'Nenhuma assinatura encontrada.' : { ativas: 'Nenhum assinante ativo.', canceladas: 'Nenhuma assinatura cancelada.', arquivadas: 'Nada arquivado.' }[aba[0]]}</p>`}
    </div>`;
}

/* =========================================================
   CLIENTES
   ========================================================= */
function adminClientes() {
    const b = ADM.busca.clientes.toLowerCase(), bNum = b.replace(/\D/g, '');
    const lista = db.usuarios.filter(u => !b || u.nome.toLowerCase().includes(b) || u.email.toLowerCase().includes(b) || (bNum && u.telefone.replace(/\D/g, '').includes(bNum)));
    return `
    <div class="caixa">
        <div class="ferramentas"><input class="busca-adm larga" data-adm-busca="clientes" placeholder="🔍 Buscar por nome, e-mail ou telefone" value="${esc(ADM.busca.clientes)}">
            <span class="suave">${db.usuarios.length} cliente${db.usuarios.length === 1 ? '' : 's'}</span></div>
        ${lista.length ? `<div class="tabela-wrap"><table class="t-adm">
            <tr><th>Cliente</th><th>Telefone</th><th>Pets</th><th>Pedidos</th><th>Total gasto</th><th>Clube</th><th>Desde</th><th></th></tr>
            ${lista.map(u => { const peds = db.pedidos.filter(p => p.clienteId === u.id && p.status !== 'Cancelado'); return `<tr>
                <td><div class="pet-cel"><span class="avatar ini">${iniciais(u.nome)}</span><div><b>${esc(u.nome)}</b>${u.observacoes ? ' <span title="Tem observações">📝</span>' : ''}<br><small class="suave">${esc(u.email)}</small></div></div></td>
                <td class="nw">${esc(u.telefone) || '<span class="suave">—</span>'}</td>
                <td>${(u.pets || []).map(p => iconePet(p.tipo)).join(' ') || '<span class="suave">—</span>'}</td>
                <td>${peds.length}</td><td><b>${dinheiro(peds.reduce((s, p) => s + p.total, 0))}</b></td>
                <td>${planoAtivo(u) ? badge(planoAtivo(u).nome, 'caramelo', '⭐') : '<span class="suave">—</span>'}</td>
                <td>${dataBR(u.criadoEm)}</td>
                <td><div class="acoes"><button class="btn btn-borda btn-peq" data-acao="adm-ver-cliente" data-id="${u.id}">Ver</button>
                    <button class="ic-btn" data-acao="adm-editar-cliente" data-id="${u.id}" title="Editar">✏️</button>
                    <button class="ic-btn perigo" data-acao="adm-excluir-cliente" data-id="${u.id}" title="Excluir">🗑️</button></div></td>
            </tr>`; }).join('')}
        </table></div>` : `<p class="vazio">${b ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}</p>`}
    </div>`;
}

async function verCliente(id) {
    const c = await api('GET', '/admin/clientes/' + id);
    const validos = c.pedidos.filter(p => p.status !== 'Cancelado');
    const zap = linkWhats(c.telefone, `Olá, ${c.nome.split(' ')[0]}! Aqui é da AgroPet 🐾 `);
    const a = c.assinatura;
    abrirModal(`
        <div class="modal-topo"><h2><span class="avatar ini">${iniciais(c.nome)}</span> ${esc(c.nome)}</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <div class="ficha">
            <div class="ficha-bloco"><small>Contato</small><b>${esc(c.email)}</b><span>${esc(c.telefone || 'sem telefone')} · cliente desde ${dataBR(c.criadoEm)}</span>
                ${zap ? `<a class="link-zap" href="${zap}" target="_blank" rel="noopener">💬 Falar no WhatsApp</a>` : ''}</div>
            <div class="ficha-bloco"><small>Compras</small><b>${dinheiro(validos.reduce((s, p) => s + p.total, 0))}</b><span>${validos.length} pedido${validos.length === 1 ? '' : 's'} · ${a && a.ativa ? 'Clube ' + PLANOS[a.plano].nome : 'sem Clube'}</span></div>
        </div>
        <form class="form" id="formObsCliente" data-id="${c.id}">
            <label>Observações <small class="suave">(só a loja vê)</small><textarea name="observacoes" rows="2" placeholder="Ex.: o Thor tem pele sensível, usar shampoo neutro">${esc(c.observacoes || '')}</textarea></label>
            <button class="btn btn-borda btn-peq" style="align-self:flex-start">Salvar observações</button>
        </form>
        <h3 class="sub-ficha">🐾 Pets (${c.pets.length})</h3>
        ${c.pets.length ? `<div class="pets-ficha">${c.pets.map(p => `<div><span class="avatar pet peq">${iconePet(p.tipo)}</span><b>${esc(p.nome)}</b><small>${p.tipo} · ${p.porte}${p.raca ? ' · ' + esc(p.raca) : ''}</small></div>`).join('')}</div>` : '<p class="suave">Nenhum pet cadastrado.</p>'}
        <h3 class="sub-ficha">🧾 Pedidos (${c.pedidos.length})</h3>
        ${c.pedidos.length ? `<table class="t-adm">${c.pedidos.slice(0, 8).map(p => `<tr><td>#${String(p.id).padStart(3, '0')}</td><td>${dataBR(soData(p.data))}</td><td>${p.itens.reduce((s, i) => s + i.qtd, 0)} itens</td><td><b>${dinheiro(p.total)}</b></td><td>${badgePedido(p.status)}</td></tr>`).join('')}</table>` : '<p class="suave">Nenhum pedido.</p>'}
        <h3 class="sub-ficha">🛁 Banho e Tosa (${c.agendamentos.length})</h3>
        ${c.agendamentos.length ? `<table class="t-adm">${c.agendamentos.slice(0, 8).map(g => `<tr><td>${dataBR(g.data)} ${g.hora}</td><td>${esc(g.petNome)}</td><td>${esc(g.servicoNome || servicoPor(g.servicoId).nome)}</td><td>${g.gratis ? 'Grátis' : dinheiro(g.valor)}</td><td>${badgeAgenda(g.status)}</td></tr>`).join('')}</table>` : '<p class="suave">Nenhum agendamento.</p>'}
        <div class="modal-acoes">
            <button class="btn btn-borda" data-acao="adm-editar-cliente" data-id="${c.id}">✏️ Editar dados</button>
            <button class="btn btn-musgo" data-acao="fechar-modal">Fechar</button>
        </div>`);
}

function editarCliente(id) {
    const u = usuarioPor(id);
    abrirModal(`
        <div class="modal-topo"><h2>Editar cliente</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <form class="form" id="formCliente" data-id="${u.id}">
            <label>Nome<input name="nome" value="${esc(u.nome)}" required></label>
            <div class="form-linha">
                <label>E-mail<input name="email" type="email" value="${esc(u.email)}" required></label>
                <label>Telefone<input name="telefone" value="${esc(u.telefone)}" placeholder="(55) 99999-0000"></label>
            </div>
            <label>Observações<textarea name="observacoes" rows="3">${esc(u.observacoes || '')}</textarea></label>
            <div class="modal-acoes"><button type="button" class="btn btn-borda" data-acao="fechar-modal">Cancelar</button><button class="btn btn-musgo">Salvar</button></div>
        </form>`);
}

/* =========================================================
   CONFIGURAR SITE
   ========================================================= */
function adminSite() {
    const s = db.site;
    return `
    <div class="adm-linha">
    <form class="caixa form" id="formSite">
        <h2>🏠 Banner da página inicial</h2>
        <label>Etiqueta<input name="pilula" value="${esc(s.pilula)}"></label>
        <label>Título<input name="titulo" value="${esc(s.titulo)}" required></label>
        <label>Texto<textarea name="texto" rows="2">${esc(s.texto)}</textarea></label>
        <label>Texto do botão<input name="botao" value="${esc(s.botao)}"></label>
        <h2 style="margin-top:8px">🚚 Entrega</h2>
        <div class="form-linha">
            <label>Valor do frete (R$)<input name="frete" type="number" step="0.01" min="0" value="${s.frete}"></label>
            <label>Frete grátis acima de (R$)<input name="freteGratisAcima" type="number" step="0.01" min="0" value="${s.freteGratisAcima}"></label>
        </div>
        <button class="btn btn-musgo" style="align-self:flex-start">Salvar configurações</button>
    </form>
    <div class="caixa">
        <h2>🖼️ Imagens dos banners</h2>
        <p class="suave" style="margin:-8px 0 14px">Troque os emojis do lado direito de cada banner por uma imagem. Imagens com fundo branco ficam mais bonitas.</p>
        <div class="lista-imgs">
            ${['Banner principal', 'Banner do Clube', 'Banner do Banho e Tosa'].map((nome, i) => {
                const img = imgSlide(i);
                const propria = !!s.imgSlides[i];
                return `<div class="linha-img">
                    <span class="img-prev contem">${img ? `<img src="${img}" alt="">` : ['🐶🐱', '⭐📦', '🐩🛁'][i]}</span>
                    <div class="txt"><strong>${nome}</strong><small>${propria ? 'Imagem enviada por você' : IMG_PADRAO[i] ? 'Usando a foto padrão' : 'Usando emojis'}</small></div>
                    <div class="acoes">
                        <label class="btn btn-borda btn-peq" style="flex-direction:row">📷 Trocar<input type="file" accept="image/*" hidden data-upload="slide" data-i="${i}"></label>
                        ${propria ? `<button class="btn btn-perigo btn-peq" data-acao="img-slide-padrao" data-i="${i}">${IMG_PADRAO[i] ? 'Foto padrão' : 'Emojis'}</button>` : ''}
                    </div>
                </div>`; }).join('')}
        </div>
    </div>
    </div>
    <div class="caixa" style="margin-top:20px">
        <h2>🐾 Imagens dos animais</h2>
        <p class="suave" style="margin:-8px 0 14px">Aparecem nos círculos da página inicial e no topo da página de cada animal.</p>
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
    <div class="caixa zona-perigo" style="margin-top:20px">
        <div><h2>🧹 Limpar dados de teste</h2>
        <p>Apaga <b>todos os clientes, pets, pedidos, agendamentos e assinaturas</b>, para começar a usar a loja de verdade. O catálogo de produtos, as imagens, as configurações e a conta do admin continuam.</p></div>
        <button class="btn btn-perigo" data-acao="adm-limpar">Limpar dados de teste</button>
    </div>`;
}

function pedirLimpeza() {
    abrirModal(`
        <div class="modal-topo"><h2>🧹 Limpar dados de teste</h2><button class="fechar" data-acao="fechar-modal">✕</button></div>
        <form class="form" id="formLimpar">
            <p>Isso apaga <b>${db.usuarios.length} clientes, ${db.pedidos.length} pedidos e ${db.agendamentos.length} agendamentos</b>, com pets e assinaturas. <b>Não dá para desfazer.</b></p>
            <label>Para confirmar, digite <b>LIMPAR</b><input name="confirmar" autocomplete="off" required></label>
            <div class="modal-acoes"><button type="button" class="btn btn-borda" data-acao="fechar-modal">Cancelar</button><button class="btn btn-perigo-cheio">Apagar tudo</button></div>
        </form>`);
}

/* =========================================================
   AÇÕES DO GERENCIAMENTO (cliques com data-acao="adm-...")
   ========================================================= */
function acaoAdmin(acao, el, id) {
    const recarregar = async (msg) => { await sincronizar(); if (msg) aviso(msg); };
    switch (acao) {
        case 'adm-periodo': ADM.periodo = +el.dataset.n; redesenharAdmin(); break;
        case 'adm-ver-estoque': ADM.prod = { busca: '', animal: '', categoria: '', status: 'estoque', pagina: 1 }; adminAba = 'produtos'; renderizar(); window.scrollTo(0, 0); break;
        case 'adm-pagina': ADM.prod.pagina = +el.dataset.p; redesenharAdmin(); break;
        case 'adm-lote-limpar': ADM.sel.clear(); redesenharAdmin(); break;
        case 'adm-lote': {
            const ids = [...ADM.sel], tipo = el.dataset.lote;
            const fazer = () => executar(async () => {
                const r = await api('POST', '/produtos/lote', { ids, acao: tipo });
                ADM.sel.clear();
                await recarregar(`${r.quantidade} produto${r.quantidade > 1 ? 's' : ''} ${{ excluir: 'excluído', esconder: 'escondido', mostrar: 'visível' }[tipo]}${r.quantidade > 1 ? 's' : ''}`);
            });
            if (tipo === 'excluir') pedirConfirmacao(`Excluir ${ids.length} produto${ids.length > 1 ? 's' : ''}? Não dá para desfazer.`, fazer); else fazer();
            break;
        }
        // pedidos
        case 'adm-aba-pedidos': ADM.pedidosAba = el.dataset.aba; redesenharAdmin(); break;
        case 'adm-ver-pedido': verPedido(id); break;
        case 'adm-avancar-pedido': {
            const p = db.pedidos.find(x => x.id === id), [prox] = PROXIMO_PEDIDO[p.status];
            executar(async () => { await api('PATCH', '/pedidos/' + id, { status: prox }); await recarregar(`Pedido #${id}: ${prox}`); });
            break;
        }
        case 'adm-status-pedido': {
            const status = el.dataset.status;
            const fazer = () => executar(async () => { await api('PATCH', '/pedidos/' + id, { status }); await sincronizar(); verPedido(id); aviso(`Pedido #${id}: ${status}`); });
            if (status === 'Cancelado') pedirConfirmacao(`Cancelar o pedido #${id}? Os itens voltam para o estoque.`, fazer); else fazer();
            break;
        }
        case 'adm-arquivar-pedido': executar(async () => { await api('PATCH', '/pedidos/' + id, { arquivado: true }); await recarregar('Pedido arquivado'); }); break;
        case 'adm-desarquivar-pedido': executar(async () => { await api('PATCH', '/pedidos/' + id, { arquivado: false }); await recarregar('Pedido de volta ao histórico'); }); break;
        case 'adm-arquivar-todos-pedidos': {
            const ids = db.pedidos.filter(ABAS_PEDIDOS[1][2]).map(p => p.id);
            pedirConfirmacao(`Arquivar ${ids.length} pedido${ids.length > 1 ? 's' : ''} do histórico?`, () => executar(async () => {
                for (const i of ids) await api('PATCH', '/pedidos/' + i, { arquivado: true });
                await recarregar('Histórico arquivado');
            }));
            break;
        }
        case 'adm-excluir-pedido':
            pedirConfirmacao(`Excluir o pedido #${id} de vez? Ele deixa de contar no faturamento.`, () => executar(async () => { await api('DELETE', '/pedidos/' + id); await recarregar('Pedido excluído'); }));
            break;
        case 'adm-imprimir': imprimirPedido(id, el.dataset.tipo); break;
        // banho e tosa
        case 'adm-aba-agenda': ADM.agAba = el.dataset.aba; redesenharAdmin(); break;
        case 'adm-concluir-agenda': executar(async () => { await api('PATCH', '/agendamentos/' + id, { status: 'Concluído' }); await recarregar('Banho concluído ✓'); }); break;
        case 'adm-cancelar-agenda': {
            const a = db.agendamentos.find(x => x.id === id);
            pedirConfirmacao(`Cancelar o ${servicoPor(a.servico).nome} do ${a.pet} em ${dataBR(a.data)} às ${a.hora}? O horário fica livre.`, () => executar(async () => { await api('PATCH', '/agendamentos/' + id, { status: 'Cancelado' }); await recarregar('Agendamento cancelado'); }));
            break;
        }
        case 'adm-arquivar-agenda': executar(async () => { await api('PATCH', '/agendamentos/' + id, { arquivado: true }); await recarregar('Agendamento arquivado'); }); break;
        case 'adm-desarquivar-agenda': executar(async () => { await api('PATCH', '/agendamentos/' + id, { arquivado: false }); await recarregar('De volta ao histórico'); }); break;
        case 'adm-arquivar-todos-agenda': {
            const ids = db.agendamentos.filter(ABAS_AGENDA[1][2]).map(a => a.id);
            pedirConfirmacao(`Arquivar ${ids.length} agendamento${ids.length > 1 ? 's' : ''} do histórico?`, () => executar(async () => {
                for (const i of ids) await api('PATCH', '/agendamentos/' + i, { arquivado: true });
                await recarregar('Histórico arquivado');
            }));
            break;
        }
        case 'adm-excluir-agenda':
            pedirConfirmacao('Excluir este agendamento de vez?', () => executar(async () => { await api('DELETE', '/agendamentos/' + id); await recarregar('Agendamento excluído'); }));
            break;
        case 'adm-novo-agendamento':
            ADM.editAg = null; ADM.novoAg = { clienteId: null, petId: null, servicoId: 'banho', adicionais: [], data: '', hora: '', livres: [] };
            modalAgenda();
            break;
        case 'adm-editar-agenda': {
            const a = db.agendamentos.find(x => x.id === id);
            ADM.novoAg = null;
            ADM.editAg = { id, pet: a.pet, porte: a.porte, servicoId: a.servico, adicionais: [...(a.extras || [])], data: a.data, hora: a.hora, dataOriginal: a.data, horaOriginal: a.hora, livres: [] };
            executar(async () => { await carregarHorariosAdm(ADM.editAg); modalAgenda(); });
            break;
        }
        case 'adm-ag-servico': { const s = ADM.novoAg || ADM.editAg; s.servicoId = el.dataset.v; modalAgenda(); break; }
        case 'adm-ag-extra': { const s = ADM.novoAg || ADM.editAg; const v = el.dataset.v; s.adicionais = s.adicionais.includes(v) ? s.adicionais.filter(x => x !== v) : [...s.adicionais, v]; modalAgenda(); break; }
        case 'adm-ag-hora': { const s = ADM.novoAg || ADM.editAg; s.hora = el.dataset.v; modalAgenda(); break; }
        case 'adm-ag-salvar': {
            if (el.disabled) break;
            el.disabled = true;
            const s = ADM.novoAg || ADM.editAg;
            executar(async () => {
                if (ADM.novoAg) await api('POST', '/agendamentos', { petId: s.petId, servicoId: s.servicoId, adicionais: s.adicionais, data: s.data, hora: s.hora });
                else await api('PATCH', '/agendamentos/' + s.id, { data: s.data, hora: s.hora, servicoId: s.servicoId, adicionais: s.adicionais });
                const msg = ADM.novoAg ? 'Agendamento criado ✓' : 'Agendamento atualizado ✓';
                ADM.novoAg = ADM.editAg = null; fecharModal();
                ADM.agAba = 'agendados';
                await recarregar(msg);
            }).finally(() => { el.disabled = false; });
            break;
        }
        // assinaturas
        case 'adm-aba-ass': ADM.assAba = el.dataset.aba; redesenharAdmin(); break;
        case 'adm-arquivar-ass': executar(async () => { await api('PATCH', '/admin/assinaturas', { clienteId: id, arquivada: true }); await recarregar('Assinatura arquivada'); }); break;
        case 'adm-desarquivar-ass': executar(async () => { await api('PATCH', '/admin/assinaturas', { clienteId: id, arquivada: false }); await recarregar('De volta para canceladas'); }); break;
        case 'adm-excluir-ass':
            pedirConfirmacao('Excluir esta assinatura de vez?', () => executar(async () => { await api('DELETE', '/admin/assinaturas?clienteId=' + id); await recarregar('Assinatura excluída'); }));
            break;
        // clientes
        case 'adm-ver-cliente': executar(() => verCliente(id)); break;
        case 'adm-editar-cliente': editarCliente(id); break;
        case 'adm-excluir-cliente': {
            const u = usuarioPor(id);
            pedirConfirmacao(`Excluir ${u.nome}? Os pets, pedidos, agendamentos e a assinatura dessa pessoa também serão apagados. Não dá para desfazer.`, () => executar(async () => { await api('DELETE', '/admin/clientes/' + id); await recarregar('Cliente excluído'); }));
            break;
        }
        // site
        case 'adm-limpar': pedirLimpeza(); break;
    }
}

// Campos do gerenciamento que mudam valor (filtros, seleção, formulário de agendamento)
function mudouAdmin(el) {
    if (el.dataset.admFiltro) {
        const c = el.dataset.admFiltro;
        ADM.prod[c] = el.value;
        if (c === 'animal') ADM.prod.categoria = '';
        ADM.prod.pagina = 1;
        redesenharAdmin();
        return true;
    }
    if (el.dataset.admCheck) {
        const v = el.dataset.admCheck;
        if (v === 'pagina') {
            const lista = produtosFiltrados().slice((ADM.prod.pagina - 1) * POR_PAGINA, ADM.prod.pagina * POR_PAGINA);
            lista.forEach(p => el.checked ? ADM.sel.add(p.id) : ADM.sel.delete(p.id));
        } else el.checked ? ADM.sel.add(+v) : ADM.sel.delete(+v);
        redesenharAdmin();
        return true;
    }
    if (el.dataset.agCampo) {
        const s = ADM.novoAg || ADM.editAg, c = el.dataset.agCampo;
        if (c === 'clienteId') { s.clienteId = +el.value || null; s.petId = null; }
        if (c === 'petId') s.petId = +el.value || null;
        if (c === 'data') { s.data = el.value; executar(async () => { await carregarHorariosAdm(s); modalAgenda(); }); return true; }
        modalAgenda();
        return true;
    }
    return false;
}

// Busca dos filtros do gerenciamento (redesenha sem perder o cursor)
function buscouAdmin(el) {
    const qual = el.dataset.admBusca;
    if (qual === 'prod') { ADM.prod.busca = el.value; ADM.prod.pagina = 1; } else ADM.busca[qual] = el.value;
    const pos = el.selectionStart;
    $('#adminConteudo').innerHTML = adminConteudo();
    const inp = document.querySelector(`[data-adm-busca="${qual}"]`);
    if (inp) { inp.focus(); inp.setSelectionRange(pos, pos); }
}

// Formulários do gerenciamento
function enviouAdmin(f) {
    if (f.id === 'formObsPedido') {
        const id = +f.dataset.id, observacao = f.observacao.value;
        executar(async () => { await api('PATCH', '/pedidos/' + id, { observacao }); await sincronizar(); verPedido(id); aviso('Observação salva ✓'); });
        return true;
    }
    if (f.id === 'formObsCliente') {
        const id = +f.dataset.id;
        executar(async () => { await api('PUT', '/admin/clientes/' + id, { observacoes: f.observacoes.value }); await sincronizar(); aviso('Observações salvas ✓'); });
        return true;
    }
    if (f.id === 'formCliente') {
        const d = Object.fromEntries(new FormData(f));
        executar(async () => { await api('PUT', '/admin/clientes/' + f.dataset.id, d); fecharModal(); await sincronizar(); aviso('Cliente atualizado ✓'); });
        return true;
    }
    if (f.id === 'formLimpar') {
        const confirmar = f.confirmar.value.trim().toUpperCase();
        if (confirmar !== 'LIMPAR') { aviso('Digite LIMPAR para confirmar'); return true; }
        executar(async () => { await api('POST', '/admin/limpar', { confirmar }); fecharModal(); await sincronizar(); aviso('Dados de teste apagados ✓'); });
        return true;
    }
    return false;
}

// Dica flutuante dos gráficos
document.addEventListener('mousemove', (e) => {
    const tip = document.getElementById('admTip');
    if (!tip) return;
    const alvo = e.target.closest && e.target.closest('[data-tip]');
    if (!alvo) { tip.classList.remove('on'); return; }
    tip.innerHTML = alvo.dataset.tip;
    tip.classList.add('on');
    const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
    tip.style.left = x + 'px'; tip.style.top = (e.clientY - tip.offsetHeight - 12) + 'px';
});

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
    if (acao.startsWith('adm-')) { if (el.tagName === 'A' && el.getAttribute('href')) return; acaoAdmin(acao, el, id); return; }

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

        case 'admin-aba': adminAba = el.dataset.aba; fecharModal(); renderizar(); window.scrollTo(0, 0); break;
        case 'admin-menu': document.querySelector('.adm')?.classList.toggle('menu-aberto'); break; // abre/fecha o menu no celular
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
    if (enviouAdmin(f)) return;
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
    mudouAdmin(el);
});

/* Busca do topo e do admin */
document.addEventListener('input', (e) => {
    if (e.target.id === 'busca') {
        filtro.busca = e.target.value;
        if (rotaAtual() !== '') { ir(''); $('#busca').focus(); }
        else renderizar();
    }
    if (e.target.dataset && e.target.dataset.admBusca) buscouAdmin(e.target);
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
