
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSettings, updateAffiliateExceptions } from "@/utils/mockApi";
import { GeoBlockingSettings, AffiliateException } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Plus, Settings, Globe, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import AffiliateForm from "@/components/AffiliateForm";
import { v4 as uuidv4 } from 'uuid';

const AffiliateExceptions = () => {
  const [settings, setSettings] = useState<GeoBlockingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAffiliate, setActiveAffiliate] = useState<AffiliateException | null>(null);
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
          description: "Failed to load affiliate exception settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  const handleSaveAffiliate = async (affiliate: AffiliateException) => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // Check if we're adding a new affiliate or updating an existing one
      const updatedAffiliates = isAdding
        ? [...(settings.affiliateExceptions || []), affiliate]
        : (settings.affiliateExceptions || []).map(a => 
            a.id === affiliate.id ? affiliate : a
          );
      
      const updated = await updateAffiliateExceptions(updatedAffiliates);
      setSettings(updated);
      
      toast({
        title: isAdding ? "Exception added" : "Exception updated",
        description: isAdding 
          ? "New affiliate exception has been added." 
          : "Affiliate exception has been updated.",
      });
      
      setActiveAffiliate(null);
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error saving exception",
        description: "Failed to save affiliate exception.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteAffiliate = async (id: string) => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const updatedAffiliates = (settings.affiliateExceptions || []).filter(a => a.id !== id);
      const updated = await updateAffiliateExceptions(updatedAffiliates);
      
      setSettings(updated);
      setActiveAffiliate(null);
      
      toast({
        title: "Exception deleted",
        description: "Affiliate exception has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting exception",
        description: "Failed to delete affiliate exception.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const toggleAffiliateStatus = async (id: string, enabled: boolean) => {
    if (!settings) return;
    
    try {
      const updatedAffiliates = (settings.affiliateExceptions || []).map(a => 
        a.id === id ? { ...a, enabled } : a
      );
      
      const updated = await updateAffiliateExceptions(updatedAffiliates);
      setSettings(updated);
      
      toast({
        title: enabled ? "Exception enabled" : "Exception disabled",
        description: `Affiliate exception has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating exception",
        description: "Failed to update exception status.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading affiliate exception settings...</p>
        </div>
      </div>
    );
  }
  
  const formatIdentifiers = (identifiers: AffiliateException['identifiers']) => {
    if (!identifiers || identifiers.length === 0) return "No identifiers";
    
    if (identifiers.length === 1) {
      return identifiers[0].value;
    }
    
    return `${identifiers[0].value} and ${identifiers.length - 1} more`;
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Create exceptions for specific affiliates to bypass blocking rules
          </p>
        </div>
        
        {!activeAffiliate && (
          <Button onClick={() => {
            setIsAdding(true);
            setActiveAffiliate({
              id: uuidv4(),
              identifiers: [{ value: "", type: "id" }],
              bypassRestrictions: {
                geoBlocking: true,
                timeRestrictions: true
              },
              enabled: true
            });
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Exception
          </Button>
        )}
      </div>
      
      {activeAffiliate ? (
        <AffiliateForm
          affiliate={activeAffiliate}
          onSave={handleSaveAffiliate}
          onCancel={() => {
            setActiveAffiliate(null);
            setIsAdding(false);
          }}
          onDelete={!isAdding ? () => handleDeleteAffiliate(activeAffiliate.id) : undefined}
        />
      ) : (
        <>
          {!settings?.affiliateExceptions || settings.affiliateExceptions.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Affiliate Exceptions</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You have not created any affiliate exceptions yet. Create an exception to allow specific affiliates to bypass restrictions.
                </p>
                <Button onClick={() => {
                  setIsAdding(true);
                  setActiveAffiliate({
                    id: uuidv4(),
                    identifiers: [{ value: "", type: "id" }],
                    bypassRestrictions: {
                      geoBlocking: true,
                      timeRestrictions: true
                    },
                    enabled: true
                  });
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Exception
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>About affiliate exceptions</AlertTitle>
                <AlertDescription>
                  Exceptions allow specific affiliates to bypass the country blocking and time restrictions. They are identified by their affiliate ID or email.
                </AlertDescription>
              </Alert>
              
              {settings.affiliateExceptions.map((affiliate) => (
                <Card key={affiliate.id} className="card-hover overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center text-lg">
                          <Users className="mr-2 h-5 w-5 text-primary" />
                          Affiliate
                          <Badge 
                            variant={affiliate.enabled ? "default" : "outline"} 
                            className="ml-3"
                          >
                            {affiliate.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {affiliate.identifiers && affiliate.identifiers.map((id, index) => (
                            <span key={index} className="mr-1">
                              <Badge variant="outline" className="mr-1 font-mono">
                                {id.value}
                              </Badge>
                            </span>
                          ))}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={affiliate.enabled}
                          onCheckedChange={(checked) => toggleAffiliateStatus(affiliate.id, checked)}
                          aria-label="Toggle exception"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveAffiliate(affiliate)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Bypass geo-blocking: {affiliate.bypassRestrictions.geoBlocking ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Bypass time restrictions: {affiliate.bypassRestrictions.timeRestrictions ? "Yes" : "No"}
                        </span>
                      </div>
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

export default AffiliateExceptions;
