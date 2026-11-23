'use client';
// Minha conta (/conta/pedidos, /conta/agendamentos, /conta/pets, /conta/clube, /conta/dados).
import Link from 'next/link';
import { useState } from 'react';
import { useLoja } from '../Provedor';
import { usePrecisaLogin } from '../loja/LojaLayout';
import BotaoLink from '../loja/BotaoLink';
import FormPet from './FormPet';
import { Planos, useNomesItens } from './Clube';
import { hojeISO, proximaEntrega } from '../../lib/regras';
import { dataBR, dinheiro, iconePet } from '../../lib/front/util';

export const ABAS_CONTA = [['pedidos', '📦', 'Meus pedidos'], ['agendamentos', '🛁', 'Banho e Tosa'], ['pets', '🐾', 'Meus pets'], ['clube', '⭐', 'Clube AgroPet'], ['dados', '👤', 'Meus dados']];

export default function Conta({ aba }) {
    const { sair } = useLoja();
    const usuario = usePrecisaLogin('/conta/' + aba);
    if (!usuario) return null;
    const Conteudo = { pedidos: Pedidos, agendamentos: Agendamentos, pets: Pets, clube: MeuClube, dados: Dados }[aba] || Pedidos;
    return (
        <div className="container area">
            <aside className="lateral">
                <div className="quem"><strong>{usuario.nome}</strong><small>{usuario.email}</small></div>
                {ABAS_CONTA.map(([id, ic, nome]) => <BotaoLink key={id} href={'/conta/' + id} className={aba === id ? 'ativo' : ''}>{ic} {nome}</BotaoLink>)}
                <button className="sair" onClick={sair}>↩ Sair</button>
            </aside>
            <section><Conteudo u={usuario} /></section>
        </div>
    );
}

function Pedidos({ u }) {
    const { pedidos, confirmar, executar, api, sincronizar, aviso } = useLoja();
    const lista = pedidos.filter(p => p.clienteId === u.id).reverse(); // mais novos primeiro
    const cancelar = (id) => confirmar('Cancelar este pedido? Os itens voltam para a loja.', () => executar(async () => {
        await api('PATCH', '/pedidos/' + id, { status: 'Cancelado' }); await sincronizar(); aviso('Pedido cancelado');
    }));
    return (
        <div className="caixa"><h2>Meus pedidos</h2>
            {lista.length ? (
                <>
                    <div className="tabela-wrap"><table><tbody>
                        <tr><th>Nº</th><th>Data</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr>
                        {lista.map(p => (
                            <tr key={p.id}>
                                <td>#{p.id}</td><td>{dataBR(p.data)}</td>
                                <td>{p.itens.map((i, k) => <span key={k}>{i.qtd}× {i.nome}<br /></span>)}</td>
                                <td>{dinheiro(p.total)}</td>
                                <td><span className={`status st-${p.status.replace(' ', '-')}`}>{p.status}</span></td>
                                <td>{p.status === 'Recebido' && <button className="btn btn-perigo btn-peq" onClick={() => cancelar(p.id)}>Cancelar</button>}</td>
                            </tr>
                        ))}
                    </tbody></table></div>
                    <p className="nota" style={{ marginTop: 14 }}>Dá para cancelar o pedido enquanto ele está como <b>Recebido</b>. Depois que entra em separação, fale com a loja.</p>
                </>
            ) : <p className="vazio">Você ainda não fez nenhum pedido.</p>}
        </div>
    );
}

function Agendamentos({ u }) {
    const { agendamentos, servicoPor, extraPor, confirmar, executar, api, sincronizar, aviso } = useLoja();
    const [sub, setSub] = useState('proximos');
    const meus = agendamentos.filter(a => a.clienteId === u.id);
    const prox = meus.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const ant = meus.filter(a => !prox.includes(a)).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
    const lista = sub === 'proximos' ? prox : ant;
    const cancelar = (id) => confirmar('Cancelar este agendamento?', () => executar(async () => {
        await api('PATCH', '/agendamentos/' + id, { status: 'Cancelado' }); await sincronizar(); aviso('Agendamento cancelado');
    }));
    return (
        <div className="caixa">
            <div className="barra-ferr"><h2 style={{ margin: 0 }}>Meus agendamentos</h2><Link href="/banho-e-tosa/agendar" className="btn btn-azul btn-peq">Agendar agora →</Link></div>
            <div className="sub-abas">
                <button className={sub === 'proximos' ? 'ativo' : ''} onClick={() => setSub('proximos')}>Próximos ({prox.length})</button>
                <button className={sub === 'anteriores' ? 'ativo' : ''} onClick={() => setSub('anteriores')}>Anteriores ({ant.length})</button>
            </div>
            {lista.length ? lista.map(a => (
                <div className="ag-card" key={a.id}>
                    <span className="av">{iconePet(a.especie)}</span>
                    <div className="info"><strong>{a.pet} · {servicoPor(a.servico).nome}</strong>
                        <small>{dataBR(a.data)} às {a.hora}{a.extras.length ? ' · + ' + a.extras.map(x => extraPor(x).nome).join(', ') : ''}</small>
                        <small>{dinheiro(a.valor)}{a.gratis ? ' · banho grátis ⭐' : ''}</small></div>
                    <span className={`status st-${a.status}`}>{a.status}</span>
                    {a.status === 'Agendado' && <button className="btn btn-perigo btn-peq" onClick={() => cancelar(a.id)}>Cancelar</button>}
                </div>
            )) : (
                <div className="sem-pet"><div className="grande">🛁</div><h3>{sub === 'proximos' ? 'Ainda não há agendamentos' : 'Nenhum atendimento anterior'}</h3><p>Seus agendamentos vão aparecer aqui.</p></div>
            )}
        </div>
    );
}

