# 🌿 Solution Document
## CarbonZero — Carbon Footprint Awareness Platform

**Version:** 1.0  
**Challenge:** PromptWars — Challenge 3  
**Tech Stack:** React + Flask + Firebase + Gemini AI + Google Cloud Run  

---

## 1. Solution Overview

CarbonZero is a full-stack web application that combines a **React frontend**, **Flask backend API**, **Firebase** for database/auth, and **Google Gemini AI** for personalized insights and an intelligent chatbot. The entire stack is containerized and deployed on **Google Cloud Run** for scalable, serverless hosting.

---

## 2. Tech Stack Breakdown

### Frontend
```
React 18 (Vite)
├── react-router-dom v6       — SPA routing
├── TailwindCSS               — utility-first styling
├── Framer Motion             — animations & transitions
├── Recharts                  — data visualization
├── React Query (TanStack)    — server state management
├── Zustand                   — client state management
├── Firebase JS SDK v10       — auth & real-time DB
├── React Hook Form + Zod     — form validation
└── Axios                     — HTTP client
```

### Backend
```
Flask 3.x (Python 3.11)
├── flask-cors                — CORS handling
├── flask-limiter             — rate limiting
├── firebase-admin            — Firebase Admin SDK
├── google-generativeai       — Gemini API SDK
├── python-dotenv             — environment config
├── gunicorn                  — WSGI production server
└── pytest + pytest-cov       — testing framework
```

### Google Services
```
Firebase
├── Firebase Authentication   — Google OAuth + email/password
├── Cloud Firestore           — NoSQL real-time database
├── Firebase Cloud Messaging  — push notifications
└── Firebase Hosting          — static frontend hosting (optional)

Google Cloud
├── Cloud Run                 — serverless container hosting (frontend + backend)
├── Artifact Registry         — Docker image storage
├── Cloud Build               — CI/CD pipeline
└── Secret Manager            — secure API key management

Google AI
├── Gemini 1.5 Flash          — chatbot + insights (cost-efficient)
├── Gemini 1.5 Pro            — complex analysis tasks
└── Gemini Vision             — AR carbon scanner (multimodal)
```

---

## 3. Project Structure

```
carbonzero/
├── frontend/                        # React application
│   ├── public/
│   │   ├── manifest.json            # PWA manifest
│   │   └── sw.js                    # Service Worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Button, Card, Modal, Input
│   │   │   ├── layout/              # Navbar, Sidebar, Footer
│   │   │   ├── charts/              # DonutChart, BarChart, Heatmap
│   │   │   ├── chatbot/             # GreenBot widget
│   │   │   └── calculator/          # Multi-step form components
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Onboarding.jsx       # Calculator wizard
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── LogActivity.jsx      # Daily activity logging
│   │   │   ├── Insights.jsx         # AI insights page
│   │   │   ├── Actions.jsx          # Eco-actions marketplace
│   │   │   ├── Community.jsx        # Leaderboard & challenges
│   │   │   ├── News.jsx             # Sustainability news
│   │   │   └── Profile.jsx          # User settings & goals
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFootprint.js
│   │   │   ├── useGreenBot.js
│   │   │   └── useActivities.js
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance + interceptors
│   │   │   ├── firebase.js          # Firebase initialization
│   │   │   └── emissions.js         # Client-side emission helpers
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── footprintStore.js
│   │   ├── utils/
│   │   │   ├── emissionFactors.js   # IPCC emission constants
│   │   │   ├── validators.js        # Zod schemas
│   │   │   └── formatters.js        # Number/date helpers
│   │   ├── constants/
│   │   │   └── categories.js        # Activity categories
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # Flask API
│   ├── app/
│   │   ├── __init__.py              # App factory
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Token verification
│   │   │   ├── footprint.py         # Carbon calculation routes
│   │   │   ├── activities.py        # Activity CRUD
│   │   │   ├── insights.py          # Gemini insights routes
│   │   │   ├── chatbot.py           # GreenBot chat API
│   │   │   ├── community.py         # Leaderboard routes
│   │   │   └── news.py              # News feed routes
│   │   ├── services/
│   │   │   ├── gemini_service.py    # Gemini AI integration
│   │   │   ├── firebase_service.py  # Firestore operations
│   │   │   ├── carbon_service.py    # Emission calculations
│   │   │   └── cache_service.py     # In-memory caching
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── activity.py
│   │   │   └── footprint.py
│   │   ├── middleware/
│   │   │   ├── auth_middleware.py   # Firebase token verification
│   │   │   └── rate_limit.py
│   │   └── utils/
│   │       ├── emission_factors.py  # IPCC validated factors
│   │       ├── validators.py        # Input sanitization
│   │       └── response.py          # Standard API responses
│   ├── tests/
│   │   ├── test_footprint.py
│   │   ├── test_chatbot.py
│   │   ├── test_activities.py
│   │   └── conftest.py
│   ├── config.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
│
├── infra/
│   ├── cloudbuild.yaml              # Cloud Build CI/CD
│   ├── cloudrun-frontend.yaml       # Cloud Run service spec (frontend)
│   ├── cloudrun-backend.yaml        # Cloud Run service spec (backend)
│   └── firestore.rules              # Firestore security rules
│
├── .github/
│   └── workflows/
│       └── deploy.yml               # GitHub Actions (optional)
│
└── README.md
```

