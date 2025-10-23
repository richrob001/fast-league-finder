import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-sports.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Athletes in action" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">
              Sports League
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Join thousands of players competing in leagues near you. 
            From casual to competitive, find the right fit for your game.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search by sport, location, or league name..." 
                className="pl-10 h-12 bg-card shadow-lg border-border"
              />
            </div>
            <Button variant="hero" size="lg" className="h-12 px-8">
              Search Leagues
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Active Leagues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-muted-foreground">Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-muted-foreground">Sports</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};