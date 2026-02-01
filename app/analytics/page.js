"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from "recharts";
import { TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AnalyticsPage() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => setPeople(data || []));
  }, []);

  // --- ЛОГІКА ОБЧИСЛЕННЯ ---
  
  // Знаходимо найтоксичнішого (Max Score)
  const highestRisk = people.length > 0 
    ? people.reduce((prev, current) => (prev.vibeScore > current.vibeScore) ? prev : current)
    : null;

  // Знаходимо "Зелений прапорець" (Найменший Score)
  const safestPerson = people.length > 0
    ? people.reduce((prev, current) => (prev.vibeScore < current.vibeScore) ? prev : current)
    : null;

  // Середній рівень токсичності оточення
  const averageScore = people.length > 0
    ? Math.round(people.reduce((sum, p) => sum + p.vibeScore, 0) / people.length)
    : 0;

  // Дані для кругової діаграми
  const pieData = [
    { name: 'Safe', value: people.filter(p => p.vibeScore <= 20).length },
    { name: 'Warning', value: people.filter(p => p.vibeScore > 20 && p.vibeScore <= 50).length },
    { name: 'Danger', value: people.filter(p => p.vibeScore > 50).length },
  ];
  
  const COLORS = ['#15803d', '#eab308', '#8B0000']; // Green, Yellow, Scarlet

  // Функція кольору для стовпчиків
  const getBarColor = (score) => {
    if (score > 50) return "#8B0000"; // Scarlet
    if (score > 20) return "#eab308"; // Yellow
    return "#15803d"; // Green
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar />

      <main className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-scarlet mb-2">Vibe Analytics</h1>
        <p className="text-scarlet/60 mb-10">Data visualization of your social circle.</p>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Toxic King/Queen */}
          <div className="bg-[#EBDBCB]/40 p-6 rounded-3xl border border-scarlet/10">
            <div className="flex items-center gap-3 mb-2 text-scarlet/60 font-bold text-xs uppercase tracking-widest">
              <AlertTriangle size={16} /> Highest Risk
            </div>
            <div className="text-2xl font-serif text-scarlet font-bold">
              {highestRisk ? highestRisk.name : "N/A"}
            </div>
            <div className="text-sm text-scarlet/50">
              Score: {highestRisk ? highestRisk.vibeScore : 0}
            </div>
          </div>

          {/* Card 2: Average */}
          <div className="bg-[#EBDBCB]/40 p-6 rounded-3xl border border-scarlet/10">
            <div className="flex items-center gap-3 mb-2 text-scarlet/60 font-bold text-xs uppercase tracking-widest">
              <TrendingUp size={16} /> Average Vibe
            </div>
            <div className="text-2xl font-serif text-scarlet font-bold">
              {averageScore}
            </div>
            <div className="text-sm text-scarlet/50">
              Points per person
            </div>
          </div>

          {/* Card 3: Safest */}
          <div className="bg-[#EBDBCB]/40 p-6 rounded-3xl border border-scarlet/10">
            <div className="flex items-center gap-3 mb-2 text-scarlet/60 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={16} /> Safest Connection
            </div>
            <div className="text-2xl font-serif text-scarlet font-bold">
              {safestPerson ? safestPerson.name : "N/A"}
            </div>
            <div className="text-sm text-scarlet/50">
              Score: {safestPerson ? safestPerson.vibeScore : 0}
            </div>
          </div>
        </div>

        {/* --- GRAPHS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Graph 1: Bar Chart */}
          <section className="bg-white/50 p-8 rounded-[40px] shadow-sm">
            <h2 className="text-xl font-serif font-bold text-scarlet mb-6">Toxicity Comparison</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={people}>
                  <XAxis dataKey="name" stroke="#8B0000" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#FFF5E1', borderRadius: '12px', border: 'none', color: '#8B0000' }}
                  />
                  <Bar dataKey="vibeScore" radius={[10, 10, 0, 0]}>
                    {people.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.vibeScore)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Graph 2: Pie Chart */}
          <section className="bg-white/50 p-8 rounded-[40px] shadow-sm flex flex-col items-center">
            <h2 className="text-xl font-serif font-bold text-scarlet mb-6">Circle Distribution</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFF5E1', borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-scarlet/60 mt-4">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-700"/> Safe</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"/> Warning</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-scarlet"/> Danger</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}