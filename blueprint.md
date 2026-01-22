
# Product Requirements Document (PRD)
## Band-to-Gig Platform MVP

### Overview
A platform connecting bands with venues for gig opportunities. Bands can showcase their music and find gigs, while venues can discover bands and post available slots. The platform facilitates connections between parties through external communication methods (WhatsApp, Instagram, email), with payment and booking details handled externally.

### Timeline
3 weeks for MVP development

### Target Users
- *Bands*: Musicians looking for gig opportunities to perform
- *Venues*: Bars, clubs, event spaces seeking bands to book

---

## Core Features

### 1. Authentication & User Management

*User Registration:*
- Email and password signup
- User selects role during registration: Band or Venue
- No email verification required for MVP
- Password hashing using bcrypt

*Login:*
- JWT-based authentication
- Access token (15-30 min lifespan)
- Refresh token stored in httpOnly cookie
- Tokens stored in Postgres for revocation capability

*User Model (Postgres):*
users table:
- id (uuid)
- email (unique)
- password_hash
- role (enum: 'band', 'venue')
- created_at
- updated_at

---

### 2. Profile Management

*Band Profile:*
- Band name
- Genre (selected from predefined list: Blues, Rock, Jazz, Pop, Metal, Country, Indie, etc.)
- Location (city, state)
- Bio (500 character limit)
- One demo audio file (max 10MB, ~3-4 min)
- One profile photo (max 5MB)
- Social media links (optional: Instagram, Spotify, YouTube)
- *Contact preferences*: WhatsApp number, Instagram handle, or email

*Venue Profile:*
- Venue name
- Location (city, state)
- Capacity (number)
- Bio (500 character limit)
- One profile photo (max 5MB)
- Typical genres (multi-select from predefined list including Blues)
- *Contact preferences*: WhatsApp number, Instagram handle, or email

*Profile Storage:*
- Profile data in Postgres (band_profiles and venue_profiles tables)
- Audio files and photos stored in Cloudflare R2
- Files served through Cloudflare CDN

---

### 3. Gig Postings & Discovery

*Venue Gig Postings:*
Venues can create gig listings with:
- Title
- Date and time
- Genre preference
- Location (auto-filled from venue profile)
- Description/requirements
- Pay range (optional text field)

*Band Availability Posts:*
Bands can create "looking for gigs" posts with:
- Available dates (date range)
- Preferred genres
- Willing to travel (yes/no + max distance)
- Additional notes

*Storage (Postgres):*
gig_postings table:
- id
- venue_id (foreign key)
- title
- date_time
- genre
- description
- pay_range
- created_at

gig_requests table:
- id
- band_id (foreign key)
- available_from
- available_to
- genres
- willing_to_travel
- max_distance
- notes
- created_at

---

### 4. Search & Discovery

*For Bands (searching venues/gigs):*
- Filter by location (city/state dropdown)
- Filter by genre (dropdown)
- Filter by date range
- Simple list view of gig postings
- Click to view full details and venue profile

*For Venues (searching bands):*
- Filter by location (city/state dropdown)
- Filter by genre (dropdown)
- Filter by availability (date range)
- Simple list view of band profiles and availability posts
- Click to view full profile, listen to demo, view availability

*Search Implementation:*
- Basic SQL queries with WHERE clauses
- No full-text search or advanced algorithms for MVP
- Results displayed in simple card layout

---

### 5. Contact System

*Features:*
- Users specify preferred contact method on profile (WhatsApp, Instagram, email)
- "Contact" button on profiles/postings opens external communication channel
- No in-platform messaging required

*Contact Methods:*

1. *WhatsApp*
   - User provides phone number on profile
   - "Contact" button opens WhatsApp chat via wa.me link
   - Format: https://wa.me/1234567890

2. *Instagram*
   - User provides Instagram handle on profile
   - "Contact" button opens Instagram DM
   - Format: https://instagram.com/{username}

3. *Email*
   - User provides email on profile
   - "Contact" button opens mailto link
   - Format: mailto:user@example.com

*Implementation:*
- Contact preference stored in user profile (Postgres)
- Frontend generates appropriate link based on preference
- Button opens in new tab/window or triggers native app

---

## Technical Architecture

### Frontend
- *Framework*: Next.js (App Router)
- *Styling*: Tailwind CSS
- *UI Components*: shadcn/ui (pre-built components)
- *State Management*: Zustand
- *Forms*: React Hook Form
- *Animations*: Minimal (save Framer Motion for post-MVP)

### Backend
- *Language*: Python
- *Framework*: FastAPI
- *Authentication*: JWT tokens
- *Password Hashing*: bcrypt
- *JWT Security*: httpOnly, Secure, SameSite=Strict cookies
- *File Lifecycle*: Delete old files from R2 on update/delete

### Databases
- *Postgres*: User accounts, profiles, gig postings, gig requests
- *MongoDB*: Not required for MVP (messaging removed)

### File Storage
- *Cloudflare R2*: Audio demos and profile photos
- *Cloudflare CDN*: File delivery

### Deployment
- *Frontend*: Vercel
- *Backend*: Railway or Render
- *Database*: Postgres on Railway/Render managed instance

---

## User Flows

### Band User Flow
1. Sign up → Select "Band" role
2. Create profile (name, genre, location, bio, upload demo, photo, add contact method)
3. Browse venue gig postings (filter by location/genre/date)
4. Create "available for gigs" post
5. Click "Contact Venue" on interesting gig → Opens WhatsApp/Instagram/Email
6. Coordinate details via external communication
7. Handle booking/payment externally

