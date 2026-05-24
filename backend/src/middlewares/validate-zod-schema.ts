import { type Request, type Response, type NextFunction } from "express";
import type { ZodObject } from "zod";

const validateZodSchema = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      console.log(error);

      res.status(500).json({
        ok: false,
        error,
      });
    }
  };
};

export default validateZodSchema;
