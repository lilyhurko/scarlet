"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

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
    <main className="min-h-screen bg-cream p-6 font-sans">
      <Link href="/dashboard" className="flex items-center gap-2 text-scarlet/60 hover:text-scarlet transition-colors mb-10">
        <ArrowLeft size={20} />
        <span className="text-sm uppercase tracking-widest font-medium">Back to safety</span>
      </Link>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#EBDBCB] rounded-full flex items-center justify-center mx-auto mb-4 border border-scarlet/10">
            <UserPlus size={32} className="text-scarlet" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-scarlet">New Subject</h1>
          <p className="text-scarlet/60 italic">Who are we analyzing today?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-scarlet/50 ml-4 font-bold">Name / Alias</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full p-5 rounded-[25px] bg-[#EBDBCB]/40 border-none outline-none focus:ring-1 focus:ring-scarlet text-scarlet placeholder:text-scarlet/20 text-lg font-serif"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-scarlet/50 ml-4 font-bold">Connection Type</label>
            <div className="grid grid-cols-2 gap-3">
              {["dating", "friend", "work", "other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRelation(type)}
                  className={`py-3 px-4 rounded-full border text-xs uppercase tracking-widest transition-all ${
                    relation === type 
                    ? "bg-scarlet text-cream border-scarlet shadow-md" 
                    : "bg-transparent text-scarlet/40 border-scarlet/10 hover:border-scarlet/30"
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
            className="w-full py-5 bg-scarlet text-cream rounded-full font-bold text-sm uppercase tracking-[0.3em] shadow-xl hover:bg-[#6e0000] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Adding to Records..." : "Initialize Analysis"}
          </button>
        </form>
      </div>
    </main>
  );
}