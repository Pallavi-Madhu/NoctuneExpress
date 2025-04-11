import express from "express";
export const app = express();
import cors from "cors";
import { router } from "./Routes/DownloadMusic.js"
import { WebSocketServer } from "ws";
import http from "http";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.send("WebSocket server is running");
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
// WebSocket connection setup
wss.on("connection", (ws) => {
    console.log("New client connected!");

    // Send welcome message
    ws.send(JSON.stringify({ message: "Welcome to live updates!" }));
    ws.isAlive = true;

    // Handle messages from clients
    ws.on("message", (data) => {
        console.log(`Client says: ${data}`);
    });

    // Handle pong to confirm client is still alive
    ws.on("pong", () => {
        ws.isAlive = true;
    });

    // Handle client disconnection
    ws.on("close", () => console.log("Client disconnected"));
});

// Heartbeat (ping) to check client health every 30 seconds
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log("Stale client detected, disconnecting...");
            return ws.terminate(); // Force disconnect
        }

        ws.isAlive = false; // Mark as inactive
        ws.ping(); // Send ping to check if client responds
    });
}, 30000);
// Broadcast payload to all connected WebSocket clients
// wss.clients.forEach((client) => {
//     if (client.readyState === 1) {
//         client.send(JSON.stringify(payload));
//     }
// });
app.use("/api", router);
const PORT = process.env.PORT || 80;
server.listen(PORT, "localhost", () =>
    console.log(`Server running on port ${PORT}`)
);
