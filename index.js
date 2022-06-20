import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoute from './src/routes/users.js';
import authRoute from './src/routes/auth.js';
import postRoute from './src/routes/posts.js';

import db from "./src/config/dbConnect.js";

dotenv.config();

db.on("error", console.log.bind(console, "Erro de conexão"));
db.once("open", () => {
    console.log("Conexão com o banco foi um sucesso!");
});
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
});
