# 📋 Product Requirements Document (PRD)
## Carbon Footprint Awareness Platform — CarbonZero

**Version:** 1.0  
**Author:** Umang Vaghela  
**Challenge:** PromptWars — Challenge 3  
**Date:** June 2026  

---

## 1. Executive Summary

**CarbonZero** is an AI-powered web application that empowers individuals to understand, track, and reduce their personal carbon footprint through real-time data, personalized AI insights, gamification, and a conversational AI assistant. The platform combines Google's ecosystem (Firebase, Gemini AI, Cloud Run, Vertex AI) with a clean React + Flask architecture to deliver an impactful, accessible, and production-grade sustainability tool.

---

## 2. Problem Statement

> *"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."*

**Core Pain Points:**
- People don't know their actual carbon footprint
- No single platform connects daily activities to environmental impact
- Generic advice doesn't motivate behavioral change
- Lack of community/social accountability for sustainability goals
- Complex data presented in intimidating formats

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| User Engagement | Daily Active Users retention | >40% DAU/MAU |
| Carbon Reduction | Avg. footprint reduction per user | >15% in 30 days |
| Accessibility | WCAG 2.1 AA compliance score | 100% |
| Performance | Lighthouse Performance Score | >90 |
| AI Quality | Gemini chatbot satisfaction | >85% |

---

## 4. Target Users

| Persona | Description |
|---------|-------------|
| 🌱 Eco Beginner | Individuals newly aware of climate change, want easy starting point |
| 🔬 Data Enthusiast | Users who love dashboards, charts, and tracking granular metrics |
| 👨‍👩‍👧 Family Planner | Parents wanting to teach sustainability to children |
| 🏢 Remote Worker | WFH professionals tracking home energy & commute emissions |

---

## 5. Feature Requirements

### 5.1 Core Features (P0 — Must Have)

#### F1: Carbon Footprint Calculator
- Multi-step onboarding form collecting:
  - Transportation (car type, km/week, flights/year)
  - Home energy (electricity kWh, gas usage, region)
  - Diet (vegan / vegetarian / omnivore / heavy meat)
  - Shopping habits (clothing, electronics purchases)
- Real-time CO₂e calculation using validated emission factors
- Breakdown by category with visual donut chart
- Comparison against national and global averages

#### F2: Daily Activity Logging
- Quick-log interface: one-tap common activities
- Custom activity builder with auto-categorization via Gemini
- Streak tracking with visual calendar heatmap
- Cumulative monthly/yearly footprint timeline

#### F3: AI Insights Dashboard (Gemini-powered)
- Personalized weekly "Carbon Report Card"
- Smart recommendations ranked by impact & feasibility
- "What If" scenario simulator (e.g., "If I go vegan for a month...")
- Anomaly detection — "Your travel emissions spiked 40% this week"

#### F4: AI Chatbot — GreenBot (Gemini)
- Conversational assistant embedded in all pages
- Features:
  - Answer carbon footprint questions
  - Log activities via natural language ("I drove 20km today")
  - Explain dashboard data in plain language
  - Suggest personalized eco-actions
  - Motivational nudges and eco-challenges
