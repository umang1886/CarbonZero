# 🏗️ Architecture Document
## CarbonZero — Carbon Footprint Awareness Platform

**Version:** 1.0  
**Deployment Target:** Google Cloud Run  
**Region:** asia-south1 (Mumbai, India)  

---

## 1. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USERS (Browser / Mobile)                          │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ HTTPS
                ┌───────────────────▼───────────────────────┐
                │           Google Cloud Run                  │
                │  ┌────────────────┐  ┌──────────────────┐  │
                │  │  Frontend      │  │   Backend API    │  │
                │  │  (React/Nginx) │  │  (Flask/Gunicorn)│  │
                │  │  Port: 8080    │  │  Port: 5000      │  │
                │  └───────┬────────┘  └────────┬─────────┘  │
                └──────────┼────────────────────┼────────────┘
                           │ API calls          │
          ┌────────────────┼────────────────────┼──────────────────┐
          │                │   GOOGLE SERVICES  │                  │
          │  ┌─────────────▼──────┐  ┌──────────▼───────────────┐  │
          │  │  Firebase Auth     │  │  Cloud Firestore          │  │
          │  │  (Google OAuth +   │  │  (NoSQL Database)         │  │
          │  │   Email/Password)  │  │                           │  │
          │  └────────────────────┘  └───────────────────────────┘  │
          │                                                          │
          │  ┌─────────────────────┐  ┌───────────────────────────┐ │
          │  │  Gemini 1.5 Flash   │  │  Cloud Secret Manager     │ │
          │  │  (Chatbot + Insights│  │  (API Keys, Credentials)  │ │
          │  │   + Vision API)     │  │                           │ │
          │  └─────────────────────┘  └───────────────────────────┘ │
          │                                                          │
          │  ┌─────────────────────┐  ┌───────────────────────────┐ │
          │  │  Firebase Cloud     │  │  Artifact Registry        │ │
          │  │  Messaging (FCM)    │  │  (Docker Images)          │ │
          │  └─────────────────────┘  └───────────────────────────┘ │
          │                                                          │
          │  ┌─────────────────────────────────────────────────────┐ │
          │  │              Cloud Build (CI/CD)                     │ │
          │  │  GitHub Push → Build → Test → Push to Registry →    │ │
          │  │  Deploy to Cloud Run                                 │ │
          │  └─────────────────────────────────────────────────────┘ │
          └──────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Frontend Architecture (React)

```
┌──────────────────────────────────────────────────────────────────┐
│                     React Application (SPA)                       │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    React Router v6                          │  │
│  │  /             → LandingPage                               │  │
│  │  /auth         → AuthPage (Login/Register)                 │  │
│  │  /onboarding   → OnboardingWizard (Calculator)             │  │
│  │  /dashboard    → DashboardPage ← Protected Route           │  │
│  │  /log          → LogActivityPage ← Protected Route         │  │
│  │  /insights     → InsightsPage ← Protected Route            │  │
│  │  /actions      → ActionsPage ← Protected Route             │  │
│  │  /community    → CommunityPage ← Protected Route           │  │
│  │  /news         → NewsPage ← Protected Route                │  │
│  │  /profile      → ProfilePage ← Protected Route             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │   Zustand Store  │  │   React Query    │  │  Firebase SDK    ││
│  │  ─────────────── │  │  ─────────────── │  │  ─────────────── ││
│  │  authStore       │  │  Server state    │  │  onAuthState     ││
│  │  footprintStore  │  │  Caching         │  │  Change          ││
│  │  chatStore       │  │  Invalidation    │  │  Firestore       ││
│  │  uiStore         │  │  Background sync │  │  realtime        ││
│  └──────────────────┘  └──────────────────┘  └──────────────────┘│
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                   Component Library                           │ │
│  │  Layout: Navbar, Sidebar, Footer, PageWrapper                │ │
│  │  Charts: DonutChart, AreaChart, BarChart, HeatmapCalendar    │ │
│  │  Forms: MultiStepForm, ActivityLogger, GoalSetter            │ │
│  │  UI: GreenBot, NotificationToast, LoadingSkeleton, Badge     │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Backend Architecture (Flask)

```
┌──────────────────────────────────────────────────────────────────┐
│                     Flask Application                             │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Application Factory (app/__init__.py)          │  │
│  │  Flask app  +  CORS  +  Rate Limiter  +  Error Handlers    │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                             │                                      │
│  ┌──────────────────────────▼───────────────────────────────────┐ │
│  │              Auth Middleware (verify Firebase token)          │ │
│  └──────────────────────────┬───────────────────────────────────┘ │
│                             │                                      │
│  ┌──────────────────────────▼───────────────────────────────────┐ │
│  │                    Route Blueprints                           │ │
│  │                                                               │ │
│  │  /api/v1/footprint   → footprint_bp                         │ │
│  │  /api/v1/activities  → activities_bp                        │ │
│  │  /api/v1/chatbot     → chatbot_bp                           │ │
│  │  /api/v1/insights    → insights_bp                          │ │
│  │  /api/v1/community   → community_bp                         │ │
│  │  /api/v1/news        → news_bp                              │ │
│  │  /api/v1/health      → health_bp                            │ │
│  └──────────────────────────┬───────────────────────────────────┘ │
│                             │                                      │
│  ┌──────────────────────────▼───────────────────────────────────┐ │
│  │                    Service Layer                              │ │
│  │  GeminiService   — Chat, insights, scenario simulation       │ │
│  │  FirebaseService — Firestore CRUD, Admin SDK operations      │ │
│  │  CarbonService   — Emission calculations, factor lookups     │ │
│  │  CacheService    — TTL-based in-memory cache                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Cloud Firestore)

