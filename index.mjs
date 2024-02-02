import express from "express";
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"

const ATLAS_URI =process.env.ATLAS_URI
const db = mongoose.connection;
mongoose.connect(ATLAS_URI)

db.on("error", (err) => console.log(err.message + " is mongod not running?"))
db.on("open", () => console.log("mongo connected: ", ATLAS_URI))
db.on("close", () => console.log("mongo disconnected"))

const PORT = 5050;
const app = express();

import grades from "./routes/grades.mjs";


// db.on("error", (err) => console.log(err.message + " is mongod not running?"))
// db.on("open", () => console.log("mongo connected: ", ATLAS_URI))
// db.on("close", () => console.log("mongo disconnected"))

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", grades);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
