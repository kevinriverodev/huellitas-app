import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "../routes/auth.js";
import ExpressServer from "../models/ExpressServer.js";

const server = new ExpressServer(process.env.SERVER_PORT);

server.setStaticPath("public");

server.setMiddlewares([cors({ origin: "http://localhost:5173", credentials: true }), express.json(), cookieParser()]);

server.setRoutes([{ path: "/api/auth", router: authRouter }]);

export default server;
