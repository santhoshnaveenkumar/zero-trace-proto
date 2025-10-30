import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    entropy_threshold: 75,
    rename_threshold: 50,
    auto_block_enabled: true,
    webhook_url: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('status-get');
      if (error) throw error;
      if (data) {
        setSettings({
          entropy_threshold: data.entropy_threshold || 75,
          rename_threshold: data.rename_threshold || 50,
          auto_block_enabled: data.auto_block_enabled ?? true,
          webhook_url: data.webhook_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.functions.invoke('settings-update', {
        body: settings
      });
      if (error) throw error;
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSettings({
      entropy_threshold: 75,
      rename_threshold: 50,
      auto_block_enabled: true,
      webhook_url: '',
    });
    toast.success('Settings reset to defaults');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        
        <div className="p-6 space-y-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>

          {/* Threshold Controls */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Detection Thresholds</h2>
              
              {/* Entropy Threshold */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Label>Entropy Threshold</Label>
                  <span className="text-sm font-medium text-foreground">{settings.entropy_threshold}%</span>
                </div>
                <Slider
                  value={[settings.entropy_threshold]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, entropy_threshold: value }))}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Files with entropy above this threshold will be flagged as suspicious
                </p>
              </div>

              {/* Rename Threshold */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Rename Burst Threshold</Label>
                  <span className="text-sm font-medium text-foreground">{settings.rename_threshold} files</span>
                </div>
                <Slider
                  value={[settings.rename_threshold]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, rename_threshold: value }))}
                  max={200}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Number of file renames within 5 seconds to trigger an alert
                </p>
              </div>
            </div>
          </Card>

          {/* Auto-Block Settings */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Protection Settings</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-block Suspicious Processes</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically block processes that exceed both thresholds
                </p>
              </div>
              <Switch
                checked={settings.auto_block_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_block_enabled: checked }))}
              />
            </div>
          </Card>

          {/* Webhook/Alert Configuration */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Alert Configuration</h2>
            
            <div className="space-y-2">
              <Label>Webhook URL (Optional)</Label>
              <Input
                placeholder="https://your-webhook-endpoint.com"
                value={settings.webhook_url}
                onChange={(e) => setSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Send POST notifications to this URL when threats are detected
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
