import { Router } from "express";
import validateZodSchema from "../middlewares/validate-zod-schema.js";
import { signIn, signUp } from "../controllers/auth.js";
import { signInSchema, signUpSchema } from "../schemas/auth.js";

const router = Router();

router.post("/signup", [validateZodSchema(signUpSchema)], signUp);
router.post("/signin", [validateZodSchema(signInSchema)], signIn);

export { router as authRouter };
