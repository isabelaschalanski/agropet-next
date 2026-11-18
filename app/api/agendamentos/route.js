// GET  /api/agendamentos  → meus agendamentos (o admin vê todos)
// POST /api/agendamentos  { petId, servicoId, adicionais: ["unhas"], data: "2026-11-20", hora: "08:00" }
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir, ErroHttp } from '../../../lib/api';
import { exigirLogin } from '../../../lib/auth';
import { HORARIOS, TIPOS_BANHO, hojeISO, ehDomingo, banhoGratisDisponivel, calcularAgendamento } from '../../../lib/regras';
import { agendamentoParaFront } from '../../../lib/formatos';

export const GET = rota(async (req) => {
    const u = await exigirLogin(req);
    const lista = await prisma.agendamento.findMany({
        where: u.admin ? {} : { clienteId: u.id },
        include: { servico: true, cliente: { select: { nome: true, telefone: true } } },
        orderBy: [{ data: 'asc' }, { hora: 'asc' }],
    });
    return Response.json(lista.map(agendamentoParaFront));
});

export const POST = rota(async (req) => {
    const u = await exigirLogin(req);
    exigir(!u.admin, 'O admin não faz agendamentos');
    const b = await lerCorpo(req);
    const pet = await prisma.pet.findUnique({ where: { id: Number(b.petId) } });
    exigir(pet && pet.donoId === u.id, 'Escolha um dos seus pets');
    exigir(TIPOS_BANHO.includes(pet.tipo), 'Banho e Tosa é só para cães e gatos');
    const servico = await prisma.servico.findUnique({ where: { id: String(b.servicoId) } });
    exigir(servico, 'Serviço inválido');
    const ids = Array.isArray(b.adicionais) ? b.adicionais.map(String) : [];
    const adicionais = await prisma.adicional.findMany({ where: { id: { in: ids } } });
    exigir(adicionais.length === ids.length, 'Adicional inválido');
    exigir(/^\d{4}-\d{2}-\d{2}$/.test(b.data || '') && b.data >= hojeISO(), 'Escolha uma data a partir de hoje');
    exigir(!ehDomingo(b.data), 'Não abrimos aos domingos');
    exigir(HORARIOS.includes(b.hora), 'Horário inválido');

    const criado = await prisma.$transaction(async (tx) => {
        const ocupado = await tx.agendamento.findFirst({ where: { data: b.data, hora: b.hora, status: { not: 'Cancelado' } } });
        if (ocupado) throw new ErroHttp(409, 'Esse horário acabou de ser ocupado. Escolha outro.');
        const doCliente = await tx.agendamento.findMany({ where: { clienteId: u.id } });
        const calc = calcularAgendamento({ servico, porte: pet.porte, adicionais, gratis: banhoGratisDisponivel(u, b.data, doCliente) });
        return tx.agendamento.create({
            data: {
                clienteId: u.id, petId: pet.id, petNome: pet.nome, especie: pet.tipo, porte: pet.porte, servicoId: servico.id,
                adicionais: ids.join(','), data: b.data, hora: b.hora, valor: calc.total, gratis: calc.gratis,
            },
            include: { servico: true },
        });
    });
    return Response.json(agendamentoParaFront(criado), { status: 201 });
});
