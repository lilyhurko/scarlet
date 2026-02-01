"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Flag } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const PersonCard = ({ person }) => {
  const getScoreColor = (score) => {
    if (score <= 20) return "bg-green-500";
    if (score <= 50) return "bg-yellow-500";
    return "bg-scarlet";
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#EBDBCB]/50 rounded-2xl mb-3 border border-[#D9C5B2]/30 hover:border-scarlet/20 transition-all">
      <div className="flex items-center gap-3">
        <span className="font-serif text-lg text-scarlet font-medium">
          {person.name}
        </span>
        {person.vibeScore > 50 && (
          <Flag size={14} className="text-scarlet fill-scarlet" />
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-sans font-medium text-scarlet/60 italic">
          {person.vibeScore} score
        </span>
        <div
          className={`w-3 h-3 rounded-full ${getScoreColor(person.vibeScore)} shadow-sm`}
        />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [people, setPeople] = useState([]);
  const [userName, setUserName] = useState("User");
  const [recentInteractions, setRecentInteractions] = useState([]);

useEffect(() => {
    const storedName = localStorage.getItem("scarletUser");
    if (storedName) setUserName(storedName);

    fetch("/api/people")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => setPeople(data || []))
      .catch((err) => console.log("People API not ready yet"));


      fetch("/api/interactions")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => setRecentInteractions(data || []))
      .catch((err) => console.log("Interactions API not ready yet"));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="p-8 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-scarlet leading-tight">
            Hello, {userName}!
          </h1>
          <p className="text-scarlet/60 italic text-lg">
            Here’s your vibe summary for today 🖤
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-xl font-serif font-bold text-scarlet mb-6">
              People overview
            </h2>

            <div className="space-y-3 mb-6">
              {people.length === 0 ? (
                <div className="py-8 border-2 border-dashed border-scarlet/10 rounded-3xl text-center text-scarlet/40 text-sm italic">
                  No people tracked yet.
                </div>
              ) : (
                people.map((p) => (
                  <Link key={p._id} href={`/people/${p._id}`}>
                    <PersonCard person={p} />
                  </Link>
                ))
              )}
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search people..."
                  className="w-full py-4 px-12 rounded-full bg-[#EBDBCB]/40 border-none outline-none text-sm text-scarlet placeholder:text-scarlet/30 focus:ring-1 focus:ring-scarlet/20"
                />
                <Search
                  className="absolute left-4 top-4 text-scarlet/30"
                  size={20}
                />
              </div>
              <Link
                href="/people/new"
                className="p-4 bg-scarlet text-cream rounded-full shadow-lg hover:rotate-90 transition-transform duration-300"
              >
                <Plus size={24} />
              </Link>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-scarlet">
                Recent Interactions
              </h2>
              <Link
                href="/dashboard/all-notes"
                className="text-xs uppercase tracking-widest text-scarlet/40 hover:text-scarlet transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {recentInteractions.length === 0 ? (
                <div className="p-8 bg-[#EBDBCB]/20 rounded-[40px] border border-dashed border-scarlet/20 text-center">
                  <p className="text-scarlet/40 italic text-sm">
                    No notes yet. Time to analyze someone? 😉
                  </p>
                </div>
              ) : (
                recentInteractions.map((int) => (
                  <div
                    key={int._id}
                    className="p-5 bg-[#EBDBCB]/40 rounded-3xl border border-scarlet/5 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-scarlet/40">
                        {new Date(int.date).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        {int.tags.map((tag, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${tag.flagType === "red" ? "bg-scarlet" : "bg-gold"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-scarlet font-medium leading-relaxed">
                      "{int.notes}"
                    </p>
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
