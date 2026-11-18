// Ajudantes usados por todas as rotas da API

export class ErroHttp extends Error {
    constructor(status, mensagem) {
        super(mensagem);
        this.status = status;
    }
}

// Envolve a rota: se der erro, devolve { erro: "mensagem" } com o código certo
export function rota(funcao) {
    return async (requisicao, contexto) => {
        try {
            return await funcao(requisicao, contexto);
        } catch (e) {
            if (e instanceof ErroHttp) return Response.json({ erro: e.message }, { status: e.status });
            console.error(e);
            return Response.json({ erro: 'Erro no servidor' }, { status: 500 });
        }
    };
}

export async function lerCorpo(requisicao) {
    try {
        return await requisicao.json();
    } catch {
        throw new ErroHttp(400, 'Corpo da requisição inválido (envie JSON)');
    }
}

export function exigir(condicao, mensagem, status = 400) {
    if (!condicao) throw new ErroHttp(status, mensagem);
}

export async function lerId(contexto) {
    const { id } = await contexto.params;
    const n = Number(id);
    exigir(Number.isInteger(n) && n > 0, 'Id inválido');
    return n;
}
