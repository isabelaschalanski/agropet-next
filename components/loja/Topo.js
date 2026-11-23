'use client';
// Topo do site: logo, busca, conta, carrinho e o menu de animais.
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoja } from '../Provedor';

const linkAnimal = (id, categoria) => `/loja/${id}${categoria ? '?categoria=' + encodeURIComponent(categoria) : ''}`;
const ehCelular = () => typeof window !== 'undefined' && window.innerWidth <= 720;

export default function Topo() {
    const { animais, usuario, admin, qtdCarrinho, busca, setBusca, sair } = useLoja();
    const router = useRouter();
    const caminho = usePathname();
    const [menuAberto, setMenuAberto] = useState(false);      // menu inteiro (celular)
    const [categoriaAberta, setCategoriaAberta] = useState(null); // painel de um animal (celular)
    const [grupoAberto, setGrupoAberto] = useState(null);         // subpainel (celular)
    const [contaAberta, setContaAberta] = useState(false);
    const topoRef = useRef(null);

    // fecha os menus ao mudar de página ou clicar fora
    useEffect(() => { setMenuAberto(false); setCategoriaAberta(null); setGrupoAberto(null); setContaAberta(false); }, [caminho]);
    useEffect(() => {
        const fora = (e) => {
            if (!e.target.closest('.categoria')) { setCategoriaAberta(null); setGrupoAberto(null); }
            if (!e.target.closest('.conta-drop')) setContaAberta(false);
        };
        document.addEventListener('click', fora);
        return () => document.removeEventListener('click', fora);
    }, []);

    const animalAtual = caminho.startsWith('/loja/') ? decodeURIComponent(caminho.split('/')[2] || '') : '';
    const atualEhOutro = !!(animais.find(a => a.id === animalAtual) || {}).outro;

    function irPara(url) {
        setCategoriaAberta(null); setGrupoAberto(null); setMenuAberto(false);
        router.push(url);
    }
    // no computador, clicar no animal abre a página; no celular, abre as opções
    function clicarCategoria(id) {
        if (!ehCelular()) { irPara(linkAnimal(id)); return; }
        setGrupoAberto(null);
        setCategoriaAberta(categoriaAberta === id ? null : id);
    }
    // no celular, tocar no grupo abre as opções em vez de filtrar direto
    function clicarGrupo(chave, url) {
        if (ehCelular() && grupoAberto !== chave) { setGrupoAberto(chave); return; }
        irPara(url);
    }
    function digitar(v) {
        setBusca(v);
        if (v.trim()) router.replace('/busca?q=' + encodeURIComponent(v));
        else if (caminho === '/busca') router.replace('/');
    }

    const principais = animais.filter(a => !a.outro);
    const outros = animais.filter(a => a.outro);

    return (
        <header className="topo" ref={topoRef}>
            <div className="container topo-linha">
                <Link href="/" className="logo" onClick={() => setBusca('')}>AgroPet</Link>
                <div className="busca">
                    <span>🔍</span>
                    <input type="text" placeholder="O que seu pet precisa hoje?" autoComplete="off" value={busca} onChange={(e) => digitar(e.target.value)} />
                </div>
                <div className="topo-acoes">
                    {!usuario && !admin ? (
                        <Link href="/entrar" className="btn btn-borda">Entrar</Link>
                    ) : (
                        <div className={'conta-drop' + (contaAberta ? ' aberto' : '')}>
                            <button className="btn btn-borda" onClick={() => setContaAberta(!contaAberta)}>
                                {admin ? '⚙️ Admin' : <>👤 <span className="btn-entrar-txt">{usuario.nome.split(' ')[0]}</span></>} ▾
                            </button>
                            <div className="drop">
                                <div className="quem"><strong>{admin ? 'Administrador' : usuario.nome}</strong><small>{admin ? 'usuário: admin' : usuario.email}</small></div>
                                {admin ? <Link href="/admin">⚙️ Gerenciamento</Link> : (
                                    <>
                                        <Link href="/conta/pedidos">📦 Meus pedidos</Link>
                                        <Link href="/conta/agendamentos">🛁 Meus agendamentos</Link>
                                        <Link href="/conta/pets">🐾 Meus pets</Link>
                                        <Link href="/conta/clube">⭐ Minha assinatura</Link>
                                        <Link href="/conta/dados">👤 Meus dados</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <Link href="/carrinho" className="btn btn-azul">
                        🛒 <span className="btn-entrar-txt">Carrinho</span> <span className="contador">{qtdCarrinho}</span>
                    </Link>
                    {usuario && (
                        <button className="btn btn-borda" onClick={async () => { await sair(); router.push('/'); }} title="Sair da conta">
                            ↩ <span className="btn-entrar-txt">Sair</span>
                        </button>
                    )}
                    <button className="menu-btn" aria-label="Menu" onClick={() => setMenuAberto(!menuAberto)}>☰</button>
                </div>
            </div>

            <nav className={'barra' + (menuAberto ? ' aberta' : '')}>
                <ul className="container categorias">
                    {principais.map(a => (
                        <li key={a.id} className={'categoria' + (categoriaAberta === a.id ? ' aberta' : '')}>
                            <button type="button" className={'cat-btn' + (animalAtual === a.id ? ' ativo' : '')} onClick={() => clicarCategoria(a.id)}>
                                <span className="cat-icone">{a.icone}</span>{a.curto || a.nome}
                            </button>
                            <div className="painel">
                                <ul className="painel-lista">
                                    {a.grupos.map(g => {
                                        const chave = a.id + '|' + g.t;
                                        return (
                                            <li key={g.t} className={'painel-item' + (grupoAberto === chave ? ' aberto' : '')}>
                                                <button type="button" className="painel-item-btn" onClick={() => clicarGrupo(chave, linkAnimal(a.id, g.t))}>
                                                    {g.t} <span className="seta">›</span>
                                                </button>
                                                <div className="subpainel">
                                                    <h4>{g.t}</h4>
                                                    {g.i.map(i => <button key={i} className="link" onClick={() => irPara(linkAnimal(a.id, g.t))}>{i}</button>)}
                                                    <button className="link" style={{ fontWeight: 600, marginTop: 6 }} onClick={() => irPara(linkAnimal(a.id, g.t))}>Ver todos →</button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <button className="ver-tudo" onClick={() => irPara(linkAnimal(a.id))}>Ver tudo de {a.nome} →</button>
                            </div>
                        </li>
                    ))}

                    <li className={'categoria' + (categoriaAberta === 'outros-pets' ? ' aberta' : '')}>
                        <button type="button" className={'cat-btn' + (animalAtual === 'outros-pets' || atualEhOutro ? ' ativo' : '')} onClick={() => clicarCategoria('outros-pets')}>
                            <span className="cat-icone">🐾</span>Outros Pets
                        </button>
                        <div className="painel">
                            <ul className="painel-lista">
                                {outros.map(a => (
                                    <li key={a.id} className={'painel-item' + (grupoAberto === a.id ? ' aberto' : '')}>
                                        <button type="button" className="painel-item-btn" onClick={() => clicarGrupo(a.id, linkAnimal(a.id))}>
                                            <span>{a.icone}&nbsp; {a.nome}</span> <span className="seta">›</span>
                                        </button>
                                        <div className="subpainel">
                                            <h4>{a.icone} {a.nome}</h4>
                                            {a.grupos.map(g => <button key={g.t} className="link" onClick={() => irPara(linkAnimal(a.id, g.t))}>{g.t}</button>)}
                                            <button className="link" style={{ fontWeight: 600, marginTop: 6 }} onClick={() => irPara(linkAnimal(a.id))}>Ver tudo de {a.nome} →</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button className="ver-tudo" onClick={() => irPara(linkAnimal('outros-pets'))}>Ver todos os Outros Pets →</button>
                        </div>
                    </li>

                    <li className="cat-espaco"></li>
                    <li><Link href="/clube" className="cat-link">⭐ Clube</Link></li>
                    <li><Link href="/banho-e-tosa" className="cat-link">🛁 Banho e Tosa</Link></li>
                </ul>
            </nav>
        </header>
    );
}
