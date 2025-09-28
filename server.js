import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({});

const gerarPrompt = (angulos) => {
  return `
  Gere um pre-diagnostico cefalometrico com base nestes angulos: ${JSON.stringify(angulos)}

  Responda **somente em JSON** com o seguinte formato:
{
  "diagnostico": "Resumo do pre-diagnostico",
  "recomendacoes: ["Sugestao 1", "Sugestao 2", "Sugestao 3", "Sugestao 4"]" -> Aqui no maximo 4
}
`;
}
const app = express();
app.use(express.json());
app.use(cors());

app.post("/diagnostico", async (req, res) => {
  try {
    const angulos = req.body;
    console.log(angulos);

    // chamada para a IA
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: gerarPrompt(angulos)
    });

    //const data = await response.json();

    console.log(response.text);

    //const diagnostico = data?.output?.[0]?.content?.[0]?.text || "Não foi possível gerar diagnóstico";

    //response.json({ diagnostico });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar diagnóstico" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
