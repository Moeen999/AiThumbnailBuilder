import express, { Request, Response } from 'express';
import cors from "cors"
import "dotenv/config"
import { connectDB } from './config/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRoutes.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';
declare module "express-session" {
    interface SessionData {
        isLoggedIn: boolean,
        userId: string
    }
}



await connectDB();
const app = express();


//! middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRETKEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: "sessions"
    })
}))
app.use(express.json());

//! AuthRoutes
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use("/api/user", UserRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});