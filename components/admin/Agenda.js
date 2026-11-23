'use client';
// Banho e Tosa no gerenciamento (/admin/banho-e-tosa): agenda, concluir, remarcar, WhatsApp, arquivar.
import { useEffect, useState } from 'react';
import { useLoja } from '../Provedor';
import { AbasLista, BadgeAgenda } from './comum';
import { HORARIOS, PORTES, TIPOS_BANHO, hojeISO } from '../../lib/regras';
import { dataBR, dinheiro, iconePet, linkWhats, semAcento } from '../../lib/front/util';

const ABAS_AGENDA = [
    ['agendados', 'Agendados', a => !a.arquivado && a.status === 'Agendado'],
    ['historico', 'Histórico', a => !a.arquivado && a.status !== 'Agendado'],
    ['arquivados', 'Arquivados', a => a.arquivado],
];
const TEXTO_VAZIO = { agendados: 'Nenhum banho marcado.', historico: 'Nenhum agendamento concluído ou cancelado.', arquivados: 'Nada arquivado.' };

export default function Agenda() {
    const { agendamentos, usuarioPor, servicoPor, extraPor, api, executar, sincronizar, aviso, confirmar, abrirJanela } = useLoja();
    const [aba, setAba] = useState('agendados');
    const [busca, setBusca] = useState('');
    const nomeDe = (id) => (usuarioPor(id) || {}).nome || '';
    const b = semAcento(busca);
    let lista = agendamentos.filter(ABAS_AGENDA.find(a => a[0] === aba)[2])
        .filter(a => !b || semAcento(a.pet).includes(b) || semAcento(nomeDe(a.clienteId)).includes(b))
        .sort((x, y) => (x.data + x.hora).localeCompare(y.data + y.hora));
    if (aba !== 'agendados') lista = lista.reverse();
    const recarregar = async (msg) => { await sincronizar(); if (msg) aviso(msg); };

    const textoConfirmacao = (a) => {
        const u = usuarioPor(a.clienteId) || {};
        return `Olá, ${(u.nome || '').split(' ')[0]}! 🐾 Confirmando o ${servicoPor(a.servico).nome} do ${a.pet} na AgroPet em ${dataBR(a.data)} às ${a.hora}. `
            + `Valor: ${a.gratis ? 'grátis (Clube Premium)' : dinheiro(a.valor)}. Qualquer coisa, é só responder aqui. Até lá!`;
    };
    const mudar = (id, dados, msg) => executar(async () => { await api('PATCH', '/agendamentos/' + id, dados); await recarregar(msg); });
    const cancelar = (a) => confirmar(`Cancelar o ${servicoPor(a.servico).nome} do ${a.pet} em ${dataBR(a.data)} às ${a.hora}? O horário fica livre.`, () => mudar(a.id, { status: 'Cancelado' }, 'Agendamento cancelado'));
    const excluir = (id) => confirmar('Excluir este agendamento de vez?', () => executar(async () => { await api('DELETE', '/agendamentos/' + id); await recarregar('Agendamento excluído'); }));
    const arquivarTodos = () => {
        const ids = agendamentos.filter(ABAS_AGENDA[1][2]).map(a => a.id);
        confirmar(`Arquivar ${ids.length} agendamento${ids.length > 1 ? 's' : ''} do histórico?`, () => executar(async () => {
            for (const i of ids) await api('PATCH', '/agendamentos/' + i, { arquivado: true });
            await recarregar('Histórico arquivado');
        }));
    };
    const aoSalvar = () => setAba('agendados');

    return (
        <div className="caixa">
            <div className="ferramentas">
                <AbasLista abas={ABAS_AGENDA} atual={aba} lista={agendamentos} aoTrocar={setAba} />
                <input className="busca-adm" placeholder="🔍 Pet ou cliente" value={busca} onChange={(e) => setBusca(e.target.value)} />
                <button className="btn btn-musgo" onClick={() => abrirJanela(<ModalAgenda aoSalvar={aoSalvar} />)}>+ Novo agendamento</button>
            </div>
            {lista.length ? (
                <div className="tabela-wrap"><table className="t-adm"><tbody>
                    <tr><th>Quando</th><th>Pet</th><th>Serviço</th><th>Cliente</th><th>Valor</th><th>Status</th><th></th></tr>
                    {lista.map(a => {
                        const u = usuarioPor(a.clienteId) || {};
                        const zap = linkWhats(u.telefone, textoConfirmacao(a));
                        return (
                            <tr key={a.id}>
                                <td><b>{dataBR(a.data)}</b><br /><small className="suave">{a.hora}{a.data === hojeISO() ? ' · hoje' : ''}</small></td>
                                <td><div className="pet-cel"><span className="avatar pet peq">{iconePet(a.especie)}</span><div><b>{a.pet}</b><br /><small className="suave">{a.especie} · {a.porte}</small></div></div></td>
                                <td>{servicoPor(a.servico).nome}{a.extras.length > 0 && <><br /><small className="suave">+ {a.extras.map(x => extraPor(x).nome).join(', ')}</small></>}</td>
                                <td>{u.nome || '—'}<br /><small className="suave nw">{u.telefone || 'sem telefone'}</small></td>
                                <td><b>{a.gratis ? 'Grátis ⭐' : dinheiro(a.valor)}</b></td>
                                <td><BadgeAgenda status={a.status} /></td>
                                <td><div className="acoes">
                                    {a.status === 'Agendado' && !a.arquivado && (
                                        <>
                                            <button className="btn btn-musgo btn-peq" onClick={() => mudar(a.id, { status: 'Concluído' }, 'Banho concluído ✓')}>✓ Concluir</button>
                                            <button className="ic-btn" onClick={() => abrirJanela(<ModalAgenda editar={a} aoSalvar={aoSalvar} />)} title="Remarcar ou trocar serviço">✏️</button>
                                            {zap ? <a className="ic-btn zap" href={zap} target="_blank" rel="noopener noreferrer" title="Confirmar pelo WhatsApp">💬</a>
                                                : <span className="ic-btn off" title="Cliente sem telefone">💬</span>}
                                            <button className="ic-btn perigo" onClick={() => cancelar(a)} title="Cancelar">✕</button>
                                        </>
                                    )}
                                    {aba === 'historico' && <button className="ic-btn" onClick={() => mudar(a.id, { arquivado: true }, 'Agendamento arquivado')} title="Arquivar">🗄️</button>}
                                    {aba === 'arquivados' && (
                                        <>
                                            <button className="ic-btn" onClick={() => mudar(a.id, { arquivado: false }, 'De volta ao histórico')} title="Voltar ao histórico">↩️</button>
                                            <button className="ic-btn perigo" onClick={() => excluir(a.id)} title="Excluir de vez">🗑️</button>
                                        </>
                                    )}
                                </div></td>
                            </tr>
                        );
                    })}
                </tbody></table></div>
            ) : <p className="vazio">{b ? 'Nenhum agendamento encontrado.' : TEXTO_VAZIO[aba]}</p>}
            {aba === 'historico' && lista.length > 0 && <div className="rodape-lista"><button className="btn btn-borda btn-peq" onClick={arquivarTodos}>🗄️ Arquivar todo o histórico</button></div>}
        </div>
    );
}

