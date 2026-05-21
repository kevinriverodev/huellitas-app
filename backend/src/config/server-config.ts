import express from "express";
import cors from "cors";
import ExpressServer from "../models/ExpressServer.js";

const server = new ExpressServer(process.env.SERVER_PORT);

server.setStaticPath("public");

server.setMiddlewares([
    cors({ origin: "http://localhost:5173", credentials: true }),
	express.json(),
]);

export default server;