import express from 'express';
import dotenv from 'dotenv';
import routes from './Routes/routes.js';
import connection_db from './Database/connection.js';

const app = express();

dotenv.config({ path: ".env.example"})

// CORS: o site (Flutter Web) roda em outra origem/porta e precisa
// chamar a API pelo navegador. Em produção, troque "*" pelo domínio do site.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    if (req.method === "OPTIONS") return res.sendStatus(204)
    next()
})

// Garante a conexão com o banco antes de atender cada requisição.
app.use(async (req, res, next) => {
    try {
        await connection_db();
        next();
    } catch (error) {
        res.status(503).send('Banco de dados indisponível');
    }
});

app.use(express.json({ limit: "1mb" }))
routes(app)

export default app;
