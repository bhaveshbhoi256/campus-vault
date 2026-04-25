// Dashboard.jsx — Main screen after login.
// Now includes: stats bar, sort by Most Liked / Newest, like + delete on cards.

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import UploadForm from "./UploadForm";
import NoteCard from "./NoteCard";

export const SUBJECTS = [
    "Computer Science",
  "Computer Organization & Architecture",
  "Data Structures",
  "Operating Systems",
  "Database Management",
  "Computer Networks",
  "Software Engineering",
  "Mathematics",
  "Physics",
  "Other"
];
export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function Dashboard({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest" or "mostLiked"
  const [toast, setToast] = useState(""); // success message

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("uploadedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotes(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Show a toast message for 3 seconds
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // Filter
  let filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === "All" || note.subject === filterSubject;
    const matchesYear = filterYear === "All" || note.year === filterYear;
    return matchesSearch && matchesSubject && matchesYear;
  });

  // Sort
  if (sortBy === "mostLiked") {
    filteredNotes = [...filteredNotes].sort(
      (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
    );
  }

  // Stats
  const totalLikes = notes.reduce((sum, n) => sum + (n.likes?.length || 0), 0);

  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <div className="dashboard">
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-brand">
          <span>🗄️</span> Campus Vault
        </div>
        <div className="nav-right">
          <span className="user-email">{user.email}</span>
          <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">{notes.length}</div>
          <div className="stat-label">Total Notes</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{totalLikes}</div>
          <div className="stat-label">Total Likes</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{SUBJECTS.length}</div>
          <div className="stat-label">Subjects</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">

        {/* Header */}
        <div className="content-header">
          <div>
            <h2>All Notes</h2>
            <p className="subtitle">{filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} found</p>
          </div>
          <button className="btn-primary" onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? "✕ Cancel" : "+ Upload Note"}
          </button>
        </div>

        {/* Upload form */}
        {showUpload && (
          <UploadForm
            userId={user.uid}
            onSuccess={() => { setShowUpload(false); showToast("🎉 Note added successfully!"); }}
          />
        )}

        {/* Search + Filters */}
        <div className="search-filter-bar">
          <input
            type="text" className="search-input"
            placeholder="🔍  Search notes by title…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="filter-select">
            <option value="All">All Subjects</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="filter-select">
            <option value="All">All Years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Sort tabs */}
        <div className="sort-tabs">
          <button className={`sort-tab ${sortBy === "newest" ? "active" : ""}`} onClick={() => setSortBy("newest")}>
            🕐 Newest First
          </button>
          <button className={`sort-tab ${sortBy === "mostLiked" ? "active" : ""}`} onClick={() => setSortBy("mostLiked")}>
            ❤️ Most Liked
          </button>
        </div>

        {/* Notes grid */}
        {loading ? (
          <div className="empty-state"><div className="loader"></div><p>Loading notes…</p></div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📂</p>
            <p>No notes found. Be the first to upload!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} currentUserId={user.uid} />
            ))}
          </div>
        )}
      </main>

      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
