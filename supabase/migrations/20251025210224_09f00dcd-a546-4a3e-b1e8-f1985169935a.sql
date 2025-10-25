-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule fetch-matches to run every 15 minutes
SELECT cron.schedule(
  'fetch-matches-every-15-min',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://psecfzejcrtwvjcgwypi.supabase.co/functions/v1/fetch-matches',
        headers:='{"Content-Type": "application/json"}'::jsonb
    ) as request_id;
  $$
);

-- Schedule fetch-news to run every 30 minutes
SELECT cron.schedule(
  'fetch-news-every-30-min',
  '*/30 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://psecfzejcrtwvjcgwypi.supabase.co/functions/v1/fetch-news',
        headers:='{"Content-Type": "application/json"}'::jsonb
    ) as request_id;
  $$
);

-- Schedule update-live-scores to run every 2 minutes for live updates
SELECT cron.schedule(
  'update-live-scores-every-2-min',
  '*/2 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://psecfzejcrtwvjcgwypi.supabase.co/functions/v1/update-live-scores',
        headers:='{"Content-Type": "application/json"}'::jsonb
    ) as request_id;
  $$
);