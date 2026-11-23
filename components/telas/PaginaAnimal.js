'use client';
// Página de um animal (/loja/caes) ou de "Outros Pets" (/loja/outros-pets), com filtros ao lado.
// ?categoria=Ração já abre filtrado.
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLoja } from '../Provedor';
import { dinheiro, FAIXAS, ORDENS } from '../../lib/front/util';
import { GradeProdutos } from '../loja/Cards';
import { IconeAnimal } from '../loja/Imagens';

const novoFiltro = (categoria) => ({ categorias: categoria ? [categoria] : [], pets: [], faixa: null, min: '', max: '', estoque: false, ofertas: false, ordem: 'relevancia' });

const ORDENAR = {
    relevancia: (a, b) => (!!b.selo - !!a.selo) || ((b.estoque > 0) - (a.estoque > 0)) || a.id - b.id,
    menor: (a, b) => a.preco - b.preco, maior: (a, b) => b.preco - a.preco,
    az: (a, b) => a.nome.localeCompare(b.nome), za: (a, b) => b.nome.localeCompare(a.nome), novos: (a, b) => b.id - a.id,
};

export default function PaginaAnimal({ id }) {
    const { animais, produtos, animalPor } = useLoja();
    const categoria = useSearchParams().get('categoria');
    const [f, setF] = useState(() => novoFiltro(categoria));
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    // trocou de animal ou de categoria pelo menu: começa os filtros de novo
    useEffect(() => { setF(novoFiltro(categoria)); }, [id, categoria]);

    const outros = id === 'outros-pets';
    const lista0 = outros ? animais.filter(a => a.outro) : animais.filter(a => a.id === id);
    const existe = lista0.length > 0;
    const ids = lista0.map(a => a.id);
    const a0 = outros ? { nome: 'Outros Pets', icone: '🐾', cor: 'roxo' } : lista0[0];
    const base = useMemo(() => produtos.filter(p => p.ativo && ids.includes(p.animal)), [produtos, ids.join()]); // eslint-disable-line react-hooks/exhaustive-deps
    const grupos = [...new Set(lista0.flatMap(a => a.grupos.map(g => g.t)))];

    if (!existe) {
        return <div className="container sucesso"><div className="grande">🐾</div><h1>Página não encontrada</h1><Link href="/" className="btn btn-azul" style={{ marginTop: 20 }}>Voltar à loja</Link></div>;
    }

    let lista = base.filter(p =>
        (!f.pets.length || f.pets.includes(p.animal))
        && (!f.categorias.length || f.categorias.includes(p.categoria))
        && (!f.estoque || p.estoque > 0)
        && (!f.ofertas || p.selo));
    if (f.faixa) { const [, mn, mx] = FAIXAS[f.faixa]; lista = lista.filter(p => p.preco >= mn && p.preco < mx); }
    if (f.min !== '') lista = lista.filter(p => p.preco >= +f.min);
    if (f.max !== '') lista = lista.filter(p => p.preco <= +f.max);
    lista = [...lista].sort(ORDENAR[f.ordem]);

    const mudar = (campos) => setF(atual => ({ ...atual, ...campos }));
    const alterna = (lista, v) => (lista.includes(v) ? lista.filter(x => x !== v) : [...lista, v]);
    const limpar = () => setF(atual => ({ ...novoFiltro(null), ordem: atual.ordem }));
    const contar = (fn) => base.filter(fn).length;

    // filtros ativos (as "pílulas" com ✕)
    const pills = [
        ...f.pets.map(v => [`${animalPor(v).icone} ${animalPor(v).nome}`, () => mudar({ pets: f.pets.filter(x => x !== v) })]),
        ...f.categorias.map(v => [v, () => mudar({ categorias: f.categorias.filter(x => x !== v) })]),
        ...(f.faixa ? [[FAIXAS[f.faixa][0], () => mudar({ faixa: null })]] : []),
        ...(f.min !== '' || f.max !== '' ? [[`${f.min !== '' ? 'de ' + dinheiro(+f.min) : ''} ${f.max !== '' ? 'até ' + dinheiro(+f.max) : ''}`.trim(), () => mudar({ min: '', max: '' })]] : []),
        ...(f.estoque ? [['Em estoque', () => mudar({ estoque: false })]] : []),
        ...(f.ofertas ? [['Ofertas e novidades', () => mudar({ ofertas: false })]] : []),
    ];

    return (
        <div className="container">
            <nav className="migalha">
                <Link href="/">Início</Link> › {!outros && lista0[0].outro && <><Link href="/loja/outros-pets">Outros Pets</Link> › </>}<b>{a0.nome}</b>
            </nav>

            <section className={`cab-animal cor-${a0.cor}`}>
                <span className="cab-ic">{outros ? a0.icone : <IconeAnimal animal={a0} />}</span>
                <div>
                    <h1>{a0.nome}</h1>
                    <p>{base.length} produtos {outros ? 'para pássaros, peixes e roedores' : 'com entrega rápida e desconto para assinantes do Clube'}.</p>
                </div>
            </section>

            <div className="atalhos">
                <button className={'atalho' + (!f.categorias.length ? ' ativo' : '')} onClick={() => mudar({ categorias: [] })}>Tudo</button>
                {grupos.map(g => <button key={g} className={'atalho' + (f.categorias.length === 1 && f.categorias[0] === g ? ' ativo' : '')} onClick={() => mudar({ categorias: [g] })}>{g}</button>)}
            </div>

            <div className="loja-layout">
                <aside className={'caixa filtros' + (filtrosAbertos ? ' aberto' : '')}>
                    <div className="filtros-topo"><h3>Filtrar</h3>{pills.length > 0 && <button className="link-azul" onClick={limpar}>Limpar filtros</button>}</div>
                    {outros && (
                        <div className="fgrupo"><h4>Pet</h4>
                            {lista0.map(a => (
                                <label className="fop" key={a.id}><input type="checkbox" checked={f.pets.includes(a.id)} onChange={() => mudar({ pets: alterna(f.pets, a.id) })} />{a.icone} {a.nome}<small>{contar(p => p.animal === a.id)}</small></label>
                            ))}
                        </div>
                    )}
                    <div className="fgrupo"><h4>Categorias</h4>
                        {grupos.map(g => (
                            <label className="fop" key={g}><input type="checkbox" checked={f.categorias.includes(g)} onChange={() => mudar({ categorias: alterna(f.categorias, g) })} />{g}<small>{contar(p => p.categoria === g)}</small></label>
                        ))}
                    </div>
                    <div className="fgrupo"><h4>Faixa de preço</h4>
                        {Object.entries(FAIXAS).map(([k, [nome, mn, mx]]) => (
                            <label className="fop" key={k}><input type="radio" name="faixa" checked={f.faixa === k} onChange={() => mudar({ faixa: k, min: '', max: '' })} />{nome}<small>{contar(p => p.preco >= mn && p.preco < mx)}</small></label>
                        ))}
                        <div className="preco-livre">
                            <input type="number" min="0" placeholder="De R$" value={f.min} onChange={(e) => mudar({ min: e.target.value, faixa: null })} />
                            <input type="number" min="0" placeholder="Até R$" value={f.max} onChange={(e) => mudar({ max: e.target.value, faixa: null })} />
                        </div>
                    </div>
                    <div className="fgrupo"><h4>Disponibilidade</h4>
                        <label className="fop"><input type="checkbox" checked={f.estoque} onChange={(e) => mudar({ estoque: e.target.checked })} />Somente em estoque<small>{contar(p => p.estoque > 0)}</small></label>
                    </div>
                    <div className="fgrupo"><h4>Promoções</h4>
                        <label className="fop"><input type="checkbox" checked={f.ofertas} onChange={(e) => mudar({ ofertas: e.target.checked })} />Ofertas e novidades<small>{contar(p => p.selo)}</small></label>
                    </div>
                </aside>

                <section>
                    <div className="barra-res">
                        <div className="pills">
                            <button className="btn btn-borda btn-peq btn-filtros" onClick={() => setFiltrosAbertos(v => !v)}>⚙️ Filtros{pills.length ? ` (${pills.length})` : ''}</button>
                            <b>{lista.length} {lista.length === 1 ? 'produto' : 'produtos'}</b>
                            {pills.map(([t, tirar]) => <span className="filtro-ativo" key={t}>{t} <button onClick={tirar} title="Remover">✕</button></span>)}
                        </div>
                        <label className="ordem" style={{ flexDirection: 'row', fontWeight: 400 }}>Ordenar por:
                            <select value={f.ordem} onChange={(e) => mudar({ ordem: e.target.value })}>
                                {Object.entries(ORDENS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}
                            </select>
                        </label>
                    </div>
                    <GradeProdutos lista={lista} vazio={
                        <div className="vazio">Nenhum produto com esses filtros 🐾<br /><button className="btn btn-azul btn-peq" style={{ marginTop: 14 }} onClick={limpar}>Limpar filtros</button></div>
                    } />
                </section>
            </div>
        </div>
    );
}
