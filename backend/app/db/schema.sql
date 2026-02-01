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

CREATE INDEX IF NOT EXISTS idx_band_genre ON band_profiles(genre);
CREATE INDEX IF NOT EXISTS idx_band_location ON band_profiles(location_city, location_state);

-- Venue Profiles
CREATE TABLE IF NOT EXISTS venue_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_name VARCHAR(255) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(50) NOT NULL,
    capacity INTEGER,
    bio TEXT,
    photo_url TEXT,
    typical_genres TEXT[], -- Array of genres
    contact_method VARCHAR(20) CHECK (contact_method IN ('whatsapp', 'instagram', 'email')),
    whatsapp_number VARCHAR(20),
    messenger_username VARCHAR(255),
    instagram VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_location ON venue_profiles(location_city, location_state);

-- Gig Postings (from venues)
CREATE TABLE IF NOT EXISTS gig_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT,
    pay_range VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gigs_genre ON gig_postings(genre);
CREATE INDEX IF NOT EXISTS idx_gigs_date ON gig_postings(date_time);

-- Gig Requests (from bands)
CREATE TABLE IF NOT EXISTS gig_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID REFERENCES users(id) ON DELETE CASCADE,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    genres TEXT[] NOT NULL,
    willing_to_travel BOOLEAN DEFAULT FALSE,
    max_distance INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- Updated_at Trigger (Optional but good practice)
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
CREATE TRIGGER update_gig_requests_updated_at BEFORE UPDATE ON gig_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
