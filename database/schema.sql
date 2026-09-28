-- ============================================================================
-- FITFLOW: FIT INDIA / KHELO INDIA PLATFORM DATABASE SCHEMA
-- PostgreSQL / Supabase Schema Definition
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('athlete', 'coach', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_enum AS ENUM (
        'Verified',
        'Partially Verified',
        'Self-Reported'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE test_type_enum AS ENUM (
        'pushup',
        'situp',
        'squat',
        'vertical_jump',
        'shuttle_run'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE scout_status_enum AS ENUM (
        'Prospect',
        'State_Camp_Eligible',
        'National_Talent_Pool',
        'Under_Review'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- 2. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL CHECK (age BETWEEN 5 AND 100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('M', 'F', 'Other')),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    user_role user_role_enum NOT NULL DEFAULT 'athlete',
    fitness_points INT NOT NULL DEFAULT 0,
    institution VARCHAR(200), -- School/College/Club
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. WORKOUTS TABLE (Anti-Cheating & Rep Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    duration INT NOT NULL, -- Duration in seconds
    total_reps INT NOT NULL DEFAULT 0,
    valid_reps INT NOT NULL DEFAULT 0,
    verification_status verification_status_enum NOT NULL DEFAULT 'Self-Reported',
    raw_pose_data JSONB, -- Compressed skeletal landmarks and telemetry frames
    sensor_telemetry JSONB, -- Accelerometer cadence and Bluetooth HR streams
    telemetry_hash VARCHAR(64), -- SHA-256 tamper-proof signature
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. FITNESS TESTS TABLE (Khelo India Protocol Submissions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_type test_type_enum NOT NULL,
    raw_score NUMERIC(8, 2) NOT NULL, -- reps, jump height in cm, shuttle run seconds
    unit VARCHAR(20) NOT NULL, -- 'reps', 'cm', 'sec'
    benchmark_percentile NUMERIC(5, 2) NOT NULL DEFAULT 0.0 CHECK (benchmark_percentile BETWEEN 0 AND 100),
    verification_status verification_status_enum NOT NULL DEFAULT 'Self-Reported',
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. TALENT PROFILES TABLE (Scouting & Khelo India Pipeline)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS talent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agility_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    strength_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    endurance_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    speed_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    composite_talent_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0 CHECK (composite_talent_score BETWEEN 0 AND 100),
    is_high_potential BOOLEAN NOT NULL DEFAULT FALSE, -- Flagged if >= 95th percentile
    scout_status scout_status_enum NOT NULL DEFAULT 'Prospect',
    scout_notes TEXT,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. MULTIPLAYER LIVE BATTLES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player1_id UUID NOT NULL REFERENCES users(id),
    player2_id UUID NOT NULL REFERENCES users(id),
    activity_p1 VARCHAR(50) NOT NULL,
    activity_p2 VARCHAR(50) NOT NULL,
    p1_unified_points INT NOT NULL DEFAULT 0,
    p2_unified_points INT NOT NULL DEFAULT 0,
    winner_id UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. INDEXES FOR GEOGRAPHIC ANALYTICS & HIGH-SPEED SEARCH
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_state_district ON users (state, district);
CREATE INDEX IF NOT EXISTS idx_users_role_points ON users (user_role, fitness_points DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user_created ON workouts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fitness_tests_user ON fitness_tests (user_id, test_type);
CREATE INDEX IF NOT EXISTS idx_talent_high_potential ON talent_profiles (is_high_potential, composite_talent_score DESC);

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for athlete profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read their workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches can read all talent profiles" ON talent_profiles FOR SELECT USING (true);
