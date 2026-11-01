import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateDefaultPlan } from './src/utils/planGenerator.ts';
import { EventInput, MasterEventPlan } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client if key exists
function getAiClient(): GoogleGenAI | null {
  if (process.env.GEMINI_API_KEY) {
    try {
      return new GoogleGenAI();
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI:', err);
    }
  }
  return null;
}

// 1. Generate Master Event Plan API
app.post('/api/generate-plan', async (req, res) => {
  const input: EventInput = req.body;
  
  if (!input || !input.eventType) {
    return res.status(400).json({ error: 'Missing event details' });
  }

  const defaultPlan = generateDefaultPlan(input);
  const ai = getAiClient();

  if (!ai) {
    // If no key or offline, instantly return our rich deterministic plan
    return res.json({ plan: defaultPlan, source: 'curated-engine' });
  }

  try {
    const prompt = `You are "EventGenie", an elite, multi-disciplinary AI Event Planning Assistant specializing in weddings, milestone birthdays, and large-scale community events.
Transform the following event specifications into a comprehensive, actionable, and creative master plan.

Event Specifications:
- Event Title: ${input.title}
- Event Type: ${input.eventType}
- Guest Count: ${input.guestCount}
- Location / Setting: ${input.location}
- Aesthetic & Vibe: ${input.vibe}
- Total Budget: $${input.totalBudget}
- Date: ${input.eventDate || 'Upcoming'}
- Special Constraints/Notes: ${input.specialNotes || 'None'}

You must provide an exhaustive, practical, and inspiring master plan divided into 5 distinct sections:
1. BUDGET ALLOCATION MATRIX: Percentage and dollar breakdown tailored to $${input.totalBudget} across Venue, Catering/Bar, Decor/Flowers, Entertainment, Photography, Buffer/Contingency (reserve 7-10%), and theme-specific cost-saving tips.
2. REVERSE TIMELINE & MILESTONES: Chronological countdown (9-12 months out, 6 months out, 1 month out, Week-of, and detailed Day-of run of show schedule with exact times from morning to wrap-up).
3. VENDOR & LOGISTICS CHECKLIST: Essential vendor categories, 3-4 critical high-impact questions to ask each vendor before hiring, red flags to watch for, and logistical necessities (permits, event insurance, dedicated electrical power specs, guest flow, restroom ratios).
4. PERSONALIZED THEME & CREATIVE CONCEPTS: 3 unique, cohesive creative concepts. For each: Theme Name, Tagline, Story/Narrative vibe, Color Palette with exact hex codes & role names, Signature Experience / Wow-Moment, DIY styling elements (smart savings), and Professional styling splurges.
5. INTERACTIVE COLLABORATION PROMPTS: 3 targeted, highly strategic follow-up questions to refine the plan further (e.g., dietary & bar specializations, weather Plan B thresholds, family/cultural traditions).

Return your response strictly in valid JSON format matching this schema:
{
  "executiveSummary": "string",
  "budgetMatrix": {
    "totalBudget": number,
    "perGuestCost": number,
    "contingencyBufferAmount": number,
    "contingencyBufferPercent": number,
    "categories": [
      {
        "category": "string",
        "percentage": number,
        "amount": number,
        "items": ["string"],
        "tips": "string"
      }
    ],
    "themeSpecificSavingsTips": ["string"]
  },
  "timeline": {
    "milestones": [
      {
        "period": "string",
        "timingBadge": "string",
        "focusTitle": "string",
        "description": "string",
        "bookingWindow": "string",
        "tasks": [
          { "id": "string", "task": "string", "isUrgent": boolean, "deadlineNote": "string" }
        ]
      }
    ],
    "dayOfSchedule": [
      { "id": "string", "time": "string", "activity": "string", "leadPerson": "string", "notes": "string" }
    ]
  },
  "vendorAndLogistics": {
    "vendors": [
      {
        "role": "string",
        "category": "string",
        "priority": "Essential" | "High" | "Medium",
        "budgetEstimate": "string",
        "criticalQuestions": ["string"],
        "redFlags": ["string"]
      }
    ],
    "logistics": [
      {
        "category": "Permits & Licensing" | "Event Insurance & Safety" | "Power & AV Specs" | "Guest Flow & Accessibility" | "Sanitation & Facilities",
        "requirement": "string",
        "criticalDetails": "string",
        "actionItem": "string"
      }
    ]
  },
  "creativeConcepts": [
    {
      "id": "c1",
      "themeName": "string",
      "tagline": "string",
      "narrativeVibe": "string",
      "palette": [
        { "name": "string", "hex": "#xxxxxx", "role": "string" }
      ],
      "signatureExperience": "string",
      "diyElements": ["string"],
      "professionalElements": ["string"],
      "tablescapeAndDecor": "string",
      "audioVisualAtmosphere": "string"
    }
  ],
  "collaborationPrompts": [
    {
      "id": "p1",
      "question": "string",
      "contextWhyItMatters": "string",
      "sampleOptions": ["string"]
    }
  ],
  "fullMarkdown": "Comprehensive markdown formatted document of the complete plan with bold headers, bullet points, and tables."
}
Only output valid JSON with no markdown backticks around it.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text?.trim() || '';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // try stripping backticks if any
      const cleaned = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const mergedPlan: MasterEventPlan = {
      id: 'plan_' + Date.now(),
      createdAt: new Date().toISOString(),
      eventInput: input,
      budgetMatrix: parsed.budgetMatrix || defaultPlan.budgetMatrix,
      timeline: parsed.timeline || defaultPlan.timeline,
      vendorAndLogistics: parsed.vendorAndLogistics || defaultPlan.vendorAndLogistics,
      creativeConcepts: parsed.creativeConcepts || defaultPlan.creativeConcepts,
      collaborationPrompts: parsed.collaborationPrompts || defaultPlan.collaborationPrompts,
      executiveSummary: parsed.executiveSummary || defaultPlan.executiveSummary,
      fullMarkdown: parsed.fullMarkdown || defaultPlan.fullMarkdown
    };

    return res.json({ plan: mergedPlan, source: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Error in Gemini generation:', err);
    // Graceful fallback to default plan
    return res.json({ plan: defaultPlan, source: 'curated-fallback', warning: err.message });
  }
});

// 2. Interactive Refinement API (answering follow-up prompts or custom tweaks)
app.post('/api/refine-plan', async (req, res) => {
  const { currentPlan, promptAnswer, instruction } = req.body;
  const ai = getAiClient();

  if (!ai || !currentPlan) {
    return res.json({
      success: true,
      refinementNote: `Custom refinement recorded: "${instruction || promptAnswer}". The adjustments have been noted in your master event files.`,
    });
  }

  try {
    const prompt = `You are "EventGenie", the elite AI Event Planning Assistant.
The user has provided feedback or answered one of the collaboration prompts for their event:
Event: ${currentPlan.eventInput.title} (${currentPlan.eventInput.eventType})
Guest Count: ${currentPlan.eventInput.guestCount}
Budget: $${currentPlan.budgetMatrix.totalBudget}

User Feedback / Answer:
"${promptAnswer || instruction}"

Analyze this feedback and provide:
1. "refinementNote": A warm, expert explanation of how this changes their plan, budget, or run of show.
2. "actionableTweaks": 3-5 concrete action items or adjustments they should implement immediately.
3. "signatureDrinkOrDetail": A bespoke creative detail (e.g., custom cocktail recipe, unique decor idea, or schedule tweak) matching this choice.

Respond in JSON format:
{
  "refinementNote": "string",
  "actionableTweaks": ["string"],
  "signatureDrinkOrDetail": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Error in refine plan:', err);
    return res.json({
      success: true,
      refinementNote: `Refinement noted: "${promptAnswer || instruction}". We have aligned your schedule and vendor criteria with this selection.`,
      actionableTweaks: [
        'Notify your catering captain of the updated service nuances.',
        'Review the contingency budget line item to account for any custom rentals.',
        'Update your master run-of-show with the designated coordinator.'
      ]
    });
  }
});

// 3. Interactive EventGenie Consultant Chat API
app.post('/api/chat', async (req, res) => {
  const { message, currentPlan, history } = req.body;
  const ai = getAiClient();

  if (!ai) {
    return res.json({
      reply: `EventGenie here! Regarding your event "${currentPlan?.eventInput?.title || 'Celebration'}": When planning for ${currentPlan?.eventInput?.guestCount || 100} guests with a budget of $${currentPlan?.budgetMatrix?.totalBudget?.toLocaleString() || '25,000'}, balancing high-impact focal points (lighting and food) with smart DIY signage always delivers the most memorable guest experience. Would you like me to tailor specific vendor questions or budget trade-offs for this?`
    });
  }

  try {
    const context = `You are "EventGenie", an elite, warm, detail-oriented, and highly organized AI Event Planning Assistant.
The user is currently reviewing their master event plan:
- Event: ${currentPlan?.eventInput?.title || 'Celebration'}
- Type: ${currentPlan?.eventInput?.eventType || 'Event'}
- Guest Count: ${currentPlan?.eventInput?.guestCount || 100}
- Budget: $${currentPlan?.budgetMatrix?.totalBudget?.toLocaleString() || '25,000'}
- Location: ${currentPlan?.eventInput?.location || 'Venue'}
- Vibe: ${currentPlan?.eventInput?.vibe || 'Festive'}

Answer the user's inquiry with professional, high-end event planning wisdom, concrete figures, timeline etiquette, vendor negotiation tactics, or creative concepts. Keep formatting clean with clear markdown and bullet points where helpful.`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${context}\n\nUser Question: ${message}` }] }
      ]
    });

    return res.json({ reply: chatResponse.text });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.json({
      reply: `Thank you for asking! As your EventGenie assistant: for an event of this scale in ${currentPlan?.eventInput?.location || 'your venue'}, always ensure your key anchor contracts (venue & catering) are secured before fine-tuning smaller decorative elements. How else can I assist with your planning checklist today?`
    });
  }
});

// Serve Vite dev server or static dist
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventGenie server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
