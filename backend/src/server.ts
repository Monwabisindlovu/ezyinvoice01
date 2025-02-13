import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

const allowedOrigins: string[] = [
  "http://localhost:3000", // Local development
  "https://ezyinvoice01.vercel.app", // Deployed frontend (change this if needed)
];

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, success?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost/ezyinvoice")
  .then(() => console.log("MongoDB connected"))
  .catch((err: unknown) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
