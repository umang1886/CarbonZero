<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=CarbonZero&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=AI-Powered%20Carbon%20Intelligence%20Platform&descSize=20&descAlignY=60" width="100%" />

<!-- Live App Badge -->
<a href="https://carbonzero-frontend-252463810730.asia-south1.run.app/" target="_blank">
  <img src="https://img.shields.io/badge/🌍%20Live%20Demo-carbonzero.app-52B788?style=for-the-badge&logoColor=white" alt="Live Demo" />
</a>
&nbsp;
<a href="https://github.com/umang1886/CarbonZero/stargazers">
  <img src="https://img.shields.io/github/stars/umang1886/CarbonZero?style=for-the-badge&color=52B788&logo=github&logoColor=white" alt="Stars" />
</a>
&nbsp;
<a href="https://github.com/umang1886/CarbonZero/blob/main/LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-74C0FC?style=for-the-badge" alt="License" />
</a>

<br/><br/>

<!-- Tech Badges -->
<img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Firebase-FF6F00?style=flat-square&logo=firebase&logoColor=white" />
<img src="https://img.shields.io/badge/Cloud_Run-4285F4?style=flat-square&logo=google-cloud&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />

<br/><br/>

> **CarbonZero** is a full-stack, AI-powered web application that helps individuals calculate, track, and reduce their personal carbon footprint using IPCC-validated emission factors and Google Gemini AI.

</div>

---

## ✨ Features at a Glance

<div align="center">

| Feature | Description |
|---|---|
| 🔢 **Carbon Calculator** | IPCC-validated CO₂e across transport, diet, energy & shopping |
| 🤖 **Gemini AI Chatbot** | Real-time eco advice via natural language (GreenBot) |
| 📊 **AI Insights Dashboard** | Bento-box analytics, What-If sliders & weekly report cards |
| 🏆 **Community Leaderboard** | Global & city-level rankings with 30-day challenges |
| 📝 **Activity Logger** | Log daily eco activities with CO₂ impact tracking |
| 🛡️ **Firebase Auth** | Secure login, protected routes & persistent user data |
| ☁️ **Cloud Run Deployed** | Auto-scaling, zero-config production infrastructure |

</div>

---

## 🖼️ Screenshots

<div align="center">

### 🏠 Landing Page — Interactive 3D Sandbox
> Toggle scenarios (EV, Vegan Diet, Solar) and watch your projected CO₂ drop in real-time!

```
┌─────────────────────────────────────────────────────────────────┐
│  🌱 CarbonZero              Dashboard  Calculator  Community    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Know Your Carbon Story.                   ┌─────────────┐    │
│   Change It.                                │  4,500 kg   │    │
│                                             │  CO₂e/yr    │    │
│   [Calculate My Footprint →]                │  ▓▓▓░░░░░░  │    │
│   [View Demo Dashboard]                     └─────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 📊 Dashboard — Real-Time Analytics
```
┌─────────────────────────────────────────────────────────────────┐
│  Total Footprint     Weekly Trend        Top Category           │
│  ┌────────────┐     ┌────────────┐      ┌────────────┐         │
│  │ 4,500 kg   │     │  ╭──╮      │      │  🚗 1,500  │         │
│  │ CO₂e /yr   │     │ ╭╯  ╰─    │      │  Transport │         │
│  └────────────┘     └────────────┘      └────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

