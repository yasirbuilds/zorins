# SyncSpark Gap Analysis Engine

A micro-service that connects **Gemini 1.5 Flash** to **Google Workspace** for competitive intelligence analysis.

## 🎯 What This Does

**Variation 1: "The Strategist"** - Competitive Intelligence Focus

- Takes competitor social media posts as input (text or file)
- Uses Gemini AI to identify content gaps
- Generates a professional "Gap Analysis Report" in Google Docs
- Handles AI hallucinations with structured JSON validation

## 🛠️ Tech Stack

- **Node.js** + **Express.js** + **TypeScript**
- **Gemini 1.5 Flash** (Google AI)
- **Google Docs API** + **Google Drive API**
- No database required

## 📋 Prerequisites

1. **Gemini API Key**
   - Get it from: https://aistudio.google.com/app/apikey

2. **Google Cloud Project with OAuth2**
   - Go to: https://console.cloud.google.com/
   - Create a new project (or use existing)
   - Enable APIs: Google Docs API + Google Drive API
   - Create OAuth2 credentials (Desktop app type)
   - Download as `credentials.json`

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

### Step 3: Add Google Credentials

Place your downloaded `credentials.json` in the **root directory** (same level as package.json).

### Step 4: Authenticate with Google

1. Start the server:
```bash
npm run dev
```

2. Open your browser and go to:
```
http://localhost:3000/auth
```

3. Copy the `authUrl` from the response and open it in your browser

4. Sign in with your Google account and grant permissions

5. Copy the authorization code from the URL (after `code=`)

6. Visit:
```
http://localhost:3000/auth/callback?code=YOUR_CODE_HERE
```

7. You should see: `"Authentication successful!"`

A `token.json` file will be created automatically. You only need to do this once.

## 🎮 Usage

### Method 1: Send Text Directly

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"posts": "Post 1: Check out our new product features!\nPost 2: We love our customers!\nPost 3: Happy Friday everyone!"}'
```

### Method 2: Analyze from File

1. Create a text file with competitor posts (e.g., `competitor_posts.txt`)

2. Send the file path:
```bash
curl -X POST http://localhost:3000/analyze-file \
  -H "Content-Type: application/json" \
  -d '{"filePath": "E:\\z\\competitor_posts.txt"}'
```

### Response Example

```json
{
  "success": true,
  "message": "Gap analysis completed successfully",
  "documentUrl": "https://docs.google.com/document/d/XXXXX/edit",
  "analysis": {
    "topics_competitor_covers": ["Product features", "Customer appreciation"],
    "identified_gaps": ["Industry trends", "Thought leadership"],
    "opportunities": ["Create educational content", "Share market insights"],
    "analysis_summary": "Competitor focuses on product and customer but lacks strategic content..."
  }
}
```

## 📁 Project Structure

```
├── src/
│   ├── index.ts                      # Express server & API endpoints
│   └── services/
│       ├── gemini.service.ts         # Gemini AI integration
│       └── googleDocs.service.ts     # Google Docs/Drive API
├── package.json
├── tsconfig.json
├── .env                              # Your environment variables (create this)
├── .env.example                      # Template
├── credentials.json                  # Google OAuth credentials (add this)
└── token.json                        # Auto-generated after auth
```

## 🔍 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check & API documentation |
| `/auth` | GET | Get Google OAuth URL |
| `/auth/callback?code=XXX` | GET | Complete OAuth flow |
| `/analyze` | POST | Analyze competitor posts (JSON or text) |
| `/analyze-file` | POST | Analyze from file path |

## 🛡️ Error Handling

- **JSON Validation**: Ensures Gemini returns valid structured data
- **Hallucination Detection**: Validates all required fields in AI response
- **Google API Errors**: Proper error messages for auth/API failures
- **File Handling**: Checks file existence before processing

## 🧪 Testing with Sample Data

Create a file `sample_posts.txt`:

```
Our new AI feature is amazing! Users love it.
Black Friday sale - 50% off everything!
Thank you to our 10,000 customers!
We're hiring! Join our amazing team.
```

Then test:
```bash
curl -X POST http://localhost:3000/analyze-file -H "Content-Type: application/json" -d "{\"filePath\": \"E:\\\\z\\\\sample_posts.txt\"}"
```

## 📝 Notes

- The `credentials.json` and `token.json` files are gitignored for security
- Reports are created with "anyone with link" sharing
- Gemini model used: `gemini-1.5-flash` (as per task requirements)
