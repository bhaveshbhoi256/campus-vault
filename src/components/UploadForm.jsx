// UploadForm.jsx — Updated version: uses Google Drive link instead of Firebase Storage.
// No Firebase Storage needed — stays on the FREE Spark plan forever!
//
// How it works:
// 1. User uploads their PDF to Google Drive manually
// 2. User copies the shareable link and pastes it here
// 3. We save the title, subject, year, and that link to Firestore

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { SUBJECTS, YEARS } from "./Dashboard";

export default function UploadForm({ userId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [driveLink, setDriveLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Converts Google Drive share link → direct view link
  // Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Output: https://drive.google.com/file/d/FILE_ID/view
  function convertDriveLink(link) {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
      const match = link.match(pattern);
      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/view`;
      }
    }
    return null;
  }

  function isGoogleDriveLink(link) {
    return link.includes("drive.google.com") || link.includes("docs.google.com");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!driveLink.trim()) {
      setError("Please paste a Google Drive link.");
      return;
    }
    if (!isGoogleDriveLink(driveLink)) {
      setError("That doesn't look like a Google Drive link.");
      return;
    }
    const cleanURL = convertDriveLink(driveLink.trim());
    if (!cleanURL) {
      setError("Couldn't read that link. Make sure you copied the full sharing link.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "notes"), {
        title,
        subject,
        year,
        fileURL: cleanURL,
        fileName: title,
        fileType: "application/pdf",
        uploadedBy: userId,
        uploadedAt: serverTimestamp(),
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="upload-form-card">
      <h3>Add a Note</h3>

      {/* Step-by-step instructions */}
      <div className="drive-instructions">
        <p className="instructions-title">📋 How to get your Google Drive link:</p>
        <ol>
          <li>Upload your PDF to <a href="https://drive.google.com" target="_blank" rel="noreferrer">Google Drive</a></li>
          <li>Right-click the file → <strong>"Share"</strong></li>
          <li>Set access to <strong>"Anyone with the link"</strong></li>
          <li>Click <strong>"Copy link"</strong> and paste below ↓</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Note Title *</label>
          <input
            type="text"
            placeholder="e.g. Chapter 3 – Newton's Laws"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="form-row two-col">
          <div className="form-group">
            <label>Subject *</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Year *</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Google Drive Link *</label>
          <input
            type="url"
            placeholder="https://drive.google.com/file/d/..."
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            required
          />
          <p className="field-hint">Paste the shareable link from Google Drive</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save Note"}
        </button>
      </form>
    </div>
  );
}
