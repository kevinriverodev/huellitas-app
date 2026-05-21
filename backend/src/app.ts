import dns from "dns";
import dotenv from "dotenv";
dotenv.config();
import server from "./config/server-config.js";
import MongooseConnection from "./models/MongooseConnection.js";

// Uso de servidor DNS público para resolver bloqueo de DNS en desarrollo para la base de datos
if (process.env.DEV_DNS) dns.setServers([process.env.DEV_DNS]); 

const main = async () => {
    try {
        server.listen();
        const mongoose = new MongooseConnection(process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);
        mongoose.connect();

    } catch (error) {
        console.log("Failed to start the server", error);
        process.exit(1);
    }
}

main();