// Janela de novo agendamento (o admin escolhe cliente e pet) ou de remarcação (editar = agendamento)
function ModalAgenda({ editar, aoSalvar }) {
    const { usuarios, usuarioPor, servicos, extras, extraPor, api, executar, sincronizar, aviso, fecharJanela } = useLoja();
    const novo = !editar;
    const [clienteId, setClienteId] = useState(null);
    const [petId, setPetId] = useState(null);
    const [servicoId, setServicoId] = useState(novo ? 'banho' : editar.servico);
    const [adicionais, setAdicionais] = useState(novo ? [] : [...editar.extras]);
    const [data, setData] = useState(novo ? '' : editar.data);
    const [hora, setHora] = useState(novo ? '' : editar.hora);
    const [livres, setLivres] = useState([]);
    const [fechado, setFechado] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // horários livres da data escolhida
    useEffect(() => {
        let vale = true;
        setLivres([]); setFechado(false);
        if (!data) return;
        api('GET', '/horarios?data=' + data).then((r) => {
            if (!vale) return;
            setLivres(r.livres); setFechado(r.fechado);
            const original = !novo && data === editar.data;
            setHora(h => (h && !r.livres.includes(h) && !(original && h === editar.hora) ? '' : h));
        }).catch((e) => aviso('⚠️ ' + e.message));
        return () => { vale = false; };
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    const clientes = usuarios.filter(u => (u.pets || []).some(p => TIPOS_BANHO.includes(p.tipo)));
    const cli = novo ? usuarioPor(clienteId) : null;
    const pets = cli ? cli.pets.filter(p => TIPOS_BANHO.includes(p.tipo)) : [];
    const pet = novo ? pets.find(p => p.id === petId) : null;
    const porte = novo ? (pet && pet.porte) : editar.porte;
    const preco = (sv) => Math.round(sv.preco * (PORTES[porte] || 1));
    const valor = porte ? servicos.filter(x => x.id === servicoId).reduce((t, sv) => t + preco(sv), 0) + adicionais.reduce((t, id) => t + extraPor(id).preco, 0) : 0;
    const pode = (novo ? petId : true) && data && hora && !salvando;

    const alternarExtra = (id) => setAdicionais(l => (l.includes(id) ? l.filter(x => x !== id) : [...l, id]));
    const salvar = () => {
        setSalvando(true);
        executar(async () => {
            if (novo) await api('POST', '/agendamentos', { petId, servicoId, adicionais, data, hora });
            else await api('PATCH', '/agendamentos/' + editar.id, { data, hora, servicoId, adicionais });
            fecharJanela();
            if (aoSalvar) aoSalvar();
            await sincronizar();
            aviso(novo ? 'Agendamento criado ✓' : 'Agendamento atualizado ✓');
        }).finally(() => setSalvando(false));
    };

    return (
        <>
            <div className="modal-topo"><h2>{novo ? '+ Novo agendamento' : `Remarcar · ${editar.pet}`}</h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <div className="form">
                {novo && (
                    <>
                        <div className="form-linha">
                            <label>Cliente
                                <select value={clienteId || ''} onChange={(e) => { setClienteId(+e.target.value || null); setPetId(null); }}>
                                    <option value="">Escolha…</option>
                                    {clientes.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                                </select>
                            </label>
                            <label>Pet
                                <select value={petId || ''} onChange={(e) => setPetId(+e.target.value || null)} disabled={!cli}>
                                    <option value="">{cli ? 'Escolha…' : 'Escolha o cliente antes'}</option>
                                    {pets.map(p => <option key={p.id} value={p.id}>{iconePet(p.tipo)} {p.nome} · {p.porte}</option>)}
                                </select>
                            </label>
                        </div>
                        {!clientes.length && <p className="nota">Nenhum cliente com cachorro ou gato cadastrado.</p>}
                    </>
                )}
                <span className="rot">Serviço</span>
                <div className="opcoes-adm">
                    {servicos.map(sv => <button type="button" key={sv.id} className={'op-adm' + (sv.id === servicoId ? ' ativo' : '')} onClick={() => setServicoId(sv.id)}>{sv.icone} {sv.nome}{porte && <small>{dinheiro(preco(sv))}</small>}</button>)}
                </div>
                <span className="rot">Adicionais</span>
                <div className="opcoes-adm">
                    {extras.map(x => <button type="button" key={x.id} className={'op-adm' + (adicionais.includes(x.id) ? ' ativo' : '')} onClick={() => alternarExtra(x.id)}>{x.icone} {x.nome}<small>+ {dinheiro(x.preco)}</small></button>)}
                </div>
                <label style={{ maxWidth: 240 }}>Data<input type="date" min={hojeISO()} value={data} onChange={(e) => setData(e.target.value)} /></label>
                <span className="rot">Horário</span>
                {!data ? <p className="suave">Escolha a data para ver os horários livres.</p>
                    : fechado ? <p className="nota">Não abrimos aos domingos.</p>
                        : (
                            <div className="horas-adm">
                                {HORARIOS.map(h => {
                                    const livre = livres.includes(h) || (!novo && data === editar.data && h === editar.hora);
                                    return <button type="button" key={h} className={h === hora ? 'ativo' : ''} onClick={() => setHora(h)} disabled={!livre}>{h}</button>;
                                })}
                            </div>
                        )}
                <div className="ag-total"><span>Valor estimado</span><b>{porte ? dinheiro(valor) : '—'}</b></div>
                <div className="modal-acoes">
                    <button type="button" className="btn btn-borda" onClick={fecharJanela}>Cancelar</button>
                    <button type="button" className="btn btn-musgo" onClick={salvar} disabled={!pode}>{novo ? 'Agendar' : 'Salvar alterações'}</button>
                </div>
            </div>
        </>
    );
}
