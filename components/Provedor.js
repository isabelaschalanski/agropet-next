'use client';
// Provedor: guarda os dados que o site inteiro usa (produtos, login, carrinho...) e
// entrega para qualquer componente pelo hook useLoja().
// No navegador só ficam guardados o carrinho e o token de login (localStorage).

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PLANOS } from '../lib/regras';
import { soData } from '../lib/front/util';

const Contexto = createContext(null);
export const useLoja = () => useContext(Contexto);

const CHAVE = 'agropet_local_v1';
const IMG_PADRAO = ['/img/banner-animais.jpg', '/img/banner-clube.jpg', '/img/banner-banho.jpg'];
const SITE_VAZIO = { pilula: '', titulo: '', texto: '', botao: '', frete: 0, freteGratisAcima: 0, imgSlides: ['', '', ''], imgAnimais: {} };

// ---- converte o formato da API para o formato que as telas usam
function assinaturaDaApi(a) {
    if (!a) return null;
    return { plano: a.plano, itens: (a.itens || []).map(i => ({ id: i.produtoId, qtd: i.qtd })), diaEntrega: a.diaEntrega, pagamento: a.pagamento, desde: soData(a.desde), ativa: a.ativa, arquivada: !!a.arquivada };
}
function usuarioDaApi(u) {
    return { id: u.id, nome: u.nome, email: u.email, telefone: u.telefone || '', observacoes: u.observacoes || '', criadoEm: soData(u.criadoEm), pets: u.pets || [], assinatura: assinaturaDaApi(u.assinatura) };
}
function pedidoDaApi(p) {
    return { ...p, data: soData(p.data), itens: p.itens.map(i => ({ id: i.produtoId, nome: i.nome, preco: i.preco, qtd: i.qtd })) };
}
function agendamentoDaApi(a) {
    return { ...a, pet: a.petNome, servico: a.servicoId, extras: a.adicionais || [] };
}

