// GET  /api/agendamentos  → meus agendamentos (o admin vê todos)
// POST /api/agendamentos  { petId, servicoId, adicionais: ["unhas"], data: "2026-11-20", hora: "08:00" }
//   o admin também agenda: o pet escolhido define o cliente
import { prisma } from '../../../lib/db';
import { rota, lerCorpo, exigir, ErroHttp } from '../../../lib/api';
import { exigirLogin } from '../../../lib/auth';
import { HORARIOS, TIPOS_BANHO, hojeISO, ehDomingo, horarioPassou, vagaDe, banhoGratisDisponivel, calcularAgendamento } from '../../../lib/regras';
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
    const quem = await exigirLogin(req);
    const b = await lerCorpo(req);
    const pet = await prisma.pet.findUnique({ where: { id: Number(b.petId) } });
    exigir(pet && (quem.admin || pet.donoId === quem.id), quem.admin ? 'Escolha um pet' : 'Escolha um dos seus pets');
    // dono do pet (com a assinatura, para saber se tem banho grátis)
    const u = await prisma.usuario.findUnique({ where: { id: pet.donoId }, include: { assinatura: true } });
    exigir(TIPOS_BANHO.includes(pet.tipo), 'Banho e Tosa é só para cães e gatos');
    const servico = await prisma.servico.findUnique({ where: { id: String(b.servicoId) } });
    exigir(servico, 'Serviço inválido');
    const ids = Array.isArray(b.adicionais) ? b.adicionais.map(String) : [];
    const adicionais = await prisma.adicional.findMany({ where: { id: { in: ids } } });
    exigir(adicionais.length === ids.length, 'Adicional inválido');
    exigir(/^\d{4}-\d{2}-\d{2}$/.test(b.data || '') && b.data >= hojeISO(), 'Escolha uma data a partir de hoje');
    exigir(!ehDomingo(b.data), 'Não abrimos aos domingos');
    exigir(HORARIOS.includes(b.hora), 'Horário inválido');
    exigir(!horarioPassou(b.data, b.hora), 'Esse horário já passou. Escolha outro.');

    const ESTA_OCUPADO = 'Esse horário acabou de ser ocupado. Escolha outro.';
    const criado = await prisma.$transaction(async (tx) => {
        const ocupado = await tx.agendamento.findFirst({ where: { data: b.data, hora: b.hora, status: { not: 'Cancelado' } } });
        if (ocupado) throw new ErroHttp(409, ESTA_OCUPADO);
        const doCliente = await tx.agendamento.findMany({ where: { clienteId: u.id } });
        const calc = calcularAgendamento({ servico, porte: pet.porte, adicionais, gratis: banhoGratisDisponivel(u, b.data, doCliente) });
        return tx.agendamento.create({
            data: {
                clienteId: u.id, petId: pet.id, petNome: pet.nome, especie: pet.tipo, porte: pet.porte, servicoId: servico.id,
                adicionais: ids.join(','), data: b.data, hora: b.hora, vaga: vagaDe(b.data, b.hora), valor: calc.total, gratis: calc.gratis,
            },
            include: { servico: true },
        });
    }).catch((e) => {
        // P2002 = o banco recusou porque a vaga já existe (duas pessoas clicaram ao mesmo tempo)
        if (e.code === 'P2002') throw new ErroHttp(409, ESTA_OCUPADO);
        throw e;
    });
    return Response.json(agendamentoParaFront(criado), { status: 201 });
});
