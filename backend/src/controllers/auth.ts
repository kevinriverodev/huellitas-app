import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import generateJWT from "../helpers/generate-jwt.js";
import { sendError, sendSuccess } from "../helpers/response.js";
import { User } from "../models/User.js";

export const signUp = async (req: Request, res: Response) => {
  const { username, firstName, lastName, password, email, biography, imageURL } = req.body;

  try {
    const userExist = await User.exists({
      $or: [{ username }, { email }],
    });

    if (userExist) return sendError(res, "User already registered", 400);

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      username,
      firstName,
      lastName,
      password: hash,
      biography,
      email,
      imageURL,
    });

    await user.save();

    const token = await generateJWT(user.id);

    res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });

    return sendSuccess(
      res,
      {
        username: user.username,
        firstName: user.firstName,
        lastname: user.lastName,
      },
      201,
    );
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) return sendError(res, "Invalid credentials", 401);

    if (!bcrypt.compareSync(password, user.password)) return sendError(res, "Invalid credentials", 401);

    if (!user.status) return sendError(res, "Inactive user", 401);

    const token = await generateJWT(user.id);

    res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });

    return sendSuccess(
      res,
      {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      200,
    );
  } catch (error) {
    console.log("Server error: ", error);
    return sendError(res, "An unexpected error occurred", 500);
  }
};
