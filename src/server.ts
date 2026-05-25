import express from 'express';

const app = express();

// Health checkpoint - for monitoring
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'Notes Taking API',
	});
});

export default app;