---

## 4. Key Implementation Details

### 4.1 Authentication Flow
```
User → Firebase Auth (Google OAuth / Email)
     → ID Token returned to client
     → Every API call includes: Authorization: Bearer <token>
     → Flask middleware verifies token via firebase-admin
     → User UID used as Firestore document key
```

### 4.2 Carbon Calculation Engine (backend/app/services/carbon_service.py)
```python
EMISSION_FACTORS = {
    "transport": {
        "car_petrol": 0.21,       # kg CO2e per km
        "car_electric": 0.07,
        "flight_economy": 0.255,  # per km
        "bus": 0.089,
        "train": 0.035,
    },
    "diet": {
        "vegan": 1500,            # kg CO2e/year
        "vegetarian": 1700,
        "omnivore": 2500,
        "heavy_meat": 3300,
    },
    "energy": {
        "electricity_india": 0.82, # kg CO2e per kWh (grid factor)
        "natural_gas": 2.04,       # per m³
    },
    "shopping": {
        "clothing_item": 12.0,    # per item
        "electronics_phone": 70,   # per device
    }
}

def calculate_annual_footprint(user_data: dict) -> dict:
    """
    Returns breakdown by category + total in kg CO2e/year
    """
    transport = calculate_transport(user_data["transport"])
    diet = EMISSION_FACTORS["diet"][user_data["diet_type"]]
    energy = calculate_energy(user_data["energy"])
    shopping = calculate_shopping(user_data["shopping"])
    
    total = transport + diet + energy + shopping
    
    return {
        "total_kg_co2e": round(total, 2),
        "breakdown": {
            "transport": round(transport, 2),
            "diet": round(diet, 2),
            "energy": round(energy, 2),
            "shopping": round(shopping, 2),
        },
        "comparison": {
            "india_avg": 1900,     # kg CO2e/year
            "global_avg": 4800,
            "paris_target": 2000,
        }
    }
```

