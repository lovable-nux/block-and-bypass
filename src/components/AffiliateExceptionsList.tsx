
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AffiliateException } from "@/utils/types";
import { Globe, Clock, Settings, Users } from "lucide-react";

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
                  onCheckedChange={(checked) => onToggleStatus(affiliate.id, checked)}
                  aria-label="Toggle exception"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditAffiliate(affiliate)}
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
  );
};

export default AffiliateExceptionsList;
