import express from "express";
import axios from "axios";

export const router = express.Router();

//POST route to receive music data (if needed)
router.post("/", async (req, res) => {
    const { data } = req.body;
    console.log("Received Music Data:", data);
    if (!data) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Do something here if you need this route separately
    res.status(200).json({ message: "Music data received." });
});

//GET /stream route to support React Native TrackPlayer
router.get("/stream", async (req, res) => {
    const ytUrl = req.query.url;
    console.log(ytUrl)
    if (!ytUrl) {
        return res.status(400).json({ error: "Missing 'url' query param" });
    }

    try {
        const response = await axios.post("http://0.0.0.0:7000/yt", { data: ytUrl }, {
            headers: { "Content-Type": "application/json" },
            responseType: "stream", // 🟢 Stream response
        });

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Transfer-Encoding", "chunked");

        // Stream MP3 chunks to frontend (React Native TrackPlayer)
        response.data.pipe(res);
    } catch (error) {
        console.error("Streaming error:", error.message);
        res.status(500).json({ error: "Failed to stream audio" });
    }
});
router.get("/metadata", async (req, res) => {
    const ytUrl = req.query.url;

    if (!ytUrl) {
        return res.status(400).json({ error: "Missing 'url' query param" });
    }

    try {
        console.log("getting metadata...")
        const response = await axios.post("http://0.0.0.0:7000/yt/meta", {
            data: ytUrl,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Metadata fetch error:", error.message);
        res.status(500).json({ error: "Failed to fetch metadata" });
    }
});

