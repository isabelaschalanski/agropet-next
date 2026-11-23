'use client';
// Botão que leva para outra página. Usado onde o CSS foi feito para <button>
// (círculos da página inicial, menus laterais), para o visual continuar igual.
import { useRouter } from 'next/navigation';

export default function BotaoLink({ href, children, ...resto }) {
    const router = useRouter();
    return <button type="button" {...resto} onClick={() => { router.push(href); window.scrollTo(0, 0); }}>{children}</button>;
}
