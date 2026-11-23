'use client';
// Banho e Tosa: página de apresentação (/banho-e-tosa) e o agendamento em 4 passos (/banho-e-tosa/agendar).
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoja } from '../Provedor';
import { usePrecisaLogin } from '../loja/LojaLayout';
import { VisualSlide } from '../loja/Imagens';
import FormPet from './FormPet';
import { HORARIOS, TIPOS_BANHO, banhoGratisDisponivel, calcularAgendamento, ehDomingo, hojeISO, PORTES } from '../../lib/regras';
import { dataBR, dinheiro, iconePet } from '../../lib/front/util';

export function Banho() {
    const { servicos, extras } = useLoja();
    return (
        <div className="container">
            <section className="bt-hero">
                <div>
                    <h1>Banho & Tosa</h1>
                    <h2>O cuidado que o seu pet merece</h2>
                    <p>Serviços completos e seguros para a higiene do seu melhor amigo, com hora marcada.</p>
                    <Link href="/banho-e-tosa/agendar" className="btn btn-azul">Agendar agora →</Link>
                </div>
                <VisualSlide i={2} emojis={['🐩', '🛁', '✂️', '🐈']} />
            </section>

            <div className="vantagens">
                <div className="vantagem"><span className="num">1 grátis</span><div><strong>banho por mês</strong><br /><small style={{ color: 'var(--suave)' }}>para assinantes do plano Premium</small></div></div>
                <div className="vantagem"><span className="num">⭐ Clube</span><div><strong>prioridade no agendamento</strong><br /><small style={{ color: 'var(--suave)' }}>e desconto em todos os produtos</small></div></div>
            </div>

            <section className="faixa">
                <div className="faixa-topo"><h2>Nossos serviços</h2></div>
                <div className="cards-serv">
                    {servicos.map(sv => (
                        <div className="card-serv" key={sv.id}><span className="ic">{sv.icone}</span><h3>{sv.nome}</h3><p>{sv.desc}</p>
                            <span className="preco">a partir de {dinheiro(sv.preco)}</span></div>
                    ))}
                </div>
                <p className="tag" style={{ marginTop: 10 }}>Porte médio +30% · porte grande +60%</p>
            </section>

            <section className="faixa">
                <div className="faixa-topo"><h2>Que tal um cuidado adicional?</h2></div>
                <div className="extras-lista">
                    {extras.map(x => (
                        <div className="extra-card" key={x.id}><span className="ic">{x.icone}</span><div><strong>{x.nome}</strong><small>{x.desc}</small><b style={{ color: 'var(--marrom)' }}>+ {dinheiro(x.preco)}</b></div></div>
                    ))}
                </div>
            </section>

            <section className="faixa faq">
                <div className="faixa-topo"><h2>Dúvidas frequentes</h2></div>
                <details><summary>Não consigo comparecer no horário marcado. O que eu faço?</summary><p>Cancele pelo site em Minha conta → Banho e Tosa e faça um novo agendamento. Não cobramos nada pelo cancelamento.</p></details>
                <details><summary>Quais animais vocês atendem?</summary><p>Cães e gatos de todos os portes. Para outros animais, fale com a gente pelo telefone.</p></details>
                <details><summary>Preciso levar alguma coisa?</summary><p>Só a coleira ou a caixa de transporte. Shampoo, toalha e perfume ficam por nossa conta.</p></details>
                <details><summary>Como funciona o banho grátis do Clube?</summary><p>Assinantes do plano Premium têm 1 banho por mês sem custo. Ele é aplicado automaticamente no agendamento.</p></details>
                <div className="ajuda"><div><strong>Precisa de ajuda?</strong><br /><small>(55) 3312-0000 · segunda a sábado, das 8h às 18h</small></div><Link href="/banho-e-tosa/agendar" className="btn">Agendar agora</Link></div>
            </section>
        </div>
    );
}

const PASSOS = ['Pet', 'Serviço', 'Data e horário', 'Revisão'];

