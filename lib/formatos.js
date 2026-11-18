// Formatos que a API devolve para o front (deixa os dados "planos" e fáceis de usar)

export function produtoParaFront(p) {
    return {
        id: p.id, nome: p.nome, descricao: p.descricao, preco: p.preco, estoque: p.estoque,
        icone: p.icone, cor: p.cor, selo: p.selo, imagem: p.imagem, ativo: p.ativo,
        animal: p.animalId, animalNome: p.animal ? p.animal.nome : undefined,
        categoria: p.categoria ? p.categoria.nome : undefined,
    };
}

export function agendamentoParaFront(a) {
    return {
        ...a,
        adicionais: a.adicionais ? a.adicionais.split(',').filter(Boolean) : [],
        servicoNome: a.servico ? a.servico.nome : undefined,
        servico: undefined,
        clienteNome: a.cliente ? a.cliente.nome : undefined,
        clienteTelefone: a.cliente ? a.cliente.telefone : undefined,
        cliente: undefined,
    };
}

export function configParaFront(c) {
    let imgSlides = ['', '', ''];
    try { imgSlides = JSON.parse(c.imgSlides); } catch { /* mantém vazio */ }
    return { ...c, imgSlides };
}
