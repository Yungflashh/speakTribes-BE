import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

export const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({ errors: error.issues });
      }
      return res.status(400).json({ error: error.message });
    }
  };
};
