# Dashboard Troubleshooting Guide

## Current Status
- ✅ API is working (2 metrics in database)
- ✅ All endpoints responding correctly
- ✅ Dashboard code updated

## If "Refresh Metrics" Shows "Failed to fetch"

### Step 1: Hard Refresh Browser
- **Windows/Linux**: Press `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`
- Or: Open Developer Tools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### Step 2: Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Click "Refresh Metrics" button
4. Look for any error messages (they'll be in red)

### Step 3: Verify API is Running
Open a new browser tab and go to:
```
http://localhost:3000/api/v1/performance/metrics?limit=10
```

You should see JSON data. If you see an error, the API might not be running.

### Step 4: Check CORS Issues
If you see CORS errors in the console:
- The API has CORS enabled, but some browsers are strict
- Try accessing the dashboard from `http://localhost:3000` (not `127.0.0.1`)

### Step 5: Test API Directly
Run this in PowerShell to test:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/performance/metrics?limit=10"
```

## Quick Test
1. Submit a metric using the form
2. Wait 1 second
3. Click "Refresh Metrics"
4. You should see your newly submitted metric

## Expected Behavior
- **First time**: Shows "No metrics found" if database is empty
- **After submitting**: Shows list of metrics with CPU, Memory, Latency, and Timestamp
- **On error**: Shows detailed error message with troubleshooting tips

## Still Not Working?
1. Check Docker containers are running:
   ```powershell
   docker compose ps
   ```

2. Check application logs:
   ```powershell
   docker compose logs app --tail 50
   ```

3. Restart the application:
   ```powershell
   docker compose restart app
   ```

