import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total logs count
    const { count: totalLogs } = await supabase
      .from('system_logs')
      .select('*', { count: 'exact', head: true });

    // Get threats blocked (action_taken = 'blocked')
    const { count: threatsBlocked } = await supabase
      .from('system_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action_taken', 'blocked');

    // Get warnings (severity = 'warning')
    const { count: warnings } = await supabase
      .from('system_logs')
      .select('*', { count: 'exact', head: true })
      .eq('severity', 'warning');

    // Get threats (severity = 'threat')
    const { count: threats } = await supabase
      .from('system_logs')
      .select('*', { count: 'exact', head: true })
      .eq('severity', 'threat');

    // Get recent threat logs
    const { data: recentThreats } = await supabase
      .from('system_logs')
      .select('*')
      .eq('severity', 'threat')
      .order('timestamp', { ascending: false })
      .limit(10);

    // Get logs by event type
    const { data: eventTypeData } = await supabase
      .from('system_logs')
      .select('event_type');

    const eventTypeCounts = eventTypeData?.reduce((acc: any, log: any) => {
      acc[log.event_type] = (acc[log.event_type] || 0) + 1;
      return acc;
    }, {}) || {};

    return new Response(
      JSON.stringify({
        totalLogs: totalLogs || 0,
        threatsBlocked: threatsBlocked || 0,
        warnings: warnings || 0,
        threats: threats || 0,
        recentThreats: recentThreats || [],
        eventTypeCounts,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in report-get:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
