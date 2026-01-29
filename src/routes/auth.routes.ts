import { Router, Request, Response } from 'express';
import { GoogleDocsService } from '../services/googleDocs.service';

const router = Router();
let docsService: GoogleDocsService;

try {
  docsService = new GoogleDocsService();
} catch (error: any) {
  console.error('Google Docs Service initialization failed:', error.message);
}

// Google OAuth flow
router.get('/auth', (req: Request, res: Response) => {
  try {
    const authUrl = docsService.getAuthUrl();
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
    await docsService.getToken(code);
    res.json({ success: true, message: 'Authentication successful! You can now use the analyze endpoints.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as authRoutes, docsService };
