import type { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

// Validate Request Body
export const validateBody = (schema: ZodType) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = schema.parse(req.body);
			req.body = validatedData;

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					error: 'Validation failed',
					details: error.issues.map((err) => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				});
			}
			next(error);
		}
	};
};
