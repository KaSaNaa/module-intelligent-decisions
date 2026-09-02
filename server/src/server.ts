import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    engine: 'IDSS Decision Intelligence Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  IDSS Decision Intelligence Engine API Service        `);
  console.log(`  Running on: http://localhost:${PORT}                 `);
  console.log(`  Health check: http://localhost:${PORT}/health        `);
  console.log(`=======================================================`);
});

export default app;
