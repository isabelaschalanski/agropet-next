'use client';
// Janela com os detalhes de um pedido: cliente, itens, observação, mudar status e imprimir.
import { useLoja } from '../Provedor';
import { BadgePedido, imprimirPedido } from './comum';
import { STATUS_PEDIDO } from '../../lib/regras';
import { dataBR, dinheiro, linkWhats, numPedido } from '../../lib/front/util';

export default function DetalhePedido({ id }) {
    const { pedidos, usuarioPor, api, executar, sincronizar, aviso, fecharJanela, abrirJanela, confirmar } = useLoja();
    const p = pedidos.find(x => x.id === id);
    if (!p) return <><div className="modal-topo"><h2>Pedido não encontrado</h2><button className="fechar" onClick={fecharJanela}>✕</button></div></>;
    const u = usuarioPor(p.clienteId) || {};
    const zap = linkWhats(u.telefone, `Olá, ${(u.nome || '').split(' ')[0]}! Aqui é da AgroPet 🐾 Sobre o seu pedido #${numPedido(p.id)}: `);
    const reabrir = () => abrirJanela(<DetalhePedido id={id} />);

    const mudarStatus = (status) => {
        const fazer = () => executar(async () => { await api('PATCH', '/pedidos/' + id, { status }); await sincronizar(); reabrir(); aviso(`Pedido #${id}: ${status}`); });
        if (status === 'Cancelado') confirmar(`Cancelar o pedido #${id}? Os itens voltam para o estoque.`, fazer); else fazer();
    };
    const salvarObs = (e) => {
        e.preventDefault();
        const observacao = e.currentTarget.observacao.value;
        executar(async () => { await api('PATCH', '/pedidos/' + id, { observacao }); await sincronizar(); aviso('Observação salva ✓'); });
    };

    return (
        <>
            <div className="modal-topo"><h2>Pedido #{numPedido(p.id)} <BadgePedido status={p.status} /></h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <div className="ficha">
                <div className="ficha-bloco"><small>Cliente</small><b>{u.nome || '—'}</b><span>{u.email || ''}{u.telefone ? ' · ' + u.telefone : ''}</span>
                    {zap && <a className="link-zap" href={zap} target="_blank" rel="noopener noreferrer">💬 Falar no WhatsApp</a>}</div>
                <div className="ficha-bloco"><small>Entrega</small><b>{p.endereco || '—'}</b><span>Pedido em {dataBR(p.data)} · {p.pagamento}</span></div>
            </div>
            <table className="t-adm t-itens"><tbody>
                <tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr>
                {p.itens.map((i, k) => <tr key={k}><td>{i.nome}</td><td>{i.qtd}</td><td>{dinheiro(i.preco)}</td><td>{dinheiro(i.preco * i.qtd)}</td></tr>)}
                <tr className="tot"><td colSpan={3}>Subtotal</td><td>{dinheiro(p.subtotal)}</td></tr>
                {p.desconto > 0 && <tr className="tot"><td colSpan={3}>Desconto do Clube</td><td>− {dinheiro(p.desconto)}</td></tr>}
                <tr className="tot"><td colSpan={3}>Frete</td><td>{p.frete ? dinheiro(p.frete) : 'Grátis'}</td></tr>
                <tr className="tot total"><td colSpan={3}>Total</td><td>{dinheiro(p.total)}</td></tr>
            </tbody></table>
            <form className="form" onSubmit={salvarObs} key={'obs' + p.id}>
                <label>Observação interna <small className="suave">(só a loja vê)</small><textarea name="observacao" rows={2} placeholder="Ex.: entregar depois das 14h" defaultValue={p.observacao || ''} /></label>
                <button className="btn btn-borda btn-peq" style={{ alignSelf: 'flex-start' }}>Salvar observação</button>
            </form>
            <div className="status-linha"><small>Mudar status:</small>
                {STATUS_PEDIDO.map(s => <button key={s} className={'chip-st' + (s === p.status ? ' ativo' : '')} onClick={() => mudarStatus(s)}>{s}</button>)}
            </div>
            <div className="modal-acoes">
                <button className="btn btn-borda" onClick={() => imprimirPedido(p, u, 'etiqueta')}>🏷️ Etiqueta</button>
                <button className="btn btn-borda" onClick={() => imprimirPedido(p, u, 'comprovante')}>🖨️ Comprovante</button>
                <button className="btn btn-musgo" onClick={fecharJanela}>Fechar</button>
            </div>
        </>
    );
}
