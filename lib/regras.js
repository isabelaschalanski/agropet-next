// Regras do negócio (preços, descontos, frete, horários). Sem banco aqui: só cálculos.

export const PLANOS = {
    basico: { nome: 'Básico', preco: 19.9, desconto: 5, beneficios: ['5% de desconto em todos os produtos', 'Ração entregue todo mês', 'Frete grátis na entrega da assinatura'] },
    premium: { nome: 'Premium', preco: 39.9, desconto: 10, beneficios: ['10% de desconto em todos os produtos', 'Ração entregue todo mês', 'Frete grátis em todos os pedidos', '1 banho grátis por mês', 'Prioridade no agendamento'] },
};
export const PORTES = { Pequeno: 1, 'Médio': 1.3, Grande: 1.6 };
export const HORARIOS = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30'];
export const DIAS_ENTREGA = [5, 10, 15, 20, 25];
export const TIPOS_BANHO = ['Cachorro', 'Gato'];
export const STATUS_PEDIDO = ['Recebido', 'Em separação', 'Enviado', 'Entregue', 'Cancelado'];
export const STATUS_AGENDA = ['Agendado', 'Concluído', 'Cancelado'];
export const PAGAMENTOS = ['Pix', 'Cartão de crédito', 'Boleto'];

export const arred = (v) => Math.round(v * 100) / 100;
const dois = (n) => String(n).padStart(2, '0');
// Data e hora do computador onde o site roda (horário local, não UTC)
export const hojeISO = () => { const d = new Date(); return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`; };
export const horaAgora = () => { const d = new Date(); return `${dois(d.getHours())}:${dois(d.getMinutes())}`; };
// true se o horário (data + hora) já passou
export const horarioPassou = (data, hora) => data < hojeISO() || (data === hojeISO() && hora <= horaAgora());
// "vaga" = data + hora. No banco ela é única: dois agendamentos ativos nunca ficam no mesmo horário
export const vagaDe = (data, hora) => `${data} ${hora}`;

export function planoAtivo(usuario) {
    const a = usuario && usuario.assinatura;
    return a && a.ativa ? { id: a.plano, ...PLANOS[a.plano] } : null;
}

// itens = [{ produto, qtd }]
export function calcularCarrinho(itens, usuario, config) {
    const plano = planoAtivo(usuario);
    const subtotal = arred(itens.reduce((s, i) => s + i.produto.preco * i.qtd, 0));
    const desconto = plano ? arred(subtotal * plano.desconto / 100) : 0;
    const freteGratis = (plano && plano.id === 'premium') || subtotal - desconto >= config.freteGratisAcima;
    const frete = itens.length === 0 || freteGratis ? 0 : config.frete;
    return { subtotal, desconto, frete, total: arred(subtotal - desconto + frete), plano: plano ? plano.nome : null };
}

export function ehDomingo(dataISO) {
    return new Date(dataISO + 'T12:00:00').getDay() === 0;
}

// agendamentosDoCliente = agendamentos já feitos por esse cliente
export function banhoGratisDisponivel(usuario, dataISO, agendamentosDoCliente) {
    const plano = planoAtivo(usuario);
    if (!plano || plano.id !== 'premium' || !dataISO) return false;
    const mes = dataISO.slice(0, 7);
    return !agendamentosDoCliente.some(a => a.status !== 'Cancelado' && a.gratis && a.data.slice(0, 7) === mes);
}

export function calcularAgendamento({ servico, porte, adicionais, gratis }) {
    const base = Math.round(servico.preco * (PORTES[porte] || 1));
    const extras = adicionais.reduce((s, a) => s + a.preco, 0);
    const vaiSerGratis = gratis && servico.id === 'banho';
    return { base, extras, gratis: vaiSerGratis, total: arred((vaiSerGratis ? 0 : base) + extras) };
}

export function proximaEntrega(dia, hoje = new Date()) {
    if (!dia) return null;
    let d = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    if (d <= hoje) d = new Date(hoje.getFullYear(), hoje.getMonth() + 1, dia);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
