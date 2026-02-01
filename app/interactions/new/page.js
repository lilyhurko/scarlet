"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Heart,
  ThumbsDown,
  Check,
  MessageCircle,
  Clock,
  EyeOff,
  Zap,
  DollarSign,
  UserMinus,
  ShieldAlert,
  Ghost,
  TrendingUp,
  Activity,
  Lock,
  Smile,
  Flag,
  Ban,
} from "lucide-react";
import Link from "next/link";

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

    let baseStyle = "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border";
    let activeStyle = "bg-[#EBDBCB] text-scarlet/60 border-transparent hover:border-scarlet/20"; // Неактивний

    if (isSelected) {
      if (tag.type === "red") activeStyle = "bg-scarlet text-cream border-scarlet shadow-md scale-105";
      if (tag.type === "green") activeStyle = "bg-green-700 text-cream border-green-700 shadow-md scale-105";
      if (tag.type === "yellow") activeStyle = "bg-yellow-500 text-cream border-yellow-500 shadow-md scale-105";
    }

    return (
      <button
        key={tag.label}
        type="button"
        onClick={() => toggleTag(tag)}
        className={`${baseStyle} ${activeStyle}`}
      >
        <Icon size={14} />
        {tag.label}
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-cream p-6 font-sans">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-scarlet/60 hover:text-scarlet mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-xs uppercase tracking-widest font-bold">Back</span>
      </Link>

      <h1 className="text-3xl font-serif font-bold text-scarlet mb-8">
        New Check-in
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-scarlet/50 font-bold ml-2">
            Subject
          </label>
          <div className="relative">
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#EBDBCB] border-none text-scarlet font-serif text-lg outline-none appearance-none shadow-sm focus:ring-1 focus:ring-scarlet"
            >
              {people.length === 0 && <option>No people found...</option>}
              {people.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-scarlet/50">
              ▼
            </div>
          </div>
          {people.length === 0 && (
            <p className="text-xs text-scarlet">
              <Link href="/people/new" className="underline font-bold">
                Add a person
              </Link>{" "}
              first!
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-scarlet/50 font-bold ml-2">
            Red Flags (Danger)
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS_PRESETS.filter((t) => t.type === "red").map((tag) => renderTagButton(tag))}
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <label className="text-xs uppercase tracking-widest text-yellow-600/50 font-bold ml-2">
            Warning Signs
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS_PRESETS.filter((t) => t.type === "yellow").map((tag) => renderTagButton(tag))}
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <label className="text-xs uppercase tracking-widest text-green-700/50 font-bold ml-2">
            Green Flags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS_PRESETS.filter((t) => t.type === "green").map((tag) => renderTagButton(tag))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-scarlet/50 font-bold ml-2">
            Observation
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Trust your gut. What happened?"
            className="w-full p-5 h-40 rounded-3xl bg-[#EBDBCB]/40 border-none outline-none text-scarlet placeholder:text-scarlet/30 resize-none focus:bg-[#EBDBCB]/60 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || people.length === 0}
          className="w-full py-4 bg-scarlet text-cream rounded-full font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#6e0000] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Analyzing Data..." : "Save Analysis"}
        </button>
      </form>
    </main>
  );
}