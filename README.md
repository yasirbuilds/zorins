## Implementation Overview

The service accepts raw competitor social media content, processes it through Gemini 1.5 Flash to identify content gaps and opportunities, then outputs a formatted Google Doc report titled "Gap Analysis Report."

**Tech Stack:**
- Node.js + Express + TypeScript
- Gemini 1.5 Flash API
- Google Docs API + Google Drive API

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (copy `.env.example` to `.env` and add your Gemini API key)

3. Add your `credentials.json` file from Google Cloud Console to the root directory

4. Start the server:
```bash
npm run dev
```

5. Complete OAuth authentication (one-time setup):
   - Visit `http://localhost:3000/auth`
   - Follow the authorization URL
   - Return to `/auth/callback?code=YOUR_CODE`

## API Usage

**Endpoint:** `POST /analyze`

Accepts competitor posts as JSON and returns a Google Docs URL with the gap analysis report.

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"posts": "Post 1: New product launch...\nPost 2: Customer testimonial..."}'
```

**Endpoint:** `POST /analyze-file`

Analyzes competitor posts from a text file.

```bash
curl -X POST http://localhost:3000/analyze-file \
  -H "Content-Type: application/json" \
  -d '{"filePath": "path/to/competitor_posts.txt"}'
```

**Response:**

```json
{
  "success": true,
  "documentUrl": "https://docs.google.com/document/d/1a2b3c4d5/edit",
  "analysis": {
    "topics_competitor_covers": ["Product launches", "Customer testimonials"],
    "identified_gaps": ["Industry thought leadership", "Educational content"],
    "opportunities": ["Position as industry expert", "Create how-to guides"],
    "analysis_summary": "Competitor focuses heavily on promotional content..."
  }
}
```

The `documentUrl` links directly to the generated Google Doc report.

## Project Structure

```
src/
├── index.ts                    # Express server setup
├── routes/
│   ├── auth.routes.ts         # OAuth flow endpoints
│   └── analysis.routes.ts     # Analysis endpoints
└── services/
    ├── gemini.service.ts      # Gemini API integration
    └── googleDocs.service.ts  # Google Workspace integration
```

## Key Features Demonstrated

**AI Gap Detection Logic**
- Structured prompting to categorize competitor content
- JSON schema validation to prevent hallucinations
- Error handling for malformed AI responses

**Google Workspace Integration**
- Programmatic document creation via Google Docs API
- OAuth 2.0 authentication flow
- Batch updates for efficient API usage
- Automatic document sharing configuration

**API Design**
- Clean separation of concerns (routes/services)
- TypeScript for type safety
- Multiple input methods (direct JSON, file upload)
- Comprehensive error responses

## Testing

A sample competitor posts file is included (`sample_posts.txt`). Run the analysis with:

```bash
npm run dev
# In another terminal:
curl -X POST http://localhost:3000/analyze-file \
  -H "Content-Type: application/json" \
  -d '{"filePath": "sample_posts.txt"}'
```

Open the returned Google Docs URL to view the generated report.
