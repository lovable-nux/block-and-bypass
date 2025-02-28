
import { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountryBlocking from "@/pages/CountryBlocking";
import TimeRestrictions from "@/pages/TimeRestrictions";
import AffiliateExceptions from "@/pages/AffiliateExceptions";
import Header from "@/components/Header";
import { Globe, Clock, Users } from "lucide-react";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/").pop() || "";
  
  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 pt-20 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">GeoAccess Manager</h1>
            <p className="text-muted-foreground mt-1">
              Manage access restrictions for your platform
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="country-blocking"
          value={currentPath} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-6 border-b pb-0 rounded-none bg-background">
            <TabsTrigger 
              value="country-blocking"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3"
            >
              <Globe size={18} />
              Country Blocking
            </TabsTrigger>
            <TabsTrigger 
              value="time-restrictions"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3"
            >
              <Clock size={18} />
              Time Restrictions
            </TabsTrigger>
            <TabsTrigger 
              value="affiliate-exceptions"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3"
            >
              <Users size={18} />
              Affiliate Exceptions
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/country-blocking" replace />} />
            <Route path="country-blocking" element={<CountryBlocking />} />
            <Route path="time-restrictions" element={<TimeRestrictions />} />
            <Route path="affiliate-exceptions" element={<AffiliateExceptions />} />
          </Routes>
        </div>
      </main>
      
      <div className="container pb-8">
        <div className="p-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border text-center">
          <p className="text-xs text-sidebar-foreground/80">
            GeoAccess Manager v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
