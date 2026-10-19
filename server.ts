import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0 && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log('[AI Mirror] Google GenAI initialized successfully with Gemini 3.8 Flash');
  } catch (err) {
    console.error('[AI Mirror] Failed to initialize GoogleGenAI:', err);
  }
} else {
  console.log('[AI Mirror] No active GEMINI_API_KEY configured in server env; local pedagogical engine active.');
}

/**
 * Health check endpoint indicating AI model status
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConnected: Boolean(aiClient),
    model: aiClient ? 'gemini-3.8-flash' : 'curriculum-engine-local',
    timestamp: new Date().toISOString()
  });
});

/**
 * Mentor AI Chat Endpoint
 * Connects to Gemini 3.8 Flash with rich pedagogical system prompt
 */
app.post('/api/mentor', async (req: Request, res: Response) => {
  try {
    const { prompt, profile, activeSubject } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'GEMINI_OFFLINE',
        message: 'Gemini API is not configured on the server. Falling back to local curriculum engine.',
        connected: false
      });
    }

    const studentName = profile?.name || 'Student';
    const gradeLabel = profile?.gradeLabel || 'Class 11 - 12';
    const gradeId = profile?.gradeId || 'senior';
    const subjects = profile?.subjects?.map((s: any) => s.name).join(', ') || 'General Science & Math';
    const goals = profile?.learningGoals?.join(', ') || 'Conceptual mastery';
    const strengths = profile?.mirrorData?.strengths?.map((s: any) => s.topic).join(', ') || 'Reasoning';
    const gaps = profile?.mirrorData?.gaps?.map((g: any) => g.concept).join(', ') || 'None identified';

    const systemPrompt = `You are Dr. Elena, the world-class AI Mirror pedagogical mentor.
Your student is ${studentName}, currently in ${gradeLabel} (${gradeId}).
Enrolled Subjects: ${subjects}.
Selected Active Subject: ${activeSubject || 'Core Subject'}.
Student Academic Goals: ${goals}.
Identified Strengths: ${strengths}.
Identified Cognitive Gaps: ${gaps}.

Guidelines:
1. Explain concepts at the student's exact education level (${gradeLabel}). For Primary (Class 1-5), use friendly analogies, simple words, and enthusiasm. For Secondary/Senior/Undergrad, use rigorous derivations, step-by-step logic, and first-principles reasoning.
2. Give concrete real-world examples or analogies tailored to their level.
3. Keep the main explanation concise (2 to 4 paragraphs), encouraging and clear.
4. End by asking a thoughtful practice question or conceptual check to test understanding.
5. Provide a single key takeaway sentence.
6. Provide 2-3 short suggested follow-up questions the student might ask next.

Respond in JSON format with the following keys:
{
  "responseText": "Your complete formatted markdown response",
  "speechText": "A natural, warm 1-2 sentence spoken summary for voice synthesis",
  "levelBadge": "${gradeLabel} Verified Pedagogical Response",
  "keyTakeaway": "Single sentence core principle",
  "suggestedFollowUps": ["Follow up question 1", "Follow up question 2", "Follow up question 3"]
}`;

    const geminiResponse = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const responseText = geminiResponse.text || '';
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = {
        responseText,
        speechText: responseText.slice(0, 150) + '...',
        levelBadge: `${gradeLabel} Verified AI Response`,
        keyTakeaway: 'Master the fundamental principles before applying formulas.',
        suggestedFollowUps: ['Can you show me a practice problem?', 'How does this connect to real-world applications?']
      };
    }

    return res.json({
      success: true,
      sourceEngine: 'gemini_api',
      ...parsed
    });
  } catch (error: any) {
    console.error('[AI Mirror] Gemini API Error in /api/mentor:', error);
    return res.status(500).json({
      error: 'GEMINI_GENERATION_FAILED',
      message: error?.message || 'Error communicating with Gemini model.',
      connected: false
    });
  }
});

/**
 * Adaptive Quiz Generation Endpoint
 * Generates custom multiple-choice questions dynamically via Gemini 3.8 Flash
 */
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  try {
    const { gradeLabel, subject, topic, difficulty, questionCount } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'GEMINI_OFFLINE',
        message: 'Gemini API is not configured on the server. Falling back to local curriculum question bank.'
      });
    }

    const count = Math.min(Math.max(questionCount || 3, 1), 5);
    const systemPrompt = `You are an expert curriculum test designer for ${gradeLabel} students.
Generate ${count} adaptive multiple-choice questions on "${topic || subject}" for the subject "${subject}".
Target Difficulty: ${difficulty || 'adaptive'}.
Rules:
1. Each question must have EXACTLY 4 distinct multiple-choice options (A, B, C, D).
2. exactly one correct option with correctIndex between 0 and 3.
3. A clear, pedagogical explanation explaining why the correct option is right and the reasoning.
4. Level of rigor must strictly match ${gradeLabel}.

Return JSON in this format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation",
      "topic": "${topic || subject}",
      "difficulty": "medium",
      "tierLabel": "Tier 2: Intermediate Application"
    }
  ]
}`;

    const geminiResponse = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate ${count} questions on ${subject} - ${topic || 'Core Curriculum'}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(geminiResponse.text || '{"questions":[]}');
    return res.json({
      success: true,
      sourceEngine: 'gemini_api',
      questions: parsed.questions || []
    });
  } catch (error: any) {
    console.error('[AI Mirror] Error generating quiz via Gemini:', error);
    return res.status(500).json({
      error: 'GEMINI_QUIZ_FAILED',
      message: error?.message || 'Failed to generate quiz via Gemini.'
    });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Mirror] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AI Mirror] Failed to start server:', err);
});
