import { PedidoConfirmado } from '../../../../components/telas/Carrinho';

export default async function Page({ params }) {
    const { id } = await params;
    return <PedidoConfirmado id={id} />;
}
