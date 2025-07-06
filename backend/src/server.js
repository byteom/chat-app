import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from "./routes/user.route.js"
import  chatRoutes from "./routes/chat.route.js"

import { connectDb } from './lib/db.js';
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON and URL-encoded data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes for authentication
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb()
});