// index.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import 'dotenv/config';
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

app.post("/story", async (req, res) => {
  try {
    const { placeName } = req.body;
    if (!placeName) {
      return res.status(400).json({ error: "placeName is required" });
    }

    const prompt = `Create a story-like narrative with fun facts, like a virtual tour guide for "${placeName}".`;

    const result = await model.generateContent(prompt);
    const text = result.response.text(); // this is where the response from AI is

    res.json({ story: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
