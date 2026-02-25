"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Flag } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

const PersonCard = ({ person }) => {
  const getScoreStyle = (score) => {
    if (score <= 20) return styles.dotGreen;
    if (score <= 50) return styles.dotYellow;
    return styles.dotRed;
  };

  return (
    <div className={styles.personCard}>
      <div className={styles.personName}>
        <span>{person.name}</span>
        {person.vibeScore > 50 && <Flag size={14} fill="currentColor" />}
      </div>

      <div className={styles.scoreContainer}>
        <span className={styles.scoreLabel}>{person.vibeScore} score</span>
        <div
          className={`${styles.statusDot} ${getScoreStyle(person.vibeScore)}`}
        />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [people, setPeople] = useState([]);
  const [userName, setUserName] = useState("User");
  const [recentInteractions, setRecentInteractions] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
    const storedName = localStorage.getItem("scarletUser");
    const storedEmail = localStorage.getItem("scarletEmail"); 
    if (storedName) setUserName(storedName);

    if (storedEmail) {
      fetch(`/api/people?email=${storedEmail}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setPeople(data || []))
        .catch((err) => console.log("API not ready"));

      fetch(`/api/interactions?email=${storedEmail}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setRecentInteractions(data || []))
        .catch((err) => console.log("API not ready"));
    }
  }, []);
  
  const filteredPeople = people.filter((person) => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Navbar />

      <main>
        <div className={styles.header}>
          <h1 className={styles.title}>Hello, {userName}!</h1>
          <p className={styles.subtitle}>
            Here’s your vibe summary for today 🖤
          </p>
        </div>

        <div className={styles.grid}>
          <section>
            <h2 className={styles.sectionTitle}>People overview</h2>

            <div style={{ marginBottom: "1.5rem" }}>
              {filteredPeople.length === 0 ? (
                <div className={styles.emptyState}>
                  {people.length === 0 ? "No people tracked yet." : "No matches found."}
                </div>
              ) : (
                filteredPeople.map((p) => (
                  <Link
                    key={p._id}
                    href={`/people/${p._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <PersonCard person={p} />
                  </Link>
                ))
              )}
            </div>

            <div className={styles.controls}>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search people..."
                  className={styles.input}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <Search className={styles.searchIcon} size={20} />
              </div>
              <Link href="/people/new" className={styles.addButton}>
                <Plus size={24} />
              </Link>
            </div>
          </section>

          <section>
            <div className={styles.sectionTitle}>
              Recent Interactions
              <Link href="/dashboard/all-notes" className={styles.linkViewAll}>
                View all
              </Link>
            </div>

            <div className={styles.interactionsList}>
              {recentInteractions.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No notes yet. Time to analyze someone? 😉</p>
                </div>
              ) : (
                recentInteractions
                  .filter((int) => int.notes && int.notes.trim().length > 0)
                  .slice(0, 5)
                  .map((int) => (
                    <div
                      key={int._id}
                      className={styles.interactionCard || styles.personCard}
                    >
                      <p>{int.notes}</p>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}