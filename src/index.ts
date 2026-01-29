import express, { Request, Response } from 'express';
import { GeminiService } from './services/gemini.service';
import { GoogleDocsService } from './services/googleDocs.service';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Initialize services
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('ERROR: GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

const geminiService = new GeminiService(geminiApiKey);
let docsService: GoogleDocsService;

try {
  docsService = new GoogleDocsService();
} catch (error: any) {
  console.error('Google Docs Service initialization failed:', error.message);
  console.log('Please set up Google Cloud credentials first.');
}

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

// Google OAuth flow
app.get('/auth', (req: Request, res: Response) => {
  try {
    const authUrl = docsService.getAuthUrl();
    res.json({ authUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/auth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    await docsService.getToken(code);
    res.json({ success: true, message: 'Authentication successful! You can now use the analyze endpoints.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Main analysis endpoint - accepts text directly
app.post('/analyze', async (req: Request, res: Response) => {
  try {
    let competitorPosts: string;

    // Handle both JSON and plain text
    if (typeof req.body === 'string') {
      competitorPosts = req.body;
    } else if (req.body.posts) {
      competitorPosts = req.body.posts;
    } else {
      return res.status(400).json({
        error: 'Invalid request. Send either plain text or JSON with "posts" field'
      });
    }

    if (!competitorPosts || competitorPosts.trim().length === 0) {
      return res.status(400).json({
        error: 'Competitor posts cannot be empty'
      });
    }

    console.log('Analyzing competitor posts with Gemini...');
    const gapMap = await geminiService.analyzeCompetitorPosts(competitorPosts);

    console.log('Creating Gap Analysis Report in Google Docs...');
    const docUrl = await docsService.createGapAnalysisReport(gapMap);

    res.json({
      success: true,
      message: 'Gap analysis completed successfully',
      documentUrl: docUrl,
      analysis: gapMap
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message,
      hint: error.message.includes('hallucination') 
        ? 'The AI returned invalid data. Try rephrasing or providing more context.'
        : undefined
    });
  }
});

// Endpoint to analyze from a file upload
app.post('/analyze-file', async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        error: 'File path required. Provide absolute path in JSON: {"filePath": "path/to/file.txt"}'
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: `File not found: ${filePath}`
      });
    }

    const competitorPosts = fs.readFileSync(filePath, 'utf-8');

    console.log('Analyzing competitor posts from file with Gemini...');
    const gapMap = await geminiService.analyzeCompetitorPosts(competitorPosts);

    console.log('Creating Gap Analysis Report in Google Docs...');
    const docUrl = await docsService.createGapAnalysisReport(gapMap);

    res.json({
      success: true,
      message: 'Gap analysis completed successfully',
      documentUrl: docUrl,
      analysis: gapMap
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SyncSpark Gap Analysis Engine running on http://localhost:${PORT}`);
  console.log(`📝 Visit http://localhost:${PORT} for API documentation`);
  console.log(`\n⚠️  Setup required:`);
  console.log(`   1. Copy .env.example to .env and add your GEMINI_API_KEY`);
  console.log(`   2. Add credentials.json from Google Cloud Console`);
  console.log(`   3. Visit /auth endpoint to authenticate with Google`);
});
