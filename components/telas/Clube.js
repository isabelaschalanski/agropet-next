'use client';
// Clube AgroPet: planos (/clube), assinar ou alterar (/clube/assinar?plano=premium) e boas-vindas (/clube/bem-vindo).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoja } from '../Provedor';
import BotaoLink from '../loja/BotaoLink';
import { usePrecisaLogin } from '../loja/LojaLayout';
import { VisualSlide, ImgProduto } from '../loja/Imagens';
import { DIAS_ENTREGA, proximaEntrega } from '../../lib/regras';
import { dataBR, dinheiro, iconePagamento } from '../../lib/front/util';

// "2× Ração X, 1× Ração Y" (ou "Sem entrega mensal")
export function useNomesItens() {
    const { produtoPor } = useLoja();
    return (a) => {
        const l = (a.itens || []).filter(i => produtoPor(i.id)).map(i => `${i.qtd}× ${produtoPor(i.id).nome}`);
        return l.length ? l.join(', ') : 'Sem entrega mensal';
    };
}

// Os cartões dos planos (usados no Clube e em Minha conta)
export function Planos() {
    const { planos, usuario } = useLoja();
    const atual = usuario && usuario.assinatura && usuario.assinatura.ativa ? usuario.assinatura.plano : null;
    return (
        <div className="planos">
            {Object.entries(planos).map(([id, pl]) => (
                <div className={'plano' + (id === 'premium' ? ' destaque' : '')} key={id}>
                    {id === 'premium' && <span className="selo">Mais popular</span>}
                    <h3>{pl.nome}</h3>
                    <p className="preco">{dinheiro(pl.preco)}<small>/mês</small></p>
                    <ul>{pl.beneficios.map(b => <li key={b}>{b}</li>)}</ul>
                    {atual === id
                        ? <BotaoLink href="/clube/assinar" className="btn btn-borda btn-bloco">✓ Seu plano · alterar</BotaoLink>
                        : <BotaoLink href={`/clube/assinar?plano=${id}`} className={`btn ${id === 'premium' ? 'btn-azul' : 'btn-marrom'} btn-bloco`}>Assinar {pl.nome}</BotaoLink>}
                </div>
            ))}
        </div>
    );
}

export function Clube() {
    const { usuario, planos } = useLoja();
    const nomesItens = useNomesItens();
    const a = usuario && usuario.assinatura && usuario.assinatura.ativa ? usuario.assinatura : null;
    return (
        <div className="container">
            <section className="banner s2">
                <div className="banner-texto">
                    <span className="pilula">Assinatura com benefícios</span>
                    <h1>Clube AgroPet</h1>
                    <p>A ração do seu pet chega todo mês na sua casa, com desconto em todos os produtos e vantagens no Banho e Tosa.</p>
                </div>
                <VisualSlide i={1} emojis={['⭐', '📦', '🐶', '🐱']} />
            </section>
            {a && (
                <p className="nota azul" style={{ marginTop: 24 }}>
                    Você é assinante <b>{planos[a.plano].nome}</b> desde {dataBR(a.desde)} · {nomesItens(a)} · entrega: {a.diaEntrega ? `todo dia ${a.diaEntrega} · próxima em ${dataBR(proximaEntrega(a.diaEntrega))}` : 'Sem agendamento'}. <Link href="/conta/clube">Gerenciar</Link>
                </p>
            )}
            <section className="secao"><Planos /></section>
        </div>
    );
}

const racaoDeVerdade = (p) => p.ativo && p.estoque > 0 && ['Ração', 'Alimentação', 'Nutrição'].includes(p.categoria);

