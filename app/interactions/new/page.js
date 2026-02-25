"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, AlertTriangle, Heart, ThumbsDown, Check, MessageCircle,
  Clock, EyeOff, Zap, DollarSign, UserMinus, ShieldAlert, Ghost,
  TrendingUp, Activity, Lock, Smile, Flag, Ban, Sparkles, Upload, X
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [notes, setNotes] = useState("");
  const [scoreChange, setScoreChange] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("scarletEmail");
    if (storedEmail) {
      fetch(`/api/people?email=${storedEmail}`)
        .then((res) => res.json())
        .then((data) => {
          setPeople(data || []);
          if (data && data.length > 0) setSelectedPerson(data[0]._id);
        })
        .catch((err) => console.error("Error loading people:", err));
    }
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    setIsAnalyzing(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 95 ? 95 : prev + Math.floor(Math.random() * 10) + 1));
    }, 500);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result;

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        if (!response.ok) throw new Error("AI failed to analyze");

        const aiData = await response.json();

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (aiData.observation) setNotes(aiData.observation);
        if (aiData.tags) setSelectedTags(aiData.tags);
        if (aiData.suggestedScoreChange) setScoreChange(aiData.suggestedScoreChange);

        setTimeout(() => {
          alert("AI Analysis Complete! Review the auto-filled data.");
          setIsAnalyzing(false);
        }, 300);
      };
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      alert("Oops! Something went wrong with the AI analysis.");
      handleRemoveImage(); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPerson) return alert("Please select a person first!");

    setLoading(true);
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: selectedPerson,
          tags: selectedTags,
          notes,
          scoreChange: Number(scoreChange),
        }),
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
    <div className="min-h-screen bg-cream font-sans">
      <Navbar />

      <main className="p-8 max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-dark/50 hover:text-dark font-bold text-xs uppercase tracking-widest mb-8">
          <ArrowLeft size={16} /> Back
        </Link>

        <h1 className="text-4xl font-serif font-bold text-scarlet mb-8">New Check-in</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-scarlet/60">Subject</label>
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#EBDBCB]/40 border border-scarlet/20 text-scarlet font-serif text-lg outline-none focus:border-scarlet/50 appearance-none"
            >
              {people.length === 0 ? (
                <option value="">No people found...</option>
              ) : (
                people.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="bg-[#EBDBCB]/40 p-6 rounded-3xl border border-scarlet/20 flex flex-col items-center justify-center gap-4 text-center min-h-[200px]">
            {previewImage ? (
              <div className="relative w-full max-w-xs mx-auto">
                <img 
                  src={previewImage} 
                  alt="Uploaded preview" 
                  className="w-full rounded-2xl object-cover shadow-md aspect-[9/16] max-h-64" 
                />
                
                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-all hover:scale-110"
                    title="Remove image"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                )}

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#4A0E17]/60 rounded-2xl flex flex-col items-center justify-center text-cream backdrop-blur-sm transition-all">
                    <Sparkles className="animate-pulse mb-3 text-[#EBDBCB]" size={32} />
                    <span className="font-bold tracking-widest text-xs uppercase mb-1">Analyzing Vibe</span>
                    <span className="text-3xl font-serif font-bold">{uploadProgress}%</span>
                    
                    <div className="w-2/3 h-1.5 bg-black/30 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="h-full bg-cream transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Sparkles className="text-scarlet" size={32} />
                <div>
                  <h3 className="font-serif text-scarlet font-bold text-xl">Let AI analyze the chat</h3>
                  <p className="text-sm text-scarlet/60 mt-1">Upload a screenshot and AI will automatically find red/green flags and write an observation.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mt-2 flex items-center gap-2 px-6 py-3 bg-scarlet text-cream rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                >
                  <Upload size={16} /> Upload Screenshot
                </button>
              </>
            )}

            <input 
              type="file" 
              accept="image/*" 
              hidden 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-scarlet/60 mb-3 block">Red Flags (Danger)</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_PRESETS.filter(t => t.type === "red").map((tagObj) => (
                  <button 
                    key={tagObj.label} 
                    type="button" 
                    onClick={() => toggleTag(tagObj.label)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${selectedTags.includes(tagObj.label) ? "bg-[#8B0000] text-cream" : "bg-[#8B0000]/10 text-[#8B0000] hover:bg-[#8B0000]/20"}`}
                  >
                    <tagObj.icon size={14} /> {tagObj.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#B8860B]/80 mb-3 block">Warning Signs</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_PRESETS.filter(t => t.type === "yellow").map((tagObj) => (
                  <button 
                    key={tagObj.label} 
                    type="button" 
                    onClick={() => toggleTag(tagObj.label)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${selectedTags.includes(tagObj.label) ? "bg-[#B8860B] text-cream" : "bg-[#B8860B]/10 text-[#B8860B] hover:bg-[#B8860B]/20"}`}
                  >
                    <tagObj.icon size={14} /> {tagObj.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#2E8B57]/80 mb-3 block">Green Flags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_PRESETS.filter(t => t.type === "green").map((tagObj) => (
                  <button 
                    key={tagObj.label} 
                    type="button" 
                    onClick={() => toggleTag(tagObj.label)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${selectedTags.includes(tagObj.label) ? "bg-[#2E8B57] text-cream" : "bg-[#2E8B57]/10 text-[#2E8B57] hover:bg-[#2E8B57]/20"}`}
                  >
                    <tagObj.icon size={14} /> {tagObj.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-scarlet/60">Observation Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What happened? (Or let AI fill this...)"
                className="w-full p-4 rounded-2xl bg-[#EBDBCB]/40 border border-scarlet/20 text-dark placeholder:text-dark/30 outline-none focus:border-scarlet/50 h-32 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-scarlet/60">Vibe Score Impact (-100 to +100)</label>
              <input
                type="number"
                value={scoreChange}
                onChange={(e) => setScoreChange(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#EBDBCB]/40 border border-scarlet/20 text-scarlet font-serif text-xl outline-none focus:border-scarlet/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-scarlet text-cream font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Saving..." : "Save Interaction"}
          </button>
        </form>
      </main>
    </div>
  );
}