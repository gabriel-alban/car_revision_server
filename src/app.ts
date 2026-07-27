import express from 'express';
import env from 'dotenv';
import authRouter from './routes/authRouter.js'
import carRouter from './routes/carRoutes.js';
import revisionRouter from './routes/revisionRoutes.js';
import mongoose from 'mongoose';
import {json, urlencoded} from 'body-parser';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
env.config();

const port = process.env.PORT;

app.use(json());
app.use(urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "../")));
app.use(morgan('short'));

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    throw new Error("No db provided!");
}

mongoose.connect(mongoUrl)
    .then(() => console.log('Mongodb connected'))
    .catch((err) => console.log(err));

app.use("/api/auth", authRouter);
app.use("/api/cars", carRouter);
app.use("/api/cars/:carId/revisions", revisionRouter)

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});