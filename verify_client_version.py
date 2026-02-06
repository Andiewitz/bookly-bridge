import requests
import uuid
from datetime import datetime, timedelta

BASE_URL = "http://192.168.18.50:8000"
API_URL = f"{BASE_URL}/api/v1"

def print_pass(msg):
    print(f"✅ PASS: {msg}")

def print_fail(msg):
    print(f"❌ FAIL: {msg}")
    exit(1)

def run_test():
    print("🚀 Starting Client Version Verification...")

    # 1. Health Check
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code == 200:
            print_pass("Backend is healthy")
        else:
            print_fail(f"Backend unhealthy: {r.status_code}")
    except Exception as e:
        print_fail(f"Could not connect to backend: {e}")

    # 2. Register Band
    email = f"testband_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    print(f"Creating user {email}...")
    
    r = requests.post(f"{API_URL}/auth/register", json={
        "email": email,
        "password": password,
        "role": "band"
    })
    if r.status_code == 200:
        print_pass("User registration")
    else:
        print_fail(f"Registration failed: {r.text}")

    # 3. Login
    r = requests.post(f"{BASE_URL}/docs/oauth2-redirect", data={}) # Just testing connectivity usually, but here needed real login
    
    # Real login
    r = requests.post(f"{API_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    if r.status_code == 200:
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print_pass("Login successful")
    else:
        print_fail(f"Login failed: {r.text}")

    # 4. Create Profile
    r = requests.put(f"{API_URL}/profiles/me", json={
        "band_name": "The Testers",
        "genre": "Rock",
        "location_city": "New York",
        "location_state": "NY",
        "bio": "We test things.",
        "contact_method": "email",
        "contact_email": email
    }, headers=headers)
    
    if r.status_code == 200:
        print_pass("Profile creation")
    else:
        print_fail(f"Profile creation failed: {r.text}")

    # 5. Register Venue (to post gig)
    venue_email = f"testvenue_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API_URL}/auth/register", json={
        "email": venue_email,
        "password": password,
        "role": "venue"
    })
    
    # Login Venue
    r = requests.post(f"{API_URL}/auth/login", json={
        "email": venue_email,
        "password": password
    })
    venue_token = r.json()["access_token"]
    venue_headers = {"Authorization": f"Bearer {venue_token}"}

    # Create Venue Profile
    r = requests.put(f"{API_URL}/profiles/me", json={
        "venue_name": "The Test Club",
        "location_city": "Brooklyn",
        "location_state": "NY",
        "capacity": 200
    }, headers=venue_headers)

    # 6. Post Gig
    r = requests.post(f"{API_URL}/gigs/", json={
        "title": "Friday Night JAM",
        "genre": "Jazz",
        "date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "time": "20:00",
        "pay": "$500",
        "description": "Need a trio.",
        "formatted_address": "123 Test St, Brooklyn, NY",
        "tags": ["jazz", "trio"]
    }, headers=venue_headers)
    
    if r.status_code == 200:
        print_pass("Gig creation")
        gig_id = r.json()["id"]
    else:
        print_fail(f"Gig creation failed: {r.text}")

    # 7. List Gigs (Discovery)
    r = requests.get(f"{API_URL}/gigs/", headers=headers)
    if r.status_code == 200:
        gigs = r.json()
        if len(gigs) > 0:
            print_pass(f"Discovery found {len(gigs)} gigs")
        else:
            print_fail("Discovery returned 0 gigs")
    else:
        print_fail(f"Discovery failed: {r.text}")

    print("\n🎉 ALL SYSTEMS GO! Client Version is verified.")

if __name__ == "__main__":
    run_test()
