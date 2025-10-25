import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Calendar, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

export default function LeagueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [league, setLeague] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLeague = async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Failed to load league details');
        navigate('/');
      } else {
        setLeague(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchLeague();
    }
  }, [id, navigate]);

  const handleJoinLeague = async () => {
    if (!user) {
      toast.error('Please sign in to join a league');
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('user_favorite_leagues')
      .insert({ user_id: user.id, league_id: id });

    if (error) {
      if (error.code === '23505') {
        toast.info('You have already joined this league');
      } else {
        toast.error('Failed to join league');
      }
    } else {
      toast.success('Successfully joined the league!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leagues
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  {league.logo_url && (
                    <img src={league.logo_url} alt={league.name} className="w-16 h-16 object-contain" />
                  )}
                  <div>
                    <CardTitle className="text-3xl">{league.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{league.sport}</Badge>
                      {league.country && <Badge variant="outline">{league.country}</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                    <Trophy className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Season</p>
                      <p className="font-semibold">{league.season || 'Current Season'}</p>
                    </div>
                  </div>
                  
                  {league.country && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                      <MapPin className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-semibold">{league.country}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">About This League</h3>
                  <p className="text-muted-foreground">
                    This is a professional {league.sport} league featuring top teams from {league.country || 'around the world'}. 
                    Follow live matches, scores, and get the latest news about your favorite teams.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Join League</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleJoinLeague} className="w-full" size="lg">
                  Follow This League
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Get notifications for upcoming matches and updates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}