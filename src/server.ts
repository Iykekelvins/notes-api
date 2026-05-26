import express from 'express';
import env, { isTestEnv } from '../env.ts';

// Middlewares
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dns from 'dns';

// Routes
import authRoutes from './routes/authRoutes.ts';
import noteRoutes from './routes/noteRoutes.ts';

const app = express();
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS

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

// AP Routes
app.use('/api/auth', authRoutes);
app.use('/notes', noteRoutes);

// 404 for Non existing API routes
app.use('/api/*path', (req, res) => {
	res.status(404).json({
		error: 'API route not found',
		message: `Cannot ${req.method} ${req.originalUrl}`,
		timestamp: new Date().toISOString(),
	});
});

export default app;
