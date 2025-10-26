import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Star, HelpCircle, Settings, Trophy, Dribbble, Medal, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sports = [
  { name: "Football", icon: Trophy, count: 3 },
  { name: "Basketball", icon: Dribbble, count: 1 },
  { name: "Tennis", icon: Medal, count: 1 },
  { name: "Hockey", icon: Zap, count: 2 },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="bg-background border-b border-border">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-xl font-bold text-foreground">FastLeague</div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search matches, competitions, teams, players, and more"
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button variant="ghost" size="icon">
                    <Star className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sports navigation */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {sports.map((sport) => (
              <Button
                key={sport.name}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 shrink-0"
              >
                <sport.icon className="h-4 w-4" />
                <span>{sport.name}</span>
                <Badge variant="secondary" className="text-xs px-1.5">
                  {sport.count}
                </Badge>
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="shrink-0">
              More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
