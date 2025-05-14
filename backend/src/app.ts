import 'dotenv/config'
import express from 'express'
import cors from 'cors';
import { config } from './config/env';

const app = express();

app.use(cors({
    origin: config.clientUrl,
    credentials: true
}));

app.use(express.json());

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});