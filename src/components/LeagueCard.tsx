import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, TrendingUp } from "lucide-react";

interface LeagueCardProps {
  name: string;
  sport: string;
  location: string;
  players: number;
  skillLevel: string;
  startDate: string;
  spotsLeft: number;
}

export const LeagueCard = ({ 
  name, 
  sport, 
  location, 
  players, 
  skillLevel, 
  startDate,
  spotsLeft 
}: LeagueCardProps) => {
  return (
    <Card className="group hover:scale-[1.02] cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary">{sport}</Badge>
          <Badge variant={spotsLeft < 5 ? "destructive" : "default"}>
            {spotsLeft} spots left
          </Badge>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{players} players registered</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Skill Level: {skillLevel}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Starts {startDate}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button variant="default" className="flex-1">Join League</Button>
        <Button variant="outline">Details</Button>
      </CardFooter>
    </Card>
  );
};