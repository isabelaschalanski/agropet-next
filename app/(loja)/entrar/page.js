import { Suspense } from 'react';
import Entrar from '../../../components/telas/Entrar';

export const metadata = { title: 'Entrar · AgroPet' };

// /entrar?voltar=/finalizar → depois do login volta para /finalizar
export default function Page() {
    return <Suspense><Entrar /></Suspense>;
}
