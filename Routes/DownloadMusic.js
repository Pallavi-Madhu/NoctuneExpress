import express from "express";
export const router = express.Router();
import axios from "axios";

// POST route to receive music data
router.post("/", async (req, res) => {
    const { data } = req.body; // Extract data from request
    console.log("Received Music Data:", data);
    if (!data) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const response = await axios.post("http://0.0.0.0:7000/yt", { data: data }, {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer"
        });

        console.log("Received audio data length:", response.data);  // Log size

        if (response.data.length === 0) {
            return res.status(500).json({ error: "Received empty file from FastAPI" });
        }

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(response.data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to retrieve audio" });
    }

});
