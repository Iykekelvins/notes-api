import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
	res.json({ notes: [] });
});

export default router;
