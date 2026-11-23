'use client';
// Moldura do gerenciamento: menu lateral (vira gaveta no celular), cabeçalho e a dica dos gráficos.
// Só o admin entra; os outros vão para /entrar.
import { Fragment, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoja } from '../Provedor';
import { hojeISO } from '../../lib/regras';
import { ABAS_ADMIN, GRUPOS_ADMIN } from './comum';

// desenho discreto no pé do menu (cachorro e gato em traço)
function IlustracaoPets() {
    return (
        <svg className="adm-ilustra" viewBox="0 0 200 130" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M30 120 C26 92 34 70 58 66 C82 70 90 92 86 120" />
            <path d="M38 52 C30 40 32 22 46 18 C52 28 50 40 48 48" /><path d="M78 52 C86 40 84 22 70 18 C64 28 66 40 68 48" />
            <path d="M40 54 C40 38 76 38 76 54 C76 70 66 78 58 78 C50 78 40 70 40 54Z" />
            <circle cx="51" cy="54" r="1.6" fill="currentColor" /><circle cx="65" cy="54" r="1.6" fill="currentColor" />
            <path d="M55 63 L58 66 L61 63" /><path d="M58 66 L58 69 M54 71 C56 73 60 73 62 71" />
            <path d="M110 120 C106 98 112 84 132 82 C152 84 158 98 154 120" />
            <path d="M114 62 L112 40 L126 52" /><path d="M150 62 L152 40 L138 52" />
            <path d="M114 64 C114 50 150 50 150 64 C150 78 142 86 132 86 C122 86 114 78 114 64Z" />
            <path d="M124 64 C126 62 128 62 129 64" /><path d="M135 64 C136 62 138 62 140 64" />
            <path d="M130 71 L132 73 L134 71" /><path d="M118 72 L104 70 M118 76 L104 78 M146 72 L160 70 M146 76 L160 78" />
            <path d="M154 112 C172 112 178 98 170 90" />
        </svg>
    );
}

export default function AdminShell({ children }) {
    const { admin, pedidos, agendamentos, sair, fecharJanela } = useLoja();
    const router = useRouter();
    const caminho = usePathname();
    const [menuAberto, setMenuAberto] = useState(false);
    const saindo = useRef(false);
    const tipRef = useRef(null);

    // Fora do admin: vai para o login
    useEffect(() => { if (!admin && !saindo.current) router.replace('/entrar?voltar=/admin'); }, [admin, router]);

    // O CSS do gerenciamento usa body.modo-admin
    useEffect(() => {
        document.body.classList.add('modo-admin');
        return () => document.body.classList.remove('modo-admin');
    }, []);

    // Trocou de tela: fecha o menu do celular e janelas abertas
    useEffect(() => { setMenuAberto(false); fecharJanela(); }, [caminho, fecharJanela]);

    // Dica flutuante dos gráficos (qualquer elemento com data-tip)
    useEffect(() => {
        const mover = (e) => {
            const tip = tipRef.current;
            if (!tip) return;
            const alvo = e.target.closest && e.target.closest('[data-tip]');
            if (!alvo) { tip.classList.remove('on'); return; }
            tip.innerHTML = alvo.dataset.tip;
            tip.classList.add('on');
            const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
            tip.style.left = x + 'px'; tip.style.top = (e.clientY - tip.offsetHeight - 12) + 'px';
        };
        document.addEventListener('mousemove', mover);
        return () => document.removeEventListener('mousemove', mover);
    }, []);

    if (!admin) return null;

    const badges = {
        pedidos: pedidos.filter(p => p.status === 'Recebido').length,
        agendamentos: agendamentos.filter(a => a.status === 'Agendado' && a.data >= hojeISO()).length,
    };
    const aba = ABAS_ADMIN.find(x => x[4] === caminho) || ABAS_ADMIN[0];
    const ehPainel = aba[0] === 'painel';
    const irPara = (href) => { router.push(href); window.scrollTo(0, 0); };
    const sairDaConta = async () => { saindo.current = true; await sair(); router.replace('/'); };

    return (
        <>
            <div className={'adm' + (menuAberto ? ' menu-aberto' : '')}>
                <div className="adm-fundo" onClick={() => setMenuAberto(false)} />
                <aside className="adm-lat">
                    <div className="adm-logo"><span className="pata">🐾</span>AgroPet<small>Gerenciamento</small></div>
                    {GRUPOS_ADMIN.map(([grupo, abas]) => (
                        <Fragment key={grupo}>
                            <div className="adm-grupo">{grupo}</div>
                            {abas.map(([id, ic, nome, , href]) => (
                                <button key={id} className={aba[0] === id ? 'ativo' : ''} onClick={() => irPara(href)}>
                                    <span className="ic">{ic}</span>{nome}{badges[id] ? <span className="adm-badge">{badges[id]}</span> : null}
                                </button>
                            ))}
                        </Fragment>
                    ))}
                    <div className="adm-espaco" />
                    <IlustracaoPets />
                </aside>
                <div className="adm-corpo">
                    <header className="adm-topo">
                        <div className="adm-titulo">
                            <button className="adm-menu-btn" onClick={() => setMenuAberto(v => !v)} aria-label="Abrir menu">☰</button>
                            <div className="adm-ola">
                                <span className="pata">{ehPainel ? '🐾' : aba[1]}</span>
                                <div><h1>{ehPainel ? 'Bem-vindo ao seu painel!' : aba[2]}</h1><small>{aba[3]}</small></div>
                            </div>
                        </div>
                        <div className="adm-user"><span>👤</span>admin<button className="btn btn-musgo" onClick={sairDaConta}>↩ Sair</button></div>
                    </header>
                    <section className="adm-conteudo">{children}</section>
                </div>
            </div>
            <div className="adm-tip" ref={tipRef} />
        </>
    );
}
