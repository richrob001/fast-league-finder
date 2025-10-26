import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface MatchCardProps {
  homeTeam: {
    name: string;
    logo_url?: string;
  };
  awayTeam: {
    name: string;
    logo_url?: string;
  };
  homeScore: number;
  awayScore: number;
  status: string;
  matchDate: string;
  venue?: string;
  league: {
    name: string;
    logo_url?: string;
  };
}

export const MatchCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  matchDate,
  venue,
  league,
}: MatchCardProps) => {
  const isLive = status === "LIVE" || status === "1H" || status === "2H" || status === "HT";
  const isFinished = status === "FT" || status === "AET" || status === "PEN";

  return (
    <Card className="hover:bg-card/80 transition-all border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* League logo */}
          <div className="flex flex-col items-center gap-1">
            {league.logo_url && (
              <img src={league.logo_url} alt={league.name} className="w-8 h-8 object-contain" />
            )}
          </div>

          {/* Teams */}
          <div className="flex-1 space-y-2">
            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {homeTeam.logo_url && (
                  <img src={homeTeam.logo_url} alt={homeTeam.name} className="w-6 h-6 object-contain" />
                )}
                <span className="text-sm font-medium">{homeTeam.name}</span>
              </div>
              <span className="text-lg font-bold ml-4">{homeScore}</span>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {awayTeam.logo_url && (
                  <img src={awayTeam.logo_url} alt={awayTeam.name} className="w-6 h-6 object-contain" />
                )}
                <span className="text-sm font-medium">{awayTeam.name}</span>
              </div>
              <span className="text-lg font-bold ml-4">{awayScore}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isLive ? "destructive" : isFinished ? "secondary" : "default"} className="text-xs">
              {isLive ? "LIVE" : status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(matchDate), "HH:mm")}
            </span>
          </div>
        </div>

        {venue && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{venue}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};