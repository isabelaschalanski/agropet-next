'use client';
// Página inicial: banners, benefícios, produtos recomendados e atalhos por animal.
import Link from 'next/link';
import BotaoLink from '../loja/BotaoLink';
import { useLoja } from '../Provedor';
import { dinheiro } from '../../lib/front/util';
import { CardMini } from '../loja/Cards';
import { ImgProduto, IconeAnimal, VisualSlide } from '../loja/Imagens';
import { Carrossel, FaixaRolagem, VerTudo } from '../loja/Faixas';

// Destaques: produtos com selo + o primeiro de cada animal
function destaques(produtos, animais) {
    const ativos = produtos.filter(p => p.ativo);
    const lista = ativos.filter(p => p.selo);
    animais.forEach(a => { const p = ativos.find(x => x.animal === a.id && !lista.includes(x)); if (p) lista.push(p); });
    return lista.slice(0, 15);
}

function CirculoCategoria({ animal, grupo }) {
    const { produtos } = useLoja();
    const p = produtos.find(x => x.ativo && x.animal === animal.id && x.categoria === grupo);
    return (
        <BotaoLink href={`/loja/${animal.id}?categoria=${encodeURIComponent(grupo)}`} className="circulo">
            <span className={`bola cor-${p ? p.cor : animal.cor}`}>{p ? <ImgProduto p={p} /> : <IconeAnimal animal={animal} />}</span><span>{grupo}</span>
        </BotaoLink>
    );
}

function CirculoAnimal({ animal }) {
    return (
        <BotaoLink href={`/loja/${animal.id}`} className="circulo">
            <span className={`bola cor-${animal.cor}`}><IconeAnimal animal={animal} /></span><span>{animal.nome}</span>
        </BotaoLink>
    );
}

export default function Inicio() {
    const { site, produtos, animais, animalPor, planos } = useLoja();
    const cao = animalPor('caes'), gato = animalPor('gatos');
    const rolarProdutos = (e) => { e.preventDefault(); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

    const slides = [
        <div className="slide s1" key="s1">
            <div><span className="pilula">{site.pilula}</span><h1>{site.titulo}</h1><p>{site.texto}</p>
                <a href="#produtos" className="btn btn-azul" onClick={rolarProdutos}>{site.botao}</a></div>
            <VisualSlide i={0} emojis={['🐶', '🐱', '🐄', '🐴']} />
        </div>,
        <div className="slide s2" key="s2">
            <div><span className="pilula">Clube AgroPet</span><h2>Até 10% off em tudo, todo mês</h2><p>Assine, receba a ração em casa no dia que escolher e economize em todas as compras.</p>
                <Link href="/clube" className="btn btn-azul">Conhecer o Clube</Link></div>
            <VisualSlide i={1} emojis={['⭐', '📦', '🐶', '🐱']} />
        </div>,
        <div className="slide s3" key="s3">
            <div><span className="pilula">Banho e Tosa</span><h2>Seu pet cheiroso, com hora marcada</h2><p>Agende online em poucos cliques. Assinantes Premium ganham 1 banho por mês.</p>
                <Link href="/banho-e-tosa" className="btn btn-marrom">Agendar agora</Link></div>
            <VisualSlide i={2} emojis={['🐩', '🛁', '✂️', '🐈']} />
        </div>,
    ];

    return (
        <div className="container">
            <Carrossel slides={slides} />

            <section className="beneficios">
                <div className="beneficio"><span className="ic">🚚</span><div><strong>Entrega rápida</strong><small>Em Santo Ângelo e região</small></div></div>
                <div className="beneficio"><span className="ic">📦</span><div><strong>Frete grátis</strong><small>Acima de {dinheiro(site.freteGratisAcima)}</small></div></div>
                <div className="beneficio"><span className="ic">💳</span><div><strong>Até 3x sem juros</strong><small>No cartão de crédito</small></div></div>
                <div className="beneficio"><span className="ic">⭐</span><div><strong>Clube AgroPet</strong><small>Até 10% off para assinantes</small></div></div>
            </section>

            <FaixaRolagem id="produtos" titulo="Produtos recomendados">
                {destaques(produtos, animais).map(p => <CardMini key={p.id} p={p} />)}
            </FaixaRolagem>
            <FaixaRolagem titulo="Tudo para cachorros" link={<VerTudo href="/loja/caes" />}>
                {cao.grupos.map(g => <CirculoCategoria key={g.t} animal={cao} grupo={g.t} />)}
            </FaixaRolagem>
            <FaixaRolagem titulo="Tudo para gatos" link={<VerTudo href="/loja/gatos" />}>
                {gato.grupos.map(g => <CirculoCategoria key={g.t} animal={gato} grupo={g.t} />)}
            </FaixaRolagem>
            <FaixaRolagem titulo="Tudo para o campo">
                {animais.filter(a => a.agro).map(a => <CirculoAnimal key={a.id} animal={a} />)}
            </FaixaRolagem>
            <FaixaRolagem titulo="Outros pets" link={<VerTudo href="/loja/outros-pets" />}>
                {animais.filter(a => a.outro).map(a => <CirculoAnimal key={a.id} animal={a} />)}
            </FaixaRolagem>

            <section className="faixa">
                <div className="faixa-topo"><h2>Cuidados essenciais</h2></div>
                <div className="cuidados">
                    <div className="promo promo-banho">
                        <div>
                            <h3>Banho & Tosa</h3>
                            <p>Banho, tosa higiênica ou completa. Escolha o dia e o horário pela internet.</p>
                            <span className="cupom">Premium: 1 banho grátis/mês</span><br />
                            <Link href="/banho-e-tosa/agendar" className="btn">Agendar horário</Link>
                        </div>
                        <span className="grande">🛁</span>
                    </div>
                    <div className="promo promo-clube">
                        <div>
                            <h3>Clube AgroPet</h3>
                            <p>A ração chega em casa todo mês e você ganha desconto em todas as compras.</p>
                            <span className="cupom">A partir de {dinheiro(planos.basico.preco)}/mês</span><br />
                            <Link href="/clube" className="btn">Quero assinar</Link>
                        </div>
                        <span className="grande">⭐</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
