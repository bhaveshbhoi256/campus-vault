// NoteCard.jsx — Displays a note card with Like + Delete features.
// Like: stored in Firestore, anyone can like any note.
// Delete: only visible to the person who uploaded the note.

import { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function NoteCard({ note, currentUserId }) {
  const [deleting, setDeleting] = useState(false);

  // Check if current user already liked this note
  // note.likes is an array of user IDs who liked it
  const likes = note.likes || [];
  const hasLiked = likes.includes(currentUserId);

  // ── LIKE / UNLIKE ──
  async function handleLike() {
    const noteRef = doc(db, "notes", note.id);
    if (hasLiked) {
      // Remove user ID from likes array
      await updateDoc(noteRef, { likes: arrayRemove(currentUserId) });
    } else {
      // Add user ID to likes array
      await updateDoc(noteRef, { likes: arrayUnion(currentUserId) });
    }
  }

  // ── DELETE ──
  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${note.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "notes", note.id));
    } catch (err) {
      console.error(err);
      alert("Could not delete. Please try again.");
      setDeleting(false);
    }
  }

  // Check if note is new (uploaded in last 3 days)
  const isNew = () => {
    if (!note.uploadedAt) return false;
    const uploadDate = note.uploadedAt.toDate();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return uploadDate > threeDaysAgo;
  };

  const formatDate = () => {
    if (!note.uploadedAt) return "Unknown date";
    return note.uploadedAt.toDate().toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const fileIcon = () => {
    if (note.fileType === "application/pdf") return "📄";
    if (note.fileType?.startsWith("image/")) return "🖼️";
    return "📎";
  };

  const subjectColor = (subject) => {
    const colors = {
      Mathematics: "badge-blue", Physics: "badge-purple",
      Chemistry: "badge-green", Biology: "badge-teal",
      "Computer Science": "badge-indigo", History: "badge-amber",
      Economics: "badge-orange", English: "badge-pink", Other: "badge-gray",
    };
    return colors[subject] || "badge-gray";
  };

  // Check if the current user is the one who uploaded this note
  const isOwner = note.uploadedBy === currentUserId;

  return (
    <div className="note-card" style={{ opacity: deleting ? 0.5 : 1 }}>
      {/* Top row */}
      <div className="card-top">
        <span className="file-icon">{fileIcon()}</span>
        <div className="card-top-right">
          {isNew() && <span className="new-badge">✨ New</span>}
          {/* Delete button — only shows for the note's uploader */}
          {isOwner && (
            <button className="btn-delete" onClick={handleDelete} disabled={deleting} title="Delete this note">
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{note.title}</h3>

      {/* Badges */}
      <div className="card-badges">
        <span className={`badge ${subjectColor(note.subject)}`}>{note.subject}</span>
        <span className="badge badge-gray">{note.year}</span>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className="card-date">📅 {formatDate()}</span>
        <div className="card-actions">
          {/* Like button */}
          <button
            className={`btn-like ${hasLiked ? "liked" : ""}`}
            onClick={handleLike}
            title={hasLiked ? "Unlike" : "Like this note"}
          >
            {hasLiked ? "❤️" : "🤍"} {likes.length > 0 ? likes.length : ""}
          </button>

          {/* Download button */}
          <a
            href={note.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download"
          >
            ⬇ Open
          </a>
        </div>
      </div>
    </div>
  );
}
