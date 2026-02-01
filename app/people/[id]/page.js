"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Flag, Plus } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PersonProfilePage({ params }) {
  const { id } = use(params);
  
  const [person, setPerson] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((people) => {
        const found = people.find((p) => p._id === id);
        setPerson(found);
      });

    fetch(`/api/interactions?personId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, [id]);

  if (!person) return <div className="min-h-screen bg-cream flex items-center justify-center text-scarlet">Loading Dossier...</div>;

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar />

      <main className="p-8 max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-scarlet/50 hover:text-scarlet mb-6 transition-colors">
            <ArrowLeft size={18} /> <span className="text-xs uppercase tracking-widest font-bold">Back to Dashboard</span>
          </Link>
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-serif font-bold text-scarlet mb-2">{person.name}</h1>
              <p className="text-scarlet/60 uppercase tracking-[0.2em] text-sm font-bold flex items-center gap-2">
                {person.relation} • Status: {person.status}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-serif font-bold text-scarlet">{person.vibeScore}</div>
              <div className="text-xs text-scarlet/40 uppercase tracking-widest">Risk Score</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-12 border-b border-scarlet/10 pb-8">
            <Link 
              href="/interactions/new" 
              className="flex items-center gap-2 px-6 py-3 bg-scarlet text-cream rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <Plus size={18} /> New Check-in
            </Link>
        </div>

        <section>
          <h2 className="text-2xl font-serif font-bold text-scarlet mb-6">Interaction History</h2>

          <div className="space-y-6 relative border-l border-scarlet/10 ml-4 pl-8">
            {history.length === 0 ? (
               <p className="text-scarlet/40 italic">No records yet.</p>
            ) : (
              history.map((item) => (
                <div key={item._id} className="relative group">
                  <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-cream border-4 border-scarlet/20 group-hover:border-scarlet transition-colors" />
                  
                  <div className="bg-[#EBDBCB]/30 p-6 rounded-3xl border border-transparent hover:border-scarlet/10 transition-all">
                    <div className="flex flex-wrap gap-2 mb-3">
                       {item.tags.map((tag, idx) => (
                         <span key={idx} className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                           tag.flagType === 'red' ? 'bg-scarlet/10 text-scarlet' : 
                           tag.flagType === 'green' ? 'bg-green-700/10 text-green-800' : 'bg-yellow-500/10 text-yellow-700'
                         }`}>
                           {tag.label}
                         </span>
                       ))}
                    </div>
                    <p className="text-scarlet text-lg font-serif mb-2">"{item.notes}"</p>
                    <p className="text-xs text-scarlet/40 uppercase tracking-widest">
                      {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
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