</div>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend — Next.js 16"]
        A[Landing Page] --> B[Auth Pages]
        B --> C[Dashboard]
        C --> D[Calculator]
        C --> E[AI Insights]
        C --> F[Community]
        C --> G[Log Activity]
        H[GreenBot Chatbot]
    end

    subgraph Backend["Backend — FastAPI + Python"]
        I["/api/v1/footprint/calculate"]
        J["/api/v1/footprint/latest"]
        K["/api/v1/chat/message"]
    end

    subgraph Cloud["Google Cloud"]
        L[Cloud Run — Frontend]
        M[Cloud Run — Backend]
        N[Firebase Auth]
        O[Firestore DB]
        P[Gemini 1.5 Flash API]
    end

    D --> I
    H --> K
    I --> O
    K --> P
    L --> M
    B --> N
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ & npm
- Python 3.11+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- A [Firebase Project](https://console.firebase.google.com/)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/umang1886/CarbonZero.git
cd CarbonZero
```

### 2️⃣ Setup the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
python run.py
# Backend available at http://localhost:5000
```

### 3️⃣ Setup the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Run the dev server
npm run dev
# Frontend available at http://localhost:3000
```

---

## ☁️ Cloud Run Deployment

### Backend
```bash
cd backend
gcloud run deploy carbonzero-backend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=YOUR_KEY,ALLOWED_ORIGIN=YOUR_FRONTEND_URL"
```

### Frontend
```bash
cd frontend
gcloud run deploy carbonzero-frontend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-build-env-vars="NEXT_PUBLIC_API_URL=YOUR_BACKEND_URL"
```

---

## 🔐 Environment Variables

### Backend (`.env`)
| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ Yes |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | ✅ Yes |
| `FLASK_ENV` | `development` or `production` | Optional |

### Frontend (`.env.local`)
| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ Yes |

---

## 🧮 Emission Factors (IPCC-Validated)

CarbonZero uses emission factors from the **IPCC AR6 Report** and internationally recognized databases:

| Category | Source | Factor |
|---|---|---|
| 🚗 Petrol Car | IPCC AR6 | 0.21 kg CO₂e/km |
| ✈️ Short-haul Flight | IPCC AR6 | 0.255 kg CO₂e/km |
| 🥩 Beef Consumption | Our World in Data | 27.0 kg CO₂e/kg |
| ⚡ Grid Electricity (India) | IEA 2023 | 0.71 kg CO₂e/kWh |
| 🛍️ General Shopping | EPA | 0.5 kg CO₂e/$ |

---

## 🧪 Running Tests

```bash
cd backend

# Install test dependencies
pip install pytest

# Run the test suite
pytest tests/ -v
```

```
✅ test_footprint_calculation_basic       PASSED
✅ test_footprint_transport_only          PASSED
✅ test_footprint_vegan_diet              PASSED
✅ test_footprint_all_categories          PASSED
```

---

## 📁 Project Structure

```
CarbonZero/
├── 📂 frontend/                  # Next.js 16 App
│   ├── 📂 src/
│   │   ├── 📂 app/               # App Router pages
│   │   │   ├── page.tsx          # Landing Page
│   │   │   ├── dashboard/        # Main Dashboard
│   │   │   ├── calculator/       # CO₂ Calculator
│   │   │   ├── insights/         # AI Insights
│   │   │   ├── community/        # Leaderboard
│   │   │   └── log/              # Activity Logger
│   │   ├── 📂 components/        # Reusable Components
│   │   │   ├── ChatBot.tsx       # GreenBot AI Chat
│   │   │   ├── Navbar.tsx        # Navigation
│   │   │   └── ui/               # shadcn components
│   │   ├── 📂 store/             # Zustand State
│   │   ├── 📂 lib/               # Firebase config
│   │   └── config.ts             # API URL config
│   ├── Dockerfile
│   └── next.config.ts
│
├── 📂 backend/                   # FastAPI + Flask App
│   ├── 📂 app/
│   │   ├── 📂 routes/
│   │   │   ├── footprint.py      # CO₂ calculation API
│   │   │   └── chat.py           # Gemini AI chat API
│   │   └── firebase_admin_setup.py
│   ├── 📂 tests/
│   │   └── test_footprint.py     # Unit tests
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
│
└── README.md
```

---

## 🧑‍💻 Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router) |
| **UI Library** | shadcn/ui + Tailwind CSS |
| **Animations** | Framer Motion |
| **State Management** | Zustand |
| **Backend Framework** | FastAPI / Flask |
| **AI Model** | Google Gemini 1.5 Flash |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Deployment** | Google Cloud Run |
| **Containerization** | Docker (multi-stage builds) |
| **Testing** | pytest |

</div>

---

## 🌍 Impact Goals

```
Current Global Average:  ████████████████████  4,800 kg CO₂e/yr
CarbonZero Users Avg:    ████████████░░░░░░░░  4,080 kg CO₂e/yr  (-15%)
Paris Agreement Target:  ██████████░░░░░░░░░░  2,000 kg CO₂e/yr
```

> 💡 **Our mission**: Help every user reduce their footprint by at least **15%** in the first 30 days through data-driven, AI-personalized action plans.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Umang Vaghela**

Built with ❤️ for the **PromptWars Challenge 3**

Powered by **Google Gemini AI**, **Firebase**, and **Google Cloud Run**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer&animation=twinkling" width="100%" />

</div>
