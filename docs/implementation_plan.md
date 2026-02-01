# MVP Advanced Sprint - Visibility & Media

Expanding from the "Minimal" marketplace to a "Feature-Rich" MVP by enabling public profiles, functional filtering, and audio showcases.

## User Review Required

> [!NOTE]
> I will be creating a custom audio player UI rather than using the default browser player to maintain the "Booklyn" premium aesthetic.

## Proposed Changes

### [Backend] Public Profiles
#### [MODIFY] [profile.py](file:///home/w/Projects/Booklyn/backend/app/api/v1/endpoints/profile.py)
- Implement `GET /{user_id}`: Standardized way to fetch public data for either a band or venue.
- Security: Ensure sensitive data (internal IDs, private contact info if not connected) is omitted.

### [Frontend] Profile Visibility
#### [NEW] `src/app/dashboard/profile/[id]/page.tsx`
- A single dynamic route that handles both Band and Venue layouts.
- **Venue Layout**: Show map location (placeholder), capacity, open gigs list.
- **Band Layout**: Show genres, bio, and the new Audio Player.

### [Frontend] The Beat (Audio Player)
#### [NEW] `src/components/profile/AudioPlayer.tsx`
- Sleek, custom-styled media player with Play/Pause, Progress Bar, and Volume.
- Responsive design for mobile viewing.

### [Phase] Functional Discovery & Scaling
#### [MODIFY] [gig_mongo.py](file:///home/w/Projects/Booklyn/backend/app/models/gig_mongo.py)
- **Indexing**: Define a compound `TEXT` index on `title`, `description`, and `tags` for high-speed keyword searching.
- **Tag System**: Ensure tags are searchable as a separate array field.
#### [MODIFY] `src/app/dashboard/browse/page.tsx`
- Connect state from the filter chips (Genre, Location, Date) to the `fetchGigs` query params.
- Implement "Search Bands" mode (currently only searches Gigs).

---

## Verification Plan

### Automated Verification
- Hit `/api/v1/profile/[uuid]` via backend docs and check JSON structure.
- Verify browser console doesn't throw `404` on dynamic routes.

### Manual Verification
1. [User] Navigate to a profile link from a Gig card.
2. [User] Play the demo track on a Band profile.
3. [User] Filter discovery results by "Rock" and verify the list updates.
