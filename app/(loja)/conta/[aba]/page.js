import { notFound } from 'next/navigation';
import Conta from '../../../../components/telas/Conta';

export const metadata = { title: 'Minha conta · AgroPet' };

const ABAS = ['pedidos', 'agendamentos', 'pets', 'clube', 'dados'];

// /conta/pedidos, /conta/agendamentos, /conta/pets, /conta/clube, /conta/dados
export default async function Page({ params }) {
    const { aba } = await params;
    if (!ABAS.includes(aba)) notFound();
    return <Conta aba={aba} />;
}
