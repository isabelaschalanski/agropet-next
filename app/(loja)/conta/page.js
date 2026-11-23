import { redirect } from 'next/navigation';

// /conta abre a primeira aba
export default function Page() {
    redirect('/conta/pedidos');
}
