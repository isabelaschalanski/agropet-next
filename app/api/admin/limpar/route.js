// POST /api/admin/limpar (admin) { confirmar: "LIMPAR" }
//   apaga os dados de teste: clientes, pets, pedidos, agendamentos e assinaturas.
//   Mantém o catálogo (produtos, animais, serviços), as configurações do site e a conta do admin.
import { prisma } from '../../../../lib/db';
import { rota, lerCorpo, exigir } from '../../../../lib/api';
import { exigirAdmin } from '../../../../lib/auth';

export const POST = rota(async (req) => {
    await exigirAdmin(req);
    const { confirmar } = await lerCorpo(req);
    exigir(confirmar === 'LIMPAR', 'Digite LIMPAR para confirmar');
    const [ag, ped] = await prisma.$transaction([
        prisma.agendamento.deleteMany({}),
        prisma.pedido.deleteMany({}),                        // itens vão junto
        prisma.assinatura.deleteMany({}),                    // rações escolhidas vão junto
        prisma.pet.deleteMany({}),
        prisma.usuario.deleteMany({ where: { admin: false } }), // sessões dos clientes vão junto
    ]);
    return Response.json({ ok: true, agendamentos: ag.count, pedidos: ped.count });
});
