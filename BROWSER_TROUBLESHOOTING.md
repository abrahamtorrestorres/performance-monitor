# Browser Troubleshooting: ERR_BLOCKED_BY_CLIENT

## Common Causes

### 1. Browser Extensions (Most Common)
**Ad blockers or privacy extensions** often block fetch requests:
- **uBlock Origin**
- **AdBlock Plus**
- **Privacy Badger**
- **Ghostery**
- **NoScript**

**Solution:**
1. Disable extensions temporarily
2. Or whitelist `localhost:3000` in your extension settings
3. Try in **Incognito/Private mode** (extensions usually disabled)

### 2. Browser Cache
**Solution:**
- Hard refresh: `Ctrl + F5` or `Ctrl + Shift + R`
- Or clear browser cache completely

### 3. Browser Security Settings
**Solution:**
- Check if browser has strict security settings
- Try a different browser (Chrome, Firefox, Edge)

### 4. Mixed Content
**Solution:**
- Ensure you're accessing via `http://localhost:3000` (not `https://`)

## Quick Fixes

### Option 1: Try Incognito/Private Mode
1. Open browser in Incognito/Private mode
2. Go to `http://localhost:3000`
3. Try "Refresh Metrics"

### Option 2: Disable Extensions
1. Go to browser extensions settings
2. Disable ad blockers/privacy extensions
3. Refresh page and try again

### Option 3: Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for the exact error message
4. Go to **Network** tab
5. Click "Refresh Metrics"
6. Check if the request appears and what status it has

### Option 4: Test API Directly
Open in browser:
```
http://localhost:3000/api/v1/performance/metrics?limit=10
```
If this works, the API is fine - it's a browser/extension issue.

## Verify Fix

After trying fixes, check browser console (F12):
- Should see: "Fetching metrics from: /api/v1/performance/metrics?limit=10"
- Should see: "Response status: 200 OK"
- Should see: "Metrics result: [data]"

If you still see ERR_BLOCKED_BY_CLIENT, it's definitely a browser extension blocking the request.

