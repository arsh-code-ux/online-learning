# 🚨 URGENT: Google OAuth Configuration Fix

## Problem Identified
The screenshot shows "Error 400: origin_mismatch" - this means your Google Cloud Console OAuth client doesn't have the correct JavaScript origins configured.

## IMMEDIATE SOLUTION STEPS

### Step 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Sign in with: arshdeepkaur24@navgurukul.org
3. Make sure you're in the correct project

### Step 2: Find Your OAuth Client ID
Look for this OAuth 2.0 Client ID:
```
1030492698153-6vad3dms8kji8ll0burl58o2u7e4dpht.apps.googleusercontent.com
```

### Step 3: Edit OAuth Client Configuration
1. Click on the OAuth client name (will show as "Web client" or similar)
2. Look for "Authorized JavaScript origins" section
3. Click "ADD URI" and add these EXACT URLs:

```
http://localhost:3000
http://127.0.0.1:3000
```

### Step 4: Add Redirect URIs
In the "Authorized redirect URIs" section, add:
```
http://localhost:3000
http://localhost:3000/login
```

### Step 5: Save Changes
1. Click "SAVE" at the bottom
2. Wait 5-10 minutes for changes to propagate

## Alternative Quick Fix

If you can't access the Google Cloud Console immediately, you can create a NEW OAuth client:

1. In Google Cloud Console, click "CREATE CREDENTIALS"
2. Choose "OAuth client ID" 
3. Application type: "Web application"
4. Name: "LMS Local Development"
5. Authorized JavaScript origins: `http://localhost:3000`
6. Authorized redirect URIs: `http://localhost:3000`
7. Click "CREATE"
8. Copy the new Client ID
9. Update your .env file with the new Client ID

## Current Workaround (Use This Now)

While fixing Google OAuth, use email/password login:
1. Go to: http://localhost:3000/register
2. Create account with email/password
3. Full access to all features without Google OAuth

## Why This Happens

Google OAuth requires the exact domain/port to be pre-approved in Cloud Console for security. Since you're running on localhost:3000, that specific URL must be in the "Authorized JavaScript origins" list.