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

    console.log('Fetching matches from API-SPORTS...');

    // Fetch live and upcoming matches for popular leagues
    const leagueIds = [39, 140, 135, 61, 2]; // Premier League, La Liga, Serie A, Ligue 1, Champions League
    
    for (const leagueId of leagueIds) {
      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2024&next=10`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY!,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch matches for league ${leagueId}`);
        continue;
      }

      const data = await response.json();
      console.log(`Fetched ${data.response?.length || 0} matches for league ${leagueId}`);

      // Process and store matches
      for (const fixture of data.response || []) {
        // Upsert league
        const { data: league } = await supabase
          .from('leagues')
          .upsert({
            external_id: fixture.league.id.toString(),
            name: fixture.league.name,
            sport: 'football',
            country: fixture.league.country,
            logo_url: fixture.league.logo,
            season: fixture.league.season.toString()
          }, { onConflict: 'external_id' })
          .select()
          .single();

        // Upsert teams
        const { data: homeTeam } = await supabase
          .from('teams')
          .upsert({
            external_id: fixture.teams.home.id.toString(),
            name: fixture.teams.home.name,
            logo_url: fixture.teams.home.logo
          }, { onConflict: 'external_id' })
          .select()
          .single();

        const { data: awayTeam } = await supabase
          .from('teams')
          .upsert({
            external_id: fixture.teams.away.id.toString(),
            name: fixture.teams.away.name,
            logo_url: fixture.teams.away.logo
          }, { onConflict: 'external_id' })
          .select()
          .single();

        // Upsert match
        if (league && homeTeam && awayTeam) {
          await supabase
            .from('matches')
            .upsert({
              external_id: fixture.fixture.id.toString(),
              league_id: league.id,
              home_team_id: homeTeam.id,
              away_team_id: awayTeam.id,
              match_date: fixture.fixture.date,
              status: fixture.fixture.status.short,
              home_score: fixture.goals.home || 0,
              away_score: fixture.goals.away || 0,
              venue: fixture.fixture.venue.name
            }, { onConflict: 'external_id' });
        }
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