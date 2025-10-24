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
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {league.logo_url && (
              <img src={league.logo_url} alt={league.name} className="w-6 h-6 object-contain" />
            )}
            <span className="text-sm font-medium text-muted-foreground">{league.name}</span>
          </div>
          <Badge variant={isLive ? "destructive" : isFinished ? "secondary" : "default"}>
            {isLive ? "LIVE" : status}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {homeTeam.logo_url && (
                <img src={homeTeam.logo_url} alt={homeTeam.name} className="w-10 h-10 object-contain" />
              )}
              <span className="font-semibold">{homeTeam.name}</span>
            </div>
            <span className="text-2xl font-bold">{homeScore}</span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {awayTeam.logo_url && (
                <img src={awayTeam.logo_url} alt={awayTeam.name} className="w-10 h-10 object-contain" />
              )}
              <span className="font-semibold">{awayTeam.name}</span>
            </div>
            <span className="text-2xl font-bold">{awayScore}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(matchDate), "PPp")}</span>
          </div>
          {venue && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{venue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};