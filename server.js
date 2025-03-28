// cesium-cert-buellton, server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 3000;

const openaiKey = process.env.OPENAI_API_KEY;
const nrelApiKey = process.env.NREL_API_KEY;
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Debug: log keys to confirm they’re not undefined
console.log("NREL key from .env:", nrelApiKey);
console.log("OpenAI key from .env:", openaiKey);
console.log("OpenWeather key from .env:", openWeatherApiKey);

// Serve index.html at the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// --- New Custom Chat Endpoint using OpenAI ---
// Use the previous working require() for OpenAI.
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_CHAT_API_KEY || process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Helper function to retrieve context from City of Buellton documents
// Helper function to retrieve context from City of Buellton documents
const textFilePath1 = path.join(docsDir, "FINAL 2023-2031 Housing Element - Certified 8.1.23.txt");
const textFilePath2 = path.join(docsDir, "Home2Suites and Hyatt Place_Engage Overview.txt");
const textFilePath3 = path.join(docsDir, "Home2Suites and Hyatt Place_Planning Commission Reso. No. 19-02 18-FDP-02 and TPM 31062.txt");
const textFilePath4 = path.join(docsDir, "Home2Suites and Hyatt Place_Planning Commission Reso. No. 24-01 23-TE-05.txt");
const textFilePath5 = path.join(docsDir, "Hwy 246 Commercial Center_Applicant Letter and Project Narrative.txt");
const textFilePath6 = path.join(docsDir, "Hwy 246 Commercial Center_Comments from Second Conceptual Review.txt");
const textFilePath7 = path.join(docsDir, "Hwy 246 Commercial Center_Engage Overview.txt");
const textFilePath8 = path.join(docsDir, "Hwy 246 Commercial Center_Planning Staff Report for September 5 2024 Preliminary Review.txt");
const textFilePath9 = path.join(docsDir, "March-24-2022_Regular-City-Council-Meeting-Minutes.txt");
const textFilePath10 = path.join(docsDir, "PC Meeting February 6th 2025.txt");
const textFilePath11 = path.join(docsDir, "Planning Projects_Engage Overview.txt");
const textFilePath12 = path.join(docsDir, "Polo Village_Engage Overview.txt");
const textFilePath13 = path.join(docsDir, "The 518_Avenue of Flags Plans October 2024.txt");
const textFilePath14 = path.join(docsDir, "The 518_Engage Overview.txt");
const textFilePath15 = path.join(docsDir, "The 518_Project Description by Applicant.txt");
const textFilePath16 = path.join(docsDir, "The Buellton Hub Project_Approved Final Development Plans 18-FDP-06.txt");
const textFilePath17 = path.join(docsDir, "The Buellton Hub Project_Reso. No. 18-03.txt");
const textFilePath18 = path.join(docsDir, "The Buellton Hub Project_Staff Report Buellton HUB Time Extension .txt");
const textFilePath19 = path.join(docsDir, "The Buellton Hub Project_Time Extension Objection Letter Recieved 2-5-24.txt");
const textFilePath20 = path.join(docsDir, "Village Senior Apartments_Engage Overview.txt");
const textFilePath21 = path.join(docsDir, "BUE 17 Specific Plan_Project Site Vicinity Map.pdf");
const textFilePath22 = path.join(docsDir, "Buellton-district4-Final Map - 02-24-22.pdf");
const textFilePath23 = path.join(docsDir, "PC Meeting February 6th 2025.pdf");
const textFilePath24 = path.join(docsDir, "PC Meeting January 16th 2025.pdf");
const textFilePath25 = path.join(docsDir, "01-04-24 PC Minutes.txt");
const textFilePath26 = path.join(docsDir, "01-05-23 PC Minutes.txt");
const textFilePath27 = path.join(docsDir, "02-01-24 PC Minutes.txt");
const textFilePath28 = path.join(docsDir, "03-18-24 PC Minutes.txt");
const textFilePath29 = path.join(docsDir, "03-20-23 Industrial 291 23.0320 Development Plan Submit 02 R1.txt");
const textFilePath30 = path.join(docsDir, "03-21-24 PC Minutes.txt");
const textFilePath31 = path.join(docsDir, "04-06-23 PC Minutes.txt");
const textFilePath32 = path.join(docsDir, "04-20-23 PC Minutes.txt");
const textFilePath33 = path.join(docsDir, "4-11-24-PC_Agenda Item_1-1713483571.txt");
const textFilePath34 = path.join(docsDir, "05-02-24 PC Minutes.txt");
const textFilePath35 = path.join(docsDir, "06-06-24 PC Minutes.txt");
const textFilePath36 = path.join(docsDir, "06-20-24 PC minutes.txt");
const textFilePath37 = path.join(docsDir, "08-15-24 PC Minutes.txt");
const textFilePath38 = path.join(docsDir, "10-17-24 PC Minutes.txt");
const textFilePath39 = path.join(docsDir, "11-21-24 PC Minutes.txt");
const textFilePath40 = path.join(docsDir, "376 AOF_Concept Plans.txt");
const textFilePath41 = path.join(docsDir, "376 Ave of Flags Mixed-Use Project (Pea Soup Andersen's site)_376 AOF_Project Description.txt");
const textFilePath42 = path.join(docsDir, "376 Ave of Flags Mixed-Use Project_Engage Overview.txt");
const textFilePath43 = path.join(docsDir, "2024_Mitigated Negative Declaration.txt");
const textFilePath44 = path.join(docsDir, "ARCO AM-PM Plans 2024.txt");
const textFilePath45 = path.join(docsDir, "ARCO AM-PM_Engage Overview.txt");
const textFilePath46 = path.join(docsDir, "ARCO AM-PM_RA inc Design Arco Review Letter.txt");
const textFilePath47 = path.join(docsDir, "ARCO AM-PM_SB Fire Comments Letter.txt");
const textFilePath48 = path.join(docsDir, "ARCO AM-PM_Stormwater Control Plan.txt");
const textFilePath49 = path.join(docsDir, "ARCO AM-PM_WeWatch ARCOProjectLighting comments.txt");
const textFilePath50 = path.join(docsDir, "BUE 17 Specific Plan_Engage Overview.txt");
const textFilePath51 = path.join(docsDir, "BUE 17 Specific Plan_July-7-2022_PC-CC packet.txt");
const textFilePath52 = path.join(docsDir, "BUE 17 Specific Plan_Resolution of SP Scope.txt");
const textFilePath53 = path.join(docsDir, "BUE 17 Specific Plan_Specific Plan Draft Outline.txt");
const textFilePath54 = path.join(docsDir, "Buellton Garden Apartments_Engage Overview.txt");
const textFilePath55 = path.join(docsDir, "Buellton Planning Commission.txt");
const textFilePath56 = path.join(docsDir, "Buellton Pre-Designed ADU Plans_1 Bed Mission Style ADU Plan 23BDP-01060.txt");
const textFilePath57 = path.join(docsDir, "Buellton Pre-Designed ADU Plans_Engage Overview.txt");
const textFilePath58 = path.join(docsDir, "Buellton Public Review Draft HEU ISND 3-10-23 CLEAN REV.txt");
const textFilePath59 = path.join(docsDir, "Cesium BIM and CAD Rendering  Model.txt");
const textFilePath60 = path.join(docsDir, "Chanin Wine Company Planning Commission Resolution 04 20 23.txt");
const textFilePath61 = path.join(docsDir, "Chanin Wine Company_Engage Overview.txt");
const textFilePath62 = path.join(docsDir, "Cottage Health Medical Building -515 McMurray Rd_Concept Package.txt");
const textFilePath63 = path.join(docsDir, "Cottage McMurray PC Concept Review Letter Request 3.10.25.txt");
const textFilePath64 = path.join(docsDir, "Creekside Village (480 Avenue of Fl_Engage Overview.txt");
const textFilePath65 = path.join(docsDir, "Creekside Village Engineering Substantial Conformance Letter.txt");
const textFilePath66 = path.join(docsDir, "Creekside Village Plans October 2024.txt");
const textFilePath67 = path.join(docsDir, "Creekside-480 Avenue of Flags_Plans_241007_MAY2024.txt");
const textFilePath68 = path.join(docsDir, "Current Projects Listing - December 2024.txt");

// New endpoint for chat-based Q&A
app.post("/api/chat", async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "No query provided." });
        }

        // Step 1: Retrieve context from City of Buellton documents
        const context = await getCityDocumentsContext(query);

        // Step 2: Build the chat prompt with system and user messages
        const systemPrompt = "You are an expert assistant with detailed knowledge of the City of Buellton documents. Use the provided context to answer questions. If the answer is not in the context, use general knowledge.";
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Context:\n${context}\n\nQuestion: ${query}` }
        ];

        // Step 3: Call OpenAI Chat Completion API (using GPT-4 as fallback)
        const response = await openai.createChatCompletion({
            model: "gpt-4", // or use "gpt-3.5-turbo" if preferred
            messages,
            temperature: 0.5,
        });

        const answer = response.data.choices[0].message.content;
        res.json({ answer });
    } catch (err) {
        console.error("Error in /api/chat:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Expose public configuration (for client-side usage)
app.get("/api/config", (req, res) => {
    res.json({
        NREL_API_KEY: nrelApiKey,
        OPENWEATHER_API_KEY: openWeatherApiKey
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