### Venue User Flow
1. Sign up → Select "Venue" role
2. Create profile (name, location, capacity, bio, genres, photo, add contact method)
3. Post available gig slot (date, genre, description, pay)
4. Browse band profiles and availability posts (filter by location/genre/date)
5. Click "Contact Band" on interesting profile → Opens WhatsApp/Instagram/Email
6. Coordinate details via external communication
7. Handle booking/payment externally

---

## API Endpoints (FastAPI)

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout (invalidate tokens)

### Profiles
- GET /api/profile/me - Get current user's profile
- PUT /api/profile/me - Update current user's profile
- GET /api/profile/{user_id} - Get public profile by ID
- POST /api/profile/upload-demo - Get presigned URL for demo upload
- POST /api/profile/upload-photo - Get presigned URL for photo upload

### Gig Postings
- POST /api/gigs - Create gig posting (venues only)
- GET /api/gigs - List gig postings (with filters)
- GET /api/gigs/{id} - Get specific gig posting
- PUT /api/gigs/{id} - Update gig posting
- DELETE /api/gigs/{id} - Delete gig posting

### Gig Requests
- POST /api/gig-requests - Create availability post (bands only)
- GET /api/gig-requests - List availability posts (with filters)
- GET /api/gig-requests/{id} - Get specific request
- PUT /api/gig-requests/{id} - Update request
- DELETE /api/gig-requests/{id} - Delete request

---

## Data Models

### Postgres Schema

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('band', 'venue')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_role ON users(role);

-- Band Profiles
CREATE TABLE band_profiles (
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
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Venue Profiles
CREATE TABLE venue_profiles (
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
    instagram VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gig Postings (from venues)
CREATE TABLE gig_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT,
    pay_range VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gig Requests (from bands)
CREATE TABLE gig_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID REFERENCES users(id) ON DELETE CASCADE,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    genres TEXT[] NOT NULL,
    willing_to_travel BOOLEAN DEFAULT FALSE,
    max_distance INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh Tokens (for JWT management)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

---

## UI/UX Requirements

### Design Principles
- Clean, minimal interface
- Fast loading times
- Mobile-responsive (mobile-first approach)
- Accessibility considerations (semantic HTML, proper contrast)

### Key Pages

*1. Landing/Login Page*
- Login form
- Link to registration
- Brief value proposition

*2. Registration Page*
- Email/password fields
- Role selection (Band or Venue)
- Submit button

*3. Profile Creation/Edit*
- Form fields based on user role
- File upload for demo (bands) and photo (both)
- Contact method selection (WhatsApp/Instagram/Email)
- Save button

*4. Dashboard/Home*
- For Bands: "Browse Gigs" and "Post Availability" buttons
- For Venues: "Post Gig" and "Browse Bands" buttons
- Link to profile

*5. Browse Page (Gigs or Bands)*
- Filter sidebar (location, genre, date)
- Card grid of results
- Each card shows key info and "View Details" button

*6. Detail Page (Gig Posting or Band Profile)*
- Full information display
- Audio player for band demos
- "Contact" button that opens external communication (WhatsApp/Instagram/Email)

*7. Post Creation Pages*
- Form for creating gig posting (venues)
- Form for creating availability post (bands)

---

## Out of Scope for MVP

The following features are explicitly *NOT* included in the MVP and will be considered for future iterations:

- In-platform messaging system
- Email verification
- Password reset functionality (MVP will use manual/admin-assisted reset if needed)
- Email notifications
- In-app notifications (badge counts, push notifications)
- Multiple demo uploads per band
- Photo galleries
- Reviews/ratings system
- Application tracking system
- Calendar integration
- Advanced search (full-text, Elasticsearch, radius-based)
- Analytics dashboard
- Admin moderation tools
- Reporting system for fake profiles
- Payment processing within platform
- Automated matching/recommendations
- Profile verification badges
- Saved searches or favorites
- Export/share features
- Advanced animations (Framer Motion)
- Unit/integration tests

---

## Success Metrics (Post-Launch)

- Number of registered users (bands vs venues)
- Number of gig postings created
- Number of availability posts created
- Click-through rate on "Contact" buttons
- User retention (return visits)

---

## Risk & Mitigation

*Risk*: Low user adoption due to chicken-and-egg problem (need bands to attract venues, need venues to attract bands)
*Mitigation*: Launch in specific geographic area, seed platform with initial users from both sides

*Risk*: Spam or fake profiles
*Mitigation*: Monitor manually for MVP, add reporting tools post-launch

*Risk*: Users uncomfortable sharing contact info publicly
*Mitigation*: Contact info only visible after clicking "Contact" button (requires login)

*Risk*: File storage costs
*Mitigation*: Cloudflare R2 has no egress fees, limit file sizes and quantity per user

*Risk*: 3-week timeline too aggressive
*Mitigation*: Use AI code generation, pre-built UI components, cut features aggressively if behind schedule

---

## Development Phases

### Week 1: Foundation
- Set up Next.js frontend project
- Set up FastAPI backend project
- Configure Postgres connection
- Implement authentication (register, login, JWT)
- Create basic user and profile models
- Build profile creation forms
- Set up Cloudflare R2 for file uploads

### Week 2: Core Features
- Build gig posting creation (venues)
- Build availability posting creation (bands)
- Implement search/browse pages with filters
- Build profile detail pages
- Integrate audio player for demos
- Implement contact button functionality (WhatsApp/Instagram/Email links)

### Week 3: Polish & Deploy
- UI polish and responsive design fixes
- Bug fixes and testing
- Privacy controls for contact info
- Deploy frontend to Vercel
- Deploy backend to Railway/Render
- Final testing in production

---

*END OF PRD*