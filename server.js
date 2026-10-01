const express = require("express");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: Falta OPENAI_API_KEY");
    console.error("Configura la API key en las variables de entorno.");
    process.exit(1);
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// Servir la aplicación web
app.use(express.static(__dirname));

// API de FINDER
app.post("/api/finder", async (req, res) => {
    try {
        const goal = req.body?.goal;

        if (!goal || typeof goal !== "string" || !goal.trim()) {
            return res.status(400).json({
                error: "No se recibió ningún objetivo."
            });
        }

        console.log("");
        console.log("🔎 NUEVO OBJETIVO:");
        console.log(goal);

        const response = await client.responses.create({
            model: "gpt-5.6-luna",

            instructions: `
Eres FINDER, un sistema inteligente que recomienda herramientas de inteligencia artificial.

Tu trabajo es analizar el objetivo del usuario y convertirlo en un FLOW de trabajo.

Debes:

1. Entender qué quiere conseguir el usuario.
2. Dividir el objetivo en tareas concretas.
3. Identificar qué tipo de IA necesita cada tarea.
4. Recomendar herramientas de IA adecuadas.
5. Explicar brevemente por qué cada herramienta sirve.
6. Ordenar las tareas de principio a fin.

FINDER conoce actualmente estas herramientas:

- ChatGPT: texto, análisis, ideas, escritura, estudio y programación.
- Claude: escritura, análisis y programación.
- Gemini: investigación, texto y análisis.
- Midjourney: generación de imágenes.
- Adobe Firefly: imágenes y diseño.
- Runway: generación y edición de vídeo.
- Pika: generación de vídeo.
- ElevenLabs: generación de voz.
- GitHub Copilot: programación.

No inventes herramientas desconocidas.

Cuando sea posible, estructura el FLOW así:

FLOW DE FINDER

Paso 1:
Tarea:
IA recomendada:
Por qué:

Paso 2:
Tarea:
IA recomendada:
Por qué:

Paso 3:
Tarea:
IA recomendada:
Por qué:

Al final explica brevemente cómo conectar los pasos para conseguir el objetivo del usuario.

Responde en español.
`,

            input: goal
        });

        console.log("✅ RESPUESTA RECIBIDA");

        res.json({
            result: response.output_text
        });

    } catch (error) {
        console.error("");
        console.error("❌ ERROR DE FINDER:");
        console.error(error);

        res.status(500).json({
            error: "FINDER no pudo contactar con el cerebro de IA."
        });
    }
});

// Arrancar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("🚀 ===============================");
    console.log("🚀 FINDER ESTÁ FUNCIONANDO");
    console.log("🚀 ===============================");
    console.log("");
    console.log(`🌐 Puerto: ${PORT}`);
    console.log("");
});