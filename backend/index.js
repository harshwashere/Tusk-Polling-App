import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/db.js";
import authroute from "./routes/authRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import pollroute from "./routes/pollRoute.js";

const app = express();
dotenv.config();
connection();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsoptions = {
  origin: [process.env.CLIENT_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD"], 
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authroute);
app.use("/poll", pollroute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Port is running at ${PORT}`);
});
