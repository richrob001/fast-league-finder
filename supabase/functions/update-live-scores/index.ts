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

    console.log('Fetching live scores from Sofascore API...');

    // Get current date in YYYYMMDD format
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

    const response = await fetch(
      `https://sofascore.p.rapidapi.com/events/live/list?sport=football&date=${today}`,
      {
        headers: {
          'x-rapidapi-host': 'sofascore.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Sofascore API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.log('No live events found');
      return new Response(
        JSON.stringify({ success: true, message: 'No live events to update' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${data.data.length} live events`);
    let updatedCount = 0;

    for (const event of data.data) {
      // Find match by external_id
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .eq('external_id', event.id.toString())
        .limit(1);

      if (matches && matches.length > 0) {
        const match = matches[0];
        await supabase
          .from('matches')
          .update({
            home_score: event.homeScore?.current || 0,
            away_score: event.awayScore?.current || 0,
            status: event.status?.type || 'inprogress',
          })
          .eq('id', match.id);
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} live matches`);

    return new Response(
      JSON.stringify({ success: true, message: `Updated ${updatedCount} live matches` }),
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