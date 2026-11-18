import Script from 'next/script';

// Estrutura fixa do site (topo, menu e rodapé).
// O conteúdo de cada página é montado pelo arquivo public/app.js dentro do <main id="app">.
export default function Home() {
    return (
        <>
            <header className="topo">
                <div className="container topo-linha">
                    <a href="#inicio" data-ir="" className="logo">AgroPet</a>
                    <div className="busca">
                        <span>🔍</span>
                        <input id="busca" type="text" placeholder="O que seu pet precisa hoje?" autoComplete="off" />
                    </div>
                    <div className="topo-acoes">
                        <div id="contaMenu"></div>
                        <a href="#carrinho" data-ir="carrinho" className="btn btn-azul">
                            🛒 <span className="btn-entrar-txt">Carrinho</span> <span className="contador" id="contador">0</span>
                        </a>
                        <span id="sairTopo"></span>
                        <button className="menu-btn" id="menuBtn" aria-label="Menu">☰</button>
                    </div>
                </div>
                <nav className="barra" id="barra">
                    <ul className="container categorias" id="categorias"></ul>
                </nav>
            </header>

            <main id="app"></main>

            <footer className="rodape">
                <div className="container rodape-grade">
                    <div>
                        <span className="logo">AgroPet</span>
                        <p style={{ marginTop: 8 }}>Pet shop online com carinho de verdade.<br />Santo Ângelo – RS</p>
                    </div>
                    <div>
                        <h4>Loja</h4>
                        <a href="#inicio" data-ir="">Produtos</a>
                        <a href="#clube" data-ir="clube">Clube AgroPet</a>
                        <a href="#banho-e-tosa" data-ir="banho-e-tosa">Banho e Tosa</a>
                    </div>
                    <div>
                        <h4>Minha conta</h4>
                        <a href="#conta" data-ir="conta">Meus pedidos</a>
                        <a href="#carrinho" data-ir="carrinho">Carrinho</a>
                        <a href="#entrar" data-ir="entrar">Entrar / Cadastrar</a>
                    </div>
                    <div>
                        <h4>Contato</h4>
                        <p>(55) 3312-0000</p>
                        <p>contato@agropet.com.br</p>
                    </div>
                </div>
                <p className="copy">© AgroPet — Projeto acadêmico · Ciência da Computação URI</p>
            </footer>

            <div id="modal"></div>
            <div className="aviso" id="aviso"></div>

            <Script src="/app.js" strategy="afterInteractive" />
        </>
    );
}
