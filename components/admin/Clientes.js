'use client';
// Clientes no gerenciamento (/admin/clientes): busca, ficha completa, editar e excluir.
import { useEffect, useState } from 'react';
import { useLoja } from '../Provedor';
import { Badge, BadgeAgenda, BadgePedido } from './comum';
import { planoAtivo } from '../../lib/regras';
import { dataBR, dinheiro, iconePet, iniciais, linkWhats, numPedido, semAcento, soData } from '../../lib/front/util';

export default function Clientes() {
    const { usuarios, pedidos, usuarioPor, api, executar, sincronizar, aviso, confirmar, abrirJanela } = useLoja();
    const [busca, setBusca] = useState('');
    const b = semAcento(busca), bNum = busca.replace(/\D/g, '');
    const lista = usuarios.filter(u => !b || semAcento(u.nome).includes(b) || semAcento(u.email).includes(b) || (bNum && u.telefone.replace(/\D/g, '').includes(bNum)));
    const excluir = (id) => {
        const u = usuarioPor(id);
        confirmar(`Excluir ${u.nome}? Os pets, pedidos, agendamentos e a assinatura dessa pessoa também serão apagados. Não dá para desfazer.`,
            () => executar(async () => { await api('DELETE', '/admin/clientes/' + id); await sincronizar(); aviso('Cliente excluído'); }));
    };

    return (
        <div className="caixa">
            <div className="ferramentas">
                <input className="busca-adm larga" placeholder="🔍 Buscar por nome, e-mail ou telefone" value={busca} onChange={(e) => setBusca(e.target.value)} />
                <span className="suave">{usuarios.length} cliente{usuarios.length === 1 ? '' : 's'}</span>
            </div>
            {lista.length ? (
                <div className="tabela-wrap"><table className="t-adm"><tbody>
                    <tr><th>Cliente</th><th>Telefone</th><th>Pets</th><th>Pedidos</th><th>Total gasto</th><th>Clube</th><th>Desde</th><th></th></tr>
                    {lista.map(u => {
                        const peds = pedidos.filter(p => p.clienteId === u.id && p.status !== 'Cancelado');
                        const plano = planoAtivo(u);
                        return (
                            <tr key={u.id}>
                                <td><div className="pet-cel"><span className="avatar ini">{iniciais(u.nome)}</span><div><b>{u.nome}</b>{u.observacoes && <> <span title="Tem observações">📝</span></>}<br /><small className="suave">{u.email}</small></div></div></td>
                                <td className="nw">{u.telefone || <span className="suave">—</span>}</td>
                                <td>{(u.pets || []).map(p => iconePet(p.tipo)).join(' ') || <span className="suave">—</span>}</td>
                                <td>{peds.length}</td><td><b>{dinheiro(peds.reduce((s, p) => s + p.total, 0))}</b></td>
                                <td>{plano ? <Badge cor="caramelo" icone="⭐">{plano.nome}</Badge> : <span className="suave">—</span>}</td>
                                <td>{dataBR(u.criadoEm)}</td>
                                <td><div className="acoes">
                                    <button className="btn btn-borda btn-peq" onClick={() => abrirJanela(<FichaCliente id={u.id} />)}>Ver</button>
                                    <button className="ic-btn" onClick={() => abrirJanela(<EditarCliente id={u.id} />)} title="Editar">✏️</button>
                                    <button className="ic-btn perigo" onClick={() => excluir(u.id)} title="Excluir">🗑️</button>
                                </div></td>
                            </tr>
                        );
                    })}
                </tbody></table></div>
            ) : <p className="vazio">{b ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}</p>}
        </div>
    );
}

