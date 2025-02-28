
import { useState, useEffect } from "react";
import { fetchSettings, updateAffiliateExceptions } from "@/utils/mockApi";
import { GeoBlockingSettings, AffiliateException } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export const useAffiliateExceptions = () => {
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
        
        // Initialize countries field for each affiliate exception if it doesn't exist
        if (data.affiliateExceptions) {
          data.affiliateExceptions = data.affiliateExceptions.map(affiliate => ({
            ...affiliate,
            countries: affiliate.countries || []
          }));
        }
        
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

  const addNewAffiliate = () => {
    setIsAdding(true);
    setActiveAffiliate({
      id: uuidv4(),
      identifiers: [],
      bypassRestrictions: {
        geoBlocking: true,
        timeRestrictions: true
      },
      enabled: true,
      countries: [] // Empty array means global (all countries)
    });
  };

  return {
    settings,
    loading,
    activeAffiliate,
    isAdding,
    saving,
    handleSaveAffiliate,
    handleDeleteAffiliate,
    toggleAffiliateStatus,
    setActiveAffiliate,
    addNewAffiliate
  };
};
