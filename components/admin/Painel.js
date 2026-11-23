'use client';
// Painel do gerenciamento (/admin): números, gráficos, próximos banhos, estoque e últimos pedidos.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoja } from '../Provedor';
import { ImgProduto } from '../loja/Imagens';
import DetalhePedido from './DetalhePedido';
import { BadgeAgenda, BadgeEstoque, BadgePedido, useNomeCliente, useNumeros } from './comum';
import { hojeISO } from '../../lib/regras';
import { dataBR, diaMes, diasAtras, dinheiro, iconePet, numPedido } from '../../lib/front/util';

const CORES_RECEITA = ['#a24e1f', '#5f9e3f', '#3a78b5']; // terracota, verde, azul (paleta conferida para daltonismo)

// Barras: vendas por dia (Loja + Banho e Tosa)
function GraficoBarras({ n }) {
    const { vendasDoDia } = useNumeros();
    const dias = Array.from({ length: n }, (_, i) => diasAtras(n - 1 - i));
    const valores = dias.map(d => vendasDoDia(d));
    const max = Math.max(...valores.map(v => v.total), 1);
    const topo = Math.ceil(max / 50) * 50 || 50;
    const W = 640, H = 220, esq = 52, dir = 8, cima = 12, baixo = 26;
    const largura = (W - esq - dir) / n, barra = Math.max(4, Math.min(34, largura - (n > 10 ? 3 : 12)));
    const y = (v) => cima + (H - cima - baixo) * (1 - v / topo);
    const total = valores.reduce((s, v) => s + v.total, 0);
    return (
        <div className="grafico">
            <p className="graf-resumo">{dinheiro(total)} <span>em {n} dias · Loja + Banho e Tosa</span></p>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Vendas por dia nos últimos ${n} dias`}>
                {[0, 0.5, 1].map(f => (
                    <g key={f}>
                        <line x1={esq} x2={W - dir} y1={y(topo * f)} y2={y(topo * f)} className="grade-l" />
                        <text x={esq - 8} y={y(topo * f) + 4} className="eixo" textAnchor="end">{(topo * f).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</text>
                    </g>
                ))}
                <line x1={esq} x2={W - dir} y1={y(0)} y2={y(0)} className="base-l" />
                {dias.map((d, i) => {
                    const v = valores[i], x = esq + i * largura + (largura - barra) / 2, h = (H - cima - baixo) - (y(v.total) - cima);
                    const r = Math.min(4, barra / 2, h);
                    const caminho = h > 0 ? `M${x},${y(0)} V${y(v.total) + r} Q${x},${y(v.total)} ${x + r},${y(v.total)} H${x + barra - r} Q${x + barra},${y(v.total)} ${x + barra},${y(v.total) + r} V${y(0)} Z` : '';
                    const tip = `${dataBR(d)}<br><b>${dinheiro(v.total)}</b><br>Loja ${dinheiro(v.loja)} · Banho ${dinheiro(v.banho)}`;
                    return (
                        <g key={d}>
                            {caminho && <path d={caminho} className="barra-v" />}
                            {(n <= 7 || i % 5 === 0 || i === n - 1) && <text x={x + barra / 2} y={H - 8} className="eixo" textAnchor="middle">{diaMes(d)}</text>}
                            <rect x={esq + i * largura} y={cima} width={largura} height={H - cima - baixo} className="alvo" data-tip={tip} />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// Rosca: Loja x Banho e Tosa x Assinaturas (30 dias)
function GraficoRosca() {
    const { vendasPeriodo, mensalidades } = useNumeros();
    const v = vendasPeriodo(0, 29);
    const partes = [['Loja (produtos)', v.loja], ['Banho e Tosa', v.banho], ['Assinaturas', mensalidades]];
    const total = partes.reduce((s, p) => s + p[1], 0);
    if (!total) return <p className="vazio">Ainda não há vendas nos últimos 30 dias.</p>;
    const R = 62, C = 2 * Math.PI * R, gap = partes.filter(p => p[1] > 0).length > 1 ? 3 : 0;
    let acum = 0;
    const arcos = partes.map(([nome, val], i) => {
        if (!val) return null;
        const comp = val / total * C;
        const el = <circle key={nome} r={R} cx="90" cy="90" fill="none" stroke={CORES_RECEITA[i]} strokeWidth="24" strokeDasharray={`${Math.max(comp - gap, 0.1)} ${C}`} strokeDashoffset={-acum} transform="rotate(-90 90 90)" className="fatia" data-tip={`${nome}<br><b>${dinheiro(val)}</b> · ${Math.round(val / total * 100)}%`} />;
        acum += comp;
        return el;
    });
    return (
        <>
            <div className="rosca">
                <svg viewBox="0 0 180 180" role="img" aria-label="Receita dos últimos 30 dias por origem">
                    {arcos}
                    <text x="90" y="86" textAnchor="middle" className="rosca-v">{dinheiro(total).replace(',00', '')}</text>
                    <text x="90" y="104" textAnchor="middle" className="eixo">30 dias</text>
                </svg>
                <ul className="legenda">
                    {partes.map(([nome, val], i) => <li key={nome}><i style={{ background: CORES_RECEITA[i] }} /><span>{nome}</span><b>{dinheiro(val)}</b><small>{Math.round(val / total * 100)}%</small></li>)}
                </ul>
            </div>
            <p className="graf-nota">Assinaturas = mensalidades ativas de um mês.</p>
        </>
    );
}

// Ranking: produtos mais vendidos e serviço mais pedido nos últimos 30 dias
function Ranking() {
    const { pedidos, agendamentos, servicoPor } = useLoja();
    const desde = diasAtras(29);
    const qtd = {};
    pedidos.filter(p => p.status !== 'Cancelado' && p.data >= desde).forEach(p => p.itens.forEach(i => { qtd[i.nome] = (qtd[i.nome] || 0) + i.qtd; }));
    const top = Object.entries(qtd).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const serv = {};
    agendamentos.filter(a => a.status !== 'Cancelado' && a.data >= desde).forEach(a => { serv[a.servico] = (serv[a.servico] || 0) + 1; });
    const topServ = Object.entries(serv).sort((a, b) => b[1] - a[1])[0];
    if (!top.length && !topServ) return <p className="vazio">Nenhuma venda nos últimos 30 dias.</p>;
    const max = top.length ? top[0][1] : 1;
    return (
        <>
            <ol className="ranking">
                {top.map(([nome, n], i) => (
                    <li key={nome}><span className="pos">{i + 1}</span><div className="rk"><div className="rk-nome"><span>{nome}</span><b>{n} un.</b></div><div className="rk-barra"><i style={{ width: `${Math.max(6, n / max * 100)}%` }} /></div></div></li>
                ))}
            </ol>
            {topServ && <p className="rk-serv">🛁 Serviço mais pedido: <b>{servicoPor(topServ[0]).nome}</b> ({topServ[1]}×)</p>}
        </>
    );
}

export function TabelaPedidosResumo({ lista }) {
    const { abrirJanela } = useLoja();
    const nomeCliente = useNomeCliente();
    if (!lista.length) return <p className="vazio">Nenhum pedido ainda.</p>;
    return (
        <div className="tabela-wrap"><table className="t-adm"><tbody>
            <tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Status</th></tr>
            {lista.map(p => (
                <tr key={p.id} className="clicavel" onClick={() => abrirJanela(<DetalhePedido id={p.id} />)}>
                    <td><b>#{numPedido(p.id)}</b></td><td>{nomeCliente(p.clienteId)}</td><td>{dataBR(p.data)}</td><td><b>{dinheiro(p.total)}</b></td><td><BadgePedido status={p.status} /></td>
                </tr>
            ))}
        </tbody></table></div>
    );
}

export default function Painel() {
    const { pedidos, agendamentos, produtos, servicoPor, animalPor } = useLoja();
    const { vendasPeriodo, assinantes, mensalidades } = useNumeros();
    const router = useRouter();
    const [periodo, setPeriodo] = useState(30);
    const atual = vendasPeriodo(0, 29), anterior = vendasPeriodo(30, 59);
    const cresc = anterior.total > 0 ? Math.round((atual.total - anterior.total) / anterior.total * 100) : null;
    const aguardando = pedidos.filter(p => p.status === 'Recebido').length;
    const proximos = agendamentos.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const baixo = produtos.filter(p => p.estoque <= 10).sort((a, b) => a.estoque - b.estoque);
    const ultimos = [...pedidos].sort((a, b) => b.id - a.id).slice(0, 5);
    const ir = (href) => { router.push(href); window.scrollTo(0, 0); };

    return (
        <>
            <div className="kpis">
                <div className="kpi"><span className="kpi-ic">💰</span><div><small>Vendas · 30 dias</small><strong>{dinheiro(atual.total)}</strong>
                    <p>{cresc === null ? 'Loja + Banho e Tosa' : <><b className={cresc >= 0 ? 'sobe' : 'desce'}>{cresc >= 0 ? '↑' : '↓'} {Math.abs(cresc)}%</b> vs. 30 dias anteriores</>}</p></div></div>
                <div className="kpi"><span className="kpi-ic">🛍️</span><div><small>Pedidos</small><strong>{pedidos.length}</strong><p>{aguardando ? <b className="alerta">{aguardando} aguardando separação</b> : 'Nenhum aguardando'}</p></div></div>
                <div className="kpi"><span className="kpi-ic">📅</span><div><small>Agendamentos futuros</small><strong>{proximos.length}</strong><p>{proximos[0] ? `Próximo: ${diaMes(proximos[0].data)} às ${proximos[0].hora}` : 'Agenda livre'}</p></div></div>
                <div className="kpi"><span className="kpi-ic">⭐</span><div><small>Assinantes ativos</small><strong>{assinantes.length}</strong><p>Mensalidades: {dinheiro(mensalidades)}/mês</p></div></div>
            </div>

            <div className="adm-linha l-graf">
                <div className="caixa">
                    <div className="caixa-topo"><h2>📈 Faturamento</h2>
                        <div className="seg">{[7, 30].map(n => <button key={n} className={periodo === n ? 'ativo' : ''} onClick={() => setPeriodo(n)}>{n} dias</button>)}</div>
                    </div>
                    <GraficoBarras n={periodo} />
                </div>
                <div className="caixa">
                    <div className="caixa-topo"><h2>🥧 De onde vem a receita</h2></div>
                    <GraficoRosca />
                </div>
            </div>

            <div className="adm-linha">
                <div className="caixa">
                    <div className="caixa-topo"><h2>🐾 Próximos banhos</h2><a className="ver" onClick={() => ir('/admin/banho-e-tosa')}>Ver agenda →</a></div>
                    {proximos.length ? (
                        <div className="lista-adm">
                            {proximos.slice(0, 4).map(a => (
                                <div className="li-adm" key={a.id}>
                                    <span className="avatar pet">{iconePet(a.especie)}</span>
                                    <div className="li-txt"><small>{dataBR(a.data)} · {a.hora}</small><b>{a.pet}</b><span>{servicoPor(a.servico).nome}</span></div>
                                    <BadgeAgenda status={a.status} />
                                </div>
                            ))}
                        </div>
                    ) : <p className="vazio">Nenhum banho marcado.</p>}
                </div>
                <div className="caixa">
                    <div className="caixa-topo"><h2>📦 Alertas de estoque</h2><a className="ver" onClick={() => ir('/admin/produtos?filtro=estoque')}>Ver produtos →</a></div>
                    {baixo.length ? (
                        <div className="lista-adm">
                            {baixo.slice(0, 4).map(p => (
                                <div className="li-adm" key={p.id}>
                                    <span className={`avatar prod cor-${p.cor}`}><ImgProduto p={p} /></span>
                                    <div className="li-txt"><b>{p.nome}</b><span>{p.estoque <= 5 ? 'Estoque crítico' : 'Estoque baixo'} · {animalPor(p.animal).nome}</span></div>
                                    <BadgeEstoque n={p.estoque} />
                                </div>
                            ))}
                        </div>
                    ) : <p className="vazio">Tudo certo com o estoque. ✓</p>}
                </div>
            </div>

            <div className="adm-linha l-rank">
                <div className="caixa">
                    <div className="caixa-topo"><h2>🏆 Mais vendidos · 30 dias</h2></div>
                    <Ranking />
                </div>
                <div className="caixa">
                    <div className="caixa-topo"><h2>🧾 Últimos pedidos</h2><a className="ver" onClick={() => ir('/admin/pedidos')}>Ver todos os pedidos →</a></div>
                    <TabelaPedidosResumo lista={ultimos} />
                </div>
            </div>
        </>
    );
}
