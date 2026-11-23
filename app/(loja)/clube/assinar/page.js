import { Suspense } from 'react';
import { Assinar } from '../../../../components/telas/Clube';

export const metadata = { title: 'Assinar o Clube · AgroPet' };

// /clube/assinar?plano=premium
export default function Page() {
    return <Suspense><Assinar /></Suspense>;
}
