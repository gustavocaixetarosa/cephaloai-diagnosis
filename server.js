import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({});

const gerarPrompt = (angulos) => {
  return `
  Gere um pré-diagnóstico cefalométrico com base nestes ângulos: ${JSON.stringify(angulos)}

  Responda **somente em JSON** com o seguinte formato:
  {
    "diagnostico": "Resumo do pré-diagnóstico",
    "recomendacoes": ["Sugestao 1", "Sugestao 2", "Sugestao 3", "Sugestao 4"]
  }
  `;
};

const app = express();
app.use(express.json());
app.use(cors());

app.post("/diagnostico", async (req, res) => {
  try {
    const angulos = req.body;
    console.log("Ângulos recebidos:", JSON.stringify(angulos, null, 2));

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: gerarPrompt(angulos),
    });



    // Extrai texto da resposta do modelo
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("A IA não retornou texto na resposta.");
    }

    const cleanText = text.replace(/```json|```/g, "").trim();

    console.log("Resposta bruta da IA:", text);

    // Faz parse do JSON retornado pela IA
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.error("Erro no parse.");
    }

    return res.json({
      diagnostico: parsed.diagnostico,
      recomendacoes: parsed.recomendacoes,
    });

  } catch (err) {
    console.error("Erro ao gerar diagnóstico:", err);
    res.status(500).json({ error: "Erro ao gerar diagnóstico" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
