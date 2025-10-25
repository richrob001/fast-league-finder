import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MatchCard } from "@/components/MatchCard";
import { NewsCard } from "@/components/NewsCard";
import { LeagueCard } from "@/components/LeagueCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
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

  // Fetch leagues
  const { data: leagues, isLoading: leaguesLoading } = useQuery({
    queryKey: ['leagues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('name', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Fetch matches
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          league:leagues(*),
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*)
        `)
        .order('match_date', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Fetch news
  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sports_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  // Subscribe to realtime match updates
  useEffect(() => {
    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          toast.info('Match scores updated!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Live Sports</h2>
            <p className="text-muted-foreground">
              Real-time scores, matches, and news from around the world
            </p>
          </div>
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>

        <Tabs defaultValue="leagues" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="leagues">Leagues</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="leagues" className="mt-6">
            {leaguesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : leagues && leagues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leagues.map((league: any) => (
                  <LeagueCard
                    key={league.id}
                    id={league.id}
                    name={league.name}
                    sport={league.sport}
                    country={league.country}
                    logo_url={league.logo_url}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No leagues available yet. Check back soon!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matches" className="mt-6">
            {matchesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : matches && matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match: any) => (
                  <MatchCard
                    key={match.id}
                    homeTeam={match.home_team}
                    awayTeam={match.away_team}
                    homeScore={match.home_score}
                    awayScore={match.away_score}
                    status={match.status}
                    matchDate={match.match_date}
                    venue={match.venue}
                    league={match.league}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No matches available yet. Check back soon!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            {newsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : news && news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article: any) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    description={article.description}
                    imageUrl={article.image_url}
                    url={article.url}
                    publishedAt={article.published_at}
                    source={article.source}
                    sport={article.sport}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No news available yet. Check back soon!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;