// PATCH  /api/agendamentos/7
//   cliente: { status: "Cancelado" } no próprio agendamento, antes do horário
//   admin:   { status } e/ou { data, hora, servicoId, adicionais } (remarcar/trocar serviço) e/ou { arquivado }
//   cancelar libera o horário; voltar um cancelado para Agendado só funciona se o horário ainda estiver livre
// DELETE /api/agendamentos/7 (admin) → apaga de vez (só arquivados)
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, lerId, exigir, ErroHttp } from '../../../../lib/api';
import { exigirLogin, exigirAdmin } from '../../../../lib/auth';
import { STATUS_AGENDA, HORARIOS, ehDomingo, horarioPassou, vagaDe, calcularAgendamento } from '../../../../lib/regras';
import { agendamentoParaFront } from '../../../../lib/formatos';

const OCUPADO = 'Esse horário já está ocupado por outro agendamento';

export const PATCH = rota(async (req, ctx) => {
    const u = await exigirLogin(req);
    const id = await lerId(ctx);
    const b = await lerCorpo(req);
    const a = await prisma.agendamento.findUnique({ where: { id } });
    if (!a || (!u.admin && a.clienteId !== u.id)) throw new ErroHttp(404, 'Agendamento não encontrado');

    const data = {};
    if (!u.admin) {
        exigir(b.status === 'Cancelado' && a.status === 'Agendado', 'Você só pode cancelar um agendamento marcado');
        exigir(!horarioPassou(a.data, a.hora), 'O horário desse agendamento já passou');
        data.status = 'Cancelado';
    } else {
        if (b.status !== undefined) { exigir(STATUS_AGENDA.includes(b.status), 'Status inválido'); data.status = b.status; }
        // remarcar e/ou trocar serviço
        if (b.data !== undefined || b.hora !== undefined) {
            const nd = b.data ?? a.data, nh = b.hora ?? a.hora;
            exigir(/^\d{4}-\d{2}-\d{2}$/.test(nd), 'Data inválida');
            exigir(!ehDomingo(nd), 'Não abrimos aos domingos');
            exigir(HORARIOS.includes(nh), 'Horário inválido');
            exigir(!horarioPassou(nd, nh), 'Esse horário já passou');
            data.data = nd; data.hora = nh;
        }
        if (b.servicoId !== undefined || b.adicionais !== undefined) {
            const servico = await prisma.servico.findUnique({ where: { id: String(b.servicoId ?? a.servicoId) } });
            exigir(servico, 'Serviço inválido');
            const ids = Array.isArray(b.adicionais) ? b.adicionais.map(String) : a.adicionais.split(',').filter(Boolean);
            const adicionais = await prisma.adicional.findMany({ where: { id: { in: ids } } });
            exigir(adicionais.length === ids.length, 'Adicional inválido');
            const calc = calcularAgendamento({ servico, porte: a.porte, adicionais, gratis: a.gratis });
            Object.assign(data, { servicoId: servico.id, adicionais: ids.join(','), valor: calc.total, gratis: calc.gratis });
        }
        if (b.arquivado !== undefined) {
            exigir(!b.arquivado || ['Concluído', 'Cancelado'].includes(data.status || a.status), 'Só dá para arquivar agendamentos concluídos ou cancelados');
            data.arquivado = !!b.arquivado;
        }
    }

    const status = data.status || a.status;
    const dia = data.data || a.data, hora = data.hora || a.hora;
    const vaga = status === 'Cancelado' ? null : vagaDe(dia, hora);
    if (vaga && vaga !== a.vaga) {
        const outro = await prisma.agendamento.findFirst({ where: { data: dia, hora, status: { not: 'Cancelado' }, id: { not: id } } });
        if (outro) throw new ErroHttp(409, OCUPADO);
    }
    data.vaga = vaga;
    try {
        const novo = await prisma.agendamento.update({ where: { id }, data, include: { servico: true, cliente: { select: { nome: true, telefone: true } } } });
        return Response.json(agendamentoParaFront(novo));
    } catch (e) {
        if (e.code === 'P2002') throw new ErroHttp(409, OCUPADO);
        throw e;
    }
});

export const DELETE = rota(async (req, ctx) => {
    await exigirAdmin(req);
    const id = await lerId(ctx);
    const a = await prisma.agendamento.findUnique({ where: { id } });
    if (!a) throw new ErroHttp(404, 'Agendamento não encontrado');
    exigir(a.arquivado, 'Arquive o agendamento antes de excluir');
    await prisma.agendamento.delete({ where: { id } });
    return Response.json({ ok: true });
});
