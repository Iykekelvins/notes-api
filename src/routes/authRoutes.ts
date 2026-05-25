import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
	res.status(201).json({ message: 'Login successful' });
});

router.post('/register', (req, res) => {
	res.status(201).json({ message: 'User registered' });
});

router.post('/logout', (req, res) => {
	res.status(201).json({ message: 'Logout successful' });
});

export default router;
