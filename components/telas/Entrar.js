'use client';
// Entrar / Criar conta (/entrar?voltar=/finalizar). Depois do login volta para onde a pessoa estava.
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoja } from '../Provedor';

export default function Entrar() {
    const { api, entrarComo, aviso, usuario, admin } = useLoja();
    const router = useRouter();
    const voltar = useSearchParams().get('voltar');
    const destino = voltar && voltar.startsWith('/') ? voltar : '/conta';
    const [aba, setAba] = useState('entrar');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [acabouDeEntrar, setAcabou] = useState(false);

    // Já está logado (abriu /entrar sem querer): vai para a conta
    useEffect(() => {
        if (acabouDeEntrar) return;
        if (admin) router.replace('/admin');
        else if (usuario) router.replace('/conta');
    }, [usuario, admin, acabouDeEntrar, router]);

    async function enviar(e) {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        setErro('');
        if (aba === 'cadastro' && d.senha !== d.senha2) { setErro('As senhas não são iguais.'); return; }
        setEnviando(true);
        try {
            const r = aba === 'entrar'
                ? await api('POST', '/login', { login: d.login, senha: d.senha })
                : await api('POST', '/cadastro', { nome: d.nome, email: d.email, telefone: d.telefone, senha: d.senha });
            setAcabou(true);
            await entrarComo(r);
            if (r.usuario.admin) { aviso('Bem-vindo ao gerenciamento ⚙️'); router.replace('/admin'); return; }
            aviso(aba === 'entrar' ? `Olá, ${r.usuario.nome.split(' ')[0]}! 🐾` : 'Conta criada! Bem-vindo à AgroPet 🎉');
            router.replace(destino);
        } catch (erro2) { setErro(erro2.message); setEnviando(false); setAcabou(false); }
    }

    const trocar = (a) => { setAba(a); setErro(''); };

    return (
        <div className="container">
            <div className="caixa entrar-box">
                <div style={{ textAlign: 'center', marginBottom: 18 }}><span className="logo">AgroPet</span></div>
                <div className="abas">
                    <button className={aba === 'entrar' ? 'ativo' : ''} onClick={() => trocar('entrar')}>Entrar</button>
                    <button className={aba === 'cadastro' ? 'ativo' : ''} onClick={() => trocar('cadastro')}>Criar conta</button>
                </div>
                {aba === 'entrar' ? (
                    <form className="form" onSubmit={enviar} key="entrar">
                        <label>E-mail ou usuário<input name="login" required autoComplete="username" /></label>
                        <label>Senha<input name="senha" type="password" required autoComplete="current-password" /></label>
                        <p className="erro">{erro}</p>
                        <button className="btn btn-azul btn-bloco" disabled={enviando}>Entrar</button>
                        <p className="nota" style={{ fontSize: '.85rem' }}>Demonstração — cliente: <b>maria@email.com</b> / <b>123</b></p>
                    </form>
                ) : (
                    <form className="form" onSubmit={enviar} key="cadastro">
                        <label>Nome completo<input name="nome" required /></label>
                        <label>E-mail<input name="email" type="email" required /></label>
                        <label>Telefone<input name="telefone" placeholder="(55) 99999-0000" /></label>
                        <div className="form-linha">
                            <label>Senha<input name="senha" type="password" minLength={3} required /></label>
                            <label>Repetir senha<input name="senha2" type="password" required /></label>
                        </div>
                        <p className="erro">{erro}</p>
                        <button className="btn btn-azul btn-bloco" disabled={enviando}>Criar conta</button>
                    </form>
                )}
            </div>
        </div>
    );
}
