'use client';
// Pedacinhos de imagem usados em várias telas: foto do produto, ícone do animal e imagem dos banners.
import { useLoja } from '../Provedor';

// Foto do produto ou, se não tiver, o emoji
export function ImgProduto({ p }) {
    return p.imagem ? <img src={p.imagem} alt={p.nome} /> : <>{p.icone}</>;
}

// Imagem do animal (enviada pelo admin) ou o emoji
export function IconeAnimal({ animal }) {
    const { site } = useLoja();
    const img = site.imgAnimais[animal.id];
    return img ? <img src={img} alt={animal.nome} /> : <>{animal.icone}</>;
}

// Lado direito dos banners: a imagem do banner ou 4 emojis
export function VisualSlide({ i, emojis }) {
    const { imgSlide } = useLoja();
    const img = imgSlide(i);
    if (img) return <img className="slide-img" src={img} alt="" />;
    return <div className="bichos">{emojis.map(e => <span key={e}>{e}</span>)}</div>;
}
