const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

// Comprobar que existe la API key
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Falta OPENAI_API_KEY");
    console.error("Configura la API key antes de iniciar FINDER.");
    process.exit(1);
}

// Conectar con OpenAI
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Permitir recibir JSON
app.use(express.json());

// Servir nuestro index.html
app.use(express.static(__dirname));

// Endpoint de FINDER
app.post("/api/finder", async (req, res) => {

    try {

        const goal = req.body?.goal;

        // Comprobar que el usuario escribió algo
        if (!goal || typeof goal !== "string" || !goal.trim()) {
            return res.status(400).json({
                error: "No se recibió ningún objetivo."
            });
        }

        console.log("🔎 Objetivo recibido:");
        console.log(goal);

        // Preguntamos al cerebro de FINDER
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

No inventes herramientas desconocidas.

Herramientas que FINDER conoce actualmente:

- ChatGPT: texto, análisis, ideas, escritura, estudio y programación.
- Claude: escritura, análisis y programación.
- Gemini: investigación, texto y análisis.
- Midjourney: generación de imágenes.
- Adobe Firefly: imágenes y diseño.
- Runway: generación y edición de vídeo.
- Pika: generación de vídeo.
- ElevenLabs: generación de voz.
- GitHub Copilot: programación.

Devuelve una respuesta clara y estructurada.
`,

            input: goal
        });

        console.log("✅ Respuesta recibida de la IA");

        // Enviar respuesta al navegador
        res.json({
            result: response.output_text
        });

    } catch (error) {

        console.error("❌ ERROR:");
        console.error(error);

        res.status(500).json({
            error: "FINDER no pudo contactar con el cerebro de IA."
        });
    }
});

// Arrancar servidor
app.listen(PORT, () => {

    console.log("");
    console.log("🚀 ===============================");
    console.log("🚀 FINDER ESTÁ FUNCIONANDO");
    console.log("🚀 ===============================");
    console.log("");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("");
});