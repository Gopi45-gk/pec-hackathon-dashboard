# PEC – Hackathon Participation & Winners Dashboard 2026
### Prathyusha Engineering College (An Autonomous Institution)

A production-ready college management dashboard designed to track hackathon participations, registrations, student turnout, shortlisted teams, and honoured award winners.

**Google Sheets is the single source of truth:** When you add, edit, or delete rows in your Google Sheet, the dashboard reflects all updates in real-time without code changes or redeployments.

---

## 🚀 Key Features

1. **Live Google Sheets Synchronization:**
   - **Google Visualization API (`gviz/tq`)**: Zero API keys or service accounts required for public view spreadsheets.
   - **Published CSV Export**: RFC 4180 parsing with PapaParse.
   - **Google Apps Script Web App**: Secure proxy for private/internal college spreadsheets.
   - **Auto-Refresh**: Background polling every 15, 30, or 60 seconds (stops automatically when the browser tab is inactive).
   - **Manual "Refresh Now"**: Real-time sync button with live feedback.
   - **Resilient Fallback**: Retains the last valid state if a network request fails, displaying clear diagnostics instead of an empty screen.

2. **Accurate Data & Calculation Integrity:**
   - **Summary Row De-duplication**: Auto-detects and excludes `TOTAL` / summary rows from individual records.
   - **Audit Engine**: Compares the sum of individual rows against spreadsheet summary totals and flags discrepancies.
   - **Continuation Rows & Team Prize Normalization**: Handles merged cells and multi-member team rows, ensuring prize money is attributed once per winning team entry (never multiplied by member count).
   - **Status Normalization**: Converts freeform status entries into clear categories (`Won Prize`, `Completed`, `Shortlisted`, `Registered / Pending`, `Needs Review`).

3. **Executive Analytics & Visualizations (Recharts):**
   - Expected vs Registered Teams (grouped bar chart)
   - Expected vs Participating Students (grouped bar chart)
   - Hackathon Outcome Distribution (doughnut chart)
   - Top Hackathons by Student Participation (horizontal bar chart)
   - Ranked Prize Money Distribution (bar chart)
   - First vs Second Prize Distribution (doughnut chart)
   - Department-wise Winning Student Distribution (bar chart)

4. **Interactive Tables:**
   - **Winners & Awards Register**: Toggle between **"Individual Students"** and **"Winning Teams"** views. Includes search, department/year/award filters, sorting, and pagination.
   - **Participation Register**: Full pipeline tracking with detailed modal drawer for each event.

5. **In-App Sheet Setup Modal:**
   - Paste any Google Sheet URL to automatically extract the Spreadsheet ID.
   - Configure custom tab names (`Participation`, `Winners`, etc.).
   - Run a live health check to test connectivity instantly.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your variables:
```env
# Google Spreadsheet ID (from URL: https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit)
VITE_GOOGLE_SHEETS_ID=

# Sheet Tab Names
VITE_PARTICIPATION_SHEET_NAME=Participation
VITE_WINNERS_SHEET_NAME=Winners

# Sync Mode: 'gviz' (Recommended), 'csv', or 'gas'
VITE_CONNECTION_MODE=gviz

# Auto Refresh Interval in Seconds (default: 30)
VITE_AUTO_REFRESH_INTERVAL=30
```

*Note: If `VITE_GOOGLE_SHEETS_ID` is left empty, the dashboard defaults to verified PEC 2026 baseline records (₹94,000 prize money, 7 winning teams, 13 hackathon events).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
The output will be generated in `dist/`.

---

## 📊 Google Sheets Setup Guide

### Method 1: Google Visualization API (Recommended)
1. Open your Google Sheet in Google Drive.
2. Click **Share** (top right).
3. Under **General access**, select **"Anyone with the link"** and set the role to **"Viewer"**.
4. Copy the URL from your browser address bar:
   `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
5. Paste it in the dashboard's **"Sheet Setup"** modal or set `VITE_GOOGLE_SHEETS_ID` in `.env`.

### Method 2: Google Apps Script (For Private Sheets)
If your college policies prohibit making the spreadsheet viewable via link:
1. In your Google Sheet, navigate to **Extensions > Apps Script**.
2. Copy the script from `public/google_apps_script.js` into the editor.
3. Click **Deploy > New deployment**.
4. Select type **Web app**, set *Execute as* to **Me**, and *Who has access* to **Anyone**.
5. Copy the generated Web App URL and paste it into the dashboard settings.

---

## 📋 Required Google Sheet Headers

### Participation Sheet Tab (e.g., `Participation`)
| S.No | Title of the Hackathon | Expected Teams | Expected No. of Students | Teams Registered/Participated | No. of Students Participated | Status/Won | Follow-Up/Completed |
|---|---|---|---|---|---|---|---|

### Winners Sheet Tab (e.g., `Winners`)
| S.No | Student Name | Department and Year | Hackathon Name | Event Date | Award / Prize Position | Prize Money |
|---|---|---|---|---|---|---|

---

## 🧪 Verification & Acceptance Tests

| # | Test Requirement | Implementation Status |
|---|---|---|
| 1 | Google Sheets live single source of truth | Implemented via GViz, CSV, and GAS protocols |
| 2 | Auto-refresh every 30-60s & "Refresh Now" | Implemented with background pause on hidden tab |
| 3 | Preserves view & reports error on sync failure | Implemented with persistent cache & error banner |
| 4 | Summary rows excluded from calculations | Implemented with discrepancy audit verification |
| 5 | Team prizes de-duplicated (not multiplied) | Verified: Team award totals ₹94,000 accurately |
| 6 | Multi-dimensional global filters | Implemented across KPIs, charts, and tables |
| 7 | Zero secrets committed | Pure client-side parsing without exposed private keys |