export function Assinar() {
    const { planos, produtos, animais, produtoPor, api, carregar, executar, aviso } = useLoja();
    const planoUrl = useSearchParams().get('plano');
    const usuario = usePrecisaLogin('/clube/assinar' + (planoUrl ? '?plano=' + planoUrl : ''), 'Entre ou crie uma conta para assinar');
    const router = useRouter();
    const atual = usuario && usuario.assinatura && usuario.assinatura.ativa ? usuario.assinatura : null;

    // Quem já assina começa com a assinatura atual preenchida
    const [f, setF] = useState(null);
    useEffect(() => {
        if (!usuario || f) return;
        setF(atual
            ? { plano: planoUrl && planos[planoUrl] ? planoUrl : atual.plano, animal: 'todos', entrega: !!atual.diaEntrega, itens: atual.itens.map(i => ({ ...i })), dia: atual.diaEntrega || 10, pagamento: atual.pagamento || 'Cartão de crédito' }
            : { plano: planoUrl && planos[planoUrl] ? planoUrl : 'premium', animal: 'todos', entrega: true, itens: [], dia: 10, pagamento: 'Cartão de crédito' });
    }, [usuario]); // eslint-disable-line react-hooks/exhaustive-deps
    const [enviando, setEnviando] = useState(false);
    if (!usuario || !f) return null;

    const mudar = (campos) => setF(x => ({ ...x, ...campos }));
    const pl = planos[f.plano];
    const precoClube = (p) => p.preco * (1 - pl.desconto / 100);
    const itens = f.entrega ? f.itens.filter(i => produtoPor(i.id)).map(i => ({ ...i, p: produtoPor(i.id), preco: precoClube(produtoPor(i.id)) })) : [];
    const racoes = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    const total = pl.preco + racoes;
    const todas = produtos.filter(racaoDeVerdade);
    const lista = todas.filter(r => f.animal === 'todos' || r.animal === f.animal);
    const animaisComRacao = animais.filter(a => todas.some(r => r.animal === a.id));
    const qtdDe = (id) => (f.itens.find(i => i.id === id) || {}).qtd || 0;
    const alternar = (id) => mudar({ itens: qtdDe(id) ? f.itens.filter(i => i.id !== id) : [...f.itens, { id, qtd: 1 }] });
    const mudarQtd = (id, delta) => mudar({ itens: f.itens.map(i => (i.id === id ? { ...i, qtd: i.qtd + delta } : i)).filter(i => i.qtd > 0) });
    const podeConfirmar = !f.entrega || itens.length > 0;
    let n = 1;

    function confirmar() {
        setEnviando(true);
        executar(async () => {
            await api('POST', '/assinatura', {
                plano: f.plano, pagamento: f.pagamento,
                diaEntrega: f.entrega ? f.dia : 0,
                itens: f.entrega ? f.itens.map(i => ({ produtoId: i.id, qtd: i.qtd })) : [],
            });
            await carregar();
            if (atual) { aviso('Assinatura atualizada ✓'); router.push('/conta/clube'); } else router.push('/clube/bem-vindo');
        }).finally(() => setEnviando(false));
    }

    return (
        <div className="container">
            <h1 className="titulo" style={{ marginTop: 34 }}>⭐ {atual ? 'Alterar assinatura' : 'Assinar o Clube AgroPet'}</h1>
            <div className="duas">
                <div className="etapas">
                    <div className="caixa">
                        <div className="passo"><b>{n++}</b><h2>Escolha o plano</h2></div>
                        <div className="escolha-plano">
                            {Object.entries(planos).map(([id, p]) => (
                                <button key={id} className={'plano-op' + (f.plano === id ? ' sel' : '')} onClick={() => mudar({ plano: id })}>
                                    <strong>{p.nome}</strong><span className="v">{dinheiro(p.preco)}<small style={{ fontWeight: 400, fontSize: '.9rem' }}>/mês</small></span>
                                    <span>{p.beneficios.join(' · ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="caixa">
                        <div className="passo"><b>{n++}</b><h2>Como você quer usar o Clube?</h2></div>
                        <div className="modo-entrega">
                            <button className={'plano-op' + (f.entrega ? ' sel' : '')} onClick={() => mudar({ entrega: true })}>
                                <strong>📦 Entrega todo mês</strong><span>Escolha as rações e o dia; elas chegam sozinhas, com desconto.</span>
                            </button>
                            <button className={'plano-op' + (!f.entrega ? ' sel' : '')} onClick={() => mudar({ entrega: false })}>
                                <strong>🛒 Sem agendamento</strong><span>Só os benefícios: desconto em tudo e você compra quando quiser.</span>
                            </button>
                        </div>
                    </div>

                    {f.entrega && (
                        <>
                            <div className="caixa">
                                <div className="passo"><b>{n++}</b><h2>Quais rações você quer receber?</h2></div>
                                <p style={{ color: 'var(--suave)', margin: '-6px 0 12px' }}>Pode escolher mais de uma e a quantidade de cada.</p>
                                <div className="chips">
                                    <button className={'chip' + (f.animal === 'todos' ? ' ativo' : '')} onClick={() => mudar({ animal: 'todos' })}><span className="ic cor-cinza">🐾</span>Todas</button>
                                    {animaisComRacao.map(a => (
                                        <button key={a.id} className={'chip' + (f.animal === a.id ? ' ativo' : '')} onClick={() => mudar({ animal: a.id })}><span className={`ic cor-${a.cor}`}>{a.icone}</span>{a.nome}</button>
                                    ))}
                                </div>
                                <div className="racao-grade">
                                    {lista.map(r => {
                                        const q = qtdDe(r.id);
                                        return (
                                            <div key={r.id} className={'racao-card' + (q ? ' sel' : '')} role="button" tabIndex={0}
                                                onClick={() => alternar(r.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(r.id); } }}>
                                                <span className="marca">{q ? '✓' : ''}</span>
                                                <span className={`ri cor-${r.cor}`}><ImgProduto p={r} /></span>
                                                <span>{r.nome}</span>
                                                <s>{dinheiro(r.preco)}</s>
                                                <span className="pr">{dinheiro(precoClube(r))}</span>
                                                {q > 0 && (
                                                    <div className="qtd" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => mudarQtd(r.id, -1)}>−</button><span>{q}</span><button onClick={() => mudarQtd(r.id, 1)}>+</button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {!lista.length && <p className="vazio" style={{ marginTop: 14 }}>Nenhuma ração disponível para esse bichinho.</p>}
                            </div>

                            <div className="caixa">
                                <div className="passo"><b>{n++}</b><h2>Dia da entrega</h2></div>
                                <div className="dias">
                                    {DIAS_ENTREGA.map(d => <button key={d} className={'opcao' + (f.dia === d ? ' sel' : '')} onClick={() => mudar({ dia: d })}>Dia {d}</button>)}
                                </div>
                                <p className="nota" style={{ marginTop: 14 }}>📦 A primeira entrega chega em <b>{dataBR(proximaEntrega(f.dia))}</b>. Depois, todo mês no mesmo dia.</p>
                            </div>
                        </>
                    )}

                    <div className="caixa">
                        <div className="passo"><b>{n++}</b><h2>Forma de pagamento</h2></div>
                        <div className="opcoes">
                            {['Cartão de crédito', 'Pix', 'Boleto'].map(m => <button key={m} className={'opcao' + (f.pagamento === m ? ' sel' : '')} onClick={() => mudar({ pagamento: m })}>{iconePagamento(m)} {m}</button>)}
                        </div>
                        <p className="nota" style={{ marginTop: 14 }}>Cobrança mensal simulada — nenhum valor é cobrado nesta demonstração.</p>
                    </div>
                </div>

                <div className="caixa lateral-resumo">
                    <h2>Resumo da assinatura</h2>
                    {f.entrega ? (itens.length ? (
                        <div className="lista-resumo">
                            {itens.map(i => (
                                <div className="resumo-produto" style={{ margin: 0 }} key={i.id}>
                                    <span className={`ri cor-${i.p.cor}`}><ImgProduto p={i.p} /></span>
                                    <div style={{ flex: 1 }}><strong>{i.qtd}× {i.p.nome}</strong><br /><small style={{ color: 'var(--suave)' }}>{dinheiro(i.preco)} cada</small></div>
                                    <b>{dinheiro(i.preco * i.qtd)}</b>
                                </div>
                            ))}
                        </div>
                    ) : <p className="nota" style={{ marginBottom: 12 }}>Escolha pelo menos uma ração para a entrega mensal.</p>)
                        : <p className="nota azul" style={{ marginBottom: 12 }}>🛒 Sem entrega agendada — você só paga o plano e tem desconto em todas as compras.</p>}
                    <div className="resumo-linha"><span>Plano {pl.nome}</span><span>{dinheiro(pl.preco)}</span></div>
                    {f.entrega && (
                        <>
                            <div className="resumo-linha"><span>Rações ({pl.desconto}% off)</span><span>{dinheiro(racoes)}</span></div>
                            <div className="resumo-linha"><span>Frete</span><span className="verde"><b>Grátis</b></span></div>
                            <div className="resumo-linha"><span>Entrega</span><span>todo dia {f.dia}</span></div>
                        </>
                    )}
                    <div className="resumo-linha total"><span>Por mês</span><span>{dinheiro(total)}</span></div>
                    <p className="nota azul" style={{ marginTop: 14 }}>⭐ Além disso: {pl.desconto}% de desconto em todas as compras{f.plano === 'premium' ? ', frete grátis sempre e 1 banho grátis por mês' : ''}.</p>
                    <button className="btn btn-azul btn-bloco" style={{ marginTop: 16 }} onClick={confirmar} disabled={!podeConfirmar || enviando}>{atual ? 'Salvar alterações' : 'Confirmar assinatura'}</button>
                    <Link href="/clube" className="btn btn-borda btn-bloco" style={{ marginTop: 10 }}>Voltar</Link>
                </div>
            </div>
        </div>
    );
}

export function AssinaturaOk() {
    const { usuario, planos } = useLoja();
    const nomesItens = useNomesItens();
    const router = useRouter();
    const a = usuario && usuario.assinatura && usuario.assinatura.ativa ? usuario.assinatura : null;
    useEffect(() => { if (!a) router.replace('/clube'); }, [a, router]);
    if (!a) return null;
    const pl = planos[a.plano];
    return (
        <div className="container sucesso">
            <div className="grande">⭐</div>
            <h1>Bem-vindo ao Clube {pl.nome}!</h1>
            <p>{a.diaEntrega ? <>Sua entrega ({nomesItens(a)}) chega em <b>{dataBR(proximaEntrega(a.diaEntrega))}</b>.</> : 'Você escolheu sem agendamento: compre quando quiser.'} A partir de agora você tem {pl.desconto}% de desconto em todos os produtos.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
                <Link href="/conta/clube" className="btn btn-azul">Ver minha assinatura</Link>
                <Link href="/" className="btn btn-borda">Ir às compras</Link>
            </div>
        </div>
    );
}
