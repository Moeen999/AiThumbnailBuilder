import express, { Request, Response } from 'express';
import cors from "cors"
import "dotenv/config"
import { connectDB } from './config/db.js';

await connectDB();
const app = express();


//! middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});