### 4.3 Gemini AI Integration (backend/app/services/gemini_service.py)
```python
import google.generativeai as genai

SYSTEM_PROMPT = """
You are GreenBot, an eco-friendly AI assistant for CarbonZero.
You help users understand and reduce their carbon footprint.
- Be encouraging, not preachy
- Provide specific, actionable advice
- Cite numbers when possible (e.g., "switching to LED saves 40kg CO2/year")
- Keep responses concise (under 200 words unless complex analysis)
- Use emojis sparingly for friendliness
- Always link advice to the user's actual data when available
"""

class GeminiService:
    def __init__(self):
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        self.model = genai.GenerativeModel("gemini-1.5-flash")
    
    def chat(self, message: str, user_context: dict, history: list) -> str:
        """Streaming chat with full user context"""
        context = f"""
User Profile:
- Annual footprint: {user_context['total_kg_co2e']} kg CO2e
- Highest category: {user_context['highest_category']}
- Goal: Reduce by {user_context['goal_percent']}%
- Recent activities: {user_context['recent_activities']}
"""
        full_history = [{"role": "user", "parts": [context + "\n\n" + message]}]
        # ... streaming response handling
    
    def generate_insights(self, footprint_data: dict) -> dict:
        """Weekly personalized insight generation"""
        prompt = f"""
Analyze this carbon footprint data and provide:
1. Top 3 actionable recommendations (ranked by CO2 savings)
2. One positive observation  
3. Weekly trend analysis
4. One fun sustainability fact

Data: {json.dumps(footprint_data)}

Respond in JSON format with keys: recommendations, positive, trend, fun_fact
"""
        # ... JSON response parsing
```

### 4.4 Firestore Data Schema
```
users/{uid}
├── profile: { name, email, photoURL, createdAt, location }
├── footprint: { total_kg_co2e, breakdown, calculated_at }
├── goals: { target_percent, target_year, monthly_targets: [] }
└── preferences: { dark_mode, notifications, units }

users/{uid}/activities/{activityId}
├── category: string
├── type: string
├── value: number
├── unit: string
├── kg_co2e: number
├── date: timestamp
└── notes: string

users/{uid}/chatHistory/{messageId}
├── role: "user" | "assistant"
├── content: string
└── timestamp: timestamp

community/leaderboard/{uid}
├── displayName: string (anonymized option)
├── total_saved_kg: number
├── actions_completed: number
└── badges: []

challenges/{challengeId}
├── title, description, duration
├── participants: [uid]
└── target_kg: number
```

### 4.5 Security Implementation
```python
# Firestore Rules (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // Leaderboard: read-only for all, write only own entry
    match /community/leaderboard/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId;
    }
    
    // Challenges: read all, no direct write (backend only)
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow write: if false; // Backend-only via Admin SDK
    }
  }
}
```

### 4.6 API Endpoints Reference
```
Authentication (all endpoints require Bearer token)

POST /api/v1/footprint/calculate       — Calculate annual footprint
GET  /api/v1/footprint/{uid}           — Get stored footprint
PUT  /api/v1/footprint/{uid}           — Update footprint

POST /api/v1/activities                — Log new activity
GET  /api/v1/activities?date=YYYY-MM   — Get activities by month
DELETE /api/v1/activities/{id}         — Delete activity

POST /api/v1/chatbot/message           — Send message to GreenBot
GET  /api/v1/chatbot/history           — Get chat history
DELETE /api/v1/chatbot/history         — Clear chat history

GET  /api/v1/insights/weekly           — Get Gemini weekly insights
GET  /api/v1/insights/scenario         — Run "what if" scenario

GET  /api/v1/community/leaderboard     — Global/local rankings
POST /api/v1/community/challenges/join — Join a challenge

GET  /api/v1/news/feed                 — Personalized news
GET  /api/v1/actions/list              — Eco-actions with filters

GET  /api/v1/health                    — Health check for Cloud Run
```

---

## 5. Frontend UI Architecture

### Pages & Key Components

#### Dashboard Page
```
DashboardPage
├── WelcomeBanner (Gemini-generated personalized greeting)
├── FootprintGauge (radial gauge — current vs. target)
├── CategoryDonutChart (recharts)
├── WeeklyTrendChart (area chart — 12 weeks)
├── InsightCards (3 AI-generated cards)
├── QuickLogWidget (1-tap recent activities)
├── StreakCounter (days logged consecutively)
└── GreenBotFAB (floating action button)
```

