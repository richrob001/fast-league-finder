import { Button } from "@/components/ui/button";
import { Trophy, Menu } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">
            <span className="text-primary">Fast</span>League
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Leagues
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button variant="accent">
            Create League
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};