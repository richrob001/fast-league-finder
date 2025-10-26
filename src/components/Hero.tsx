import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-sports.jpg";

export const Hero = () => {
  return (
    <div className="relative h-[300px] overflow-hidden border-b border-border">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl font-bold mb-3 animate-fade-in">
            Live Sports Scores & Updates
          </h1>
          <p className="text-lg mb-6 text-gray-200 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Follow your favorite teams and leagues with real-time match updates
          </p>
          <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Explore Matches
            </Button>
            <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
              View Leagues
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
