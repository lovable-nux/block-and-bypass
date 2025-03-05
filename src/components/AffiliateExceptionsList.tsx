
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AffiliateException } from "@/utils/types";
import { Globe, Clock, Settings, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { countries } from "@/utils/countries";

interface AffiliateExceptionsListProps {
  affiliateExceptions: AffiliateException[];
  onEditAffiliate: (affiliate: AffiliateException) => void;
  onToggleStatus: (id: string, enabled: boolean) => void;
  onAddFirstException: () => void;
}

const AffiliateExceptionsList = ({
  affiliateExceptions,
  onEditAffiliate,
  onToggleStatus,
  onAddFirstException
}: AffiliateExceptionsListProps) => {
  // State to track which affiliates have expanded country lists
  const [expandedCountriesMap, setExpandedCountriesMap] = useState<Record<string, boolean>>({});

  // Toggle expanded state for an affiliate's countries
  const toggleCountriesExpanded = (affiliateId: string) => {
    setExpandedCountriesMap(prev => ({
      ...prev,
      [affiliateId]: !prev[affiliateId]
    }));
  };

  // Get country name from country code
  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };

  // Function to render countries section
  const renderCountriesSection = (affiliate: AffiliateException) => {
    // If no countries are selected, it applies globally
    if (!affiliate.countries || affiliate.countries.length === 0) {
      return (
        <div className="mt-2">
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
            <Globe className="h-3 w-3" />
            Applies globally
          </Badge>
        </div>
      );
    }

    const isExpanded = expandedCountriesMap[affiliate.id];
    const countriesToShow = isExpanded ? affiliate.countries : affiliate.countries.slice(0, 3);
    const hasMore = affiliate.countries.length > 3;

    return (
      <div className="mt-2">
        <div className="text-sm text-muted-foreground mb-1">Applies in:</div>
        <div className="flex flex-wrap gap-1">
          {countriesToShow.map(countryCode => (
            <Badge 
              key={countryCode} 
              variant="outline" 
              className="bg-secondary/10"
            >
              {getCountryName(countryCode)}
            </Badge>
          ))}
          
          {hasMore && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs" 
              onClick={() => toggleCountriesExpanded(affiliate.id)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  +{affiliate.countries.length - 3} more
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (!affiliateExceptions || affiliateExceptions.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Affiliate Exceptions</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You have not created any affiliate exceptions yet. Create an exception to allow specific affiliates to bypass restrictions.
          </p>
          <Button onClick={onAddFirstException}>
            Add Your First Exception
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {affiliateExceptions.map((affiliate) => (
        <Card key={affiliate.id} className="card-hover overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
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
                  <div className="flex flex-wrap gap-1">
                    {affiliate.identifiers && affiliate.identifiers.map((id, index) => (
                      <Badge key={index} variant="outline" className="font-mono">
                        {id.value}
                      </Badge>
                    ))}
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                <Switch
                  checked={affiliate.enabled}
                  onCheckedChange={(checked) => onToggleStatus(affiliate.id, checked)}
                  aria-label="Toggle exception"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditAffiliate(affiliate)}
                  className="whitespace-nowrap"
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
                <Globe className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Bypass geo-blocking: {affiliate.bypassRestrictions.geoBlocking ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Bypass time restrictions: {affiliate.bypassRestrictions.timeRestrictions ? "Yes" : "No"}
                </span>
              </div>
              
              {/* Countries section */}
              {renderCountriesSection(affiliate)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AffiliateExceptionsList;
