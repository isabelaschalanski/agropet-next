'use client';
// Cartões de produto: o grande (páginas de animal e busca) e o pequeno (faixas da página inicial).
import { useLoja } from '../Provedor';
import { dinheiro } from '../../lib/front/util';
import { ImgProduto } from './Imagens';

export function CardProduto({ p }) {
    const { plano, planos, animalPor, adicionar } = useLoja();
    const esgotado = p.estoque <= 0;
    // preço de assinante: o do plano da pessoa, ou o melhor desconto do Clube para quem ainda não assina
    const desconto = plano ? plano.desconto : Math.max(...Object.values(planos).map(pl => pl.desconto));
    return (
        <article className="card">
            <div className={`card-img cor-${p.cor}`}>
                {p.selo && <span className="selo">{p.selo}</span>}
                {esgotado ? <span className="selo alerta">Esgotado</span> : p.estoque <= 5 && <span className="selo alerta">Últimas {p.estoque}</span>}
                <ImgProduto p={p} />
                <button className="mais" onClick={() => adicionar(p.id)} title={esgotado ? 'Esgotado' : 'Adicionar ao carrinho'} aria-label="Adicionar ao carrinho" disabled={esgotado}>+</button>
            </div>
            <div className="card-info">
                <span className="tag">{animalPor(p.animal).nome} · {p.categoria}</span>
                <h3>{p.nome}</h3>
                <span className="preco">{dinheiro(p.preco)}</span>
                <span className="preco-clube">{dinheiro(p.preco * (1 - desconto / 100))} {plano ? `no seu Clube ${plano.nome}` : 'para assinantes ⭐'}</span>
            </div>
        </article>
    );
}

export function CardMini({ p }) {
    const { adicionar, planos, plano } = useLoja();
    const desconto = plano ? plano.desconto : Math.max(...Object.values(planos).map(pl => pl.desconto));
    return (
        <article className="mini">
            <div className={`mini-img cor-${p.cor}`}>
                {p.selo && <span className="selo">{p.selo}</span>}
                <ImgProduto p={p} />
                <button className="mais" onClick={() => adicionar(p.id)} title="Adicionar ao carrinho" disabled={p.estoque <= 0}>+</button>
            </div>
            <div className="mini-info">
                <h3>{p.nome}</h3>
                <span className="preco">{dinheiro(p.preco)}</span>
                <span className="assin">{dinheiro(p.preco * (1 - desconto / 100))}<small>{plano ? `no seu Clube ${plano.nome}` : 'para assinantes ⭐'}</small></span>
            </div>
        </article>
    );
}

// Grade de cartões grandes
export function GradeProdutos({ lista, vazio }) {
    if (!lista.length) return vazio || <p className="vazio">Nenhum produto encontrado 🐾</p>;
    return <div className="grade">{lista.map(p => <CardProduto key={p.id} p={p} />)}</div>;
}