export default function Provedor({ children }) {
    const [pronto, setPronto] = useState(false);
    const [erro, setErro] = useState('');
    const [dados, setDados] = useState({
        site: SITE_VAZIO, planos: PLANOS, animais: [], servicos: [], extras: [],
        produtos: [], usuarios: [], pedidos: [], agendamentos: [],
    });
    const [sessao, setSessaoEstado] = useState(null);   // { token, tipo: 'cliente' | 'admin', id }
    const [carrinho, setCarrinhoEstado] = useState([]); // [{ id, qtd }]
    const [busca, setBusca] = useState('');
    const [janela, setJanela] = useState(null);         // conteúdo da janela (modal) aberta
    const [avisoTexto, setAvisoTexto] = useState('');
    const [avisoVisivel, setAvisoVisivel] = useState(false);
    const sessaoRef = useRef(null);
    const carrinhoRef = useRef([]);
    const timerAviso = useRef(null);

    // ---- guarda carrinho e login no navegador
    const guardar = useCallback(() => {
        try { localStorage.setItem(CHAVE, JSON.stringify({ carrinho: carrinhoRef.current, sessao: sessaoRef.current })); } catch { /* sem armazenamento */ }
    }, []);
    const setSessao = useCallback((s) => { sessaoRef.current = s; setSessaoEstado(s); guardar(); }, [guardar]);
    const setCarrinho = useCallback((fnOuLista) => {
        const nova = typeof fnOuLista === 'function' ? fnOuLista(carrinhoRef.current) : fnOuLista;
        carrinhoRef.current = nova; setCarrinhoEstado(nova); guardar();
    }, [guardar]);

    const aviso = useCallback((msg) => {
        setAvisoTexto(msg); setAvisoVisivel(true);
        clearTimeout(timerAviso.current);
        timerAviso.current = setTimeout(() => setAvisoVisivel(false), 2800);
    }, []);

    // ---- chama a API. Ex.: await api('POST', '/pedidos', { ... })
    const api = useCallback(async (metodo, caminho, corpo) => {
        const s = sessaoRef.current;
        const resp = await fetch('/api' + caminho, {
            method: metodo,
            headers: { 'Content-Type': 'application/json', ...(s ? { Authorization: 'Bearer ' + s.token } : {}) },
            body: corpo === undefined ? undefined : JSON.stringify(corpo),
        });
        const json = await resp.json().catch(() => null);
        if (resp.status === 401 && sessaoRef.current) setSessao(null);
        if (!resp.ok) throw new Error((json && json.erro) || 'Não foi possível falar com o servidor');
        return json;
    }, [setSessao]);

    // Roda uma ação que fala com a API e mostra o erro, se houver
    const executar = useCallback((fn) => Promise.resolve().then(fn).catch((e) => aviso('⚠️ ' + e.message)), [aviso]);

    // ---- busca tudo o que as telas precisam
    const carregar = useCallback(async () => {
        const [config, animais, servicos] = await Promise.all([api('GET', '/config'), api('GET', '/animais'), api('GET', '/servicos')]);
        const novo = {
            site: {
                ...config,
                imgSlides: config.imgSlides && config.imgSlides.length === 3 ? config.imgSlides : ['', '', ''],
                imgAnimais: Object.fromEntries(animais.filter(a => a.imagem).map(a => [a.id, a.imagem])),
            },
            planos: config.planos || PLANOS,
            animais: animais.map(a => ({ id: a.id, nome: a.nome, curto: a.curto || undefined, icone: a.icone, cor: a.cor, agro: a.agro, outro: a.outro, grupos: a.categorias.map(c => ({ t: c.nome, i: c.itens })) })),
            servicos: servicos.servicos.map(x => ({ id: x.id, nome: x.nome, desc: x.descricao, preco: x.preco, icone: x.icone })),
            extras: servicos.adicionais.map(x => ({ id: x.id, nome: x.nome, desc: x.descricao, preco: x.preco, icone: x.icone })),
            produtos: [], usuarios: [], pedidos: [], agendamentos: [],
        };
        const s = sessaoRef.current;
        let logado = false;
        if (s) {
            try {
                if (s.tipo === 'admin') {
                    const [produtos, pedidos, agendamentos, clientes, assinaturas] = await Promise.all([
                        api('GET', '/produtos?todos=1'), api('GET', '/pedidos'), api('GET', '/agendamentos'), api('GET', '/admin/clientes'), api('GET', '/admin/assinaturas'),
                    ]);
                    novo.produtos = produtos;
                    novo.pedidos = pedidos.map(pedidoDaApi).reverse();
                    novo.agendamentos = agendamentos.map(agendamentoDaApi);
                    novo.usuarios = clientes.map(c => usuarioDaApi({ ...c, assinatura: assinaturas.find(a => a.clienteId === c.id) || null }));
                } else {
                    const [eu, pedidos, agendamentos] = await Promise.all([api('GET', '/eu'), api('GET', '/pedidos'), api('GET', '/agendamentos')]);
                    novo.usuarios = [usuarioDaApi(eu)];
                    novo.pedidos = pedidos.map(pedidoDaApi).reverse();
                    novo.agendamentos = agendamentos.map(agendamentoDaApi);
                }
                logado = true;
            } catch {
                setSessao(null); // token vencido: volta a ser visitante
            }
        }
        if (!logado || s.tipo !== 'admin') novo.produtos = await api('GET', '/produtos');
        const ids = new Set(novo.produtos.map(p => p.id));
        if (carrinhoRef.current.some(i => !ids.has(i.id))) setCarrinho(c => c.filter(i => ids.has(i.id)));
        setDados(novo);
    }, [api, setSessao, setCarrinho]);

    // Recarrega os dados (depois de salvar algo)
    const sincronizar = useCallback(() => carregar(), [carregar]);

    // ---- início: lê o navegador e busca os dados
    useEffect(() => {
        let local = {};
        try { local = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { local = {}; }
        sessaoRef.current = local.sessao || null; setSessaoEstado(sessaoRef.current);
        carrinhoRef.current = Array.isArray(local.carrinho) ? local.carrinho : []; setCarrinhoEstado(carrinhoRef.current);
        carregar().then(() => setPronto(true)).catch((e) => setErro(e.message));
    }, [carregar]);

    // ---- login / sair
    const entrarComo = useCallback(async (r) => {
        setSessao({ token: r.token, tipo: r.usuario.admin ? 'admin' : 'cliente', id: r.usuario.id });
        await carregar();
    }, [setSessao, carregar]);
    const sair = useCallback(async () => {
        try { await api('POST', '/logout'); } catch { /* já estava fora */ }
        setSessao(null);
        await carregar();
        aviso('Até logo! 👋');
    }, [api, setSessao, carregar, aviso]);

    // ---- janelas (modal) e confirmação
    const abrirJanela = useCallback((conteudo) => setJanela(conteudo), []);
    const fecharJanela = useCallback(() => setJanela(null), []);
    const confirmar = useCallback((mensagem, fn, textoSim = 'Sim, confirmar') => {
        setJanela(
            <>
                <div className="modal-topo"><h2>Confirmar</h2><button className="fechar" onClick={() => setJanela(null)}>✕</button></div>
                <p style={{ marginBottom: 20 }}>{mensagem}</p>
                <div className="modal-acoes">
                    <button className="btn btn-borda" onClick={() => setJanela(null)}>Não</button>
                    <button className="btn btn-azul" onClick={() => { setJanela(null); fn(); }}>{textoSim}</button>
                </div>
            </>
        );
    }, []);

    // ---- carrinho
    const produtoPor = useCallback((id) => dados.produtos.find(p => p.id === id), [dados.produtos]);
    const adicionar = useCallback((id) => {
        const p = dados.produtos.find(x => x.id === id);
        if (!p) return;
        const atual = (carrinhoRef.current.find(i => i.id === id) || {}).qtd || 0;
        if (atual + 1 > p.estoque) { aviso('Quantidade máxima em estoque'); return; }
        setCarrinho(c => (atual ? c.map(i => (i.id === id ? { ...i, qtd: i.qtd + 1 } : i)) : [...c, { id, qtd: 1 }]));
        aviso(`🛒 ${p.nome} adicionado`);
    }, [dados.produtos, setCarrinho, aviso]);
    const mudarQtd = useCallback((id, delta) => {
        const item = carrinhoRef.current.find(i => i.id === id);
        const p = dados.produtos.find(x => x.id === id);
        if (!item || !p) return;
        const novo = item.qtd + delta;
        if (novo > p.estoque) { aviso('Quantidade máxima em estoque'); return; }
        setCarrinho(c => (novo <= 0 ? c.filter(i => i.id !== id) : c.map(i => (i.id === id ? { ...i, qtd: novo } : i))));
    }, [dados.produtos, setCarrinho, aviso]);
    const remover = useCallback((id) => setCarrinho(c => c.filter(i => i.id !== id)), [setCarrinho]);
    const esvaziarCarrinho = useCallback(() => setCarrinho([]), [setCarrinho]);

    // ---- valores derivados
    const valor = useMemo(() => {
        const usuario = sessao && sessao.tipo === 'cliente' ? dados.usuarios.find(u => u.id === sessao.id) || null : null;
        const admin = !!(sessao && sessao.tipo === 'admin');
        const planoDe = (u) => (u && u.assinatura && u.assinatura.ativa ? { id: u.assinatura.plano, ...dados.planos[u.assinatura.plano] } : null);
        const animalPor = (id) => dados.animais.find(a => a.id === id) || { id, nome: id, icone: '🐾', cor: 'cinza', grupos: [] };
        return {
            pronto, ...dados, sessao, usuario, admin, plano: planoDe(usuario), planoDe,
            carrinho, qtdCarrinho: carrinho.reduce((s, i) => s + i.qtd, 0),
            busca, setBusca,
            api, executar, carregar, sincronizar, entrarComo, sair, aviso,
            abrirJanela, fecharJanela, confirmar,
            adicionar, mudarQtd, remover, esvaziarCarrinho,
            animalPor,
            servicoPor: (id) => dados.servicos.find(s => s.id === id) || { id, nome: id, preco: 0 },
            extraPor: (id) => dados.extras.find(x => x.id === id) || { id, nome: id, preco: 0 },
            produtoPor,
            usuarioPor: (id) => dados.usuarios.find(u => u.id === id),
            imgSlide: (i) => dados.site.imgSlides[i] || IMG_PADRAO[i],
            imgPadrao: (i) => IMG_PADRAO[i],
        };
    }, [pronto, dados, sessao, carrinho, busca, api, executar, carregar, sincronizar, entrarComo, sair, aviso, abrirJanela, fecharJanela, confirmar, adicionar, mudarQtd, remover, esvaziarCarrinho, produtoPor]);

    let conteudo = children;
    if (erro) {
        conteudo = (
            <div className="container sucesso"><div className="grande">⚠️</div><h1>Não foi possível carregar a loja</h1>
                <p>{erro}. Confira se o &quot;npm run dev&quot; está rodando e se o arquivo .env tem o endereço do banco.</p></div>
        );
    } else if (!pronto) {
        conteudo = <div className="container sucesso"><div className="grande">🐾</div><p>Carregando...</p></div>;
    }

    return (
        <Contexto.Provider value={valor}>
            {conteudo}
            {janela && (
                <div className="fundo-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) fecharJanela(); }}>
                    <div className="modal">{janela}</div>
                </div>
            )}
            <div className={'aviso' + (avisoVisivel ? ' mostrar' : '')}>{avisoTexto}</div>
        </Contexto.Provider>
    );
}
