import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { sendError } from "../helpers/response.js";
import User from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    sendError(res, "Non existing token in the request", 401);
    return;
  }

  try {
    const { uid } = JSON.parse(JSON.stringify(jwt.verify(token, process.env.JWT_KEY || "")));

    const user = await User.findById(uid);

    if (!user || !user.status) {
      sendError(res, "Invalid token", 401);
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    console.log("Server error: ", error);
    sendError(res, "An unexpected error ocurred", 500);
  }
};

export default validateJWT;
