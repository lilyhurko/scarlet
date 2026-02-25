"use client";
import { useState, useEffect } from "react";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

export default function AllNotesPage() {
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
    const storedEmail = localStorage.getItem("scarletEmail");

    if (storedEmail) {
      fetch(`/api/interactions?email=${storedEmail}`)
        .then((res) => res.json())
        .then((data) => {
          const sorted = (data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
          setAllNotes(sorted);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load notes", err);
          setLoading(false);
        });
    } else {
      setLoading(false); 
    }
  }, []);


  const filteredNotes = allNotes.filter((note) => {
    const textMatch = note.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = note.tags?.some(tag => tag.label.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const nameMatch = note.personId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return textMatch || tagMatch || nameMatch;
  });

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.topRow}>
            <div>
                <h1 className={styles.title}>Interaction Archive</h1>
                <p className={styles.subtitle}>{allNotes.length} total entries recorded</p>
            </div>
            <Link href="/dashboard" className={styles.backLink}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by keyword, tag or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} size={18} />
          </div>
        </div>

        {loading && (
            <div className={styles.emptyState}>
                <Loader2 className="animate-spin mx-auto mb-2" />
                Loading your archive...
            </div>
        )}

        <div className={styles.grid}>
          {!loading && filteredNotes.length === 0 ? (
            <div className={styles.emptyState}>
              No interactions found matching "{searchTerm}"
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note._id} className={styles.card}>
                
                <div className={styles.cardHeader}>
                    <span className={styles.personName}>
                      {note.personId?.name || "Unknown Person"}
                    </span>
                    
                    <span className={styles.date}>
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                </div>
                
                <p className={styles.noteText}>"{note.notes}"</p>
                
                <div className={styles.tagsList}>
                    {note.tags && note.tags.map((tag, idx) => (
                        <span key={idx} className={styles.tag}>
                            {tag.label}
                        </span>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}