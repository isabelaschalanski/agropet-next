// PATCH /api/agendamentos/7  { status }
//   cliente: só pode cancelar o próprio agendamento, antes do horário · admin: Agendado, Concluído ou Cancelado
//   cancelar libera o horário; voltar um cancelado para Agendado só funciona se o horário ainda estiver livre
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, exigir, ErroHttp } from '../../../../lib/api';
import { exigirLogin } from '../../../../lib/auth';
import { STATUS_AGENDA, horarioPassou, vagaDe } from '../../../../lib/regras';
import { agendamentoParaFront } from '../../../../lib/formatos';

export const PATCH = rota(async (req, ctx) => {
    const u = await exigirLogin(req);
    const id = await lerId(ctx);
    const { status } = await lerCorpo(req);
    const a = await prisma.agendamento.findUnique({ where: { id } });
    if (!a || (!u.admin && a.clienteId !== u.id)) throw new ErroHttp(404, 'Agendamento não encontrado');
    if (u.admin) exigir(STATUS_AGENDA.includes(status), 'Status inválido');
    else {
        exigir(status === 'Cancelado' && a.status === 'Agendado', 'Você só pode cancelar um agendamento marcado');
        exigir(!horarioPassou(a.data, a.hora), 'O horário desse agendamento já passou');
    }

    const vaga = status === 'Cancelado' ? null : vagaDe(a.data, a.hora);
    if (vaga && a.status === 'Cancelado') {
        const outro = await prisma.agendamento.findFirst({ where: { data: a.data, hora: a.hora, status: { not: 'Cancelado' }, id: { not: id } } });
        if (outro) throw new ErroHttp(409, 'Esse horário já foi ocupado por outro agendamento');
    }
    try {
        const novo = await prisma.agendamento.update({ where: { id }, data: { status, vaga }, include: { servico: true } });
        return Response.json(agendamentoParaFront(novo));
    } catch (e) {
        if (e.code === 'P2002') throw new ErroHttp(409, 'Esse horário já foi ocupado por outro agendamento');
        throw e;
    }
});
