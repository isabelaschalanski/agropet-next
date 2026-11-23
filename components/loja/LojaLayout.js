'use client';
// Moldura das páginas da loja: topo, conteúdo e rodapé.
// O admin não usa a loja: se ele estiver logado, vai direto para o gerenciamento.
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoja } from '../Provedor';
import Topo from './Topo';

export default function LojaLayout({ children }) {
    const { admin } = useLoja();
    const router = useRouter();
    useEffect(() => { if (admin) router.replace('/admin'); }, [admin, router]);
    // Links antigos (da versão com #): /#clube vira /clube
    useEffect(() => {
        const h = window.location.hash.replace(/^#\/?/, '').split('?')[0];
        if (!h || h === 'produtos') return;
        const antigos = { inicio: '/', carrinho: '/carrinho', finalizar: '/finalizar', 'banho-e-tosa': '/banho-e-tosa', agendar: '/banho-e-tosa/agendar', clube: '/clube', assinar: '/clube/assinar', entrar: '/entrar', conta: '/conta/pedidos', admin: '/admin' };
        router.replace(antigos[h] || '/loja/' + h);
    }, [router]);
    if (admin) return null;

    return (
        <>
            <Topo />
            <main>{children}</main>
            <footer className="rodape">
                <div className="container rodape-grade">
                    <div>
                        <span className="logo">AgroPet</span>
                        <p style={{ marginTop: 8 }}>Pet shop online com carinho de verdade.<br />Santo Ângelo – RS</p>
                    </div>
                    <div>
                        <h4>Loja</h4>
                        <Link href="/">Produtos</Link>
                        <Link href="/clube">Clube AgroPet</Link>
                        <Link href="/banho-e-tosa">Banho e Tosa</Link>
                    </div>
                    <div>
                        <h4>Minha conta</h4>
                        <Link href="/conta/pedidos">Meus pedidos</Link>
                        <Link href="/carrinho">Carrinho</Link>
                        <Link href="/entrar">Entrar / Cadastrar</Link>
                    </div>
                    <div>
                        <h4>Contato</h4>
                        <p>(55) 3312-0000</p>
                        <p>contato@agropet.com.br</p>
                    </div>
                </div>
                <p className="copy">© AgroPet — Projeto acadêmico · Ciência da Computação URI</p>
            </footer>
        </>
    );
}

// Hook para páginas que precisam de login: manda para /entrar e volta depois
export function usePrecisaLogin(voltar, mensagem) {
    const { usuario, admin, aviso } = useLoja();
    const router = useRouter();
    useEffect(() => {
        if (!usuario && !admin) {
            if (mensagem) aviso(mensagem);
            router.replace('/entrar' + (voltar ? '?voltar=' + encodeURIComponent(voltar) : ''));
        }
    }, [usuario, admin, voltar, mensagem, aviso, router]);
    return usuario;
}
