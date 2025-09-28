import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/diagnostico", async (req, res) => {
  try {
    const angulos = req.body;

    // chamada para a IA
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // modelo mais barato e rápido
        input: `Faça um pré-diagnóstico cefalométrico com base nestes ângulos: ${JSON.stringify(
          angulos
        )}`,
      }),
    });

    const diagnostico = data?.output?.[0]?.content?.[0]?.text || "Não foi possível gerar diagnóstico";
    response.json({ diagnostico });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar diagnóstico" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
