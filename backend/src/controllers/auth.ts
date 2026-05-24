import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import generateJWT from "../helpers/generate-jwt.js";
import { sendError, sendSuccess } from "../helpers/response.js";
import User from "../models/User.js";

export const signUp = async (req: Request, res: Response) => {
  const { username, firstName, lastName, password, email, biography, imageURL } = req.body;

  try {
    const userExist = await User.exists({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      sendError(res, "User already registered", 400);
      return;
    }

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

    sendSuccess(
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
    sendError(res, "An unexpected error occured", 500);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      sendError(res, "Invalid credentials", 401);
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      sendError(res, "Invalid credentials", 401);
      return;
    }

    if (!user.status) {
      sendError(res, "Inactive user", 401);
      return;
    }

    const token = await generateJWT(user.id);

    res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });

    sendSuccess(
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
    sendError(res, "An unexpected error ocurred", 500);
  }
};
