import { Suspense } from 'react';
import Produtos from '../../../components/admin/Produtos';

// /admin/produtos?filtro=estoque abre já mostrando o estoque baixo
export default function Page() {
    return <Suspense><Produtos /></Suspense>;
}
