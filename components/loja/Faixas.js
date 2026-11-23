'use client';
// Faixa com rolagem para o lado (página inicial) e o carrossel de banners.
import BotaoLink from './BotaoLink';
import { useEffect, useRef, useState } from 'react';

export function FaixaRolagem({ titulo, link, children, id }) {
    const ref = useRef(null);
    const [sobra, setSobra] = useState(false);
    useEffect(() => {
        const medir = () => { const r = ref.current; if (r) setSobra(r.scrollWidth > r.clientWidth + 4); };
        medir();
        window.addEventListener('resize', medir);
        return () => window.removeEventListener('resize', medir);
    }, [children]);
    const rolar = (dir) => { const r = ref.current; r.scrollBy({ left: dir * r.clientWidth * 0.8, behavior: 'smooth' }); };
    return (
        <section className="faixa" id={id}>
            <div className="faixa-topo"><h2>{titulo}</h2>{link}</div>
            <div className="rolagem-wrap">
                <button className="seta-rol esq" onClick={() => rolar(-1)} aria-label="Voltar" style={{ visibility: sobra ? 'visible' : 'hidden' }}>‹</button>
                <div className="rolagem" ref={ref}>{children}</div>
                <button className="seta-rol dir" onClick={() => rolar(1)} aria-label="Avançar" style={{ visibility: sobra ? 'visible' : 'hidden' }}>›</button>
            </div>
        </section>
    );
}

// Carrossel: passa sozinho a cada 6 segundos; as setas e as bolinhas mudam o banner
export function Carrossel({ slides }) {
    const [atual, setAtual] = useState(0);
    const [volta, setVolta] = useState(0); // muda quando a pessoa clica, para reiniciar o tempo
    const total = slides.length;
    useEffect(() => {
        const t = setInterval(() => setAtual(a => (a + 1) % total), 6000);
        return () => clearInterval(t);
    }, [total, volta]);
    const ir = (n) => { setAtual((n + total) % total); setVolta(v => v + 1); };
    return (
        <section className="slider">
            <button className="seta-slide esq" onClick={() => ir(atual - 1)} aria-label="Anterior">‹</button>
            <div className="slides" style={{ transform: `translateX(-${atual * 100}%)` }}>{slides}</div>
            <button className="seta-slide dir" onClick={() => ir(atual + 1)} aria-label="Próximo">›</button>
            <div className="pontos">
                {slides.map((_, i) => <button key={i} className={'ponto' + (i === atual ? ' ativo' : '')} onClick={() => ir(i)} aria-label={`Banner ${i + 1}`} />)}
            </div>
        </section>
    );
}

// Link "Ver tudo →" usado nas faixas
export const VerTudo = ({ href }) => <BotaoLink href={href} className="link-azul">Ver tudo →</BotaoLink>;
