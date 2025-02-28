
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchSettings, updateAllSettings } from "@/utils/mockApi";
import { GeoBlockingSettings } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Save, 
  Download, 
  Upload,
  Shield,
  Clock,
  Users
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [settings, setSettings] = useState<GeoBlockingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [geoblockingEnabled, setGeoblockingEnabled] = useState(true);
  const [timeRestrictionsEnabled, setTimeRestrictionsEnabled] = useState(true);
  const [affiliateExceptionsEnabled, setAffiliateExceptionsEnabled] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
        
        // These are mock global settings; in a real app, these would come from the backend
        setGeoblockingEnabled(true);
        setTimeRestrictionsEnabled(true);
        setAffiliateExceptionsEnabled(true);
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Failed to load application settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // For this demo, we'll just simulate saving the global settings
      // In a real app, we would save these to the backend
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save application settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const exportSettings = () => {
    if (!settings) return;
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `geoaccess-settings-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Settings exported",
      description: "Your settings have been exported to a JSON file.",
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 pl-64">
        <Header />
        
        <main className="container px-4 py-6 pt-20 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Configure global application settings
              </p>
            </div>
            
            <Button onClick={saveSettings} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
          
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="import-export">Import/Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <SettingsIcon className="mr-2 h-5 w-5 text-primary" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Enable or disable features across the system
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="geo-blocking" className="text-base">
                        <Shield className="inline-block mr-2 h-4 w-4" />
                        Country Blocking
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Block users based on their geographic location
                      </p>
                    </div>
                    <Switch
                      id="geo-blocking"
                      checked={geoblockingEnabled}
                      onCheckedChange={setGeoblockingEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="time-restrictions" className="text-base">
                        <Clock className="inline-block mr-2 h-4 w-4" />
                        Time-Based Restrictions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict access based on time of day
                      </p>
                    </div>
                    <Switch
                      id="time-restrictions"
                      checked={timeRestrictionsEnabled}
                      onCheckedChange={setTimeRestrictionsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="affiliate-exceptions" className="text-base">
                        <Users className="inline-block mr-2 h-4 w-4" />
                        Affiliate Exceptions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users from affiliate links to bypass restrictions
                      </p>
                    </div>
                    <Switch
                      id="affiliate-exceptions"
                      checked={affiliateExceptionsEnabled}
                      onCheckedChange={setAffiliateExceptionsEnabled}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced system behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="strict-mode" className="text-base">
                        Strict Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Apply more strict validation to IP addresses
                      </p>
                    </div>
                    <Switch
                      id="strict-mode"
                      checked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="logging" className="text-base">
                        Access Logging
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Log all blocked access attempts
                      </p>
                    </div>
                    <Switch
                      id="logging"
                      checked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vpn-detection" className="text-base">
                        VPN/Proxy Detection
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Attempt to detect and block VPN/Proxy connections
                      </p>
                    </div>
                    <Switch
                      id="vpn-detection"
                      checked={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="import-export">
              <Card>
                <CardHeader>
                  <CardTitle>Import & Export</CardTitle>
                  <CardDescription>
                    Backup and restore your settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Export Settings</CardTitle>
                        <CardDescription>
                          Export all settings to a JSON file
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button onClick={exportSettings} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Import Settings</CardTitle>
                        <CardDescription>
                          Import settings from a JSON file
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Import
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
