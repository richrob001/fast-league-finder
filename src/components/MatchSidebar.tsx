import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Star, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterType = "all" | "live" | "finished" | "upcoming";

export const MatchSidebar = () => {
  const [filter, setFilter] = useState<FilterType>("live");
  const [selectedDate] = useState(new Date());

  const { data: matches, isLoading } = useQuery({
    queryKey: ['sidebar-matches', filter],
    queryFn: async () => {
      let query = supabase
        .from('matches')
        .select(`
          *,
          league:leagues(*),
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*)
        `)
        .order('match_date', { ascending: true })
        .limit(50);

      if (filter === "live") {
        query = query.in('status', ['LIVE', '1H', '2H', 'HT']);
      } else if (filter === "finished") {
        query = query.in('status', ['FT', 'AET', 'PEN']);
      } else if (filter === "upcoming") {
        query = query.eq('status', 'NS');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const groupedMatches = matches?.reduce((acc: any, match: any) => {
    const leagueName = match.league?.name || 'Unknown League';
    if (!acc[leagueName]) {
      acc[leagueName] = [];
    }
    acc[leagueName].push(match);
    return acc;
  }, {});

  const isLive = (status: string) => ['LIVE', '1H', '2H', 'HT'].includes(status);

  return (
    <div className="w-80 bg-sidebar-background border-r border-sidebar-border h-screen overflow-y-auto flex flex-col">
      {/* Filter tabs */}
      <div className="sticky top-0 bg-sidebar-background z-10 border-b border-sidebar-border">
        <div className="flex gap-1 p-2">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1 text-xs"
          >
            All
          </Button>
          <Button
            variant={filter === "live" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("live")}
            className="flex-1 text-xs"
          >
            Live ({matches?.filter(m => isLive(m.status)).length || 0})
          </Button>
          <Button
            variant={filter === "finished" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("finished")}
            className="flex-1 text-xs"
          >
            Finished
          </Button>
          <Button
            variant={filter === "upcoming" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("upcoming")}
            className="flex-1 text-xs"
          >
            Upcoming
          </Button>
        </div>

        {/* Date selector */}
        <div className="flex items-center justify-center gap-2 py-2 px-3 border-t border-sidebar-border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(selectedDate, "d/M")}
          </span>
        </div>

        {/* Odds toggle */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-sidebar-border">
          <span className="text-xs text-muted-foreground">Odds</span>
          <div className="w-10 h-5 bg-muted rounded-full"></div>
        </div>
      </div>

      {/* Match list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">Loading...</div>
        ) : !groupedMatches || Object.keys(groupedMatches).length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No matches found
          </div>
        ) : (
          Object.entries(groupedMatches).map(([league, leagueMatches]: [string, any]) => (
            <div key={league} className="border-b border-sidebar-border">
              {/* League header */}
              <div className="px-3 py-2 bg-sidebar-accent/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{league}</span>
                </div>
              </div>

              {/* Matches in league */}
              {leagueMatches.map((match: any) => (
                <div
                  key={match.id}
                  className="px-3 py-2 hover:bg-sidebar-accent transition-colors cursor-pointer border-b border-sidebar-border/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(match.match_date), "HH:mm")}
                      </span>
                      <Star className="h-3 w-3 text-muted-foreground" />
                    </div>
                    {isLive(match.status) && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">
                        LIVE
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.home_team?.logo_url && (
                          <img 
                            src={match.home_team.logo_url} 
                            alt="" 
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span className="truncate">{match.home_team?.name}</span>
                      </div>
                      <span className="font-semibold ml-2">{match.home_score}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {match.away_team?.logo_url && (
                          <img 
                            src={match.away_team.logo_url} 
                            alt="" 
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span className="truncate">{match.away_team?.name}</span>
                      </div>
                      <span className="font-semibold ml-2">{match.away_score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
