// Leva para o Supabase Storage as fotos que ainda estão guardadas como texto dentro do banco
// (produtos, animais e banners enviados antes desta mudança). No banco fica só o link.
// Rodar UMA vez, por uma pessoa só:   node prisma/mover-imagens.mjs
//
// Precisa no .env: DATABASE_URL, SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.
// Pode rodar de novo sem problema: o que já é link fica como está.

import { readFileSync, existsSync } from 'node:fs';
import prismaPkg from '@prisma/client';

// lê o .env (o Prisma lê sozinho só o DATABASE_URL)
const arqEnv = new URL('../.env', import.meta.url);
if (existsSync(arqEnv)) {
    for (const linha of readFileSync(arqEnv, 'utf8').split(/\r?\n/)) {
        const m = linha.match(/^\s*([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
}

const { PrismaClient } = prismaPkg;

// Envia para o Storage (o mesmo que o lib/imagens.js faz no site)
const BALDE = 'imagens';
const URL_SB = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const storageLigado = () => !!(URL_SB && CHAVE);
const cab = (extra) => ({ Authorization: 'Bearer ' + CHAVE, apikey: CHAVE, ...extra });
async function salvarImagem(texto, pasta) {
    const m = String(texto).match(/^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/);
    if (!m) return texto;
    const caminho = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${m[2] === 'jpeg' ? 'jpg' : m[2]}`;
    const enviar = () => fetch(`${URL_SB}/storage/v1/object/${BALDE}/${caminho}`, {
        method: 'POST', headers: cab({ 'Content-Type': m[1], 'x-upsert': 'true', 'cache-control': 'max-age=31536000' }), body: Buffer.from(m[3], 'base64'),
    });
    let r = await enviar();
    if (r.status === 404 || r.status === 400) {   // cria o bucket público na primeira vez
        await fetch(`${URL_SB}/storage/v1/bucket`, { method: 'POST', headers: cab({ 'Content-Type': 'application/json' }), body: JSON.stringify({ id: BALDE, name: BALDE, public: true }) });
        r = await enviar();
    }
    if (!r.ok) throw new Error(`o Storage recusou a imagem (${r.status}): ${await r.text().catch(() => '')}`);
    return `${URL_SB}/storage/v1/object/public/${BALDE}/${caminho}`;
}
const prisma = new PrismaClient();
const ehTexto = (v) => String(v || '').startsWith('data:image/');

if (!storageLigado()) {
    console.log('Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.');
    process.exit(1);
}

let movidas = 0;
try {
    for (const p of await prisma.produto.findMany()) {
        if (!ehTexto(p.imagem)) continue;
        await prisma.produto.update({ where: { id: p.id }, data: { imagem: await salvarImagem(p.imagem, 'produtos') } });
        console.log('produto:', p.nome); movidas++;
    }
    for (const a of await prisma.animal.findMany()) {
        if (!ehTexto(a.imagem)) continue;
        await prisma.animal.update({ where: { id: a.id }, data: { imagem: await salvarImagem(a.imagem, 'animais') } });
        console.log('animal:', a.nome); movidas++;
    }
    const c = await prisma.configuracaoSite.findUnique({ where: { id: 1 } });
    let slides = [];
    try { slides = JSON.parse(c.imgSlides); } catch { /* sem banners próprios */ }
    if (Array.isArray(slides) && slides.some(ehTexto)) {
        const novos = [];
        for (const s of slides) novos.push(ehTexto(s) ? await salvarImagem(s, 'banners') : s);
        await prisma.configuracaoSite.update({ where: { id: 1 }, data: { imgSlides: JSON.stringify(novos) } });
        movidas += slides.filter(ehTexto).length;
        console.log('banners da página inicial');
    }
    console.log(movidas ? `Pronto! ${movidas} imagem(ns) foram para o Storage.` : 'Nenhuma imagem para mover: o banco já está só com links.');
} catch (e) {
    console.log('Parou com erro:', e.message);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
