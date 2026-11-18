// Confere os dados de um produto enviados pelo gerenciamento
import { prisma } from '../../../lib/db';
import { exigir } from '../../../lib/api';

export async function dadosDoProduto(b, parcial = false) {
    const d = {};
    if (!parcial || b.nome !== undefined) { exigir(b.nome && String(b.nome).trim(), 'Informe o nome'); d.nome = String(b.nome).trim(); }
    if (!parcial || b.preco !== undefined) { exigir(Number(b.preco) >= 0, 'Preço inválido'); d.preco = Number(b.preco); }
    if (!parcial || b.estoque !== undefined) { exigir(Number.isInteger(Number(b.estoque)) && Number(b.estoque) >= 0, 'Estoque inválido'); d.estoque = Number(b.estoque); }
    for (const campo of ['descricao', 'icone', 'cor', 'selo', 'imagem']) if (b[campo] !== undefined) d[campo] = String(b[campo]);
    if (b.ativo !== undefined) d.ativo = !!b.ativo;
    if (!parcial || b.animal !== undefined || b.categoria !== undefined) {
        const cat = await prisma.categoria.findUnique({ where: { animalId_nome: { animalId: String(b.animal), nome: String(b.categoria) } } });
        exigir(cat, 'Animal ou categoria não existe');
        d.animalId = cat.animalId;
        d.categoriaId = cat.id;
    }
    return d;
}
