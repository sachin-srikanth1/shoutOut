'use client';

import Link from 'next/link';
import { Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-background/80 backdrop-blur-sm border-t border-border/50 ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo - Left edge */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-1.5">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-6 h-6 rounded object-cover"
              />
              <span className="text-base font-semibold text-foreground">Netch.ai</span>
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link
              href="/legal"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              Legal
            </Link>
            <Link
              href="/about"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Social Media Icons - Right edge */}
          <div className="flex items-center space-x-2">
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden border-t border-border/50 py-3">
          <nav className="flex items-center justify-center space-x-6">
            <Link
              href="/legal"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              Legal
            </Link>
            <Link
              href="/about"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
} 