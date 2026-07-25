# Study Mentor AI — InnovaHack Project

A personalized AI study and interview preparation platform featuring real-time AI mentoring, answer evaluations, speech-to-text integration, deep analytics, and gamified progression.

---

## 👥 Team & Ownership Architecture

| Member | Role | Key Ownership Scope |
| :--- | :--- | :--- |
| **Member 1** (Claude Code) | **AI + Backend + Architecture Lead** | Express server, AI Evaluation Engines, Prompt engineering, Database (Supabase/PostgreSQL), Authentication (JWT/Supabase). |
| **Member 2** | **Frontend Lead (Core App & Chat UI)** | Core layout, Authentication pages, AI Practice Screen, Interactive Chat UI, Global State (Zustand/Redux), Theme toggle. |
| **Member 3** (You) | **Analytics + Dashboard & Gamification UI** | Dashboard page, Analytics & Charts (Recharts), Leaderboard, User Profile, Gamification (XP System, Badges, Streaks, Achievements), Reusable UI & Animations (Framer Motion). |
| **Member 4** | **Speech-to-Text & Audio Specialist** | Web Audio API, Whisper / Web Speech API integration, Real-time voice capture, Audio visualization, Noise suppression, Audio upload pipes. |

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4
- **Routing**: React Router (`react-router-dom`)
- **Data Visualization**: Recharts
- **Animations**: Framer Motion
- **Icons**: React Icons (`react-icons`)
- **Backend/AI (Upcoming Integration)**: Express, PostgreSQL/Supabase, OpenAI/Gemini/Whisper APIs

---

## 🚀 Getting Started & Scripts

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Production Build**
   ```bash
   npm run build
   ```

4. **Preview Build**
   ```bash
   npm run preview
   ```

---

## 📁 Project Folder Structure (Member 3 Scope)

```
src/
├── components/
│   ├── analytics/     # AccuracyChart, PerformanceChart, RadarChart, etc.
│   ├── gamification/  # XPCard, StreakCounter, Leaderboard, AchievementCard, etc.
│   ├── profile/       # ProfileCard, SkillProgress, Statistics, RecentInterviews.
│   ├── animations/    # FadeIn, SlideUp, CountUp wrappers using Framer Motion.
│   └── common/        # Card, LoadingSpinner, Skeleton, EmptyState, ErrorState.
├── pages/
│   ├── Dashboard/     # Main Dashboard view & DashboardLayout with Sidebar.
│   ├── Analytics/     # Deep dive study & interview performance analytics.
│   ├── Leaderboard/   # Global competitive ranking view.
│   └── Profile/       # User statistics, badges earned, and achievement roadmap.
├── services/          # Mock data services (to be wired with real API in integration phase).
├── hooks/             # Custom React hooks (useAnalytics, useLeaderboard, useProgress, useAchievements).
├── types/             # TypeScript interfaces for data consistency across components.
└── utils/             # Helper formulas for XP, scoring colors, and accuracy math.
```
