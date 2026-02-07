"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Trash2, Save, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState({ name: "", email: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    
    const storedEmail = localStorage.getItem("scarletEmail"); 
    const storedName = localStorage.getItem("scarletUser");

    if (!storedEmail && !storedName) {
      router.push("/"); 
      return;
    }

    if (storedEmail) {
      fetch(`/api/profile?email=${storedEmail}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setUser({ name: storedName, email: storedEmail, bio: "" });
            } else {
                setUser(data);
            }
            setLoading(false);
        })
        .catch(err => setLoading(false));
    } else {
        setUser({ name: storedName || "User", email: "No email saved", bio: "" });
        setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("scarletUser");
    localStorage.removeItem("scarletEmail");
    router.push("/");
  };

  const handleSave = async () => {
    localStorage.setItem("scarletUser", user.name);
    
    try {
        await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        setIsEditing(false); 
    } catch (e) {
        console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    try {
        await fetch(`/api/profile?email=${user.email}`, { method: "DELETE" });
        handleLogout(); 
    } catch (e) {
        console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Profile...</div>;

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <Link href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className={styles.header}>
            <div className={styles.avatarCircle}>
                {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h1 className={styles.title}>{user.name}</h1>
            <p className={styles.emailText}>{user.email}</p>
        </div>

        <div className={styles.form}>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input 
                    type="text" 
                    className={styles.input}
                    value={user.name}
                    disabled={!isEditing}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Bio / Status</label>
                <input 
                    type="text" 
                    className={styles.input}
                    placeholder="What's your vibe?"
                    value={user.bio || ""} 
                    disabled={!isEditing}
                    onChange={(e) => setUser({...user, bio: e.target.value})}
                />
            </div>

            <div className={styles.buttonGroup}>
                {isEditing ? (
                    <button onClick={handleSave} className={styles.saveButton}>
                        <Save size={16} style={{display:'inline', marginRight:5}}/> Save Changes
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className={styles.saveButton} style={{backgroundColor: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--border-color)'}}>
                        Edit Profile
                    </button>
                )}
                
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={16} style={{display:'inline', marginRight:5}}/> Log out
                </button>
            </div>
        </div>

        <div className={styles.dangerZone}>
            <button onClick={handleDelete} className={styles.deleteButton}>
                <Trash2 size={14} /> Delete Account
            </button>
        </div>

      </main>
    </div>
  );
}