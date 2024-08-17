
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectToMongo from "./db/connect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT 



app.use(express.json()) // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.get("/", (req,res)=>{
    res.send("Hello kids");
})

app.use("/api/auth", authRoutes );
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, ()=>{
    connectToMongo();
    console.log(`Listening on port ${PORT}`)
})