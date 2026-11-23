'use client';
// Janela para cadastrar ou editar um pet. Abra com: abrirJanela(<FormPet pet={...} aoSalvar={fn} />)
import { useState } from 'react';
import { useLoja } from '../Provedor';
import { PORTES, hojeISO } from '../../lib/regras';
import { TIPOS_PET } from '../../lib/front/util';

export default function FormPet({ pet, aoSalvar }) {
    const { api, sincronizar, fecharJanela, aviso } = useLoja();
    const novo = !pet;
    const p = pet || { nome: '', tipo: 'Cachorro', porte: 'Pequeno', raca: '', sexo: 'Macho', nascimento: '' };
    const [salvando, setSalvando] = useState(false);

    async function salvar(e) {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        const dados = { nome: d.nome.trim(), tipo: d.tipo, porte: d.porte, sexo: d.sexo, raca: d.raca.trim(), nascimento: d.nascimento };
        setSalvando(true);
        try {
            const salvo = novo ? await api('POST', '/pets', dados) : await api('PUT', '/pets/' + pet.id, dados);
            fecharJanela();
            await sincronizar();
            if (aoSalvar) aoSalvar(salvo);
            aviso(novo ? `🐾 ${salvo.nome} cadastrado!` : 'Pet atualizado ✓');
        } catch (erro) { aviso('⚠️ ' + erro.message); setSalvando(false); }
    }

    return (
        <>
            <div className="modal-topo"><h2>{novo ? 'Cadastrar pet' : 'Editar pet'}</h2><button className="fechar" onClick={fecharJanela}>✕</button></div>
            <form className="form" onSubmit={salvar}>
                <div className="form-linha">
                    <label>Nome do pet *<input name="nome" defaultValue={p.nome} required placeholder="Ex.: Thor" /></label>
                    <label>Tipo *<select name="tipo" defaultValue={p.tipo}>{TIPOS_PET.map(t => <option key={t}>{t}</option>)}</select></label>
                </div>
                <div className="form-linha">
                    <label>Porte *<select name="porte" defaultValue={p.porte}>{Object.keys(PORTES).map(t => <option key={t}>{t}</option>)}</select></label>
                    <label>Sexo<select name="sexo" defaultValue={p.sexo || 'Macho'}>{['Macho', 'Fêmea'].map(t => <option key={t}>{t}</option>)}</select></label>
                </div>
                <div className="form-linha">
                    <label>Raça<input name="raca" defaultValue={p.raca || ''} placeholder="Ex.: Poodle, SRD" /></label>
                    <label>Data de nascimento<input type="date" name="nascimento" defaultValue={p.nascimento || ''} max={hojeISO()} /></label>
                </div>
                <div className="modal-acoes">
                    <button type="button" className="btn btn-borda" onClick={fecharJanela}>Cancelar</button>
                    <button className="btn btn-azul" disabled={salvando}>{novo ? 'Cadastrar' : 'Salvar'}</button>
                </div>
            </form>
        </>
    );
}
