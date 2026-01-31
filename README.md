# Gap Analysis Engine

This is a Node.js service that analyzes competitor social media posts and generates a Google Doc report showing what they're missing. It uses Gemini AI to spot content gaps and opportunities.

## What it does

Feed it your competitor's social posts → Get back a "Gap Analysis Report" in Google Docs showing:
- What topics they're covering
- What they're missing (the gaps)
- Opportunities you can exploit

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get a Gemini API key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create an API key
- Copy `.env.example` to `.env` and paste your key:
```
GEMINI_API_KEY=your_key_here
```

### 3. Set up Google Cloud credentials

You need this so the app can create Google Docs for you.

**First time with Google Cloud?** Here's the quickest path:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable these APIs:
   - Google Docs API
   - Google Drive API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add `http://localhost:3000/auth/callback` to "Authorized redirect URIs"
7. Download the JSON file and save it as `credentials.json` in this project's root folder

### 4. Start the server
```bash
npm run dev
```

You should see: `Gap Analysis Engine running on http://localhost:3000`

### 5. Authenticate with Google (one-time)

Open your browser:
1. Visit `http://localhost:3000/auth`
2. Copy the `authUrl` and paste it in your browser
3. Sign in with Google and grant permissions
4. You'll get redirected with a code - copy it
5. Visit `http://localhost:3000/auth/callback?code=PASTE_CODE_HERE`

Done! A `token.json` file will be created and you won't need to do this again.

## How to use it

### Option 1: From a text file

Create a file with competitor posts (there's already a `sample_posts.txt` you can try):

```powershell
$response = Invoke-RestMethod -Uri http://localhost:3000/analyze-file -Method POST -Body (ConvertTo-Json @{ filePath = 'sample_posts.txt' }) -ContentType "application/json"
Start-Process $response.documentUrl
```

### Option 2: Send posts directly

```powershell
$response = Invoke-RestMethod -Uri http://localhost:3000/analyze -Method POST -Body (ConvertTo-Json @{ posts = "Post 1: Excited to announce our new feature!`nPost 2: Check out this customer success story..." }) -ContentType "application/json"
Start-Process $response.documentUrl
```

**What you get back:**
```json
{
  "success": true,
  "documentUrl": "https://docs.google.com/document/d/...",
  "analysis": {
    "topics_competitor_covers": ["Product announcements", "Customer testimonials"],
    "identified_gaps": ["Industry trends", "How-to content"],
    "opportunities": ["Create educational content", "Position as thought leader"],
    "analysis_summary": "..."
  }
}
```
