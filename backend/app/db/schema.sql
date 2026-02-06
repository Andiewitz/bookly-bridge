-- Enable Extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('band', 'venue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Band Profiles
CREATE TABLE IF NOT EXISTS band_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    band_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(50) NOT NULL,
    bio TEXT,
    demo_url TEXT,
    photo_url TEXT,
    instagram VARCHAR(255),
    spotify VARCHAR(255),
    youtube VARCHAR(255),
    contact_method VARCHAR(20) CHECK (contact_method IN ('whatsapp', 'instagram', 'email')),
    whatsapp_number VARCHAR(20),
    messenger_username VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active Venue Profiles
CREATE TABLE IF NOT EXISTS venue_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_name VARCHAR(255) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(50) NOT NULL,
    capacity INTEGER,
    bio TEXT,
    photo_url TEXT,
    typical_genres TEXT[],
    contact_method VARCHAR(20) CHECK (contact_method IN ('whatsapp', 'instagram', 'email')),
    whatsapp_number VARCHAR(20),
    messenger_username VARCHAR(255),
    instagram VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simplified Gig Postings (Merged from Mongo)
CREATE TABLE IF NOT EXISTS gig_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT,
    pay VARCHAR(100),
    formatted_address TEXT,
    location_lat DECIMAL(9,6),
    location_lng DECIMAL(9,6),
    status VARCHAR(20) DEFAULT 'open',
    tags TEXT[],
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gig Applications (Moved from Mongo)
CREATE TABLE IF NOT EXISTS gig_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES gig_postings(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES users(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255),
    applicant_avatar TEXT,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_band_profiles_updated_at BEFORE UPDATE ON band_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_venue_profiles_updated_at BEFORE UPDATE ON venue_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_gig_postings_updated_at BEFORE UPDATE ON gig_postings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
