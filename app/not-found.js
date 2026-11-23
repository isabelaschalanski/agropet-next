import Link from 'next/link';

export default function NaoEncontrada() {
    return (
        <div className="container sucesso">
            <div className="grande">🐾</div>
            <h1>Página não encontrada</h1>
            <p>O endereço pode ter mudado. Que tal voltar para a loja?</p>
            <Link href="/" className="btn btn-azul" style={{ marginTop: 20 }}>Voltar à loja</Link>
        </div>
    );
}
