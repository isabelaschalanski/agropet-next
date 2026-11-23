'use client';
// Pedidos do gerenciamento (/admin/pedidos): abas, busca, avançar status, arquivar e excluir.
import { useState } from 'react';
import { useLoja } from '../Provedor';
import DetalhePedido from './DetalhePedido';
import { AbasLista, BadgePedido, PROXIMO_PEDIDO, useNomeCliente } from './comum';
import { dataBR, dinheiro, numPedido, semAcento } from '../../lib/front/util';

const ABAS_PEDIDOS = [
    ['andamento', 'Em andamento', p => !p.arquivado && !['Entregue', 'Cancelado'].includes(p.status)],
    ['historico', 'Histórico', p => !p.arquivado && ['Entregue', 'Cancelado'].includes(p.status)],
    ['arquivados', 'Arquivados', p => p.arquivado],
];
const TEXTO_VAZIO = { andamento: 'Nenhum pedido esperando ação. 🎉', historico: 'Nenhum pedido entregue ou cancelado.', arquivados: 'Nenhum pedido arquivado.' };

export default function Pedidos() {
    const { pedidos, api, executar, sincronizar, aviso, confirmar, abrirJanela } = useLoja();
    const nomeCliente = useNomeCliente();
    const [aba, setAba] = useState('andamento');
    const [busca, setBusca] = useState('');
    const filtro = ABAS_PEDIDOS.find(a => a[0] === aba)[2];
    const b = semAcento(busca).replace('#', '').trim();
    const lista = pedidos.filter(filtro)
        .filter(p => !b || String(p.id).includes(b) || semAcento(nomeCliente(p.clienteId)).includes(b))
        .sort((x, y) => y.id - x.id); // mais novos primeiro
    const recarregar = async (msg) => { await sincronizar(); if (msg) aviso(msg); };

    const avancar = (p) => {
        const [prox] = PROXIMO_PEDIDO[p.status];
        executar(async () => { await api('PATCH', '/pedidos/' + p.id, { status: prox }); await recarregar(`Pedido #${p.id}: ${prox}`); });
    };
    const arquivar = (id, sim) => executar(async () => { await api('PATCH', '/pedidos/' + id, { arquivado: sim }); await recarregar(sim ? 'Pedido arquivado' : 'Pedido de volta ao histórico'); });
    const excluir = (id) => confirmar(`Excluir o pedido #${id} de vez? Ele deixa de contar no faturamento.`, () => executar(async () => { await api('DELETE', '/pedidos/' + id); await recarregar('Pedido excluído'); }));
    const arquivarTodos = () => {
        const ids = pedidos.filter(ABAS_PEDIDOS[1][2]).map(p => p.id);
        confirmar(`Arquivar ${ids.length} pedido${ids.length > 1 ? 's' : ''} do histórico?`, () => executar(async () => {
            for (const i of ids) await api('PATCH', '/pedidos/' + i, { arquivado: true });
            await recarregar('Histórico arquivado');
        }));
    };

    return (
        <div className="caixa">
            <div className="ferramentas">
                <AbasLista abas={ABAS_PEDIDOS} atual={aba} lista={pedidos} aoTrocar={setAba} />
                <input className="busca-adm" placeholder="🔍 Nº do pedido ou cliente" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            {lista.length ? (
                <div className="tabela-wrap"><table className="t-adm"><tbody>
                    <tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr>
                    {lista.map(p => {
                        const prox = PROXIMO_PEDIDO[p.status];
                        const nItens = p.itens.reduce((s, i) => s + i.qtd, 0);
                        return (
                            <tr key={p.id}>
                                <td><b>#{numPedido(p.id)}</b></td><td>{dataBR(p.data)}</td><td>{nomeCliente(p.clienteId)}</td>
                                <td title={p.itens.map(i => `${i.qtd}× ${i.nome}`).join(', ')}>{nItens} {nItens === 1 ? 'item' : 'itens'}<br /><small className="suave">{p.itens[0] ? p.itens[0].nome : ''}{p.itens.length > 1 ? ' e +' + (p.itens.length - 1) : ''}</small></td>
                                <td><b>{dinheiro(p.total)}</b><br /><small className="suave">{p.pagamento}</small></td>
                                <td><BadgePedido status={p.status} />{p.observacao && <> <span title="Tem observação">📝</span></>}</td>
                                <td><div className="acoes">
                                    {prox && !p.arquivado && <button className="btn btn-musgo btn-peq" onClick={() => avancar(p)}>{prox[1]}</button>}
                                    <button className="btn btn-borda btn-peq" onClick={() => abrirJanela(<DetalhePedido id={p.id} />)}>Ver</button>
                                    {aba === 'historico' && <button className="ic-btn" onClick={() => arquivar(p.id, true)} title="Arquivar">🗄️</button>}
                                    {aba === 'arquivados' && (
                                        <>
                                            <button className="ic-btn" onClick={() => arquivar(p.id, false)} title="Voltar ao histórico">↩️</button>
                                            <button className="ic-btn perigo" onClick={() => excluir(p.id)} title="Excluir de vez">🗑️</button>
                                        </>
                                    )}
                                </div></td>
                            </tr>
                        );
                    })}
                </tbody></table></div>
            ) : <p className="vazio">{b ? 'Nenhum pedido encontrado.' : TEXTO_VAZIO[aba]}</p>}
            {aba === 'historico' && lista.length > 0 && <div className="rodape-lista"><button className="btn btn-borda btn-peq" onClick={arquivarTodos}>🗄️ Arquivar todos do histórico</button></div>}
            <p className="nota" style={{ marginTop: 14 }}>Arquivados saem das listas, mas continuam contando no faturamento. Ao cancelar um pedido, os itens voltam para o estoque.</p>
        </div>
    );
}
