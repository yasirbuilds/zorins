import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GapMap {
  topics_competitor_covers: string[];
  identified_gaps: string[];
  opportunities: string[];
  analysis_summary: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeCompetitorPosts(competitorPosts: string): Promise<GapMap> {
    const prompt = `You are a competitive intelligence analyst. Analyze the following competitor social media posts and identify content gaps.

Competitor Posts:
${competitorPosts}

Your task:
1. Identify the main topics the competitor IS talking about
2. Identify topics/angles they are NOT covering (gaps in their content strategy)
3. Suggest opportunities based on these gaps

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "topics_competitor_covers": ["topic1", "topic2", ...],
  "identified_gaps": ["gap1", "gap2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "analysis_summary": "A brief 2-3 sentence summary of the key findings"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```\s*$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/, '').replace(/```\s*$/, '');
      }
      
      // Parse JSON and validate structure
      const gapMap = JSON.parse(cleanedText) as GapMap;
      
      // Validate required fields to prevent hallucinations
      if (!gapMap.topics_competitor_covers || !Array.isArray(gapMap.topics_competitor_covers)) {
        throw new Error('Invalid gap map structure: missing topics_competitor_covers');
      }
      if (!gapMap.identified_gaps || !Array.isArray(gapMap.identified_gaps)) {
        throw new Error('Invalid gap map structure: missing identified_gaps');
      }
      if (!gapMap.opportunities || !Array.isArray(gapMap.opportunities)) {
        throw new Error('Invalid gap map structure: missing opportunities');
      }
      if (!gapMap.analysis_summary) {
        throw new Error('Invalid gap map structure: missing analysis_summary');
      }
      
      return gapMap;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Gemini returned invalid JSON. This might be a hallucination. Error: ${error.message}`);
      }
      throw error;
    }
  }
}
