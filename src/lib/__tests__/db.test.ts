import { db } from "../db";

describe("Database Connection", () => {
  // Fecha a conexão depois dos testes
  afterAll(async () => {
    await db.$disconnect();
  });

  it("deve conectar ao banco de dados", async () => {
    try {
      // Tenta fazer uma query simples
      const result = await db.$queryRaw`SELECT 1`;
      expect(result).toBeDefined();
      console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao conectar com o banco de dados:", error);
      fail("Não foi possível conectar ao banco de dados");
    }
  });
});
