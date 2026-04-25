# 🗄️ Campus Vault — Complete Step-by-Step Setup Guide
### For absolute beginners — no experience needed!

> ✅ **Updated plan: No Firebase Storage needed!**
> We use **Google Drive links** instead of uploading files directly.
> This means the app stays on Firebase's **100% free Spark plan** — no credit card required!

---

## 📦 WHAT YOU'LL NEED (install these first)
1. **Node.js** → https://nodejs.org → click "LTS" and install it
2. **VS Code** (code editor) → https://code.visualstudio.com
3. A **Google account** (for Firebase + Google Drive — both free!)

---

## STEP 1 — Set Up Your Project Folder

Open a Terminal (Mac) or Command Prompt (Windows):

```bash
# Move the campus-vault folder to your Desktop (or anywhere you like)
# Then open terminal and go into it:
cd Desktop/campus-vault

# Install all the libraries (takes ~1 minute)
npm install
```

> 💡 If you see "npm: command not found" → you haven't installed Node.js yet. Do that first!

---

## STEP 2 — Create a Firebase Project (free!)

> Firebase gives us login + database — completely free on the Spark plan.

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it: `campus-vault` → Continue → Continue → Create Project
4. Wait ~30 seconds for it to finish

---

## STEP 3 — Enable Firebase Authentication

> This lets users sign up and log in with email + password.

1. In the Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle the **first switch** to **ON**
5. Click **"Save"**

✅ Users can now sign up and log in!

---

## STEP 4 — Create a Firestore Database

> Firestore stores note info: title, subject, year, Google Drive link, upload date.
> It does NOT store the actual PDF — that stays in Google Drive.

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Choose region → pick **asia-south1 (Mumbai)** since you're in India 🇮🇳
5. Click **"Enable"**

✅ Your database is ready!

---

## STEP 5 — ~~Firebase Storage~~ → ✅ SKIP THIS STEP!

> 🎉 We no longer need Firebase Storage!
> Files are stored in **Google Drive** instead — completely free, no billing needed.
> Firebase Storage requires a paid Blaze plan, so we skipped it entirely.
>
> Jump straight to Step 6!

---

## STEP 6 — Get Your Firebase Config Keys

> These keys connect your app to your Firebase project.

1. Click the **gear icon ⚙️** next to "Project Overview" (top-left)
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **`</>`** (web) icon
5. Name it: `campus-vault-web` → click **"Register app"**
6. You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "campus-vault-xxxxx.firebaseapp.com",
  projectId: "campus-vault-xxxxx",
  storageBucket: "campus-vault-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

7. **Copy all these values** — you need them in Step 7.

---

## STEP 7 — Paste Your Config Into the App

1. Open **VS Code**
2. Open the file: `campus-vault/src/firebase.js`
3. Find this block near the top:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

4. **Replace every `"YOUR_..."`** with your real values from Step 6.

After replacing it looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxx",
  authDomain: "campus-vault-12345.firebaseapp.com",
  projectId: "campus-vault-12345",
  storageBucket: "campus-vault-12345.appspot.com",
  messagingSenderId: "9876543210",
  appId: "1:9876543210:web:abc123def456"
};
```

5. **Save the file** (Ctrl+S on Windows / Cmd+S on Mac)

---

## STEP 8 — Run the App!

In your terminal (make sure you're inside the `campus-vault` folder):

```bash
npm run dev
```

You'll see:
```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
```

Open your browser → go to: **http://localhost:5173**

🎉 **Campus Vault is running!**

---

## STEP 9 — Test Everything

### First: Create an account
1. Enter any email + password (min 6 characters) → click **"Create Account"**
2. You're now logged in and on the Dashboard ✅

### Then: Add your first note using Google Drive

**Do this in Google Drive first:**

1. Go to **https://drive.google.com**
2. Click **"+ New"** → **"File upload"** → pick any PDF from your computer
3. Wait for it to upload
4. **Right-click** the file → click **"Share"**
5. Under "General access" change **"Restricted"** → **"Anyone with the link"**
6. Click **"Copy link"** → click **"Done"**

**Now in Campus Vault:**

1. Click **"+ Upload Note"**
2. Fill in Title, Subject, Year
3. Paste the Google Drive link you copied
4. Click **"Save Note"**
5. Your note card appears instantly ✅

### Also test:
- 🔍 **Search bar** — type part of a note title
- 🗂️ **Subject filter** — filter by subject
- 📅 **Year filter** — filter by year
- ⬇️ **Download button** — opens the PDF in Google Drive
- 🟢 **"New" badge** — shows on notes uploaded within the last 3 days

---

## 📁 FILE STRUCTURE (what each file does)

```
campus-vault/
├── index.html              ← The HTML shell page
├── package.json            ← Lists all libraries used
├── vite.config.js          ← Build tool config
└── src/
    ├── main.jsx            ← React starts here
    ├── App.jsx             ← Checks if user is logged in
    ├── App.css             ← All the styles
    ├── firebase.js         ← 🔴 PASTE YOUR KEYS HERE
    └── components/
        ├── Auth.jsx        ← Login / Signup screen
        ├── Dashboard.jsx   ← Main screen (search, filters, grid)
        ├── UploadForm.jsx  ← Form to add a note via Google Drive link
        └── NoteCard.jsx    ← Each note card with download button
```

---

## 💡 HOW THE GOOGLE DRIVE APPROACH WORKS

```
YOU                      GOOGLE DRIVE            FIREBASE FIRESTORE
───                      ────────────            ─────────────────
Upload PDF          →    Stores the file
Copy share link     →    Link lives here

Paste link in app   →                     →      Saves: title, subject,
+ fill in details                                year, drive link, date

Click "Download"    →    Opens the PDF  ←─────── App reads the saved link
```

**Why this is better:**
- ✅ 100% free — no credit card, no Blaze plan needed
- ✅ Files live in YOUR Google Drive — 15GB free storage
- ✅ Easy to manage — rename or delete files directly in Drive
- ✅ Works perfectly for a student notes sharing app

---

## 🛠️ COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| `npm: command not found` | Install Node.js from nodejs.org first |
| `Firebase: Error (auth/invalid-api-key)` | You forgot to replace keys in `firebase.js` |
| White screen / won't load | Press F12 → Console tab → read the red error |
| "Doesn't look like a Google Drive link" | Copy the full link starting with `https://drive.google.com` |
| PDF not opening on Download | Set Drive sharing to **"Anyone with the link"** |
| `Module not found` | Run `npm install` again |
| Notes not saving | Firebase Console → Firestore → confirm test mode is on |

---

## 🚀 DEPLOY YOUR APP (Optional — share it with classmates!)

```bash
# 1. Build the production version
npm run build

# 2. Install Firebase CLI (one-time)
npm install -g firebase-tools

# 3. Login
firebase login

# 4. Set up hosting
firebase init hosting
# Answers:
# → Use an existing project → campus-vault
# → Public directory: dist
# → Single-page app: Yes
# → Overwrite dist/index.html: No

# 5. Deploy!
firebase deploy --only hosting
```

Your app goes live at: **`https://campus-vault-xxxxx.web.app`** 🎉

---

## 💡 QUICK TIPS

- **Data is permanent** — closing the browser doesn't delete anything
- **Real-time** — classmates see new notes appear without refreshing
- **15GB free** — Google Drive's free storage fits hundreds of PDFs
- **"New" badge** — automatically disappears 3 days after upload
- **Spark plan** — Firebase free tier is plenty for a student notes app
