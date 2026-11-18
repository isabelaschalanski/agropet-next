import './globals.css';

export const metadata = {
    title: 'AgroPet — Pet Shop e Agropecuária Online',
    description: 'Do pet ao campo: rações, produtos agropecuários, Clube AgroPet e Banho e Tosa.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <body>{children}</body>
        </html>
    );
}
