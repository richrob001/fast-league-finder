import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching matches from Sofascore API...');

    // Popular tournament IDs - Premier League, La Liga, Serie A, Champions League, Bundesliga
    const tournamentIds = [17, 8, 23, 7, 35]; 
    
    for (const tournamentId of tournamentIds) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `https://sofascore.p.rapidapi.com/tournaments/get-scheduled-events?tournamentId=${tournamentId}&date=${today}`,
          {
            headers: {
              'x-rapidapi-host': 'sofascore.p.rapidapi.com',
              'x-rapidapi-key': RAPIDAPI_KEY!,
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch matches for tournament ${tournamentId}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (!data.events || !Array.isArray(data.events)) {
          console.log(`No events found for tournament ${tournamentId}`);
          continue;
        }

        console.log(`Fetched ${data.events.length} matches for tournament ${tournamentId}`);

        for (const event of data.events) {
          // Upsert league
          const { data: league } = await supabase
            .from('leagues')
            .upsert({
              external_id: event.tournament.uniqueTournament?.id?.toString() || event.tournament.id.toString(),
              name: event.tournament.uniqueTournament?.name || event.tournament.name,
              country: event.tournament.category?.name || 'International',
              logo_url: `https://api.sofascore.com/api/v1/unique-tournament/${event.tournament.uniqueTournament?.id || event.tournament.id}/image`,
              season: event.season?.year?.toString() || new Date().getFullYear().toString(),
              sport: 'football',
            }, {
              onConflict: 'external_id',
              ignoreDuplicates: false,
            })
            .select()
            .single();

          if (!league) continue;

          // Upsert home team
          const { data: homeTeam } = await supabase
            .from('teams')
            .upsert({
              external_id: event.homeTeam.id.toString(),
              name: event.homeTeam.name,
              logo_url: `https://api.sofascore.com/api/v1/team/${event.homeTeam.id}/image`,
              country: event.homeTeam.country?.name || null,
            }, {
              onConflict: 'external_id',
              ignoreDuplicates: false,
            })
            .select()
            .single();

          // Upsert away team
          const { data: awayTeam } = await supabase
            .from('teams')
            .upsert({
              external_id: event.awayTeam.id.toString(),
              name: event.awayTeam.name,
              logo_url: `https://api.sofascore.com/api/v1/team/${event.awayTeam.id}/image`,
              country: event.awayTeam.country?.name || null,
            }, {
              onConflict: 'external_id',
              ignoreDuplicates: false,
            })
            .select()
            .single();

          if (!homeTeam || !awayTeam) continue;

          // Upsert match
          await supabase
            .from('matches')
            .upsert({
              external_id: event.id.toString(),
              league_id: league.id,
              home_team_id: homeTeam.id,
              away_team_id: awayTeam.id,
              match_date: new Date(event.startTimestamp * 1000).toISOString(),
              status: event.status?.type || 'notstarted',
              venue: event.venue?.stadium?.name || null,
              home_score: event.homeScore?.current || 0,
              away_score: event.awayScore?.current || 0,
            }, {
              onConflict: 'external_id',
              ignoreDuplicates: false,
            });
        }
      } catch (error) {
        console.error(`Failed to fetch matches for tournament ${tournamentId}:`, error instanceof Error ? error.message : error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Matches updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-matches:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});