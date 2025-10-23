import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FilterSidebar } from "@/components/FilterSidebar";
import { LeagueCard } from "@/components/LeagueCard";

const featuredLeagues = [
  {
    id: 1,
    name: "Downtown Basketball League",
    sport: "Basketball",
    location: "Downtown Sports Center",
    players: 48,
    skillLevel: "Intermediate",
    startDate: "March 15, 2025",
    spotsLeft: 12
  },
  {
    id: 2,
    name: "Weekend Warriors Soccer",
    sport: "Soccer",
    location: "North Side Field",
    players: 64,
    skillLevel: "Beginner",
    startDate: "March 20, 2025",
    spotsLeft: 8
  },
  {
    id: 3,
    name: "Elite Tennis Championship",
    sport: "Tennis",
    location: "West End Tennis Club",
    players: 32,
    skillLevel: "Advanced",
    startDate: "April 1, 2025",
    spotsLeft: 4
  },
  {
    id: 4,
    name: "Friendly Volleyball Nights",
    sport: "Volleyball",
    location: "South Side Arena",
    players: 24,
    skillLevel: "Intermediate",
    startDate: "March 18, 2025",
    spotsLeft: 16
  },
  {
    id: 5,
    name: "Summer Baseball Classic",
    sport: "Baseball",
    location: "East District Stadium",
    players: 56,
    skillLevel: "Expert",
    startDate: "April 5, 2025",
    spotsLeft: 2
  },
  {
    id: 6,
    name: "Ice Hockey Pro League",
    sport: "Hockey",
    location: "Downtown Ice Rink",
    players: 40,
    skillLevel: "Advanced",
    startDate: "March 25, 2025",
    spotsLeft: 10
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar />
          </aside>
          
          {/* League Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Featured Leagues</h2>
              <p className="text-muted-foreground">
                Browse through our most popular leagues and find your perfect match
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredLeagues.map((league) => (
                <LeagueCard key={league.id} {...league} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 FastLeague. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;