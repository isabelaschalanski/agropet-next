import { Suspense } from 'react';
import PaginaAnimal from '../../../../components/telas/PaginaAnimal';

// /loja/caes, /loja/gatos, /loja/outros-pets ... (?categoria=Ração abre já filtrado)
export default async function Page({ params }) {
    const { animal } = await params;
    return <Suspense><PaginaAnimal id={animal} /></Suspense>;
}
