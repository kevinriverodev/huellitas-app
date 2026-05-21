import dotenv from "dotenv";
dotenv.config();
import server from "./config/server-config.js";

const main = async () => {
    try {
        server.listen();
    } catch (error) {
        console.log("Failed to start the server", error);
        process.exit(1);
    }
}

main();