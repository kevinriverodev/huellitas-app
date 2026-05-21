import mongoose, { type Connection } from "mongoose";

export default class MongooseConnection {
    private username: string;
    private password: string;
    private host: string;
    private port: string;
    private dbName: string;
    private _connection: Connection | null;

    constructor(username?: string, password?: string, host?: string, port?: string, dbName?: string) {
        this.username = username || process.env.DB_USERNAME || "admin";
        this.password = password || process.env.DB_PASSWORD || "1234";
        this.host = host || process.env.DB_HOST || "localhost";
        this.port = port || process.env.DB_PORT || "27017";
        this.dbName = dbName || process.env.DB_NAME || "huellitas";
        this._connection = null;
    }

    public get connection() {
        return this._connection;
    }

    public async connect() {
        try {
            const mongooseInstance = await mongoose.connect(`mongodb+srv://${this.username}:${this.password}@${this.host}/${this.dbName}`);
            this._connection = mongooseInstance.connection;
            
            console.log("Successfully connected to MongoDB");

        } catch (error) {
            console.log("Error connecting to MongoDB", error);
        }
    }
}