import express from 'express';
import env from 'dotenv';
import carRouter from './routes/carRoutes.js';
import mongoose from 'mongoose';
import {json, urlencoded} from 'body-parser';
import morgan from 'morgan';

const app = express();
env.config();

const port = process.env.PORT;

app.use(json());
app.use(urlencoded({extended: true}));
app.use(morgan('short'));

mongoose.connect("mongodb://localhost:27017/car_revision")
    .then(() => console.log('Mongodb connected'))
    .catch((err) => console.log(err));

app.use("/api/cars", carRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});