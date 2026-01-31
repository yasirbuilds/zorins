import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { authRoutes } from './routes/auth.routes';
import { analysisRoutes } from './routes/analysis.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'SyncSpark Gap Analysis Engine',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /analyze - Analyze competitor posts from text',
      analyzeFile: 'POST /analyze-file - Analyze competitor posts from file',
      auth: 'GET /auth - Get Google OAuth URL',
      authCallback: 'GET /auth/callback?code=XXX - Complete OAuth'
    }
  });
});

// routes
app.use('/', authRoutes);
app.use('/', analysisRoutes);

// Validate environment
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not found in environment variables');
  console.log('Please copy .env.example to .env and add your API key');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Gap Analysis Engine running on http://localhost:${PORT}`);
});
