import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_SCHEMES } from './src/data/schemesData.ts';
import { generateRecommendations } from './src/utils/recommendationEngine.ts';
import { DEFAULT_WEIGHTS } from './src/data/demoData.ts';
import { FarmerProfile } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini API client if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'KisanKalyan Backend API',
    schemesCount: INITIAL_SCHEMES.length,
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString()
  });
});

// Schemes endpoint
app.get('/api/schemes', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: INITIAL_SCHEMES
  });
});

// Recommendations endpoint
app.post('/api/recommendations', (req: Request, res: Response) => {
  try {
    const profile: FarmerProfile = req.body.profile;
    const weights = req.body.weights || DEFAULT_WEIGHTS;
    if (!profile) {
      res.status(400).json({ error: 'Missing farmer profile in request body' });
      return;
    }
    const recommendations = generateRecommendations(profile, INITIAL_SCHEMES, weights);
    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to compute recommendations' });
  }
});

// Chatbot endpoint with Gemini API and Local Retrieval Fallback
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, language = 'en', farmerProfile } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required' });
    return;
  }

  const queryLower = message.toLowerCase();

  // Find relevant schemes in repository based on keywords
  const matchedSchemes = INITIAL_SCHEMES.filter(s => {
    const hay = `${s.scheme_name} ${s.short_description} ${s.category} ${s.state} ${s.eligible_crops.join(' ')} ${s.benefits}`.toLowerCase();
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);
    return words.some(w => hay.includes(w));
  }).slice(0, 4);

  // If Gemini API is available, generate grounded advice
  if (ai) {
    try {
      // Build focused schemes context with top matching schemes + primary agricultural flagships
      const candidateSchemes = matchedSchemes.length > 0 
        ? matchedSchemes 
        : INITIAL_SCHEMES.filter(s => s.state === 'Tamil Nadu' || s.level === 'Central').slice(0, 5);

      const schemesContext = candidateSchemes.map(s => 
        `Scheme: ${s.scheme_name} (${s.level} - ${s.state})
Category: ${s.category}
Benefits: ${s.benefit_amount} - ${s.benefits}
Eligibility: Age ${s.minimum_age}-${s.maximum_age}, Land: ${s.land_min}-${s.land_max || 'No limit'} acres, Crops: ${s.eligible_crops.join(', ')}
Required Documents: ${s.required_documents.join(', ')}
Official Portal: ${s.official_website || s.application_url}`
      ).join('\n---\n');

      const profileContext = farmerProfile 
        ? `User Context: Name ${farmerProfile.fullName}, Role/Category: ${farmerProfile.farmerCategory || 'Farmer'}, State: ${farmerProfile.state || 'Tamil Nadu'}, District: ${farmerProfile.district || 'Thanjavur'}, Land: ${farmerProfile.landholdingSize || 2.5} acres, Crop: ${farmerProfile.cropType || 'Paddy / Rice'}, Irrigation: ${farmerProfile.irrigationAvailable ? farmerProfile.irrigationType : 'Borewell'}`
        : 'User Context: Tamil Nadu Farmer / Agricultural Stakeholder';

      const prompt = `You are "ANNA AGRI AI" (AAA Platform), an authoritative, friendly agricultural intelligence advisor for Tamil Nadu farmers, produce buyers, and agri officers.
Language requested: ${language === 'ta' ? 'Tamil (தமிழ்)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
${profileContext}

Key Platform Features You Can Guide Users On:
1. TNAU Soil Test Slot Booking: 100% Free under Soil Health Mission at TNAU research centres and mobile vans; reports test 12 micro/macro nutrients with official printable token slips.
2. Farmer-Fixed Price Marketplace: Farmers list produce at their own fair rate with 0% middleman brokerage and statutory APMC Mandi Cess exemption under the TN Direct Agricultural Produce Marketing Act.
3. Bulk Commercial Procurement & Tax Invoices: Buyers can source direct from farmgate with automatic E-Way bill generation and escrow DBT payment security.
4. District Agro-Weather Advisories: 38-district weather forecast, monsoon alerts, and pest advisories.
5. Welfare Schemes & Subsidies: Kuruvai delta package, PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, PM-KUSUM solar pumps (60-70% subsidy), PMKSY micro-irrigation (up to 100% subsidy for small/marginal farmers).

Verified Government Schemes Context:
${schemesContext}

User Query: "${message}"

Instructions:
1. Ground your answer in official Tamil Nadu & Central agricultural rules and platform features.
2. Structure your answer with clear, bulleted points or short paragraphs.
3. Highlight exact benefits (financial, input, or operational), required documents, and action steps.
4. Always answer fully and fluently in the requested language (${language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिन्दी' : 'English'}).
5. Keep tone respectful, encouraging, and rural-friendly.`;

      // Helper function with timeout
      const callModelWithTimeout = async (modelName: string, timeoutMs: number = 12000) => {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on ${modelName}`)), timeoutMs)
        );
        const apiPromise = ai!.models.generateContent({
          model: modelName,
          contents: prompt
        });
        return await Promise.race([apiPromise, timeoutPromise]);
      };

      let response: any = null;
      // Cascade: try gemini-3.1-flash-lite first (fast & reliable), then gemini-3.8-flash
      try {
        response = await callModelWithTimeout('gemini-3.1-flash-lite', 10000);
      } catch (liteErr: any) {
        console.warn('gemini-3.1-flash-lite attempt failed or timed out, trying gemini-3.8-flash:', liteErr?.message || liteErr);
        try {
          response = await callModelWithTimeout('gemini-3.8-flash', 10000);
        } catch (flashErr: any) {
          console.warn('gemini-3.8-flash also failed:', flashErr?.message || flashErr);
          throw flashErr;
        }
      }

      const reply = response?.text || 'I have analyzed your request based on verified government schemes.';
      res.json({
        success: true,
        reply,
        referencedSchemes: matchedSchemes.length > 0 ? matchedSchemes : candidateSchemes.slice(0, 3)
      });
      return;
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local retrieval:', err?.message || err);
    }
  }

  // Local Intelligent Fallback
  let reply = '';
  if (queryLower.includes('rice') || queryLower.includes('paddy') || queryLower.includes('நெல்') || queryLower.includes('धान')) {
    if (language === 'ta') {
      reply = `நெல் விவசாயிகளுக்கு பிரதம மந்திரி கிசான் திட்டம் (ஆண்டுக்கு ₹6,000), PMFBY பயிர் காப்பீடு (2% பிரீமியம்), மற்றும் காவிரி டெல்டா பகுதியில் குருவை தொகுப்பு திட்டம் (இலவச சான்று பெற்ற விதைகள், யூரியா & டிஏபி) கிடைக்கின்றன.`;
    } else if (language === 'hi') {
      reply = `धान की खेती करने वाले किसानों के लिए पीएम-किसान (₹6,000/वर्ष), पीएम फसल बीमा योजना (2% प्रीमियम), एवं प्रमाणित बीज सब्सिडी (SMSP) उपलब्ध हैं।`;
    } else {
      reply = `For paddy/rice cultivation, top matching schemes are PM-KISAN (₹6,000/yr direct income support), PMFBY Crop Insurance (2% subsidized Kharif premium), and the Tamil Nadu Kuruvai Special Package (free certified seeds & fertilizers for delta farmers).`;
    }
  } else if (queryLower.includes('solar') || queryLower.includes('pump') || queryLower.includes('சோலார்') || queryLower.includes('सोलर')) {
    if (language === 'ta') {
      reply = `PM-KUSUM திட்டத்தின் கீழ் 7.5 HP வரையிலான சோலார் விவசாய பம்புசெட்டுகளுக்கு மத்திய-மாநில அரசுகள் இணைந்து 60% முதல் 70% வரை மானியம் வழங்குகின்றன. விவசாயி 10% முதல் 40% வரை மட்டும் செலுத்தினால் போதுமானது.`;
    } else if (language === 'hi') {
      reply = `पीएम-कुसुम योजना के तहत 7.5 एचपी तक के सोलर वाटर पंपों पर केंद्र और राज्य सरकार द्वारा 60% से 70% तक भारी सब्सिडी प्रदान की जाती है।`;
    } else {
      reply = `Under the PM-KUSUM Scheme (Component-B), farmers can install standalone solar agriculture pumps (up to 7.5 HP) with 60% to 70% joint Central and State subsidies. Farmer pays only 10% to 40% of the cost.`;
    }
  } else if (queryLower.includes('drip') || queryLower.includes('water') || queryLower.includes('irrigation') || queryLower.includes('பாசனம்') || queryLower.includes('सिंचाई')) {
    if (language === 'ta') {
      reply = `பிரதம மந்திரி கிரிஷி சிஞ்சாயி யோஜனா (PDMC) திட்டத்தில் சிறு மற்றும் குறு விவசாயிகளுக்கு 100% வரையிலும், பிற விவசாயிகளுக்கு 75% வரையிலும் சொட்டுநீர் மற்றும் தெளிப்புநீர் பாசன மானியம் வழங்கப்படுகிறது.`;
    } else if (language === 'hi') {
      reply = `प्रति बूंद अधिक फसल (PMKSY-PDMC) के अंतर्गत ड्रिप एवं स्प्रिंकलर सूक्ष्म सिंचाई प्रणाली लगाने हेतु 55% से 100% तक अनुदान प्राप्त होता है।`;
    } else {
      reply = `Per Drop More Crop (PDMC under PMKSY) provides 55% to 100% subsidy on Drip and Sprinkler micro-irrigation systems. In states like Tamil Nadu, small and marginal farmers receive up to 100% full subsidy.`;
    }
  } else if (queryLower.includes('document') || queryLower.includes('ஆவணம்') || queryLower.includes('दस्तावेज')) {
    if (language === 'ta') {
      reply = `அரசு திட்டங்களுக்கு பொதுவாக தேவைப்படும் முக்கிய ஆவணங்கள்: 1) ஆதார் அட்டை, 2) நில பட்டா/சிட்டா, 3) ஆதார் இணைக்கப்பட்ட வங்கி பாஸ்புக், 4) கிராம நிர்வாக அலுவலர் (VAO) பயிர் அடங்கல் சான்று, 5) சாதிச் சான்றிதழ்.`;
    } else if (language === 'hi') {
      reply = `अधिकांश योजनाओं के लिए आवश्यक मुख्य दस्तावेज: 1) आधार कार्ड, 2) भूमि रिकॉर्ड (खतौनी/पट्टा), 3) आधार-लिंक्ड बैंक पासबुक, 4) पटवारी द्वारा फसल बुवाई प्रमाण पत्र (गिरदावरी), 5) जाति प्रमाण पत्र।`;
    } else {
      reply = `Core documents required for most agricultural schemes: 1) Aadhaar Card with active mobile link, 2) Land Record (Patta/Chitta/Khatauni), 3) Aadhaar-seeded Bank Passbook, 4) Crop Sowing Certificate (Adangal/Girdawari), and 5) Community Certificate if applicable.`;
    }
  } else {
    if (language === 'ta') {
      reply = `உங்கள் சுயவிவரப்படி PM-KISAN, பயிர் காப்பீடு (PMFBY), சொட்டுநீர் பாசன மானியம் (PDMC), மற்றும் கிசான் கிரெடிட் கார்டு (KCC) போன்ற திட்டங்கள் சிறந்த பொருத்தமுடையவை. கூடுதல் விவரங்களை திட்ட அட்டைகளில் காணலாம்.`;
    } else if (language === 'hi') {
      reply = `आपकी कृषि प्रोफाइल के आधार पर पीएम-किसान, पीएम फसल बीमा योजना, ड्रिप सिंचाई सब्सिडी, और किसान क्रेडिट कार्ड (4% ब्याज) योजनाएं प्रमुख हैं।`;
    } else {
      reply = `Based on our verified agricultural database, top recommended central and state schemes include PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, PMKSY Micro-Irrigation (Drip/Sprinkler subsidy), and Kisan Credit Card (concessional credit at 4%). You can explore exact match scores and eligibility on your dashboard.`;
    }
  }

  res.json({
    success: true,
    reply,
    referencedSchemes: matchedSchemes.length > 0 ? matchedSchemes : INITIAL_SCHEMES.slice(0, 3)
  });
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KisanKalyan Platform running at http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
