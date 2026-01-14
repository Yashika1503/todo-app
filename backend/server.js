const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


// Test route
app.get("/", (req, res) => {
    res.send("API is running");
});

// Connect DB & start server
mongoose
    .connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
})
.catch(err => console.error(err));