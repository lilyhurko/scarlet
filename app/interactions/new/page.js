"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, AlertTriangle, Heart, ThumbsDown, Check, MessageCircle,
  Clock, EyeOff, Zap, DollarSign, UserMinus, ShieldAlert, Ghost,
  TrendingUp, Activity, Lock, Smile, Flag, Ban,
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const TAGS_PRESETS = [
  { label: "Gaslighting", type: "red", icon: AlertTriangle, category: "manipulation" },
  { label: "Love Bombing", type: "red", icon: Heart, category: "manipulation" },
  { label: "Narcissistic traits", type: "red", icon: UserMinus, category: "ego" },
  { label: "Anger issues", type: "red", icon: Zap, category: "safety" },
  { label: "Controlling", type: "red", icon: Lock, category: "control" },
  { label: "Future Faking", type: "red", icon: Ghost, category: "lies" },
  { label: "Negging", type: "red", icon: ThumbsDown, category: "manipulation" },
  { label: "Victim Complex", type: "red", icon: ShieldAlert, category: "ego" },
  { label: "Disrespects boundaries", type: "red", icon: Ban, category: "respect" },
  { label: "Secretive / Shady", type: "red", icon: EyeOff, category: "trust" },
  { label: "Late reply", type: "yellow", icon: Clock, category: "communication" },
  { label: "Mixed Signals", type: "yellow", icon: Activity, category: "consistency" },
  { label: "Breadcrumbing", type: "yellow", icon: Ghost, category: "interest" },
  { label: "Talks about ex", type: "yellow", icon: MessageCircle, category: "baggage" },
  { label: "Bad with money", type: "yellow", icon: DollarSign, category: "lifestyle" },
  { label: "Only late night texts", type: "yellow", icon: Clock, category: "intentions" },
  { label: "Cancels last minute", type: "yellow", icon: Ban, category: "reliability" },
  { label: "Self-centered", type: "yellow", icon: UserMinus, category: "ego" },
  { label: "Consistent", type: "green", icon: Check, category: "reliability" },
  { label: "Respects boundaries", type: "green", icon: Check, category: "respect" },
  { label: "Good Listener", type: "green", icon: MessageCircle, category: "communication" },
  { label: "Emotional Intelligence", type: "green", icon: Heart, category: "empathy" },
  { label: "Takes accountability", type: "green", icon: ShieldAlert, category: "maturity" },
  { label: "Supportive", type: "green", icon: TrendingUp, category: "partnership" },
  { label: "Clear Intentions", type: "green", icon: Flag, category: "clarity" },
  { label: "Makes you laugh", type: "green", icon: Smile, category: "connection" },
  { label: "Reliable", type: "green", icon: Check, category: "reliability" },
];

export default function NewInteractionPage() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => {
        setPeople(data || []);
        if (data && data.length > 0) {
          setSelectedPerson(data[0]._id);
        }
      });
  }, []);

  const toggleTag = (tag) => {
    const exists = selectedTags.find((t) => t.label === tag.label);
    if (exists) {
      setSelectedTags(selectedTags.filter((t) => t.label !== tag.label));
    } else {
      setSelectedTags([...selectedTags, { label: tag.label, flagType: tag.type }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPerson) return;
    setLoading(true);

    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: selectedPerson,
          note,
          tags: selectedTags,
        }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving interaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTagButton = (tag) => {
    const isSelected = selectedTags.some((t) => t.label === tag.label);
    const Icon = tag.icon;

    let buttonClass = styles.tagButton;

    if (!isSelected) {
      buttonClass += ` ${styles.tagInactive}`;
    } else {
      if (tag.type === "red") buttonClass += ` ${styles.tagRed}`;
      if (tag.type === "green") buttonClass += ` ${styles.tagGreen}`;
      if (tag.type === "yellow") buttonClass += ` ${styles.tagYellow}`;
    }

    return (
      <button
        key={tag.label}
        type="button"
        onClick={() => toggleTag(tag)}
        className={buttonClass}
      >
        <Icon size={14} />
        {tag.label}
      </button>
    );
  };

  return (
    <main className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={20} />
        <span className={styles.backText}>Back</span>
      </Link>

      <h1 className={styles.pageTitle}>
        New Check-in
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Subject
          </label>
          <div className={styles.selectWrapper}>
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className={styles.select}
            >
              {people.length === 0 && <option>No people found...</option>}
              {people.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className={styles.selectArrow}>▼</div>
          </div>
          
          {people.length === 0 && (
            <p className="text-xs text-red-500 mt-2"> 
              <Link href="/people/new" className="underline font-bold">
                Add a person
              </Link>{" "}
              first!
            </p>
          )}
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label} style={{ color: 'var(--foreground)' }}>
            Red Flags (Danger)
          </label>
          <div className={styles.tagsContainer}>
            {TAGS_PRESETS.filter((t) => t.type === "red").map((tag) => renderTagButton(tag))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} style={{ color: '#ca8a04' }}> 
            Warning Signs
          </label>
          <div className={styles.tagsContainer}>
            {TAGS_PRESETS.filter((t) => t.type === "yellow").map((tag) => renderTagButton(tag))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} style={{ color: '#15803d' }}> 
            Green Flags
          </label>
          <div className={styles.tagsContainer}>
            {TAGS_PRESETS.filter((t) => t.type === "green").map((tag) => renderTagButton(tag))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Observation
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Trust your gut. What happened?"
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          disabled={loading || people.length === 0}
          className={styles.submitButton}
        >
          {loading ? "Analyzing Data..." : "Save Analysis"}
        </button>
      </form>
    </main>
  );
}