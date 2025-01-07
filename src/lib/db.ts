/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

console.log("🔄 Iniciando conexão com o banco de dados...");

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Teste de conexão com uma query real
async function testConnection() {
  try {
    // Tenta fazer uma query simples
    const result = await db.$queryRaw`SELECT 1`;
    console.log("✅ Teste de query executado com sucesso:", result);
  } catch (error) {
    console.error("❌ Erro ao executar query:", error);
  }
}

// Executa o teste
testConnection();
