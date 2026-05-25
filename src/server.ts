import express from 'express';
import env, { isTestEnv } from '../env.ts';

// Middlewares
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes.ts';

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	morgan('dev', {
		skip: () => isTestEnv(),
	}),
);

// Health checkpoint - for monitoring
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'Notes Taking API',
	});
});

// Auth Routes
app.use('/api/auth', authRoutes);

// 404 for Non existing API routes
app.use('/api/*path', (req, res) => {
	res.status(404).json({
		error: 'API route not found',
		message: `Cannot ${req.method} ${req.originalUrl}`,
		timestamp: new Date().toISOString(),
	});
});

export default app;
