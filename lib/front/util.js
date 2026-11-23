// Funções pequenas usadas pelas telas (formatar dinheiro, datas, imagens...).
// As regras do negócio (planos, portes, horários) ficam em lib/regras.js, que o back-end também usa.

export const dinheiro = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const soData = (d) => (d ? String(d).slice(0, 10) : '');
export const dataBR = (iso) => (iso ? String(iso).slice(0, 10).split('-').reverse().join('/') : '');
export const isoDe = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function diasAtras(n) { const d = new Date(); d.setDate(d.getDate() - n); return isoDe(d); }
export const diaMes = (iso) => iso.slice(8, 10) + '/' + iso.slice(5, 7);
export const numPedido = (id) => String(id).padStart(3, '0');
export const iniciais = (nome) => String(nome || '?').split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');

export const CORES = ['amarelo', 'azul', 'laranja', 'roxo', 'verde', 'rosa', 'cinza'];
export const TIPOS_PET = ['Cachorro', 'Gato', 'Pássaro', 'Peixe', 'Roedor', 'Outro'];
export const iconePet = (tipo) => ({ Cachorro: '🐶', Gato: '🐱', Pássaro: '🐦', Peixe: '🐟', Roedor: '🐹' }[tipo] || '🐾');
export const iconePagamento = (m) => (m === 'Pix' ? '⚡' : m === 'Boleto' ? '🧾' : '💳');

// Filtros da página de cada animal
export const FAIXAS = { ate50: ['Até R$ 50', 0, 50], de50a100: ['R$ 50 a R$ 100', 50, 100], de100a200: ['R$ 100 a R$ 200', 100, 200], acima200: ['Acima de R$ 200', 200, Infinity] };
export const ORDENS = { relevancia: 'Mais relevantes', menor: 'Menor preço', maior: 'Maior preço', az: 'Nome de A-Z', za: 'Nome de Z-A', novos: 'Mais novos' };

// Busca sem diferenciar acento nem maiúscula: "racao" acha "Ração"
export const semAcento = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Link do WhatsApp com mensagem pronta (o número vira só dígitos, com 55 do Brasil na frente)
export function linkWhats(telefone, texto) {
    let n = String(telefone || '').replace(/\D/g, '');
    if (!n) return '';
    if (n.length <= 11) n = '55' + n;
    return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}

// Diminui a foto escolhida (no máximo "max" pixels) antes de mandar para o banco
export function reduzirImagem(arquivo, max = 600) {
    return new Promise((resolve, reject) => {
        if (!arquivo || !arquivo.type.startsWith('image/')) return reject(new Error('Escolha um arquivo de imagem'));
        const leitor = new FileReader();
        leitor.onload = () => {
            const img = new Image();
            img.onload = () => {
                const escala = Math.min(1, max / Math.max(img.width, img.height));
                const c = document.createElement('canvas');
                c.width = Math.round(img.width * escala); c.height = Math.round(img.height * escala);
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
                ctx.drawImage(img, 0, 0, c.width, c.height);
                resolve(c.toDataURL('image/jpeg', 0.82));
            };
            img.onerror = () => reject(new Error('Não foi possível abrir essa imagem'));
            img.src = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    });
}
