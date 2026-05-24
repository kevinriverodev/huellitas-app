import { type Response } from "express";

export const sendSuccess = (res: Response, data: any, status = 200) => res.status(status).json({ ok: true, data });

export const sendError = (res: Response, error: string, status = 500) => res.status(status).json({ ok: false, error });