```
Firestore
├── users/ (collection)
│   └── {uid}/ (document)
│       ├── Fields:
│       │   ├── name: string
│       │   ├── email: string
│       │   ├── photoURL: string
│       │   ├── location: string
│       │   ├── createdAt: timestamp
│       │   └── preferences: map
│       │       ├── darkMode: bool
│       │       ├── notifications: bool
│       │       └── units: "metric" | "imperial"
│       │
│       ├── footprint/ (sub-collection)
│       │   └── {year_month}/ (document)
│       │       ├── totalKgCo2e: number
│       │       ├── breakdown: map
│       │       │   ├── transport: number
│       │       │   ├── diet: number
│       │       │   ├── energy: number
│       │       │   └── shopping: number
│       │       └── calculatedAt: timestamp
│       │
│       ├── activities/ (sub-collection)
│       │   └── {activityId}/ (document)
│       │       ├── category: string
│       │       ├── type: string
│       │       ├── value: number
│       │       ├── unit: string
│       │       ├── kgCo2e: number
│       │       ├── date: timestamp
│       │       └── notes: string
│       │
│       ├── goals/ (sub-collection)
│       │   └── current/ (document)
│       │       ├── targetPercent: number
│       │       ├── targetYear: number
│       │       ├── baselineKg: number
│       │       └── milestones: array
│       │
│       └── chatHistory/ (sub-collection)
│           └── {messageId}/ (document)
│               ├── role: "user" | "assistant"
│               ├── content: string
│               └── timestamp: timestamp
│
├── community/ (collection)
│   └── leaderboard/ (sub-collection)
│       └── {uid}/ (document)
│           ├── displayName: string
│           ├── anonymous: bool
│           ├── totalSavedKg: number
│           ├── actionsCompleted: number
│           ├── badges: array
│           └── updatedAt: timestamp
│
└── challenges/ (collection)
    └── {challengeId}/ (document)
        ├── title: string
        ├── description: string
        ├── startDate: timestamp
        ├── endDate: timestamp
        ├── targetKg: number
        ├── participants: array
        └── category: string
```

**Firestore Indexes:**
```
activities: (uid ASC, date DESC)         — for activity timeline
leaderboard: (totalSavedKg DESC)         — for rankings
activities: (uid ASC, category ASC)      — for category filtering
```

---

## 4. API Request/Response Flow

### Chat Flow (GreenBot)
```
User types message
    │
    ▼
Frontend (useGreenBot hook)
    │  POST /api/v1/chatbot/message
    │  Body: { message, chat_history_id }
    │  Header: Authorization: Bearer <firebase_id_token>
    ▼
Flask chatbot_bp route
    │
    ├─ auth_middleware.verify_token(token)  → uid
    │
    ├─ firebase_service.get_user_context(uid)
    │   └─ Returns: footprint, recent_activities, goals
    │
    ├─ firebase_service.get_chat_history(uid, limit=10)
    │
    ├─ gemini_service.stream_chat(message, context, history)
    │   └─ Gemini 1.5 Flash API (streaming)
    │
    ├─ firebase_service.save_message(uid, "user", message)
    ├─ firebase_service.save_message(uid, "assistant", response)
    │
    └─ Return: StreamingResponse (Server-Sent Events)
    
Frontend receives streaming response
    └─ Renders tokens progressively (typing effect)
```

