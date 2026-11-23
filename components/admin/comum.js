'use client';
// Pedaços usados em várias telas do gerenciamento: etiquetas de status, abas, paginação,
// contas do painel e a impressão de pedidos.
import { useLoja } from '../Provedor';
import { hojeISO } from '../../lib/regras';
import { dataBR, diasAtras, dinheiro, numPedido } from '../../lib/front/util';

// ---------- menu lateral: [grupo, [[id, ícone, nome, subtítulo, endereço], ...]]
export const GRUPOS_ADMIN = [
    ['Gerenciamento', [
        ['painel', '📊', 'Painel', 'Gerencie sua loja de forma simples e eficiente.', '/admin'],
        ['produtos', '📦', 'Produtos', 'Catálogo, estoque e o que aparece na loja.', '/admin/produtos'],
        ['pedidos', '🧾', 'Pedidos', 'Acompanhe e despache as compras.', '/admin/pedidos'],
        ['agendamentos', '🛁', 'Banho e Tosa', 'Agenda de banhos, remarcações e confirmações.', '/admin/banho-e-tosa'],
        ['assinaturas', '⭐', 'Assinaturas', 'Assinantes do Clube AgroPet.', '/admin/assinaturas'],
    ]],
    ['Cadastros', [['clientes', '👥', 'Clientes', 'Quem compra na AgroPet: contatos, pets e histórico.', '/admin/clientes']]],
    ['Personalização', [['site', '🎨', 'Configurar site', 'Textos, imagens, frete e dados de teste.', '/admin/site']]],
];
export const ABAS_ADMIN = GRUPOS_ADMIN.flatMap(g => g[1]);

// ---------- etiquetas
const BADGE_PEDIDO = { 'Recebido': ['amarelo', '⏳'], 'Em separação': ['azul', '📦'], 'Enviado': ['azul', '🚚'], 'Entregue': ['verde', '✓'], 'Cancelado': ['vermelho', '✕'] };
const BADGE_AGENDA = { 'Agendado': ['azul', '📅'], 'Concluído': ['verde', '✓'], 'Cancelado': ['vermelho', '✕'] };
export const PROXIMO_PEDIDO = { 'Recebido': ['Em separação', 'Separar'], 'Em separação': ['Enviado', 'Enviar'], 'Enviado': ['Entregue', 'Entregue ✓'] };

export const Badge = ({ cor, icone, children }) => <span className={`badge b-${cor}`}>{icone && <i>{icone}</i>}{children}</span>;
export function BadgePedido({ status }) { const [c, i] = BADGE_PEDIDO[status] || ['cinza', '']; return <Badge cor={c} icone={i}>{status}</Badge>; }
export function BadgeAgenda({ status }) { const [c, i] = BADGE_AGENDA[status] || ['cinza', '']; return <Badge cor={c} icone={i}>{status}</Badge>; }
export function BadgeEstoque({ n }) {
    if (n <= 5) return <Badge cor="vermelho">{n} un.</Badge>;
    if (n <= 10) return <Badge cor="amarelo">{n} un.</Badge>;
    return <span className="num-estoque">{n}</span>;
}

// ---------- abas com contador: abas = [[id, nome, filtro], ...]
export function AbasLista({ abas, atual, lista, aoTrocar }) {
    return (
        <div className="abas-adm">
            {abas.map(([id, nome, f]) => <button key={id} className={atual === id ? 'ativo' : ''} onClick={() => aoTrocar(id)}>{nome}<span>{lista.filter(f).length}</span></button>)}
        </div>
    );
}

// ---------- paginação
export const POR_PAGINA = 15;
export function Paginacao({ total, atual, aoMudar }) {
    if (!total) return null;
    const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
    const de = (atual - 1) * POR_PAGINA + 1, ate = Math.min(total, atual * POR_PAGINA);
    const nums = [];
    for (let i = 1; i <= paginas; i++) if (i === 1 || i === paginas || Math.abs(i - atual) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…');
    return (
        <div className="paginacao"><span>Mostrando {de}–{ate} de {total}</span>
            {paginas > 1 && (
                <div>
                    <button onClick={() => aoMudar(atual - 1)} disabled={atual === 1}>‹</button>
                    {nums.map((n, k) => (n === '…' ? <span className="ret" key={'r' + k}>…</span> : <button key={n} className={n === atual ? 'ativo' : ''} onClick={() => aoMudar(n)}>{n}</button>))}
                    <button onClick={() => aoMudar(atual + 1)} disabled={atual === paginas}>›</button>
                </div>
            )}
        </div>
    );
}

// ---------- contas do painel
export function useNumeros() {
    const { pedidos, agendamentos, usuarios, planos } = useLoja();
    const vendasDoDia = (iso) => {
        const loja = pedidos.filter(p => p.status !== 'Cancelado' && p.data === iso).reduce((s, p) => s + p.total, 0);
        const banho = agendamentos.filter(a => a.status !== 'Cancelado' && a.data === iso && a.data <= hojeISO()).reduce((s, a) => s + a.valor, 0);
        return { loja, banho, total: loja + banho };
    };
    const vendasPeriodo = (de, ate) => { // de/ate = dias atrás (inclusivo)
        let loja = 0, banho = 0;
        for (let i = ate; i >= de; i--) { const v = vendasDoDia(diasAtras(i)); loja += v.loja; banho += v.banho; }
        return { loja, banho, total: loja + banho };
    };
    const assinantes = usuarios.filter(u => u.assinatura && u.assinatura.ativa);
    const mensalidades = assinantes.reduce((s, u) => s + planos[u.assinatura.plano].preco, 0);
    return { vendasDoDia, vendasPeriodo, assinantes, mensalidades };
}

export function useNomeCliente() {
    const { usuarioPor } = useLoja();
    return (id) => (usuarioPor(id) || {}).nome || '—';
}

// ---------- impressão de comprovante ou etiqueta (abre a janela de impressão do navegador)
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function imprimirPedido(p, u = {}, tipo = 'comprovante') {
    const num = numPedido(p.id);
    const estilo = 'body{font-family:Arial,sans-serif;color:#3f2d24;margin:24px} h1{font-size:22px;margin:0 0 4px;color:#6e4b3a} table{width:100%;border-collapse:collapse;margin-top:14px} td,th{padding:6px 4px;border-bottom:1px solid #ddd;text-align:left;font-size:13px} .r{text-align:right} .tot td{font-weight:bold;border:none} small{color:#8a7666} .etq{border:2px dashed #6e4b3a;border-radius:10px;padding:18px 22px;width:360px} .etq h2{margin:0 0 10px;font-size:15px;color:#8a7666;text-transform:uppercase;letter-spacing:1px} .etq b{font-size:20px} .etq p{margin:6px 0;font-size:15px}';
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
