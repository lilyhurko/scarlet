"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Navbar from "@/components/Navbar";

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

  if (!person) return <div className="min-h-screen bg-cream flex items-center justify-center text-scarlet font-serif animate-pulse">Loading Dossier...</div>;

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar />

      <main className="p-8 max-w-3xl mx-auto">
        {/* Header & Controls */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-scarlet/50 hover:text-scarlet transition-colors">
              <ArrowLeft size={18} /> <span className="text-xs uppercase tracking-widest font-bold">Back</span>
            </Link>

            {/* Delete Button */}
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 text-scarlet/40 hover:text-red-600 transition-colors text-xs uppercase tracking-widest font-bold"
            >
              <Trash2 size={16} /> Delete Record
            </button>
          </div>
          
          <div className="flex justify-between items-end border-b border-scarlet/10 pb-8">
            <div>
              <h1 className="text-5xl font-serif font-bold text-scarlet mb-2">{person.name}</h1>
              <p className="text-scarlet/60 uppercase tracking-[0.2em] text-sm font-bold flex items-center gap-2">
                {person.relation} • {history.length} interactions
              </p>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-serif font-bold ${person.vibeScore > 50 ? 'text-scarlet' : person.vibeScore > 20 ? 'text-yellow-600' : 'text-green-700'}`}>
                {person.vibeScore}
              </div>
              <div className="text-xs text-scarlet/40 uppercase tracking-widest">Risk Score</div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 mb-12">
            <Link 
              href="/interactions/new" 
              className="flex items-center gap-2 px-8 py-4 bg-scarlet text-cream rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#6e0000] shadow-lg hover:scale-105 transition-all"
            >
              <Plus size={18} /> New Check-in
            </Link>
        </div>

        {/* Timeline */}
        <section>
          <h2 className="text-xl font-serif font-bold text-scarlet mb-8">Case History</h2>

          <div className="space-y-8 relative border-l-2 border-scarlet/10 ml-4 pl-8">
            {history.length === 0 ? (
               <div className="text-scarlet/40 italic p-4 border border-dashed border-scarlet/20 rounded-xl bg-[#EBDBCB]/20">
                 No interactions recorded yet. Start tracking to see patterns.
               </div>
            ) : (
              history.map((item) => (
                <div key={item._id} className="relative group">
                  <div className={`absolute -left-[41px] top-6 w-5 h-5 rounded-full border-4 transition-colors bg-cream
                    ${item.tags.some(t => t.flagType === 'red') ? 'border-scarlet' : 
                      item.tags.some(t => t.flagType === 'yellow') ? 'border-yellow-500' : 'border-green-600'}`} 
                  />
                  
                  <div className="bg-white/60 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-transparent hover:border-scarlet/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
                            tag.flagType === 'red' ? 'bg-scarlet/5 text-scarlet border-scarlet/10' : 
                            tag.flagType === 'green' ? 'bg-green-700/5 text-green-800 border-green-700/10' : 'bg-yellow-500/5 text-yellow-700 border-yellow-500/10'
                          }`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-scarlet/30 font-bold uppercase tracking-widest whitespace-nowrap ml-2">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-scarlet text-lg font-serif leading-relaxed italic">"{item.notes}"</p>
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