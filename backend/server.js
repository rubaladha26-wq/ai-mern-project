const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const Chat = require("./models/Chat");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Node Backend Connected!" });
});

// Chat route
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post(
            "http://localhost:8000/chat",
            { message }
        );

        res.json({ answer: response.data.answer });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "AI Service Error" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Node Server running on port ${PORT}`);
});