import { Suspense } from 'react';
import Busca from '../../../components/telas/Busca';

export const metadata = { title: 'Busca · AgroPet' };

export default function Page() {
    return <Suspense><Busca /></Suspense>;
}
