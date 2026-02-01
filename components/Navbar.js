"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [initial, setInitial] = useState("L");

  useEffect(() => {
    const name = localStorage.getItem("scarletUser");
    if (name) setInitial(name.charAt(0).toUpperCase());
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-cream">
      {/* 1. Logo */}
      <Link
        href="/dashboard"
        className="text-4xl font-serif font-bold text-scarlet hover:opacity-80 transition-opacity"
      >
        S
      </Link>

      {/* 2. Navigation Links (Центральне меню) */}
      <div className="hidden md:flex gap-8 text-xs font-sans font-medium uppercase tracking-[0.2em] text-scarlet/60">
        <Link
          href="/dashboard"
          className="hover:text-scarlet transition-colors"
        >
          People
        </Link>
        <Link
          href="/analytics"
          className="hover:text-scarlet transition-colors"
        >
          Analytics
        </Link>
        <Link
          href="/interactions/new"
          className="hover:text-scarlet transition-colors"
        >
          Add Interaction
        </Link>{" "}
      </div>

      {/* 3. User Avatar */}
      <Link
        href="/profile"
        className="w-10 h-10 rounded-full bg-[#EBDBCB] border border-scarlet/10 flex items-center justify-center shadow-sm hover:border-scarlet/40 transition-all"
      >
        <span className="font-serif font-bold text-scarlet text-lg">
          {initial}
        </span>
      </Link>
    </nav>
  );
}
