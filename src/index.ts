import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { analysisRoutes } from './routes/analysis.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Health check endpoint
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

// Mount routes
app.use('/', authRoutes);
app.use('/', analysisRoutes);

// Validate environment
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not found in environment variables');
  console.log('Please copy .env.example to .env and add your API key');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`SyncSpark Gap Analysis Engine running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
  console.log(`\n Setup required:`);
  console.log(`   1. Copy .env.example to .env and add your GEMINI_API_KEY`);
  console.log(`   2. Add credentials.json from Google Cloud Console`);
  console.log(`   3. Visit /auth endpoint to authenticate with Google`);
});
