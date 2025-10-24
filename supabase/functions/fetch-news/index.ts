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
    const NEWSAPI_KEY = Deno.env.get('NEWSAPI_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching sports news from NewsAPI...');

    const sportsCategories = ['football', 'basketball', 'tennis', 'baseball', 'soccer'];
    
    for (const sport of sportsCategories) {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${sport}&sortBy=publishedAt&language=en&pageSize=20`,
        {
          headers: {
            'X-Api-Key': NEWSAPI_KEY!
          }
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch news for ${sport}`);
        continue;
      }

      const data = await response.json();
      console.log(`Fetched ${data.articles?.length || 0} articles for ${sport}`);

      // Store news articles
      for (const article of data.articles || []) {
        await supabase
          .from('sports_news')
          .upsert({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            image_url: article.urlToImage,
            published_at: article.publishedAt,
            source: article.source.name,
            sport: sport
          }, { 
            onConflict: 'url',
            ignoreDuplicates: true 
          });
      }
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