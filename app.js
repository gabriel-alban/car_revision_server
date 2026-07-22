import express from 'express';
import env from 'dotenv';

const app = express();
env.config();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});