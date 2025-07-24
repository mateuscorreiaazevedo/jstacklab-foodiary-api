import OpenAI, { toFile } from "openai";

type GetMealDetailsFromTextParams = {
  text: string;
  createdAt: Date;
};

const client = new OpenAI();

export async function transcribeAudio(file: Buffer) {
  const text = await client.audio.transcriptions.create({
    model: "whisper-1",
    language: "pt",
    response_format: "text",
    file: await toFile(file, "audio.m4a", {
      type: "audio/m4a",
    }),
  });

  return text;
}

export async function getMealDetailsFromText({
  createdAt,
  text,
}: GetMealDetailsFromTextParams) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `
          Você é um nutricionista e está atendendo um de seus pacientes. Você deve responder para ele seguindo as instruções a baixo.

          Seu papel é:
          1. Dar um nome e escolher um emoji (de uma refeição ou comida) para a refeição baseado no horário dela.
          2. Identificar os alimentos presentes na imagem.
          3. Estimar, para cada alimento identificado:
            - Nome do alimento (em português)
            - Quantidade aproximada (em gramas ou unidades)
            - Calorias (kcal)
            - Carboidratos (g)
            - Proteínas (g)
            - Gorduras (g)

          Seja direto, objetivo e evite explicações. Apenas retorne os dados em JSON no formato abaixo:

          {
            "name": "Jantar",
            "icon": "🍗",
            "foods": [
              {
                "name": "Arroz branco cozido",
                "quantity": "150g",
                "calories": 193,
                "carbs": 42,
                "proteins": 3.5,
                "fats": 0.4
              },
              {
                "name": "Peito de frango grelhado",
                "quantity": "100g",
                "calories": 165,
                "carbs": 0,
                "proteins": 31,
                "fats": 3.6
              }
            ]
          }
        `,
      },
      {
        role: 'user',
        content: `
          Data: ${createdAt}
          Refeição: ${text}
        `,
      },
    ],
  });

  const json = response.choices[0].message.content;

  if (!json) {
    throw new Error('Failed to process meal.');
  }

  return JSON.parse(json);
}