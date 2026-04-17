import express, { Application, Request, Response } from 'express';
import db from './config/db.config';
import authRoutes from "./routes/auth.routes"
import userRoutes from "../src/routes/user.routes"

import dotenv from "dotenv"
dotenv.config()
const app: Application = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT = 3000;
db

app.use("/api/auth", authRoutes)




app.use("/api/test", userRoutes)

app.get('/', (req: Request, res: Response) => {
    res.json({message:"welcome to jwt auth!"})
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});