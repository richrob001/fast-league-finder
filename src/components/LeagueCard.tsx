import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Trophy } from "lucide-react";
import { toast } from "sonner";

interface LeagueCardProps {
  id: string;
  name: string;
  sport: string;
  country?: string;
  logo_url?: string;
}

export const LeagueCard = ({ 
  id,
  name, 
  sport, 
  country,
  logo_url
}: LeagueCardProps) => {
  const navigate = useNavigate();

  const handleJoinLeague = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error('Please sign in to join a league');
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('user_favorite_leagues')
      .insert({ user_id: session.user.id, league_id: id });

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

  const handleViewDetails = () => {
    navigate(`/league/${id}`);
  };

  return (
    <Card className="group hover:scale-[1.02] hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          {logo_url && (
            <img src={logo_url} alt={name} className="w-10 h-10 object-contain" />
          )}
          <Badge variant="secondary">{sport}</Badge>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {country || 'International'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4" />
          <span>Professional League</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button variant="default" className="flex-1" onClick={handleJoinLeague}>
          Follow League
        </Button>
        <Button variant="outline" onClick={handleViewDetails}>
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};