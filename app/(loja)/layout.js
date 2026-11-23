import LojaLayout from '../../components/loja/LojaLayout';

// Todas as páginas da loja (o "(loja)" não aparece no endereço) têm topo, menu e rodapé.
export default function Layout({ children }) {
    return <LojaLayout>{children}</LojaLayout>;
}
