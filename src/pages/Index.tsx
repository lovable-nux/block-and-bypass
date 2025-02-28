
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchSettings } from "@/utils/mockApi";
import { GeoBlockingSettings } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { Globe, Clock, Users, Shield, Lock, AlarmClock, Zap, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";
import { countries } from "@/utils/countries";

const Dashboard = () => {
  const [settings, setSettings] = useState<GeoBlockingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Failed to load GeoAccess settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Hourglass className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading GeoAccess Manager...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Button asChild>
              <Link to="/country-blocking">
                Manage Country Blocking
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 content-appear">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Globe className="mr-2 h-5 w-5 text-primary" />
                  Country Blocking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {settings?.blockedCountries.filter(c => c.blocked).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Countries blocked out of {countries.length}
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Time Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {settings?.timeRestrictions.filter(t => t.enabled).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Active time-based restrictions
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Affiliate Exceptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {settings?.affiliateExceptions.filter(a => a.enabled).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Active affiliate exceptions
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 content-appear" style={{ animationDelay: "100ms" }}>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="status">System Status</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Access</CardTitle>
                      <CardDescription>
                        Manage your GeoAccess settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="flex items-center p-3 rounded-lg bg-accent">
                        <Globe className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <Link to="/country-blocking" className="font-medium hover:underline">
                            Country Blocking
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Block access based on user's location
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-accent">
                        <AlarmClock className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <Link to="/time-restrictions" className="font-medium hover:underline">
                            Time Restrictions
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Set time-based access rules
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-accent">
                        <Zap className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <Link to="/affiliate-exceptions" className="font-medium hover:underline">
                            Affiliate Exceptions
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Manage affiliate whitelist rules
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>System Information</CardTitle>
                      <CardDescription>
                        Current system status and statistics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertTitle>System Active</AlertTitle>
                        <AlertDescription>
                          GeoAccess blocking is currently active and filtering traffic.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last updated:</span>
                          <span className="font-medium">
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Access requests today:</span>
                          <span className="font-medium">1,248</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Blocked requests today:</span>
                          <span className="font-medium">247</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Affiliate bypasses:</span>
                          <span className="font-medium">36</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>
                      Current operational status of GeoAccess components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                        <div className="flex items-center">
                          <Lock className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">GeoIP Database</p>
                            <p className="text-sm text-muted-foreground">
                              Country detection system
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">Operational</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">Access Control</p>
                            <p className="text-sm text-muted-foreground">
                              Traffic filtering system
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">Operational</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">Time Restriction Engine</p>
                            <p className="text-sm text-muted-foreground">
                              Time-based access control
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">Operational</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">Affiliate System</p>
                            <p className="text-sm text-muted-foreground">
                              Exception handling for affiliates
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">Operational</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
