import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulator configuration
const PROCESSES = [
  'chrome.exe',
  'firefox.exe',
  'explorer.exe',
  'notepad.exe',
  'system32.exe',
  'msedge.exe',
  'vscode.exe',
];

const FILE_PATHS = [
  'C:\\Users\\Documents\\file',
  'C:\\Users\\Downloads\\document',
  'C:\\Program Files\\data',
  'D:\\Projects\\source',
  'C:\\Windows\\System32\\config',
];

const EVENT_TYPES = ['write', 'rename', 'delete', 'access'];

function generateTelemetryEvent() {
  const processName = PROCESSES[Math.floor(Math.random() * PROCESSES.length)];
  const filePath = `${FILE_PATHS[Math.floor(Math.random() * FILE_PATHS.length)]}_${Math.floor(Math.random() * 1000)}.${['txt', 'doc', 'pdf', 'exe'][Math.floor(Math.random() * 4)]}`;
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  
  // Normal entropy: 30-65, Suspicious: 65-80, Threat: 80+
  const entropyBase = Math.random() * 100;
  let severity = 'safe';
  let actionTaken = 'ignored';
  let renameCount = Math.floor(Math.random() * 5);

  // 10% chance of generating a suspicious event
  if (Math.random() < 0.1) {
    severity = 'warning';
    actionTaken = 'flagged';
    renameCount = Math.floor(Math.random() * 30) + 20;
  }

  // 5% chance of generating a threat
  if (Math.random() < 0.05) {
    severity = 'threat';
    actionTaken = 'blocked';
    renameCount = Math.floor(Math.random() * 100) + 100;
  }

  const entropyScore = severity === 'threat' 
    ? 80 + Math.random() * 20 
    : severity === 'warning'
    ? 65 + Math.random() * 15
    : 30 + Math.random() * 35;

  return {
    process_name: processName,
    file_path: filePath,
    event_type: eventType,
    entropy_score: parseFloat(entropyScore.toFixed(2)),
    rename_count: renameCount,
    severity,
    action_taken: actionTaken,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const count = parseInt(url.searchParams.get('count') || '1');
    const demo = url.searchParams.get('demo') === 'true';

    // Check if monitoring is enabled
    const { data: settings } = await supabase
      .from('settings')
      .select('monitoring_enabled')
      .limit(1)
      .single();

    if (!settings?.monitoring_enabled && !demo) {
      return new Response(
        JSON.stringify({ message: 'Monitoring is disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate telemetry events
    const events = [];
    for (let i = 0; i < count; i++) {
      events.push(generateTelemetryEvent());
    }

    // Insert into database
    const { data, error } = await supabase
      .from('system_logs')
      .insert(events)
      .select();

    if (error) throw error;

    console.log(`Generated ${events.length} telemetry events`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: events.length,
        events: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in telemetry-simulator:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
