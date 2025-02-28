
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchSettings, updateBlockedCountries, updateBlockMessages } from "@/utils/mockApi";
import { Country, GeoBlockingSettings, BlockMessage } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { Globe, Info, Upload, FileQuestion } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CountryModal from "@/components/CountryModal";
import RichTextEditor from "@/components/RichTextEditor";
import { languages } from "@/utils/countries";

const CountryBlocking = () => {
  const [settings, setSettings] = useState<GeoBlockingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [blockMessages, setBlockMessages] = useState<BlockMessage[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
        setBlockMessages(data.blockMessages);
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Failed to load country blocking settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  const handleCountrySave = async (updatedCountries: Country[]) => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const updated = await updateBlockedCountries(updatedCountries);
      setSettings(updated);
      
      const blockedCount = updatedCountries.filter(c => c.blocked).length;
      toast({
        title: "Countries updated",
        description: `${blockedCount} countries are now blocked.`,
      });
    } catch (error) {
      toast({
        title: "Error saving countries",
        description: "Failed to update blocked countries.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const updateMessageForLanguage = (lang: string, message: string) => {
    setBlockMessages(prev => 
      prev.map(m => 
        m.language === lang ? { ...m, message } : m
      )
    );
  };
  
  const toggleContactButton = (lang: string, show: boolean) => {
    setBlockMessages(prev => 
      prev.map(m => 
        m.language === lang ? { ...m, showContactButton: show } : m
      )
    );
  };
  
  const toggleSocialLinks = (lang: string, show: boolean) => {
    setBlockMessages(prev => 
      prev.map(m => 
        m.language === lang ? { ...m, showSocialLinks: show } : m
      )
    );
  };
  
  const saveMessages = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const updated = await updateBlockMessages(blockMessages);
      setSettings(updated);
      
      toast({
        title: "Messages updated",
        description: "Block messages have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving messages",
        description: "Failed to update block messages.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading country blocking settings...</p>
        </div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Settings Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            Unable to load country blocking settings.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  const activeMessage = blockMessages.find(m => m.language === activeLanguage);
  const blockedCountriesCount = settings.blockedCountries.filter(c => c.blocked).length;
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 pl-64">
        <Header />
        
        <main className="container px-4 py-6 pt-20 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Country Blocking</h1>
              <p className="text-muted-foreground mt-1">
                Manage access restrictions based on user location
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center text-lg mb-1.5">
                      <Globe className="mr-2 h-5 w-5 text-primary" />
                      Block by country
                    </CardTitle>
                    <CardDescription>
                      Select countries you want to block access from
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Info size={16} className="text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">
                      {blockedCountriesCount} countries blocked
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 min-h-[100px]">
                  {settings.blockedCountries
                    .filter(country => country.blocked)
                    .slice(0, 20)
                    .map(country => (
                      <div
                        key={country.code}
                        className="bg-accent px-3 py-1.5 rounded-md text-sm"
                      >
                        {country.name}
                      </div>
                    ))}
                  
                  {blockedCountriesCount > 20 && (
                    <div className="bg-muted px-3 py-1.5 rounded-md text-sm">
                      +{blockedCountriesCount - 20} more
                    </div>
                  )}
                  
                  {blockedCountriesCount === 0 && (
                    <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                      <p>No countries are currently blocked</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  onClick={() => setShowCountryModal(true)}
                  className="w-full"
                >
                  Select Countries
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg mb-1.5">
                  <Upload className="mr-2 h-5 w-5 text-primary" />
                  Image
                </CardTitle>
                <CardDescription>
                  Upload an image to display on the block page
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-md">
                <Button variant="outline" className="w-full">
                  Upload Image
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6 card-hover">
            <CardHeader>
              <CardTitle>Block Messages</CardTitle>
              <CardDescription>
                Customize the message displayed to blocked users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                <TabsList className="mb-4">
                  {languages.map((lang) => (
                    <TabsTrigger key={lang.code} value={lang.code}>
                      {lang.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {activeMessage && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium mb-2">Text ({activeLanguage})</p>
                      <RichTextEditor 
                        value={activeMessage.message}
                        onChange={(text) => updateMessageForLanguage(activeLanguage, text)}
                        language={activeLanguage}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-contact"
                          checked={activeMessage.showContactButton}
                          onCheckedChange={(checked) => toggleContactButton(activeLanguage, checked)}
                        />
                        <Label htmlFor="show-contact">Show 'Contact Us' button</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-social"
                          checked={activeMessage.showSocialLinks}
                          onCheckedChange={(checked) => toggleSocialLinks(activeLanguage, checked)}
                        />
                        <Label htmlFor="show-social">Show Social networks</Label>
                      </div>
                    </div>
                  </div>
                )}
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={saveMessages} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
      
      <CountryModal
        isOpen={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        countries={settings.blockedCountries}
        onSave={handleCountrySave}
      />
    </div>
  );
};

export default CountryBlocking;