#### GreenBot Chatbot Widget
```
GreenBotWidget (fixed bottom-right)
├── ChatToggleButton (animated leaf icon)
├── ChatWindow (slide-up panel)
│   ├── MessageList (virtualized scroll)
│   │   ├── UserMessage
│   │   └── BotMessage (with typing animation)
│   ├── QuickActions (suggested prompts)
│   └── ChatInput (text + voice input)
└── StreamingResponseHandler (Gemini streaming)
```

### State Management (Zustand)
```javascript
// footprintStore.js
const useFootprintStore = create((set) => ({
  footprint: null,
  activities: [],
  insights: null,
  chatHistory: [],
  
  setFootprint: (data) => set({ footprint: data }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities]
  })),
  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, msg]
  })),
}));
```

---

## 6. Testing Strategy

### Backend Tests (pytest)
```python
# tests/test_footprint.py
def test_calculate_footprint_omnivore():
    data = {
        "transport": {"car_petrol_km_week": 100, "flights_per_year": 2},
        "diet_type": "omnivore",
        "energy": {"electricity_kwh_month": 200},
        "shopping": {"clothing_items_year": 10}
    }
    result = calculate_annual_footprint(data)
    assert result["total_kg_co2e"] > 0
    assert "breakdown" in result
    assert result["breakdown"]["diet"] == 2500

def test_gemini_chatbot_response():
    # Mock Gemini API
    with patch("app.services.gemini_service.genai") as mock_genai:
        mock_genai.GenerativeModel.return_value.start_chat.return_value\
            .send_message.return_value.text = "Test response"
        # ... test assertions
```

### Frontend Tests (Vitest + React Testing Library)
```javascript
// components/calculator/Calculator.test.jsx
describe("FootprintCalculator", () => {
  it("calculates correctly with valid inputs", async () => {
    render(<FootprintCalculator />);
    fireEvent.change(screen.getByLabelText("Weekly km by car"), { 
      target: { value: "100" } 
    });
    fireEvent.click(screen.getByText("Calculate"));
    await waitFor(() => {
      expect(screen.getByTestId("total-footprint")).toBeInTheDocument();
    });
  });
  
  it("shows validation error for negative values", () => {
    // ...
  });
});
```

---

## 7. Accessibility Implementation

```jsx
// Accessible Chart Component Example
const FootprintDonutChart = ({ data }) => (
  <div role="img" aria-label={`Carbon footprint breakdown: 
    Transport ${data.transport}kg, Diet ${data.diet}kg`}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          tabIndex={0}
          aria-label="Footprint distribution chart"
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    {/* Screen-reader table fallback */}
    <table className="sr-only">
      <caption>Carbon footprint data table</caption>
      <thead><tr><th>Category</th><th>kg CO2e</th></tr></thead>
      <tbody>
        {data.map(item => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

**Accessibility Checklist:**
- [x] All images have descriptive `alt` text
- [x] Form fields have associated `<label>` elements
- [x] Color never used as sole information carrier
- [x] Focus trapped in modals (focus-trap-react)
- [x] Skip navigation link at page top
- [x] Keyboard shortcuts documented
- [x] `aria-live` regions for dynamic content (chat, notifications)
- [x] High-contrast mode via `prefers-contrast` media query
- [x] Reduced motion via `prefers-reduced-motion`

---

## 8. Performance Optimizations

```javascript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Community = lazy(() => import('./pages/Community'));

// React Query caching
const { data: footprint } = useQuery({
  queryKey: ['footprint', uid],
  queryFn: fetchFootprint,
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,
});

// Virtual list for activity logs
import { FixedSizeList } from 'react-window';

// Service Worker for offline support
// Cache-first strategy for static assets
// Network-first for API calls
```

**Backend optimizations:**
- Response caching for insights (TTL: 1 hour)
- Database query indexing on `uid + date`
- Gemini response streaming to reduce perceived latency
- Connection pooling via gunicorn workers

---

*Document Version 1.0 — CarbonZero Solution*