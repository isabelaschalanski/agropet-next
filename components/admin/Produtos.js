'use client';
// Produtos do gerenciamento (/admin/produtos): filtros, seleção em massa, páginas e o formulário.
// /admin/produtos?filtro=estoque já abre mostrando o estoque baixo.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLoja } from '../Provedor';
import { ImgProduto } from '../loja/Imagens';
import { Badge, BadgeEstoque, Paginacao, POR_PAGINA } from './comum';
import { CORES, dinheiro, reduzirImagem, semAcento } from '../../lib/front/util';

export default function Produtos() {
    const { produtos, animais, animalPor, produtoPor, api, executar, sincronizar, aviso, confirmar, abrirJanela } = useLoja();
    const filtroUrl = useSearchParams().get('filtro');
    const [f, setF] = useState({ busca: '', animal: '', categoria: '', status: filtroUrl === 'estoque' ? 'estoque' : '' });
    const [pagina, setPagina] = useState(1);
    const [sel, setSel] = useState(() => new Set());
    useEffect(() => { if (filtroUrl === 'estoque') setF(x => ({ ...x, status: 'estoque' })); }, [filtroUrl]);

    const b = semAcento(f.busca);
    const lista = produtos.filter(p =>
        (!b || semAcento(p.nome).includes(b) || semAcento(p.categoria).includes(b)) &&
        (!f.animal || p.animal === f.animal) &&
        (!f.categoria || p.categoria === f.categoria) &&
        (!f.status || (f.status === 'visiveis' ? p.ativo : f.status === 'escondidos' ? !p.ativo : p.estoque <= 10)));
    const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    const atual = Math.min(pagina, paginas);
    const pag = lista.slice((atual - 1) * POR_PAGINA, atual * POR_PAGINA);
    const cats = [...new Set(produtos.filter(p => !f.animal || p.animal === f.animal).map(p => p.categoria))].sort();
    const marcados = [...sel].filter(id => produtoPor(id)); // ignora os que já foram excluídos
    const todosMarcados = pag.length > 0 && pag.every(p => sel.has(p.id));

    const mudar = (campos) => { setF(x => ({ ...x, ...campos })); setPagina(1); };
    const marcar = (id, sim) => setSel(s => { const n = new Set(s); if (sim) n.add(id); else n.delete(id); return n; });
    const marcarPagina = (sim) => setSel(s => { const n = new Set(s); pag.forEach(p => (sim ? n.add(p.id) : n.delete(p.id))); return n; });
    const recarregar = async (msg) => { await sincronizar(); if (msg) aviso(msg); };

    const lote = (acao) => {
        const ids = marcados;
        const fazer = () => executar(async () => {
            const r = await api('POST', '/produtos/lote', { ids, acao });
            setSel(new Set());
            const plural = r.quantidade > 1 ? 's' : '';
            await recarregar(`${r.quantidade} produto${plural} ${{ excluir: 'excluído', esconder: 'escondido', mostrar: 'visível' }[acao]}${plural}`);
        });
        if (acao === 'excluir') confirmar(`Excluir ${ids.length} produto${ids.length > 1 ? 's' : ''}? Não dá para desfazer.`, fazer); else fazer();
    };
    const alternarAtivo = (p) => executar(async () => { await api('PUT', '/produtos/' + p.id, { ativo: !p.ativo }); await recarregar(!p.ativo ? 'Produto visível na loja' : 'Produto escondido da loja'); });
    const excluir = (p) => confirmar(`Excluir "${p.nome}"?`, () => executar(async () => { await api('DELETE', '/produtos/' + p.id); await recarregar('Produto excluído'); }));

    return (
        <div className="caixa">
            <div className="ferramentas">
                <input className="busca-adm" placeholder="🔍 Buscar produto" value={f.busca} onChange={(e) => mudar({ busca: e.target.value })} />
                <select value={f.animal} onChange={(e) => mudar({ animal: e.target.value, categoria: '' })}>
                    <option value="">Todos os animais</option>
                    {animais.map(a => <option key={a.id} value={a.id}>{a.icone} {a.nome}</option>)}
                </select>
                <select value={f.categoria} onChange={(e) => mudar({ categoria: e.target.value })}>
                    <option value="">Todas as categorias</option>
                    {cats.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={f.status} onChange={(e) => mudar({ status: e.target.value })}>
                    {[['', 'Todos'], ['visiveis', 'Na loja'], ['escondidos', 'Escondidos'], ['estoque', 'Estoque baixo']].map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
                <button className="btn btn-musgo" onClick={() => abrirJanela(<FormProduto />)}>+ Novo produto</button>
            </div>
            {marcados.length > 0 && (
                <div className="barra-lote"><b>{marcados.length} selecionado{marcados.length > 1 ? 's' : ''}</b>
                    <button className="btn btn-borda btn-peq" onClick={() => lote('mostrar')}>👁️ Mostrar na loja</button>
                    <button className="btn btn-borda btn-peq" onClick={() => lote('esconder')}>🙈 Esconder</button>
                    <button className="btn btn-perigo btn-peq" onClick={() => lote('excluir')}>🗑️ Excluir</button>
                    <button className="link-btn" onClick={() => setSel(new Set())}>Limpar seleção</button>
                </div>
            )}
            {pag.length ? (
                <div className="tabela-wrap"><table className="t-adm"><tbody>
                    <tr><th className="ck"><input type="checkbox" checked={todosMarcados} onChange={(e) => marcarPagina(e.target.checked)} aria-label="Selecionar a página" /></th><th></th><th>Produto</th><th>Animal</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Na loja</th><th></th></tr>
                    {pag.map(p => (
                        <tr key={p.id} className={sel.has(p.id) ? 'marcada' : ''}>
                            <td className="ck"><input type="checkbox" checked={sel.has(p.id)} onChange={(e) => marcar(p.id, e.target.checked)} aria-label={`Selecionar ${p.nome}`} /></td>
                            <td><span className={`mini-ic cor-${p.cor}`}><ImgProduto p={p} /></span></td>
                            <td><b>{p.nome}</b>{p.selo && <><br /><Badge cor="caramelo">{p.selo}</Badge></>}</td>
                            <td>{animalPor(p.animal).nome}</td>
                            <td>{p.categoria}</td>
                            <td><b>{dinheiro(p.preco)}</b></td>
                            <td><BadgeEstoque n={p.estoque} /></td>
                            <td><button className={'interruptor' + (p.ativo ? ' on' : '')} onClick={() => alternarAtivo(p)} title={p.ativo ? 'Visível na loja' : 'Escondido da loja'} /></td>
                            <td><div className="acoes">
                                <button className="ic-btn" onClick={() => abrirJanela(<FormProduto p={p} />)} title="Editar">✏️</button>
                                <button className="ic-btn perigo" onClick={() => excluir(p)} title="Excluir">🗑️</button>
                            </div></td>
                        </tr>
                    ))}
                </tbody></table></div>
            ) : <p className="vazio">Nenhum produto encontrado com esses filtros.</p>}
            <Paginacao total={lista.length} atual={atual} aoMudar={setPagina} />
        </div>
    );
}

// Janela de novo produto / editar produto
export function FormProduto({ p }) {
    const { animais, animalPor, api, sincronizar, aviso, fecharJanela } = useLoja();
    const novo = !p;
    const base = p || { nome: '', animal: 'caes', categoria: 'Ração', preco: '', estoque: '', icone: '🐾', cor: 'amarelo', selo: '', descricao: '', imagem: '', ativo: true };
    const [animal, setAnimal] = useState(base.animal);
    const [categoria, setCategoria] = useState(base.categoria);
    const [imagem, setImagem] = useState(base.imagem || '');
    const [icone, setIcone] = useState(base.icone);
    const [cor, setCor] = useState(base.cor);
    const [salvando, setSalvando] = useState(false);
    const grupos = animalPor(animal).grupos;

    const trocarAnimal = (id) => { setAnimal(id); setCategoria((animalPor(id).grupos[0] || {}).t || ''); };
    const escolherFoto = (e) => {
        const arq = e.target.files[0];
        if (arq) reduzirImagem(arq, 600).then(setImagem).catch((erro) => aviso(erro.message));
        e.target.value = '';
    };

    async function salvar(e) {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        const dados = { nome: d.nome.trim(), animal, categoria, preco: parseFloat(d.preco), estoque: parseInt(d.estoque, 10), icone: icone.trim(), cor, selo: d.selo.trim(), descricao: d.descricao.trim(), imagem };
        setSalvando(true);
        try {
            if (novo) await api('POST', '/produtos', dados); else await api('PUT', '/produtos/' + p.id, dados);
            fecharJanela();
            await sincronizar();
            aviso(novo ? 'Produto cadastrado ✓' : 'Produto atualizado ✓');
        } catch (erro) { aviso('⚠️ ' + erro.message); setSalvando(false); }
    }

    return (
        <>
            <div className="modal-topo"><h2>{novo ? 'Novo produto' : 'Editar produto'}</h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <form className="form" onSubmit={salvar}>
                <span style={{ fontWeight: 500 }}>Foto do produto</span>
                <div className="foto-campo">
                    <div className={`foto-prev cor-${cor}`}>{imagem ? <img src={imagem} alt="" /> : icone || '🐾'}</div>
                    <div className="botoes">
                        <label className="btn btn-borda btn-peq">📷 {imagem ? 'Trocar foto' : 'Escolher foto'}<input type="file" accept="image/*" hidden onChange={escolherFoto} /></label>
                        {imagem && <button type="button" className="btn btn-perigo btn-peq" onClick={() => setImagem('')}>Remover foto</button>}
                        <small>JPG ou PNG. Sem foto, aparece o emoji.</small>
                    </div>
                </div>
                <label>Nome<input name="nome" defaultValue={base.nome} required /></label>
                <div className="form-linha">
                    <label>Animal<select value={animal} onChange={(e) => trocarAnimal(e.target.value)}>{animais.map(a => <option key={a.id} value={a.id}>{a.icone} {a.nome}</option>)}</select></label>
                    <label>Categoria<select value={categoria} onChange={(e) => setCategoria(e.target.value)}>{grupos.map(g => <option key={g.t}>{g.t}</option>)}</select></label>
                </div>
                <div className="form-linha">
                    <label>Preço (R$)<input name="preco" type="number" step="0.01" min="0" defaultValue={base.preco} required /></label>
                    <label>Estoque<input name="estoque" type="number" min="0" step="1" defaultValue={base.estoque} required /></label>
                </div>
                <div className="form-linha">
                    <label>Ícone (emoji)<input value={icone} onChange={(e) => setIcone(e.target.value)} maxLength={4} required /></label>
                    <label>Cor do fundo<select value={cor} onChange={(e) => setCor(e.target.value)}>{CORES.map(c => <option key={c}>{c}</option>)}</select></label>
                </div>
                <label>Selo <small style={{ color: 'var(--suave)', fontWeight: 400 }}>(opcional — ex.: Oferta, Novo)</small><input name="selo" defaultValue={base.selo || ''} /></label>
                <label>Descrição<textarea name="descricao" rows={2} defaultValue={base.descricao || ''} /></label>
                <div className="modal-acoes">
                    <button type="button" className="btn btn-borda" onClick={fecharJanela}>Cancelar</button>
                    <button className="btn btn-azul" disabled={salvando}>{novo ? 'Cadastrar produto' : 'Salvar alterações'}</button>
                </div>
            </form>
        </>
    );
}