export function Agendar() {
    const { servicos, extras, servicoPor, extraPor, agendamentos, api, carregar, aviso, abrirJanela } = useLoja();
    const usuario = usePrecisaLogin('/banho-e-tosa/agendar', 'Entre na sua conta para agendar');
    const router = useRouter();
    const [passo, setPasso] = useState(1);
    const [petId, setPetId] = useState(null);
    const [servico, setServico] = useState('banho');
    const [escolhidos, setEscolhidos] = useState([]);   // adicionais
    const [data, setData] = useState('');
    const [hora, setHora] = useState(null);
    const [ocupados, setOcupados] = useState([]);        // horários ocupados ou que já passaram
    const [enviando, setEnviando] = useState(false);

    // Busca os horários livres sempre que muda a data
    async function buscarHorarios(d) {
        if (!d) { setOcupados([]); return; }
        try {
            const r = await api('GET', '/horarios?data=' + d);
            const fora = [...r.ocupados, ...(r.passados || [])];
            setOcupados(fora);
            setHora(h => (h && fora.includes(h) ? null : h));
        } catch (e) { aviso('⚠️ ' + e.message); }
    }
    useEffect(() => { buscarHorarios(data); }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!usuario) return null;

    const pets = (usuario.pets || []).filter(p => TIPOS_BANHO.includes(p.tipo));
    const pet = pets.find(p => p.id === petId);
    const porte = pet ? pet.porte : 'Pequeno';
    const meus = agendamentos.filter(a => a.clienteId === usuario.id);
    const c = calcularAgendamento({
        servico: servicoPor(servico), porte,
        adicionais: escolhidos.map(extraPor),
        gratis: banhoGratisDisponivel(usuario, data, meus),
    });
    const domingo = data && ehDomingo(data);
    const etapa = pet ? passo : 1;  // sem pet escolhido, fica no passo 1
    const pode = etapa === 1 ? !!pet : etapa === 2 ? !!servico : etapa === 3 ? !!(data && hora && !domingo) : true;
    const novoPet = () => abrirJanela(<FormPet aoSalvar={(salvo) => { if (TIPOS_BANHO.includes(salvo.tipo)) setPetId(salvo.id); }} />);
    const alternarExtra = (id) => setEscolhidos(l => (l.includes(id) ? l.filter(x => x !== id) : [...l, id]));

    async function confirmar() {
        setEnviando(true);
        try {
            const a = await api('POST', '/agendamentos', { petId, servicoId: servico, adicionais: escolhidos, data, hora });
            await carregar();
            aviso(`🐾 ${a.petNome} agendado para ${dataBR(a.data)} às ${a.hora}`);
            router.push('/conta/agendamentos');
        } catch (e) {
            aviso('⚠️ ' + e.message); setEnviando(false);
            // alguém pegou o horário antes: volta para escolher outro
            if (/horário/i.test(e.message)) { setHora(null); setPasso(3); buscarHorarios(data); }
        }
    }

    let corpo = null;
    if (etapa === 1) {
        corpo = pets.length ? (
            <>
                <h2>Qual pet vai tomar banho?</h2>
                <div className="pets-grade">
                    {pets.map(p => (
                        <button key={p.id} className={'pet-card' + (petId === p.id ? ' sel' : '')} onClick={() => setPetId(p.id)}>
                            <span className="av">{iconePet(p.tipo)}</span><strong>{p.nome}</strong><small>{p.raca || p.tipo} · {p.porte}</small>
                        </button>
                    ))}
                    <button className="pet-card novo" onClick={novoPet}><span className="av">＋</span><strong>Cadastrar novo pet</strong></button>
                </div>
            </>
        ) : (
            <div className="sem-pet"><div className="grande">🐶</div><h3>Você ainda não cadastrou nenhum pet</h3><p>Cadastre o seu pet para agendar o banho.</p>
                <button className="btn btn-azul" onClick={novoPet}>＋ Cadastrar pet</button></div>
        );
    }
    if (etapa === 2) {
        corpo = (
            <>
                <h2>Escolha o serviço para {pet.nome}</h2>
                <div className="escolhas">
                    {servicos.map(sv => (
                        <button key={sv.id} className={'escolha' + (servico === sv.id ? ' sel' : '')} onClick={() => setServico(sv.id)}>
                            <span className="ic">{sv.icone}</span><div><strong>{sv.nome}</strong><small>{sv.desc}</small></div><span className="v">{dinheiro(Math.round(sv.preco * PORTES[porte]))}</span>
                        </button>
                    ))}
                </div>
                <h2 style={{ marginTop: 22 }}>Adicionais <small style={{ color: 'var(--suave)', fontWeight: 400, fontSize: '.9rem' }}>(opcional)</small></h2>
                <div className="escolhas">
                    {extras.map(x => (
                        <button key={x.id} className={'escolha' + (escolhidos.includes(x.id) ? ' sel' : '')} onClick={() => alternarExtra(x.id)}>
                            <span className="marca">{escolhidos.includes(x.id) ? '✓' : ''}</span><div><strong>{x.icone} {x.nome}</strong><small>{x.desc}</small></div><span className="v">+ {dinheiro(x.preco)}</span>
                        </button>
                    ))}
                </div>
            </>
        );
    }
    if (etapa === 3) {
        corpo = (
            <>
                <h2>Quando fica melhor?</h2>
                <label style={{ maxWidth: 300 }}>Data<input type="date" min={hojeISO()} value={data} onChange={(e) => { setData(e.target.value); setHora(null); setOcupados([]); }} /></label>
                {domingo && <p className="erro" style={{ marginTop: 10 }}>Não abrimos aos domingos. Escolha outro dia.</p>}
                {data && !domingo && (
                    <>
                        <p style={{ fontWeight: 500, margin: '18px 0 8px' }}>Horários disponíveis</p>
                        <div className="horarios">
                            {HORARIOS.map(h => {
                                const fora = ocupados.includes(h);
                                return <button key={h} className={'opcao' + (hora === h ? ' sel' : '')} onClick={() => setHora(h)} disabled={fora} title={fora ? 'Ocupado' : undefined}>{h}</button>;
                            })}
                        </div>
                    </>
                )}
                {c.gratis && <p className="nota azul" style={{ marginTop: 16 }}>⭐ Neste mês o seu banho é grátis pelo plano Premium.</p>}
            </>
        );
    }
    if (etapa === 4) {
        corpo = (
            <>
                <h2>Confira o agendamento</h2>
                <div className="revisao">
                    <div className="resumo-linha"><span>Pet</span><b>{iconePet(pet.tipo)} {pet.nome} · {porte}</b></div>
                    <div className="resumo-linha"><span>Data</span><b>{dataBR(data)} às {hora}</b></div>
                    <div className="resumo-linha"><span>{servicoPor(servico).nome}</span><b>{c.gratis ? <><s style={{ color: 'var(--suave)', fontWeight: 400 }}>{dinheiro(c.base)}</s> <span className="verde">Grátis ⭐</span></> : dinheiro(c.base)}</b></div>
                    {escolhidos.map(id => <div className="resumo-linha" key={id}><span>{extraPor(id).nome}</span><b>{dinheiro(extraPor(id).preco)}</b></div>)}
                    <div className="resumo-linha total"><span>Total</span><span>{dinheiro(c.total)}</span></div>
                </div>
                <p className="nota" style={{ marginTop: 14 }}>O pagamento é feito na loja, no dia do atendimento.</p>
            </>
        );
    }

    const voltar = () => { if (etapa > 1) setPasso(etapa - 1); else router.push('/banho-e-tosa'); };
    const continuar = () => { setPasso(etapa + 1); window.scrollTo(0, 0); };

    return (
        <div className="container wizard">
            <div className="wiz-topo"><button className="wiz-voltar" onClick={voltar} aria-label="Voltar">‹</button><h1>Agendamento</h1></div>
            <div className="progresso"><span style={{ width: `${etapa * 25}%` }} /></div>
            <p className="passo-txt">Passo {etapa} de 4 · {PASSOS[etapa - 1]}</p>
            <div className="caixa">{corpo}</div>
            <div className="wiz-rodape">
                <div className="total">{pet && etapa > 1 ? <><small>Total</small><b>{dinheiro(c.total)}</b></> : <small>{pet ? pet.nome + ' selecionado' : 'Escolha um pet'}</small>}</div>
                {etapa < 4
                    ? <button className="btn btn-azul" onClick={continuar} disabled={!pode}>Continuar →</button>
                    : <button className="btn btn-azul" onClick={confirmar} disabled={enviando}>Confirmar agendamento</button>}
            </div>
        </div>
    );
}
