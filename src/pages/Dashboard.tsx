import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Heart, Settings } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favoriteLeagues, setFavoriteLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session?.user);
      fetchUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfile(profileData);

    // Fetch favorite leagues
    const { data: favData } = await supabase
      .from('user_favorite_leagues')
      .select('*, league:leagues(*)')
      .eq('user_id', userId);

    setFavoriteLeagues(favData || []);
    setLoading(false);
  };

  const handleRemoveFavorite = async (leagueId: string) => {
    const { error } = await supabase
      .from('user_favorite_leagues')
      .delete()
      .eq('league_id', leagueId)
      .eq('user_id', user?.id);

    if (error) {
      toast.error('Failed to remove league');
    } else {
      toast.success('League removed from favorites');
      setFavoriteLeagues(favoriteLeagues.filter(fav => fav.league_id !== leagueId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || user?.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Favorite Leagues</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{favoriteLeagues.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>Matches Today</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Account</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Favorite Leagues</CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteLeagues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't added any favorite leagues yet</p>
                <Button onClick={() => navigate('/')}>
                  Browse Leagues
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteLeagues.map((fav) => (
                  <Card key={fav.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {fav.league?.logo_url && (
                          <img 
                            src={fav.league.logo_url} 
                            alt={fav.league.name} 
                            className="w-12 h-12 object-contain" 
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{fav.league?.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {fav.league?.sport}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/league/${fav.league_id}`)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleRemoveFavorite(fav.league_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}