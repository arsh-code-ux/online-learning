# Google OAuth Setup Guide for LMS Project

## Step 1: Create Google OAuth 2.0 Credentials

### 1.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a new project or select an existing one
4. Give your project a name (e.g., "LMS Learning Platform")

### 1.2 Enable Required APIs
1. Go to "APIs & Services" → "Library"
2. Search for and enable:
   - **Google+ API** (for user profile data)
   - **Google Identity Services** (for OAuth)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose "External" for user type
   - Fill in required fields:
     - App name: "LMS Learning Platform"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: email, profile, openid
   - Add test users if needed

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: "LMS Web Client"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     http://localhost:3001
     https://yourdomain.com (for production)
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/login
     http://localhost:3001/login
     https://yourdomain.com/login (for production)
     ```

### 1.4 Get Your Client ID
After creating, you'll see a modal with:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: Keep this secret!

Copy the **Client ID** - you'll need it in the next step.

## Step 2: Update Your Environment Files

### 2.1 Frontend Environment (.env)
Update `/home/arshdeep/Desktop/ONLINE-LEARNING/frontend/.env`:
```env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
REACT_APP_API_URL=http://localhost:5000
```

### 2.2 Backend Environment (.env)
Update `/home/arshdeep/Desktop/ONLINE-LEARNING/backend/.env`:
```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

**Note:** Use the SAME Client ID in both files!

## Step 3: Test the Setup

### 3.1 Start Your Servers
```bash
# Terminal 1 - Backend
cd /home/arshdeep/Desktop/ONLINE-LEARNING/backend
npm run dev

# Terminal 2 - Frontend  
cd /home/arshdeep/Desktop/ONLINE-LEARNING/frontend
npm start
```

### 3.2 Test Google Login
1. Go to http://localhost:3000/login
2. Click the Google login button
3. Sign in with your Google account
4. You should be redirected to the dashboard

## Step 4: Replace Placeholder Values

Replace these placeholder values with your actual Google Client ID:

**Frontend (.env):**
```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**Backend (.env):**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## Step 5: Restart After Changes

After updating the .env files:
```bash
# Stop both servers (Ctrl+C)
# Then restart them:

# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm start
```

## Troubleshooting

### Common Issues:

1. **"Invalid Origin" Error:**
   - Make sure your localhost URLs are added to "Authorized JavaScript origins"
   - Check if you're using the correct port (3000 or 3001)

2. **"Redirect URI Mismatch":**
   - Add all possible redirect URIs to Google Console
   - Make sure the URLs match exactly (including http/https)

3. **"Client ID Not Found":**
   - Verify you copied the correct Client ID
   - Check both .env files have the same Client ID
   - Restart both servers after updating .env files

4. **Backend Connection Error:**
   - Make sure backend is running on port 5000
   - Check if MONGODB is running
   - Verify API URL in frontend .env

## Security Notes

- Never commit .env files to version control
- Use different Client IDs for development and production
- Keep your Client Secret secure (not needed for frontend-only OAuth)
- Enable only necessary scopes in OAuth consent screen

## What Happens When User Logs In:

1. User clicks Google login button
2. Google OAuth popup opens
3. User signs in and authorizes your app
4. Google returns an ID token to your frontend
5. Frontend sends token to your backend
6. Backend verifies token with Google
7. Backend creates/finds user in database
8. Backend returns JWT token for your app
9. User is logged in and redirected to dashboard

You're all set! Just replace the placeholder Client ID with your actual Google OAuth Client ID and restart your servers.