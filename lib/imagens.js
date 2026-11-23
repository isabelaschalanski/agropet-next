// Fotos enviadas pelo gerenciamento (produtos, banners e animais).
// O front manda a foto como texto ("data:image/jpeg;base64,..."). Aqui ela vai para o
// Supabase Storage (o lugar de arquivos do Supabase) e no banco fica só o link.
//
// Precisa de duas variáveis no .env (e na Vercel):
//   SUPABASE_URL="https://xxxx.supabase.co"
//   SUPABASE_SERVICE_ROLE_KEY="chave service_role"   ← secreta, nunca no GitHub
// Sem elas (por exemplo, testando sem internet), a foto continua indo como texto para o banco.

import { ErroHttp } from './api.js';

const BALDE = 'imagens'; // nome do "bucket" (pasta pública) no Supabase Storage

const url = () => (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const chave = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const storageLigado = () => !!(url() && chave());

const cabecalhos = (extra = {}) => ({ Authorization: 'Bearer ' + chave(), apikey: chave(), ...extra });
const linkPublico = (caminho) => `${url()}/storage/v1/object/public/${BALDE}/${caminho}`;
const ehNossa = (link) => storageLigado() && String(link || '').startsWith(`${url()}/storage/v1/object/public/${BALDE}/`);

// Cria o bucket público na primeira vez (se já existir, o Supabase só responde que existe)
async function criarBalde() {
    await fetch(`${url()}/storage/v1/bucket`, {
        method: 'POST',
        headers: cabecalhos({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: BALDE, name: BALDE, public: true, file_size_limit: 2 * 1024 * 1024 }),
    });
}

async function enviar(caminho, bytes, tipo) {
    return fetch(`${url()}/storage/v1/object/${BALDE}/${caminho}`, {
        method: 'POST',
        headers: cabecalhos({ 'Content-Type': tipo, 'x-upsert': 'true', 'cache-control': 'max-age=31536000' }),
        body: bytes,
    });
}

// Recebe o valor do campo "imagem" e devolve o que deve ser salvo no banco:
//   "data:image/..." → envia para o Storage e devolve o link
//   link ou ""       → devolve igual (já está no Storage, é uma imagem padrão, ou foi removida)
export async function salvarImagem(valor, pasta = 'geral') {
    const texto = String(valor || '');
    const m = texto.match(/^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/);
    if (!m || !storageLigado()) return texto;
    const [, tipo, ext] = m;
    const bytes = Buffer.from(m[3], 'base64');
    if (bytes.length > 2 * 1024 * 1024) throw new ErroHttp(400, 'Imagem grande demais (máximo 2 MB)');
    const caminho = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext === 'jpeg' ? 'jpg' : ext}`;
    let r = await enviar(caminho, bytes, tipo);
    if (r.status === 404 || r.status === 400) {           // bucket ainda não existe: cria e tenta de novo
        await criarBalde();
        r = await enviar(caminho, bytes, tipo);
    }
    if (!r.ok) {
        console.error('Storage recusou a imagem:', r.status, await r.text().catch(() => ''));
        throw new ErroHttp(502, 'Não foi possível salvar a imagem');
    }
    return linkPublico(caminho);
}

// Apaga do Storage uma imagem que não é mais usada (se der erro, não atrapalha nada)
export async function apagarImagem(link) {
    if (!ehNossa(link)) return;
    const caminho = String(link).slice(`${url()}/storage/v1/object/public/${BALDE}/`.length);
    try {
        await fetch(`${url()}/storage/v1/object/${BALDE}`, {
            method: 'DELETE',
            headers: cabecalhos({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ prefixes: [caminho] }),
        });
    } catch { /* sem problema: fica um arquivo sobrando no Storage */ }
}
