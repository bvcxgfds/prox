const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000; // You can change the port if needed

// Middleware
app.use(cors()); // Allow requests from any origin
app.use(express.json());

// Base URL for the external API
const BASE_URL = "https://api.tempmail.lol/v2";

// Root route to check server status
app.get("/", (req, res) => {
    res.send("Backend Proxy Server is Running");
});

// Proxy route to create inbox
app.get("/api/inbox/create", async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/inbox/create`);
        console.log("Created inbox:", response.data); // Log the created inbox details
        res.json(response.data);
    } catch (error) {
        console.error("Error in /api/inbox/create:", error.message);
        res.status(500).json({ error: "Error fetching data from API" });
    }
});

// Proxy route to fetch emails
app.get("/api/inbox", async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    console.log("Received token:", token); // Log the token to ensure it's received correctly

    try {
        const apiUrl = `${BASE_URL}/inbox?token=${token}`;
        console.log(`Making request to external API: ${apiUrl}`); // Log the API URL

        const response = await axios.get(apiUrl);
        console.log("Response from external API:", response.data); // Log the response

        res.json(response.data); // Return the API response to the frontend
    } catch (error) {
        console.error("Error in /api/inbox:", error.message);
        if (error.response) {
            console.error("API Error Response:", error.response.data); // Log any error response from the API
        }
        res.status(500).json({ error: "Error fetching emails" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend proxy running on http://localhost:${PORT}`);
});
