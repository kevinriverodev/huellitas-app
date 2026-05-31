import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { sendError } from "../helpers/response.js";
import { User } from "../models/User.js";

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

  if (!token) return sendError(res, "Non existing token in the request", 401);

  try {
    const { uid } = JSON.parse(JSON.stringify(jwt.verify(token, process.env.JWT_KEY || "")));

    const user = await User.findById(uid);

    if (!user || !user.status) return sendError(res, "Invalid token", 401);

    req.user = {
      id: user.id,
      role: user.role,
    };

    return next();
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error ocurred", 500);
  }
};

export default validateJWT;
