import express from "express"
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
        const response = await axios.post("http://0.0.0.0:8000/yt", { data: data }, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        return { "error": error };
    }
    // Respond with success message
    res.status(201).json({
        message: "Music received successfully",
        receivedData: req.body
    });
});
