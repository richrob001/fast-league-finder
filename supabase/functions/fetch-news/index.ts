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

    console.log('Fetching sports news from Sofascore...');

    const response = await fetch(
      'https://sofascore.p.rapidapi.com/news/list',
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
      throw new Error('Invalid response format from Sofascore API');
    }

    console.log(`Fetched ${data.data.length} news articles`);

    for (const article of data.data) {
      if (!article.title) continue;

      await supabase
        .from('sports_news')
        .upsert({
          title: article.title,
          description: article.subtitle || article.title,
          content: article.body || article.subtitle,
          url: article.link || `https://www.sofascore.com/news/${article.id}`,
          image_url: article.image ? `https://img.sofascore.com${article.image}` : null,
          published_at: new Date(article.published * 1000).toISOString(),
          source: 'Sofascore',
          sport: article.sport?.name || 'football',
        }, {
          onConflict: 'url',
          ignoreDuplicates: true,
        });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'News updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-news:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});