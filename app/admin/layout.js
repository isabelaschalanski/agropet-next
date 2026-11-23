import AdminShell from '../../components/admin/AdminShell';

export const metadata = { title: 'Gerenciamento · AgroPet' };

// Todas as páginas /admin têm o menu lateral do gerenciamento
export default function Layout({ children }) {
    return <AdminShell>{children}</AdminShell>;
}
