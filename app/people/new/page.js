"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function AddPersonPage() {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("dating");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, relation }),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={20} />
        <span className={styles.backText}>Back to safety</span>
      </Link>

      <div className={styles.headerWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.iconCircle}>
            <UserPlus size={32} />
          </div>
          <h1 className={styles.title}>New Subject</h1>
          <p className={styles.subtitle}>Who are we analyzing today?</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name / Alias</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Connection Type</label>
            <div className={styles.grid}>
              {["dating", "friend", "work", "other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRelation(type)}
                  className={`${styles.relationBtn} ${
                    relation === type ? styles.btnActive : styles.btnInactive
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Adding to Records..." : "Initialize Analysis"}
          </button>
        </form>
      </div>
    </main>
  );
}