- Persistent chat history via Firestore
- Context-aware (knows user's profile, recent logs, goals)

#### F5: Goal Setting & Progress Tracking
- Set monthly/yearly CO₂ reduction targets
- Visual progress bar and milestone badges
- Smart goal suggestions from Gemini based on profile
- Email/push notifications via Firebase Cloud Messaging

### 5.2 Enhanced Features (P1 — Should Have)

#### F6: Eco-Actions Marketplace
- Curated list of 50+ actionable steps with CO₂ saved estimates
- Mark actions as "doing it", "trying it", "done"
- Difficulty tags (Easy/Medium/Hard) and category filters
- Impact score: each action shows exact kg CO₂e saved

#### F7: Community Leaderboard & Challenges
- Anonymous opt-in leaderboards (city, country, global)
- Group challenges ("Team Zero — 30-day challenge")
- Shareable carbon badges for social media
- Friends system with activity feed

#### F8: Sustainability News Feed
- Real-time environmental news via Gemini + web grounding
- Personalized based on user's top emission categories
- "Read & Act" — each news item links to related eco-action

#### F9: Carbon Offsetting Integration
- Partner offset project cards (reforestation, solar, etc.)
- Track offset purchases and net carbon position
- Verified project data with transparent pricing

### 5.3 Unique/Differentiating Features (P2 — Unique Selling Points)

#### F10: AR Carbon Visualizer (Web-based)
- Point device at food items / products to estimate carbon footprint using Gemini Vision
- Real-time scan via browser camera + Gemini multimodal API

#### F11: Carbon Receipt Generator
- Auto-generate weekly "carbon bill" styled as a receipt
- Shareable PNG/PDF download
- Funny/motivational copy generated by Gemini

#### F12: Smart Home Integration Estimator
- Input home appliances and get AI energy audit
- Google Home / smart meter data integration roadmap

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Initial page load < 2 seconds (Cloud Run + CDN)
- API response time < 500ms (95th percentile)
- Gemini streaming responses for chatbot UX

### 6.2 Security
- Firebase Authentication (Google OAuth + email/password)
- Firestore Security Rules — user data isolated per UID
- CORS strictly configured on Flask API
- Input sanitization on all form fields
- HTTPS enforced via Cloud Run (automatic)
- No API keys exposed in frontend (all via backend proxy)
- Rate limiting on Flask API (Flask-Limiter)
- OWASP Top 10 compliance

### 6.3 Accessibility
- WCAG 2.1 AA compliant
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode toggle
- Minimum 4.5:1 color contrast ratio
- Font size scaling (rem units throughout)
- Focus indicators on all focusable elements

### 6.4 Reliability
- 99.9% uptime SLA (Cloud Run auto-scaling)
- Offline mode: cache last dashboard data via Service Worker
- Firebase real-time sync — optimistic UI updates

---

## 7. Color Design System

| Token | Color | Usage |
|-------|-------|-------|
| `--green-primary` | `#2D6A4F` | Primary actions, headers |
| `--green-light` | `#52B788` | Highlights, active states |
| `--green-pale` | `#D8F3DC` | Backgrounds, cards |
| `--teal-accent` | `#40916C` | Charts, data viz |
| `--earth-brown` | `#6B4226` | Warm accents |
| `--sky-blue` | `#74C0FC` | Info states, water emissions |
| `--amber-warn` | `#F4A261` | Warnings, high-footprint alerts |
| `--red-danger` | `#E63946` | Danger states |
| `--dark-bg` | `#1A1A2E` | Dark mode background |
| `--text-primary` | `#212529` | Body text |

---

## 8. User Stories

```
As a new user,
  I want to complete a quick 5-minute carbon assessment
  So that I can see my current footprint instantly

As a returning user,
  I want to log today's activities in under 30 seconds
  So that my tracking remains accurate without being burdensome

As an engaged user,
  I want GreenBot to explain why my footprint is high this week
  So that I can take targeted action

As a competitive user,
  I want to see how I rank against others in my city
  So that I stay motivated to reduce my emissions

As an accessibility user,
  I want to navigate the entire app using only a keyboard
  So that I can use it without limitations
```

---

## 9. Out of Scope (v1.0)

- IoT smart meter direct integration
- Native mobile apps (iOS/Android)
- B2B enterprise features
- Payment processing for offsets
- Regulatory carbon credit trading

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Gemini API rate limits | Medium | High | Implement caching, request queuing |
| Inaccurate emission factors | Low | High | Use IPCC-validated factors, cite sources |
| User data privacy | Medium | High | Firebase rules, GDPR-aware design |
| Mobile performance | Medium | Medium | Code splitting, lazy loading |
| Scope creep | High | Medium | Strict P0/P1/P2 prioritization |

---

## 11. Milestones

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Phase 1: Core | Week 1-2 | Auth, calculator, basic dashboard |
| Phase 2: AI | Week 2-3 | GreenBot, Gemini insights, logging |
| Phase 3: Social | Week 3-4 | Leaderboard, challenges, news feed |
| Phase 4: Polish | Week 4 | Accessibility audit, performance, deployment |

---

*Document Version 1.0 — CarbonZero PRD*