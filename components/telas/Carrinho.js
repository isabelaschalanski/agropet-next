'use client';
// Carrinho, finalização da compra e pedido confirmado.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoja } from '../Provedor';
import { usePrecisaLogin } from '../loja/LojaLayout';
import { calcularCarrinho, PAGAMENTOS } from '../../lib/regras';
import { dinheiro, iconePagamento } from '../../lib/front/util';
import { ImgProduto } from '../loja/Imagens';

// Itens do carrinho com o produto junto + os totais (a conta é a mesma do servidor: lib/regras.js)
function useContaCarrinho() {
    const { carrinho, produtoPor, usuario, site, plano } = useLoja();
    const itens = carrinho.map(i => ({ ...i, p: produtoPor(i.id) })).filter(i => i.p);
    const c = calcularCarrinho(itens.map(i => ({ produto: i.p, qtd: i.qtd })), usuario, site);
    return { ...c, itens, plano };
}

function Resumo({ c, children }) {
    const { site } = useLoja();
    return (
        <div className="caixa">
            <h2>Resumo</h2>
            <div className="resumo-linha"><span>Subtotal</span><span>{dinheiro(c.subtotal)}</span></div>
            {c.desconto > 0 && <div className="resumo-linha verde"><span>Desconto Clube {c.plano.nome} ({c.plano.desconto}%)</span><span>− {dinheiro(c.desconto)}</span></div>}
            <div className="resumo-linha"><span>Frete</span><span>{c.frete ? dinheiro(c.frete) : <b className="verde">Grátis</b>}</span></div>
            <div className="resumo-linha total"><span>Total</span><span>{dinheiro(c.total)}</span></div>
            {!c.plano && <p className="nota azul" style={{ marginTop: 14 }}>⭐ Assinantes do <Link href="/clube">Clube AgroPet</Link> pagam até 10% menos.</p>}
            {c.frete > 0 && <p className="nota" style={{ marginTop: 10 }}>🚚 Frete grátis em compras acima de {dinheiro(site.freteGratisAcima)}.</p>}
            <div style={{ marginTop: 18 }}>{children}</div>
        </div>
    );
}

export function Carrinho() {
    const { mudarQtd, remover } = useLoja();
    const c = useContaCarrinho();
    if (!c.itens.length) {
        return (
            <div className="container sucesso">
                <div className="grande">🛒</div>
                <h1>Seu carrinho está vazio</h1>
                <p>Que tal dar uma olhada nos produtos?</p>
                <Link href="/" className="btn btn-azul" style={{ marginTop: 20 }}>Ver produtos</Link>
            </div>
        );
    }
    return (
        <div className="container">
            <h1 className="titulo" style={{ marginTop: 34 }}>Meu carrinho</h1>
            <div className="duas">
                <div className="caixa itens">
                    {c.itens.map(i => (
                        <div className="item" key={i.id}>
                            <div className={`item-img cor-${i.p.cor}`}><ImgProduto p={i.p} /></div>
                            <div className="item-info">
                                <strong>{i.p.nome}</strong>
                                <small>{dinheiro(i.p.preco)} cada · {i.p.estoque} em estoque</small>
                            </div>
                            <div className="qtd">
                                <button onClick={() => mudarQtd(i.id, -1)}>−</button>
                                <span>{i.qtd}</span>
                                <button onClick={() => mudarQtd(i.id, 1)}>+</button>
                            </div>
                            <strong className="item-total">{dinheiro(i.p.preco * i.qtd)}</strong>
                            <button className="remover" onClick={() => remover(i.id)} title="Remover">🗑️</button>
                        </div>
                    ))}
                </div>
                <Resumo c={c}>
                    <Link href="/finalizar" className="btn btn-azul btn-bloco">Finalizar compra</Link>
                    <Link href="/" className="btn btn-borda btn-bloco" style={{ marginTop: 10 }}>Continuar comprando</Link>
                </Resumo>
            </div>
        </div>
    );
}