// Ficha do cliente (busca tudo dele na API: pets, pedidos e agendamentos)
function FichaCliente({ id }) {
    const { planos, servicoPor, api, executar, sincronizar, aviso, fecharJanela, abrirJanela } = useLoja();
    const [c, setC] = useState(null);
    useEffect(() => { executar(async () => setC(await api('GET', '/admin/clientes/' + id))); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!c) return <><div className="modal-topo"><h2>Carregando...</h2><button className="fechar" onClick={fecharJanela}>✕</button></div></>;
    const validos = c.pedidos.filter(p => p.status !== 'Cancelado');
    const zap = linkWhats(c.telefone, `Olá, ${c.nome.split(' ')[0]}! Aqui é da AgroPet 🐾 `);
    const a = c.assinatura;
    const salvarObs = (e) => {
        e.preventDefault();
        const observacoes = e.currentTarget.observacoes.value;
        executar(async () => { await api('PUT', '/admin/clientes/' + id, { observacoes }); await sincronizar(); aviso('Observações salvas ✓'); });
    };

    return (
        <>
            <div className="modal-topo"><h2><span className="avatar ini">{iniciais(c.nome)}</span> {c.nome}</h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <div className="ficha">
                <div className="ficha-bloco"><small>Contato</small><b>{c.email}</b><span>{c.telefone || 'sem telefone'} · cliente desde {dataBR(c.criadoEm)}</span>
                    {zap && <a className="link-zap" href={zap} target="_blank" rel="noopener noreferrer">💬 Falar no WhatsApp</a>}</div>
                <div className="ficha-bloco"><small>Compras</small><b>{dinheiro(validos.reduce((s, p) => s + p.total, 0))}</b><span>{validos.length} pedido{validos.length === 1 ? '' : 's'} · {a && a.ativa ? 'Clube ' + planos[a.plano].nome : 'sem Clube'}</span></div>
            </div>
            <form className="form" onSubmit={salvarObs}>
                <label>Observações <small className="suave">(só a loja vê)</small><textarea name="observacoes" rows={2} placeholder="Ex.: o Thor tem pele sensível, usar shampoo neutro" defaultValue={c.observacoes || ''} /></label>
                <button className="btn btn-borda btn-peq" style={{ alignSelf: 'flex-start' }}>Salvar observações</button>
            </form>
            <h3 className="sub-ficha">🐾 Pets ({c.pets.length})</h3>
            {c.pets.length ? (
                <div className="pets-ficha">
                    {c.pets.map(p => <div key={p.id}><span className="avatar pet peq">{iconePet(p.tipo)}</span><b>{p.nome}</b><small>{p.tipo} · {p.porte}{p.raca ? ' · ' + p.raca : ''}</small></div>)}
                </div>
            ) : <p className="suave">Nenhum pet cadastrado.</p>}
            <h3 className="sub-ficha">🧾 Pedidos ({c.pedidos.length})</h3>
            {c.pedidos.length ? (
                <table className="t-adm"><tbody>
                    {c.pedidos.slice(0, 8).map(p => <tr key={p.id}><td>#{numPedido(p.id)}</td><td>{dataBR(soData(p.data))}</td><td>{p.itens.reduce((s, i) => s + i.qtd, 0)} itens</td><td><b>{dinheiro(p.total)}</b></td><td><BadgePedido status={p.status} /></td></tr>)}
                </tbody></table>
            ) : <p className="suave">Nenhum pedido.</p>}
            <h3 className="sub-ficha">🛁 Banho e Tosa ({c.agendamentos.length})</h3>
            {c.agendamentos.length ? (
                <table className="t-adm"><tbody>
                    {c.agendamentos.slice(0, 8).map(g => <tr key={g.id}><td>{dataBR(g.data)} {g.hora}</td><td>{g.petNome}</td><td>{g.servicoNome || servicoPor(g.servicoId).nome}</td><td>{g.gratis ? 'Grátis' : dinheiro(g.valor)}</td><td><BadgeAgenda status={g.status} /></td></tr>)}
                </tbody></table>
            ) : <p className="suave">Nenhum agendamento.</p>}
            <div className="modal-acoes">
                <button className="btn btn-borda" onClick={() => abrirJanela(<EditarCliente id={c.id} />)}>✏️ Editar dados</button>
                <button className="btn btn-musgo" onClick={fecharJanela}>Fechar</button>
            </div>
        </>
    );
}

function EditarCliente({ id }) {
    const { usuarioPor, api, executar, sincronizar, aviso, fecharJanela } = useLoja();
    const u = usuarioPor(id);
    if (!u) return null;
    const salvar = (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        executar(async () => { await api('PUT', '/admin/clientes/' + id, d); fecharJanela(); await sincronizar(); aviso('Cliente atualizado ✓'); });
    };
    return (
        <>
            <div className="modal-topo"><h2>Editar cliente</h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <form className="form" onSubmit={salvar}>
                <label>Nome<input name="nome" defaultValue={u.nome} required /></label>
                <div className="form-linha">
                    <label>E-mail<input name="email" type="email" defaultValue={u.email} required /></label>
                    <label>Telefone<input name="telefone" defaultValue={u.telefone} placeholder="(55) 99999-0000" /></label>
                </div>
                <label>Observações<textarea name="observacoes" rows={3} defaultValue={u.observacoes || ''} /></label>
                <div className="modal-acoes"><button type="button" className="btn btn-borda" onClick={fecharJanela}>Cancelar</button><button className="btn btn-musgo">Salvar</button></div>
            </form>
        </>
    );
}
