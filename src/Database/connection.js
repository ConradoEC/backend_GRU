import mongoose from "mongoose";

let tentativa = null;

// Garante que o banco está conectado. Em serverless a conexão pode cair entre
// uma requisição e outra, então ela é conferida a cada chamada.
const connection = async () => {
    if (mongoose.connection.readyState === 1) return;

    if (!tentativa) {
        tentativa = mongoose
            .connect(String(process.env.DB_CONNECTION), {
                serverSelectionTimeoutMS: 8000,
                maxPoolSize: 5,
            })
            .then(() => {
                console.log("Conexão com o DB realizada com sucesso!");
            })
            .catch((error) => {
                tentativa = null;
                console.error("Erro ao conectar o DB: ", error);
                throw error;
            });
    }

    try {
        await tentativa;
    } finally {
        if (mongoose.connection.readyState !== 1) tentativa = null;
    }
};

export default connection;