### Carbon Calculation Flow
```
User completes onboarding form
    │
    ▼
POST /api/v1/footprint/calculate
    │  Body: { transport: {...}, diet_type, energy: {...}, shopping: {...} }
    ▼
carbon_service.calculate_annual_footprint(data)
    │   Uses IPCC emission factors
    │   Returns: { total_kg_co2e, breakdown, comparison }
    ▼
firebase_service.save_footprint(uid, result)
    │   Saves to users/{uid}/footprint/{year_month}
    ▼
gemini_service.generate_initial_insights(result)
    │   One-time personalized analysis
    ▼
Response: { footprint: {...}, insights: [...], redirect: "/dashboard" }
```

---

## 5. Docker Configuration

### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### Frontend Nginx Config
```nginx
# frontend/nginx.conf
server {
    listen 8080;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/javascript text/css application/json;
    gzip_min_length 256;

    # Cache static assets
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router — serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.googleapis.com https://*.google.com";
}
```

### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

# Security: non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Change to non-root user
USER appuser

# Cloud Run expects PORT env variable
ENV PORT=5000
EXPOSE 5000

# Gunicorn: 2 workers * (2 * CPU + 1) for Cloud Run
CMD exec gunicorn --bind :$PORT \
    --workers 2 \
    --threads 4 \
    --timeout 60 \
    --access-logfile - \
    --error-logfile - \
    run:app
```

---

## 6. Cloud Run Deployment Configuration

### Backend Service (cloudrun-backend.yaml)
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: carbonzero-backend
  namespace: default
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 60
      serviceAccountName: carbonzero-sa@PROJECT_ID.iam.gserviceaccount.com
      containers:
        - image: REGION-docker.pkg.dev/PROJECT_ID/carbonzero/backend:latest
          ports:
            - containerPort: 5000
          resources:
            limits:
              cpu: "1"
              memory: "512Mi"
          env:
            - name: FLASK_ENV
              value: "production"
            - name: PROJECT_ID
              value: "PROJECT_ID"
            - name: GEMINI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: gemini-api-key
                  key: latest
            - name: FIREBASE_CREDENTIALS
              valueFrom:
                secretKeyRef:
                  name: firebase-credentials
                  key: latest
          livenessProbe:
            httpGet:
              path: /api/v1/health
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /api/v1/health
            initialDelaySeconds: 5
            periodSeconds: 10
```

### Frontend Service (cloudrun-frontend.yaml)
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: carbonzero-frontend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "5"
    spec:
      containers:
        - image: REGION-docker.pkg.dev/PROJECT_ID/carbonzero/frontend:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "0.5"
              memory: "256Mi"
          env:
            - name: VITE_BACKEND_URL
              value: "https://carbonzero-backend-HASH-uc.a.run.app"
            - name: VITE_FIREBASE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: firebase-web-config
                  key: latest
