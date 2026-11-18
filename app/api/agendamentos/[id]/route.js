// PATCH /api/agendamentos/7  { status }
//   cliente: só pode cancelar o próprio agendamento · admin: Agendado, Concluído ou Cancelado
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, exigir, ErroHttp } from '../../../../lib/api';
import { exigirLogin } from '../../../../lib/auth';
import { STATUS_AGENDA } from '../../../../lib/regras';
import { agendamentoParaFront } from '../../../../lib/formatos';

export const PATCH = rota(async (req, ctx) => {
    const u = await exigirLogin(req);
    const id = await lerId(ctx);
    const { status } = await lerCorpo(req);
    const a = await prisma.agendamento.findUnique({ where: { id } });
    if (!a || (!u.admin && a.clienteId !== u.id)) throw new ErroHttp(404, 'Agendamento não encontrado');
    if (u.admin) exigir(STATUS_AGENDA.includes(status), 'Status inválido');
    else exigir(status === 'Cancelado' && a.status === 'Agendado', 'Você só pode cancelar um agendamento marcado');
    const novo = await prisma.agendamento.update({ where: { id }, data: { status }, include: { servico: true } });
    return Response.json(agendamentoParaFront(novo));
});