export function Finalizar() {
    const { carrinho, pedidos, api, carregar, esvaziarCarrinho, aviso } = useLoja();
    const usuario = usePrecisaLogin('/finalizar', 'Entre ou crie uma conta para finalizar');
    const router = useRouter();
    const c = useContaCarrinho();
    const [pagamento, setPagamento] = useState('Pix');
    const [enviando, setEnviando] = useState(false);
    const vazio = !c.itens.length;
    useEffect(() => { if (vazio && !enviando) router.replace('/carrinho'); }, [vazio, enviando, router]);
    if (!usuario || vazio) return null;

    const ultimo = [...pedidos].reverse().find(p => p.clienteId === usuario.id); // pedido mais recente (para sugerir a rua)

    async function confirmar(e) {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        setEnviando(true);
        try {
            const pedido = await api('POST', '/pedidos', {
                itens: carrinho.map(i => ({ produtoId: i.id, qtd: i.qtd })),
                pagamento,
                endereco: { rua: d.rua, numero: d.numero, bairro: d.bairro, cidade: d.cidade, cep: d.cep },
            });
            esvaziarCarrinho();
            await carregar();
            router.push('/pedido/' + pedido.id);
        } catch (erro) { aviso('⚠️ ' + erro.message); setEnviando(false); }
    }

    return (
        <div className="container">
            <h1 className="titulo" style={{ marginTop: 34 }}>Finalizar compra</h1>
            <div className="duas">
                <form className="caixa form" id="formFinalizar" onSubmit={confirmar}>
                    <h2>Endereço de entrega</h2>
                    <div className="form-linha tres">
                        <label>Rua<input name="rua" required defaultValue={ultimo ? ultimo.endereco.split(',')[0] : ''} /></label>
                        <label>Número<input name="numero" required /></label>
                        <label>CEP<input name="cep" placeholder="98800-000" required /></label>
                    </div>
                    <div className="form-linha">
                        <label>Bairro<input name="bairro" required /></label>
                        <label>Cidade<input name="cidade" defaultValue="Santo Ângelo" required /></label>
                    </div>
                    <h2 style={{ marginTop: 10 }}>Pagamento</h2>
                    <div className="opcoes">
                        {PAGAMENTOS.map(m => <button type="button" key={m} className={'opcao' + (m === pagamento ? ' sel' : '')} onClick={() => setPagamento(m)}>{iconePagamento(m)} {m}</button>)}
                    </div>
                    <p className="nota">Pagamento simulado — nenhum valor é cobrado nesta demonstração.</p>
                </form>
                <Resumo c={c}>
                    {/* o botão fica no resumo, mas envia o formulário do endereço (atributo form) */}
                    <button type="submit" form="formFinalizar" className="btn btn-azul btn-bloco" disabled={enviando}>{enviando ? 'Enviando...' : 'Confirmar pedido'}</button>
                </Resumo>
            </div>
        </div>
    );
}

export function PedidoConfirmado({ id }) {
    const { pedidos } = useLoja();
    const p = pedidos.find(x => String(x.id) === String(id));
    if (!p) {
        return <div className="container sucesso"><div className="grande">🔎</div><h1>Pedido não encontrado</h1><Link href="/conta/pedidos" className="btn btn-azul" style={{ marginTop: 20 }}>Ver meus pedidos</Link></div>;
    }
    return (
        <div className="container sucesso">
            <div className="grande">🎉</div>
            <h1>Pedido nº {p.id} confirmado!</h1>
            <p>Total de <b>{dinheiro(p.total)}</b> via {p.pagamento}. Você pode acompanhar o status em Minha conta.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
                <Link href="/conta/pedidos" className="btn btn-azul">Ver meus pedidos</Link>
                <Link href="/" className="btn btn-borda">Voltar à loja</Link>
            </div>
        </div>
    );
}
