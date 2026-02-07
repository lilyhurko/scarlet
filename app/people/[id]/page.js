"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Navbar from "@/components/Navbar";
import styles from "./page.module.css"; 

export default function PersonProfilePage({ params }) {
  const { id } = use(params);
  const router = useRouter(); 
  
  const [person, setPerson] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((res) => res.json())
      .then((data) => setPerson(data));

    fetch(`/api/interactions?personId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure? This will delete all history with this person forever.");
    if (confirmDelete) {
      await fetch(`/api/people/${id}`, { method: "DELETE" });
      router.push("/dashboard"); 
    }
  };


  const getScoreClass = (score) => {
    if (score > 50) return styles.textRed;
    if (score > 20) return styles.textYellow;
    return styles.textGreen;
  };

  const getDotClass = (tags) => {
    if (tags.some(t => t.flagType === 'red')) return styles.borderRed;
    if (tags.some(t => t.flagType === 'yellow')) return styles.borderYellow;
    return styles.borderGreen;
  };

  const getTagClass = (type) => {
    if (type === 'red') return styles.tagRed;
    if (type === 'green') return styles.tagGreen;
    if (type === 'yellow') return styles.tagYellow;
    return '';
  };

  if (!person) return <div className={styles.loadingState}>Loading Dossier...</div>;

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <div className={styles.topControls}>
            <Link href="/dashboard" className={styles.backLink}>
              <ArrowLeft size={18} /> 
              <span className={styles.backText}>Back</span>
            </Link>

            <button onClick={handleDelete} className={styles.deleteButton}>
              <Trash2 size={16} /> Delete Record
            </button>
          </div>
          
          <div className={styles.profileHeader}>
            <div>
              <h1 className={styles.name}>{person.name}</h1>
              <p className={styles.metaInfo}>
                {person.relation} • {history.length} interactions
              </p>
            </div>
            
            <div className={styles.scoreBlock}>
              <div className={`${styles.scoreValue} ${getScoreClass(person.vibeScore)}`}>
                {person.vibeScore}
              </div>
              <div className={styles.scoreLabel}>Risk Score</div>
            </div>
          </div>
        </div>

        <div className={styles.actionBar}>
            <Link href="/interactions/new" className={styles.newCheckInBtn}>
              <Plus size={18} /> New Check-in
            </Link>
        </div>

        <section>
          <h2 className={styles.timelineTitle}>Case History</h2>

          <div className={styles.timelineContainer}>
            {history.length === 0 ? (
               <div className={styles.emptyHistory}>
                 No interactions recorded yet. Start tracking to see patterns.
               </div>
            ) : (
              history.map((item) => (
                <div key={item._id} className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${getDotClass(item.tags)}`} />
                  
                  <div className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.tagsWrapper}>
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className={`${styles.tag} ${getTagClass(tag.flagType)}`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <span className={styles.date}>
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className={styles.notesText}>"{item.notes}"</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}