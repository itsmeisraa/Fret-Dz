// frontend/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo with image */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"  // 👈 Change this to your actual logo path
            alt="Fret-Dz Logo"
            width={28}
            height={32}
            className="h-15 w-auto"
          />
          <span className="text-2xl font-bold">Fret-Dz</span>
        </Link>

        {/* Right side: Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#how-it-works" className="text-sm font-medium hover:underline">
            How it Works
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:underline">
            FAQ
          </Link>
          <Link href="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
          <Link
            href="/get-started"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="container mx-auto space-y-4 px-4 pb-6 md:hidden">
          <Link
            href="#how-it-works"
            className="block text-sm font-medium hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link
            href="#faq"
            className="block text-sm font-medium hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/login"
            className="block text-sm font-medium hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/get-started"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}