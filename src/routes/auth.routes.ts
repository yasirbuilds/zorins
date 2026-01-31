import { Router, Request, Response } from 'express';
import { GoogleDocsService } from '../services/googleDocs.service';

const router = Router();

// Lazy initialization of Google Docs service
let docsService: GoogleDocsService | null = null;

function getDocsService(): GoogleDocsService {
  if (!docsService) {
    try {
      docsService = new GoogleDocsService();
    } catch (error: any) {
      throw new Error(`Google Docs Service initialization failed: ${error.message}`);
    }
  }
  return docsService;
}

// Google OAuth flow
router.get('/auth', (req: Request, res: Response) => {
  try {
    const authUrl = getDocsService().getAuthUrl();
    res.json({ authUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/auth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    await getDocsService().getToken(code);
    res.json({ success: true, message: 'Authentication successful! You can now use the analyze endpoints.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as authRoutes, getDocsService };
