import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  process_name: string;
  file_path: string;
  event_type: string;
  entropy_score: number;
  rename_count: number;
  severity: string;
  action_taken: string;
}

export const useTelemetry = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('system_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_logs',
        },
        (payload) => {
          console.log('New telemetry event:', payload);
          setEvents((prev) => [payload.new as TelemetryEvent, ...prev].slice(0, 100));
        }
      )
      .subscribe((status) => {
        console.log('Realtime connection status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Fetch initial data
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching initial data:', error);
      } else if (data) {
        setEvents(data as TelemetryEvent[]);
      }
    };

    fetchInitialData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, isConnected };
};

export const startTelemetrySimulator = async (count = 5) => {
  try {
    const { data, error } = await supabase.functions.invoke('telemetry-simulator', {
      body: { count, demo: true }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error starting telemetry simulator:', error);
    throw error;
  }
};
