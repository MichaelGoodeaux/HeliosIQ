import express from 'express';
import routes from './routes'; // Import routes from routes.ts

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Register API routes
app.use('/api', routes); // All routes from routes.ts will be prefixed with /api

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'The requested route does not exist.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;