```

---

## 7. CI/CD Pipeline (Cloud Build)

### cloudbuild.yaml
```yaml
steps:
  # 1. Install & Test Frontend
  - name: 'node:20-alpine'
    id: 'test-frontend'
    dir: 'frontend'
    entrypoint: 'sh'
    args:
      - '-c'
      - |
        npm ci
        npm run test:coverage
        npm run lint

  # 2. Install & Test Backend
  - name: 'python:3.11-slim'
    id: 'test-backend'
    dir: 'backend'
    entrypoint: 'sh'
    args:
      - '-c'
      - |
        pip install -r requirements.txt
        pip install pytest pytest-cov
        pytest tests/ --cov=app --cov-report=xml
        coverage report --fail-under=70

  # 3. Build Frontend Docker Image
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build-frontend'
    args:
      - 'build'
      - '-t'
      - '${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/frontend:$COMMIT_SHA'
      - '-t'
      - '${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/frontend:latest'
      - './frontend'
    waitFor: ['test-frontend']

  # 4. Build Backend Docker Image
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build-backend'
    args:
      - 'build'
      - '-t'
      - '${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/backend:$COMMIT_SHA'
      - '-t'
      - '${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/backend:latest'
      - './backend'
    waitFor: ['test-backend']

  # 5. Push Images to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    id: 'push-images'
    entrypoint: 'sh'
    args:
      - '-c'
      - |
        docker push ${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/frontend:latest
        docker push ${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/backend:latest
    waitFor: ['build-frontend', 'build-backend']

  # 6. Deploy Backend to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    id: 'deploy-backend'
    args:
      - 'run'
      - 'deploy'
      - 'carbonzero-backend'
      - '--image=${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/backend:$COMMIT_SHA'
      - '--region=${_REGION}'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--set-secrets=GEMINI_API_KEY=gemini-api-key:latest,FIREBASE_CREDENTIALS=firebase-credentials:latest'
    waitFor: ['push-images']

  # 7. Deploy Frontend to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    id: 'deploy-frontend'
    args:
      - 'run'
      - 'deploy'
      - 'carbonzero-frontend'
      - '--image=${_REGION}-docker.pkg.dev/${PROJECT_ID}/carbonzero/frontend:$COMMIT_SHA'
      - '--region=${_REGION}'
      - '--platform=managed'
      - '--allow-unauthenticated'
    waitFor: ['push-images']

substitutions:
  _REGION: asia-south1

options:
  logging: CLOUD_LOGGING_ONLY

timeout: '1200s'
```

---

## 8. IAM & Security Configuration

### Service Account Permissions
```bash
# Create service account
gcloud iam service-accounts create carbonzero-sa \
  --display-name="CarbonZero App Service Account"

# Grant minimum required permissions (principle of least privilege)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:carbonzero-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:carbonzero-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:carbonzero-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/firebase.sdkAdminServiceAgent"
```

### Secrets Setup
```bash
# Store secrets in Secret Manager
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=-

gcloud secrets create firebase-credentials \
  --data-file=path/to/firebase-service-account.json

gcloud secrets create firebase-web-config \
  --data-file=path/to/firebase-web-config.json
```

---

## 9. Environment Variables Reference

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://carbonzero-backend-HASH.a.run.app
VITE_FIREBASE_API_KEY=<from-secret-manager>
VITE_FIREBASE_AUTH_DOMAIN=carbonzero.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carbonzero-PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=carbonzero.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
VITE_FIREBASE_VAPID_KEY=<fcm-vapid-key>
```

### Backend (.env)
```env
FLASK_ENV=production
PORT=5000
PROJECT_ID=carbonzero-PROJECT_ID
GEMINI_API_KEY=<from-secret-manager>
FIREBASE_CREDENTIALS=<json-from-secret-manager>
ALLOWED_ORIGINS=https://carbonzero-frontend-HASH.a.run.app
RATE_LIMIT_DEFAULT=100/hour
RATE_LIMIT_CHATBOT=30/hour
CACHE_TTL_INSIGHTS=3600
LOG_LEVEL=INFO
```

---

## 10. Monitoring & Observability

```
Google Cloud Monitoring
├── Cloud Run metrics: request count, latency, instance count
├── Custom metrics: carbon calculations/hour, chatbot messages/day
├── Alerts: error rate >1%, p99 latency >2s
└── Dashboard: real-time operational health

Cloud Logging
├── Structured JSON logs (Flask)
├── Frontend error tracking via Cloud Logging
└── Log-based metrics for business events

Firebase Performance Monitoring
├── Page load times by route
├── API call latency tracking
└── Custom traces for calculator flow

Error Reporting
└── Automatic exception tracking for both services
```

---

## 11. Deployment Quick Start

```bash
# 1. Clone repo and set project
git clone https://github.com/yourusername/carbonzero
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com

# 3. Create Artifact Registry
gcloud artifacts repositories create carbonzero \
  --repository-format=docker \
  --location=asia-south1

# 4. Set up secrets (see Section 8)

# 5. Deploy via Cloud Build
gcloud builds submit \
  --config=infra/cloudbuild.yaml \
  --substitutions=_REGION=asia-south1

# 6. Get URLs
gcloud run services describe carbonzero-backend \
  --region=asia-south1 \
  --format="value(status.url)"

gcloud run services describe carbonzero-frontend \
  --region=asia-south1 \
  --format="value(status.url)"
```

---

## 12. Cost Estimate (Monthly, Light Traffic)

| Service | Usage | Est. Cost |
|---------|-------|-----------|
| Cloud Run (2 services) | 1M requests, 1 min-instance | ~$5-10 |
| Firestore | 1M reads, 200K writes | ~$1-3 |
| Gemini 1.5 Flash | 50K messages | ~$0.50-2 |
| Secret Manager | 10K accesses | ~$0.05 |
| Artifact Registry | 2 images, 2GB | ~$0.20 |
| Cloud Build | 5 builds/day | Free tier |
| **Total** | | **~$7-15/month** |

---

*Document Version 1.0 — CarbonZero Architecture*