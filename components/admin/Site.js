'use client';
// Configurar site (/admin/site): textos do banner, frete, imagens e limpar os dados de teste.
import { useLoja } from '../Provedor';
import { IconeAnimal } from '../loja/Imagens';
import { reduzirImagem } from '../../lib/front/util';

export default function Site() {
    const { site, animais, imgSlide, imgPadrao, api, executar, sincronizar, aviso, abrirJanela } = useLoja();
    const recarregar = async (msg) => { await sincronizar(); if (msg) aviso(msg); };

    const salvar = (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        executar(async () => {
            await api('PUT', '/config', { pilula: d.pilula, titulo: d.titulo, texto: d.texto, botao: d.botao, frete: parseFloat(d.frete) || 0, freteGratisAcima: parseFloat(d.freteGratisAcima) || 0 });
            await recarregar('Configurações salvas ✓');
        });
    };
    // Envia uma imagem nova (diminui antes: banners até 700px, animais até 300px)
    const enviar = (e, fazer, max) => {
        const arq = e.target.files[0];
        e.target.value = '';
        if (!arq) return;
        executar(async () => { const url = await reduzirImagem(arq, max); await fazer(url); await recarregar('Imagem atualizada ✓'); });
    };
    const trocarSlide = (i, url) => { const imgs = [...site.imgSlides]; imgs[i] = url; return api('PUT', '/config', { imgSlides: imgs }); };

    return (
        <>
            <div className="adm-linha">
                <form className="caixa form" onSubmit={salvar} key={site.titulo + site.frete}>
                    <h2>🏠 Banner da página inicial</h2>
                    <label>Etiqueta<input name="pilula" defaultValue={site.pilula} /></label>
                    <label>Título<input name="titulo" defaultValue={site.titulo} required /></label>
                    <label>Texto<textarea name="texto" rows={2} defaultValue={site.texto} /></label>
                    <label>Texto do botão<input name="botao" defaultValue={site.botao} /></label>
                    <h2 style={{ marginTop: 8 }}>🚚 Entrega</h2>
                    <div className="form-linha">
                        <label>Valor do frete (R$)<input name="frete" type="number" step="0.01" min="0" defaultValue={site.frete} /></label>
                        <label>Frete grátis acima de (R$)<input name="freteGratisAcima" type="number" step="0.01" min="0" defaultValue={site.freteGratisAcima} /></label>
                    </div>
                    <button className="btn btn-musgo" style={{ alignSelf: 'flex-start' }}>Salvar configurações</button>
                </form>
                <div className="caixa">
                    <h2>🖼️ Imagens dos banners</h2>
                    <p className="suave" style={{ margin: '-8px 0 14px' }}>Troque os emojis do lado direito de cada banner por uma imagem. Imagens com fundo branco ficam mais bonitas.</p>
                    <div className="lista-imgs">
                        {['Banner principal', 'Banner do Clube', 'Banner do Banho e Tosa'].map((nome, i) => {
                            const img = imgSlide(i);
                            const propria = !!site.imgSlides[i];
                            return (
                                <div className="linha-img" key={nome}>
                                    <span className="img-prev contem">{img ? <img src={img} alt="" /> : ['🐶🐱', '⭐📦', '🐩🛁'][i]}</span>
                                    <div className="txt"><strong>{nome}</strong><small>{propria ? 'Imagem enviada por você' : imgPadrao(i) ? 'Usando a foto padrão' : 'Usando emojis'}</small></div>
                                    <div className="acoes">
                                        <label className="btn btn-borda btn-peq" style={{ flexDirection: 'row' }}>📷 Trocar<input type="file" accept="image/*" hidden onChange={(e) => enviar(e, (url) => trocarSlide(i, url), 700)} /></label>
                                        {propria && <button className="btn btn-perigo btn-peq" onClick={() => executar(async () => { await trocarSlide(i, ''); await recarregar('Imagem do banner restaurada'); })}>{imgPadrao(i) ? 'Foto padrão' : 'Emojis'}</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="caixa" style={{ marginTop: 20 }}>
                <h2>🐾 Imagens dos animais</h2>
                <p className="suave" style={{ margin: '-8px 0 14px' }}>Aparecem nos círculos da página inicial e no topo da página de cada animal.</p>
                <div className="grade-imgs">
                    {animais.map(a => (
                        <div className="linha-img" key={a.id}>
                            <span className={`img-prev redondo cor-${a.cor}`}><IconeAnimal animal={a} /></span>
                            <div className="txt"><strong>{a.nome}</strong><small>{site.imgAnimais[a.id] ? 'Com imagem' : 'Emoji ' + a.icone}</small></div>
                            <div className="acoes">
                                <label className="btn btn-borda btn-peq" style={{ flexDirection: 'row' }} title="Trocar imagem">📷<input type="file" accept="image/*" hidden onChange={(e) => enviar(e, (url) => api('PUT', '/animais', { id: a.id, imagem: url }), 300)} /></label>
                                {site.imgAnimais[a.id] && <button className="btn btn-perigo btn-peq" onClick={() => executar(async () => { await api('PUT', '/animais', { id: a.id, imagem: '' }); await recarregar('Voltou para o emoji'); })} title="Voltar ao emoji">✕</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="caixa zona-perigo" style={{ marginTop: 20 }}>
                <div><h2>🧹 Limpar dados de teste</h2>
                    <p>Apaga <b>todos os clientes, pets, pedidos, agendamentos e assinaturas</b>, para começar a usar a loja de verdade. O catálogo de produtos, as imagens, as configurações e a conta do admin continuam.</p></div>
                <button className="btn btn-perigo" onClick={() => abrirJanela(<Limpar />)}>Limpar dados de teste</button>
            </div>
        </>
    );
}

function Limpar() {
    const { usuarios, pedidos, agendamentos, api, executar, sincronizar, aviso, fecharJanela } = useLoja();
    const enviar = (e) => {
        e.preventDefault();
        const confirmar = e.currentTarget.confirmar.value.trim().toUpperCase();
        if (confirmar !== 'LIMPAR') { aviso('Digite LIMPAR para confirmar'); return; }
        executar(async () => { await api('POST', '/admin/limpar', { confirmar }); fecharJanela(); await sincronizar(); aviso('Dados de teste apagados ✓'); });
    };
    return (
        <>
            <div className="modal-topo"><h2>🧹 Limpar dados de teste</h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <form className="form" onSubmit={enviar}>
                <p>Isso apaga <b>{usuarios.length} clientes, {pedidos.length} pedidos e {agendamentos.length} agendamentos</b>, com pets e assinaturas. <b>Não dá para desfazer.</b></p>
                <label>Para confirmar, digite <b>LIMPAR</b><input name="confirmar" autoComplete="off" required /></label>
                <div className="modal-acoes"><button type="button" className="btn btn-borda" onClick={fecharJanela}>Cancelar</button><button className="btn btn-perigo-cheio">Apagar tudo</button></div>
            </form>
        </>
    );
}
