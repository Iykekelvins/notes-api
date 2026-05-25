import express from 'express';

const app = express();

// Routes
import authRoutes from './routes/authRoutes.ts';

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
