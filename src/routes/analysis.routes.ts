import { Router, Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { getDocsService } from './auth.routes';
import * as fs from 'fs';

const router = Router();

// Lazy initialization of Gemini service
let geminiService: GeminiService | null = null;

function getGeminiService(): GeminiService {
  if (!geminiService) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    geminiService = new GeminiService(geminiApiKey);
  }
  return geminiService;
}

// Main analysis endpoint - accepts text directly
router.post('/analyze', async (req: Request, res: Response) => {
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

    const gapMap = await getGeminiService().analyzeCompetitorPosts(competitorPosts);
    const docUrl = await getDocsService().createGapAnalysisReport(gapMap);

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
router.post('/analyze-file', async (req: Request, res: Response) => {
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

    const gapMap = await getGeminiService().analyzeCompetitorPosts(competitorPosts);
    const docUrl = await getDocsService().createGapAnalysisReport(gapMap);

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

export { router as analysisRoutes };
