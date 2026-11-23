'use client';
// Resultado da busca do topo (/busca?q=racao). Não diferencia acento nem maiúscula.
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLoja } from '../Provedor';
import { semAcento } from '../../lib/front/util';
import { GradeProdutos } from '../loja/Cards';

export default function Busca() {
    const { produtos, animalPor, busca, setBusca } = useLoja();
    const q = useSearchParams().get('q') || '';
    // quem abre o link direto (/busca?q=...) vê o texto na caixa de busca
    useEffect(() => { if (q && !busca) setBusca(q); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

    const termo = semAcento(q.trim());
    const lista = termo ? produtos.filter(p => p.ativo && [p.nome, p.categoria, animalPor(p.animal).nome].some(t => semAcento(t).includes(termo))) : [];

    return (
        <div className="container">
            <nav className="migalha"><Link href="/" onClick={() => setBusca('')}>Início</Link> › Busca</nav>
            <div className="linha-titulo" style={{ marginTop: 14 }}>
                <h1 className="titulo">{q.trim() ? `Resultados para "${q.trim()}"` : 'Buscar produtos'}</h1>
                {q.trim() && <span className="tag">{lista.length} {lista.length === 1 ? 'produto' : 'produtos'}</span>}
            </div>
            {q.trim() ? <GradeProdutos lista={lista} /> : <p className="vazio">Digite o que você procura na caixa de busca lá em cima 🔎</p>}
        </div>
    );
}
