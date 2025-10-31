# 🔧 Google OAuth Configuration Fix

## Problem
Google OAuth error: "origin_mismatch" - This happens because the JavaScript origins aren't configured in Google Cloud Console.

## Solution Options

### Option 1: Fix Google Cloud Console (Recommended)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account (arshdeepkaur24@navgurukul.org)

2. **Navigate to OAuth Settings:**
   - Go to **APIs & Services** → **Credentials**
   - Find OAuth 2.0 Client ID: `1030492698153-6vad3dms8kji8ll0burl58o2u7e4dpht.apps.googleusercontent.com`
   - Click on the pencil icon to edit

3. **Add JavaScript Origins:**
   In the "Authorized JavaScript origins" section, add:
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   http://localhost:3002
   http://127.0.0.1:3002
   ```

4. **Add Redirect URIs:**
   In the "Authorized redirect URIs" section, add:
   ```
   http://localhost:3000
   http://localhost:3000/login
   http://localhost:3000/auth/callback
   http://127.0.0.1:3000
   http://127.0.0.1:3000/login
   ```

5. **Save Changes** and wait 5-10 minutes for changes to propagate

### Option 2: Create New OAuth App

If you can't edit the existing app:

1. **Create New OAuth 2.0 Client:**
   - In Google Cloud Console, click **+ CREATE CREDENTIALS**
   - Choose **OAuth client ID**
   - Application type: **Web application**
   - Name: "LMS Development"

2. **Configure Origins:**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`

3. **Update .env file:**
   Replace the Client ID in `/frontend/.env`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID_HERE
   ```

### Option 3: Development Bypass (Temporary)

For immediate testing, you can use regular email/password login:

1. Go to `/register` to create an account
2. Use email/password login instead of Google OAuth
3. This bypasses the OAuth issue for development

## Current Status
- ✅ OAuth Client ID is configured in the app
- ❌ Google Cloud Console needs JavaScript origins updated
- ✅ Alternative login methods available

## Next Steps
1. Update Google Cloud Console origins (Option 1)
2. Test Google login again
3. If still issues, create new OAuth app (Option 2)
4. Use email/password login as backup (Option 3)