-- ============================================================
-- AI Study Coach — Supabase (PostgreSQL) Schema
-- Run this in the Supabase SQL editor to set up the database.
-- ============================================================

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- users: Custom authentication table replacing Supabase Auth
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  full_name      TEXT,
  job_role       TEXT,
  skill_level    TEXT DEFAULT 'intermediate',
  learning_goals TEXT[],
  xp             INTEGER DEFAULT 0,
  level          INTEGER DEFAULT 1,
  badges         TEXT[] DEFAULT '{}',
  total_sessions INTEGER DEFAULT 0,
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- user_profiles: extends Supabase auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  job_role      TEXT,
  skill_level   TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  learning_goals TEXT[],
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- user_progress: one row per completed study session
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  topic            TEXT,
  job_role         TEXT,
  session_data     JSONB DEFAULT '[]',   -- array of {question, answer, score, topic, type}
  overall_score    NUMERIC(4, 1) CHECK (overall_score BETWEEN 0 AND 10),
  questions_count  INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- questions: optional cache of generated questions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic            TEXT,
  job_role         TEXT,
  difficulty       TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  question_type    TEXT CHECK (question_type IN ('conceptual', 'practical', 'scenario', 'behavioral')),
  question_text    TEXT NOT NULL,
  hints            TEXT[],
  expected_concepts TEXT[],
  follow_up_questions TEXT[],
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- user_answers: individual answer records within a session
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_answers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id       UUID REFERENCES public.user_progress(id) ON DELETE SET NULL,
  question_text    TEXT NOT NULL,
  user_answer_text TEXT,
  score            NUMERIC(4, 1),
  grade            CHAR(1),
  strengths        TEXT[],
  weaknesses       TEXT[],
  missing_concepts TEXT[],
  better_answer    TEXT,
  evaluation_data  JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes for query performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id   ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_created   ON public.user_progress(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_answers_user_id    ON public.user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_session_id ON public.user_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic         ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty    ON public.questions(difficulty);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.user_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions      ENABLE ROW LEVEL SECURITY;

-- user_profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_progress: users can only access their own sessions
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_answers: users can only access their own answers
CREATE POLICY "Users can view own answers"
  ON public.user_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON public.user_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- questions: public read, service-role write
CREATE POLICY "Questions are publicly readable"
  ON public.questions FOR SELECT
  USING (true);

-- ============================================================
-- Feature: XP, Badges, Levels — added for leaderboard support
-- ============================================================
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS xp             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level          INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS badges         TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;

-- ============================================================
-- leaderboard: one row per user, upserted after each session
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leaderboard (
  user_id        UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name      TEXT,
  xp             INTEGER    DEFAULT 0,
  level          INTEGER    DEFAULT 1,
  average_score  NUMERIC(4,1),
  total_sessions INTEGER    DEFAULT 0,
  badges         TEXT[],
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON public.leaderboard(xp DESC);

-- RLS for leaderboard: public read, service-role write
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is publicly readable"
  ON public.leaderboard FOR SELECT
  USING (true);

