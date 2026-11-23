import './globals.css';
import Provedor from '../components/Provedor';

export const metadata = {
    title: 'AgroPet — Pet Shop e Agropecuária Online',
    description: 'Do pet ao campo: rações, produtos agropecuários, Clube AgroPet e Banho e Tosa.',
};

// Layout de todas as páginas. O <Provedor> carrega os dados da loja e guarda o login e o carrinho.
export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <body>
                <Provedor>{children}</Provedor>
            </body>
        </html>
    );
}
