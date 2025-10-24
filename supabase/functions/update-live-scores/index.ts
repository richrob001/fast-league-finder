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
    const ODDS_API_KEY = Deno.env.get('ODDS_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching live scores from The Odds API...');

    const sports = ['soccer_epl', 'americanfootball_nfl', 'basketball_nba', 'icehockey_nhl'];
    
    for (const sport of sports) {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport}/scores/?apiKey=${ODDS_API_KEY}&daysFrom=1`,
      );

      if (!response.ok) {
        console.error(`Failed to fetch scores for ${sport}`);
        continue;
      }

      const scores = await response.json();
      console.log(`Fetched ${scores?.length || 0} scores for ${sport}`);

      // Update existing matches with live scores
      for (const game of scores || []) {
        if (game.scores) {
          // Try to find and update the match
          const { data: existingMatch } = await supabase
            .from('matches')
            .select('id')
            .ilike('venue', `%${game.home_team}%`)
            .limit(1)
            .single();

          if (existingMatch) {
            await supabase
              .from('matches')
              .update({
                home_score: game.scores[0]?.score || 0,
                away_score: game.scores[1]?.score || 0,
                status: game.completed ? 'FT' : 'LIVE'
              })
              .eq('id', existingMatch.id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Live scores updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-live-scores:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});