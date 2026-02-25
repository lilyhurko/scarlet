"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("scarletUser", data.name);
        localStorage.setItem("scarletEmail", formData.email);
        router.push("/dashboard");
      } else {
        setIsLogin(true);
        setError("Account created! Please log in.");
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream font-sans p-4">
      <div className="w-full max-w-md p-8 bg-[#EBDBCB] rounded-[40px] shadow-xl border border-[#D9C5B2]">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-serif font-bold text-scarlet mb-2">S</h1>
          <h2 className="text-xl font-serif text-dark/80 tracking-wide">
            {isLogin ? "Welcome back" : "Join Scarlet"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 rounded-2xl bg-[#F5F5F5] border-none outline-none focus:ring-2 focus:ring-scarlet placeholder:text-gray-400 text-dark"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-4 rounded-2xl bg-[#F5F5F5] border-none outline-none focus:ring-2 focus:ring-scarlet placeholder:text-gray-400 text-dark"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-4 rounded-2xl bg-[#F5F5F5] border-none outline-none focus:ring-2 focus:ring-scarlet placeholder:text-gray-400 text-dark"
            required
          />

          {error && <p className={`text-center text-sm ${error.includes("created") ? "text-green-600" : "text-scarlet"}`}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-full bg-scarlet text-cream font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-md disabled:opacity-50"
          >
            {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-dark/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-scarlet font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </main>
  );
}