import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSettings, updateTimeRestrictions } from "@/utils/mockApi";
import { GeoBlockingSettings, TimeRestriction } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Clock, Plus, Settings, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import TimeRestrictionForm from "@/components/TimeRestrictionForm";
import { countries } from "@/utils/countries";
import { v4 as uuidv4 } from 'uuid';

const TimeRestrictions = () => {
  const [settings, setSettings] = useState<GeoBlockingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRestriction, setActiveRestriction] = useState<TimeRestriction | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Failed to load time restriction settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  const handleSaveRestriction = async (restriction: TimeRestriction) => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // Check if we're adding a new restriction or updating an existing one
      const updatedRestrictions = isAdding
        ? [...settings.timeRestrictions, restriction]
        : settings.timeRestrictions.map(r => 
            r.id === restriction.id ? restriction : r
          );
      
      const updated = await updateTimeRestrictions(updatedRestrictions);
      setSettings(updated);
      
      toast({
        title: isAdding ? "Restriction added" : "Restriction updated",
        description: isAdding 
          ? "New time-based restriction has been added." 
          : "Time-based restriction has been updated.",
      });
      
      setActiveRestriction(null);
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error saving restriction",
        description: "Failed to save time-based restriction.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteRestriction = async (id: string) => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const updatedRestrictions = settings.timeRestrictions.filter(r => r.id !== id);
      const updated = await updateTimeRestrictions(updatedRestrictions);
      
      setSettings(updated);
      setActiveRestriction(null);
      
      toast({
        title: "Restriction deleted",
        description: "Time-based restriction has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting restriction",
        description: "Failed to delete time-based restriction.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const toggleRestrictionStatus = async (id: string, enabled: boolean) => {
    if (!settings) return;
    
    try {
      const updatedRestrictions = settings.timeRestrictions.map(r => 
        r.id === id ? { ...r, enabled } : r
      );
      
      const updated = await updateTimeRestrictions(updatedRestrictions);
      setSettings(updated);
      
      toast({
        title: enabled ? "Restriction enabled" : "Restriction disabled",
        description: `Time-based restriction has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating restriction",
        description: "Failed to update restriction status.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading time restriction settings...</p>
        </div>
      </div>
    );
  }
  
  const formatDays = (days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[]) => {
    const dayMap: Record<string, string> = {
      mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun"
    };
    
    if (days.length === 7) return "Every day";
    if (days.length === 0) return "No days selected";
    
    // Check for weekdays
    const weekdays = ["mon", "tue", "wed", "thu", "fri"];
    const isWeekdays = weekdays.every(day => days.includes(day as any)) && 
                      days.length === 5 && 
                      !days.includes("sat") && 
                      !days.includes("sun");
    
    if (isWeekdays) return "Weekdays";
    
    // Check for weekend
    const isWeekend = days.length === 2 && days.includes("sat") && days.includes("sun");
    if (isWeekend) return "Weekend";
    
    // Otherwise list the days
    return days.map(d => dayMap[d]).join(", ");
  };
  
  const getCountryName = (countryCode: string) => {
    if (!countryCode) return "No country selected";
    
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Manage access restrictions based on time and days of the week
          </p>
        </div>
        
        {!activeRestriction && (
          <Button onClick={() => {
            setIsAdding(true);
            setActiveRestriction({
              id: uuidv4(),
              country: "",
              startTime: "09:00",
              endTime: "18:00",
              days: ["mon", "tue", "wed", "thu", "fri"],
              timezone: "Europe/Amsterdam",
              enabled: true
            });
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Restriction
          </Button>
        )}
      </div>
      
      {activeRestriction ? (
        <TimeRestrictionForm
          restriction={activeRestriction}
          onSave={handleSaveRestriction}
          onCancel={() => {
            setActiveRestriction(null);
            setIsAdding(false);
          }}
          onDelete={!isAdding ? () => handleDeleteRestriction(activeRestriction.id) : undefined}
        />
      ) : (
        <>
          {settings?.timeRestrictions.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Time Restrictions</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You have not created any time-based restrictions yet. Create a restriction to block access during specific times.
                </p>
                <Button onClick={() => {
                  setIsAdding(true);
                  setActiveRestriction({
                    id: uuidv4(),
                    country: "",
                    startTime: "09:00",
                    endTime: "18:00",
                    days: ["mon", "tue", "wed", "thu", "fri"],
                    timezone: "Europe/Amsterdam",
                    enabled: true
                  });
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Restriction
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note about time-based restrictions</AlertTitle>
                <AlertDescription>
                  Time-based restrictions work alongside country blocking. Users will be denied access based on their location and the current time in the specified timezone.
                </AlertDescription>
              </Alert>
              
              {settings?.timeRestrictions.map((restriction) => (
                <Card key={restriction.id} className="card-hover overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center text-lg">
                          <Clock className="mr-2 h-5 w-5 text-primary" />
                          {restriction.startTime} - {restriction.endTime}
                          <Badge 
                            variant={restriction.enabled ? "default" : "outline"} 
                            className="ml-3"
                          >
                            {restriction.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {formatDays(restriction.days)} • {restriction.timezone}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={restriction.enabled}
                          onCheckedChange={(checked) => toggleRestrictionStatus(restriction.id, checked)}
                          aria-label="Toggle restriction"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveRestriction(restriction)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center mt-2">
                      <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Country: {getCountryName(restriction.country)}
                      </span>
                    </div>
                    <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm">
                      <p className="text-muted-foreground">
                        Access from {getCountryName(restriction.country)} will be blocked between {restriction.startTime} - {restriction.endTime} ({restriction.timezone}) on {formatDays(restriction.days)}.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimeRestrictions;