function Pets({ u }) {
    const { abrirJanela, confirmar, executar, api, sincronizar, aviso } = useLoja();
    const pets = u.pets || [];
    const novo = () => abrirJanela(<FormPet />);
    const excluir = (p) => confirmar(`Excluir ${p.nome} dos seus pets?`, () => executar(async () => {
        await api('DELETE', '/pets/' + p.id); await sincronizar(); aviso('Pet excluído');
    }));
    return (
        <div className="caixa">
            <div className="barra-ferr"><h2 style={{ margin: 0 }}>Meus pets</h2><button className="btn btn-azul btn-peq" onClick={novo}>＋ Cadastrar pet</button></div>
            {pets.length ? (
                <div className="lista-pets">
                    {pets.map(p => (
                        <div className="pet-card" key={p.id}>
                            <span className="av">{iconePet(p.tipo)}</span>
                            <strong>{p.nome}</strong><small>{p.tipo}{p.raca ? ' · ' + p.raca : ''} · {p.porte}{p.sexo ? ' · ' + p.sexo : ''}</small>
                            {p.nascimento && <small>Nasceu em {dataBR(p.nascimento)}</small>}
                            <div className="acoes" style={{ marginTop: 8 }}>
                                <button className="btn btn-borda btn-peq" onClick={() => abrirJanela(<FormPet pet={p} />)}>Editar</button>
                                <button className="btn btn-perigo btn-peq" onClick={() => excluir(p)}>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="sem-pet"><div className="grande">🐶</div><h3>Você ainda não cadastrou nenhum pet</h3><p>Cadastre seus pets para agendar banho e tosa mais rápido.</p><button className="btn btn-azul" onClick={novo}>＋ Cadastrar pet</button></div>
            )}
        </div>
    );
}

function MeuClube({ u }) {
    const { planos, confirmar, executar, api, sincronizar, aviso } = useLoja();
    const nomesItens = useNomesItens();
    const a = u.assinatura && u.assinatura.ativa ? u.assinatura : null;
    if (!a) return <div className="caixa"><h2>Clube AgroPet</h2><p style={{ marginBottom: 18 }}>Você ainda não é assinante.</p><Planos /></div>;
    const pl = planos[a.plano];
    const cancelar = () => confirmar('Tem certeza que quer cancelar a assinatura?', () => executar(async () => {
        await api('DELETE', '/assinatura'); await sincronizar(); aviso('Assinatura cancelada');
    }));
    return (
        <div className="caixa"><h2>Minha assinatura</h2>
            <div className="stats">
                <div className="stat"><span className="ic">⭐</span><small>Plano</small><strong>{pl.nome}</strong></div>
                <div className="stat"><span className="ic">💳</span><small>Mensalidade</small><strong>{dinheiro(pl.preco)}</strong></div>
                <div className="stat"><span className="ic">📦</span><small>Próxima entrega</small><strong>{a.diaEntrega ? dataBR(proximaEntrega(a.diaEntrega)) : 'Sem agendamento'}</strong></div>
            </div>
            <p style={{ marginBottom: 6 }}>Entrega mensal: <b>{nomesItens(a)}</b>{a.diaEntrega ? ` · todo dia ${a.diaEntrega}` : ''}</p>
            <p style={{ marginBottom: 18 }}>Assinante desde {dataBR(a.desde)}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <BotaoLink href="/clube/assinar" className="btn btn-azul">Alterar plano, ração ou entrega</BotaoLink>
                <button className="btn btn-perigo" onClick={cancelar}>Cancelar assinatura</button>
            </div>
        </div>
    );
}

function Dados({ u }) {
    const { api, sincronizar, aviso, executar } = useLoja();
    const salvar = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const d = Object.fromEntries(new FormData(form));
        executar(async () => {
            await api('PUT', '/eu', { nome: d.nome, email: d.email, telefone: d.telefone, ...(d.senha ? { senha: d.senha } : {}) });
            await sincronizar(); form.senha.value = ''; aviso('Dados atualizados ✓');
        });
    };
    return (
        <form className="caixa form" style={{ maxWidth: 560 }} onSubmit={salvar}><h2>Meus dados</h2>
            <label>Nome<input name="nome" defaultValue={u.nome} required /></label>
            <label>E-mail<input name="email" type="email" defaultValue={u.email} required /></label>
            <label>Telefone<input name="telefone" defaultValue={u.telefone} /></label>
            <label>Nova senha <small style={{ color: 'var(--suave)', fontWeight: 400 }}>(deixe em branco para manter)</small><input name="senha" type="password" /></label>
            <button className="btn btn-azul" style={{ alignSelf: 'flex-start' }}>Salvar alterações</button>
        </form>
    );
}
