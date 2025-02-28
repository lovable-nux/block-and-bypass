
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchSettings, updateAffiliateExceptions } from "@/utils/mockApi";
import { GeoBlockingSettings, AffiliateException } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Users, Plus, Settings, Check, X } from "lucide-react";
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
        ? [...settings.affiliateExceptions, affiliate]
        : settings.affiliateExceptions.map(a => 
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
      const updatedAffiliates = settings.affiliateExceptions.filter(a => a.id !== id);
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
      const updatedAffiliates = settings.affiliateExceptions.map(a => 
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
      <div className="min-h-screen flex items-center justify-center">
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
    
    return `${identifiers[0].value} +${identifiers.length - 1} more`;
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 pl-64">
        <Header />
        
        <main className="container px-4 py-6 pt-20 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Affiliate Exceptions</h1>
              <p className="text-muted-foreground mt-1">
                Create exceptions for affiliate traffic to bypass geo and time restrictions
              </p>
            </div>
            
            {!activeAffiliate && (
              <Button onClick={() => {
                setIsAdding(true);
                setActiveAffiliate({
                  id: uuidv4(),
                  identifiers: [],
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
                      You have not created any affiliate exceptions yet. Create an exception to allow traffic from specific affiliate sources.
                    </p>
                    <Button onClick={() => {
                      setIsAdding(true);
                      setActiveAffiliate({
                        id: uuidv4(),
                        identifiers: [],
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
                    <AlertTitle>How affiliate exceptions work</AlertTitle>
                    <AlertDescription>
                      Users accessing your site through affiliate links with the specified IDs or emails will be allowed to register and log in even from blocked countries or during restricted times. This helps ensure your affiliate campaigns run smoothly regardless of geo-blocking rules.
                    </AlertDescription>
                  </Alert>
                  
                  {settings.affiliateExceptions.map((affiliate) => (
                    <Card key={affiliate.id} className="card-hover overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center text-lg">
                              <Users className="mr-2 h-5 w-5 text-primary" />
                              <Badge 
                                variant={affiliate.enabled ? "default" : "outline"} 
                                className="ml-1"
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
                        <div className="flex flex-col space-y-2 mt-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 flex items-center justify-center mr-2">
                              {affiliate.bypassRestrictions.geoBlocking ? (
                                <Check size={18} className="text-green-500" />
                              ) : (
                                <X size={18} className="text-red-500" />
                              )}
                            </div>
                            <span>Bypasses country/geo blocking restrictions</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-6 h-6 flex items-center justify-center mr-2">
                              {affiliate.bypassRestrictions.timeRestrictions ? (
                                <Check size={18} className="text-green-500" />
                              ) : (
                                <X size={18} className="text-red-500" />
                              )}
                            </div>
                            <span>Bypasses time-based restrictions</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm">
                          <p className="text-muted-foreground">
                            Traffic from these identifiers will be allowed to access your site 
                            {affiliate.bypassRestrictions.geoBlocking && affiliate.bypassRestrictions.timeRestrictions 
                              ? " regardless of their location or time of day." 
                              : affiliate.bypassRestrictions.geoBlocking 
                                ? " regardless of their location." 
                                : affiliate.bypassRestrictions.timeRestrictions 
                                  ? " regardless of time of day." 
                                  : "."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AffiliateExceptions;
