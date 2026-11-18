// Conexão única com o banco (evita abrir várias conexões enquanto o "npm run dev" recarrega)
import { PrismaClient } from '@prisma/client';

const globalParaPrisma = globalThis;

export const prisma = globalParaPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalParaPrisma.prisma = prisma;
