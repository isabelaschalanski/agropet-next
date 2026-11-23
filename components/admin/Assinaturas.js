'use client';
// Assinaturas do Clube no gerenciamento (/admin/assinaturas).
import { useState } from 'react';
import { useLoja } from '../Provedor';
import { useNomesItens } from '../telas/Clube';
import { AbasLista, Badge, useNumeros } from './comum';
import { proximaEntrega } from '../../lib/regras';
import { dataBR, dinheiro, semAcento } from '../../lib/front/util';

const ABAS_ASS = [
    ['ativas', 'Ativas', u => u.assinatura.ativa],
    ['canceladas', 'Canceladas', u => !u.assinatura.ativa && !u.assinatura.arquivada],
    ['arquivadas', 'Arquivadas', u => !u.assinatura.ativa && u.assinatura.arquivada],
];
const TEXTO_VAZIO = { ativas: 'Nenhum assinante ativo.', canceladas: 'Nenhuma assinatura cancelada.', arquivadas: 'Nada arquivado.' };

export default function Assinaturas() {
    const { usuarios, planos, api, executar, sincronizar, aviso, confirmar } = useLoja();
    const { assinantes, mensalidades } = useNumeros();
    const nomesItens = useNomesItens();
    const [aba, setAba] = useState('ativas');
    const [busca, setBusca] = useState('');
    const todos = usuarios.filter(u => u.assinatura);
    const b = semAcento(busca);
    const lista = todos.filter(ABAS_ASS.find(a => a[0] === aba)[2]).filter(u => !b || semAcento(u.nome).includes(b));
    const recarregar = async (msg) => { await sincronizar(); if (msg) aviso(msg); };
    const mudar = (clienteId, dados, msg) => executar(async () => { await api('PATCH', '/admin/assinaturas', { clienteId, ...dados }); await recarregar(msg); });

    return (
        <>
            <div className="kpis kpis-3">
                <div className="kpi"><span className="kpi-ic">⭐</span><div><small>Assinantes ativos</small><strong>{assinantes.length}</strong></div></div>
                <div className="kpi"><span className="kpi-ic">💳</span><div><small>Mensalidades</small><strong>{dinheiro(mensalidades)}</strong><p>por mês</p></div></div>
                <div className="kpi"><span className="kpi-ic">📦</span><div><small>Com entrega mensal</small><strong>{assinantes.filter(u => u.assinatura.diaEntrega).length}</strong></div></div>
            </div>
            <div className="caixa">
                <div className="ferramentas">
                    <AbasLista abas={ABAS_ASS} atual={aba} lista={todos} aoTrocar={setAba} />
                    <input className="busca-adm" placeholder="🔍 Cliente" value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>
                {lista.length ? (
                    <div className="tabela-wrap"><table className="t-adm"><tbody>
                        <tr><th>Cliente</th><th>Plano</th><th>Rações</th><th>Entrega</th><th>Desde</th><th>Status</th><th></th></tr>
                        {lista.map(u => {
                            const a = u.assinatura, pl = planos[a.plano];
                            return (
                                <tr key={u.id}>
                                    <td><b>{u.nome}</b><br /><small className="suave">{u.email}</small></td>
                                    <td>{pl.nome}<br /><small className="suave">{dinheiro(pl.preco)}/mês</small></td>
                                    <td>{a.itens.length ? nomesItens(a).split(', ').map((t, k) => <span key={k}>{t}<br /></span>) : <span className="suave">—</span>}</td>
                                    <td>{!a.ativa ? '—' : a.diaEntrega ? <>Dia {a.diaEntrega}<br /><small className="suave">próx. {dataBR(proximaEntrega(a.diaEntrega))}</small></> : <span className="suave">Sem entrega</span>}</td>
                                    <td>{dataBR(a.desde)}</td>
                                    <td>{a.ativa ? <Badge cor="verde" icone="✓">Ativa</Badge> : a.arquivada ? <Badge cor="cinza">Arquivada</Badge> : <Badge cor="vermelho" icone="✕">Cancelada</Badge>}</td>
                                    <td><div className="acoes">
                                        {a.ativa && <button className="btn btn-perigo btn-peq" onClick={() => confirmar('Cancelar a assinatura deste cliente?', () => mudar(u.id, { ativa: false }, 'Assinatura cancelada'))}>Cancelar</button>}
                                        {!a.ativa && !a.arquivada && <button className="ic-btn" onClick={() => mudar(u.id, { arquivada: true }, 'Assinatura arquivada')} title="Arquivar">🗄️</button>}
                                        {a.arquivada && (
                                            <>
                                                <button className="ic-btn" onClick={() => mudar(u.id, { arquivada: false }, 'De volta para canceladas')} title="Voltar para canceladas">↩️</button>
                                                <button className="ic-btn perigo" onClick={() => confirmar('Excluir esta assinatura de vez?', () => executar(async () => { await api('DELETE', '/admin/assinaturas?clienteId=' + u.id); await recarregar('Assinatura excluída'); }))} title="Excluir de vez">🗑️</button>
                                            </>
                                        )}
                                    </div></td>
                                </tr>
                            );
                        })}
                    </tbody></table></div>
                ) : <p className="vazio">{b ? 'Nenhuma assinatura encontrada.' : TEXTO_VAZIO[aba]}</p>}
            </div>
        </>
    );
}
