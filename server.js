// server.js source code last working model
//cesium-cert-buellton
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const openaiKey = process.env.OPENAI_API_KEY;
const nrelApiKey = process.env.NREL_API_KEY;
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Debug: log them to confirm they’re not undefined
console.log("NREL key from .env:", nrelApiKey);
console.log("OpenAI key from .env:", openaiKey);
console.log("OpenWeather key from .env:", openWeatherApiKey);

// Serve index.html at the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Generate LLM text using the OpenAI API
app.post("/api/generateLLMText", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert assistant in city planning for Buellton, CA. Your role is to help city planners and real estate professionals make informed decisions by combining HelioViews’ advanced solar analysis with local insights. You understand the impact of the second-term Trump administration's policies on residential and commercial real estate, solar energy, and permaculture industries. Your responses incorporate current data on energy costs, water quality, urban development projects, and local government planning. Draw from the latest Buellton project documents and city planning resources to provide accurate, actionable recommendations."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });
        const data = await response.json();
        console.log("OpenAI response:", JSON.stringify(data, null, 2));
        if (data.choices && data.choices.length > 0) {
            res.json({ text: data.choices[0].message.content });
        } else {
            console.error("No choices returned from OpenAI:", data);
            res.status(500).json({ error: data.error });
        }

    } catch (err) {
        console.error("LLM API error:", err);
        res.status(500).json({ error: "Error generating text." });
    }
});

// Expose public configuration
app.get("/api/config", (req, res) => {
    res.json({
        NREL_API_KEY: nrelApiKey,
        OPENWEATHER_API_KEY: openWeatherApiKey
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

