import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/authController.ts';
import { validateBody } from '../middleware/validation.ts';
import { insertUserSchema } from '../db/schema.ts';
import z from 'zod';

const router = Router();

const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
});

router.post('/register', validateBody(insertUserSchema), registerUser);

router.post('/login', validateBody(loginSchema), loginUser);

router.post('/logout', (req, res) => {
	res.status(201).json({ message: 'Logout successful' });
});

export default router;
