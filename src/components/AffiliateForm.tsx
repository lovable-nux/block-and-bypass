
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AffiliateException } from "@/utils/types";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from 'uuid';

interface AffiliateFormProps {
  affiliate?: AffiliateException;
  onSave: (affiliate: AffiliateException) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const AffiliateForm = ({ 
  affiliate, 
  onSave, 
  onCancel,
  onDelete
}: AffiliateFormProps) => {
  const isNew = !affiliate;
  
  const [formData, setFormData] = useState<AffiliateException>({
    id: affiliate?.id || uuidv4(),
    name: affiliate?.name || "",
    utmSource: affiliate?.utmSource || "",
    utmMedium: affiliate?.utmMedium || "",
    utmCampaign: affiliate?.utmCampaign || "",
    referralCode: affiliate?.referralCode || "",
    bypassRestrictions: affiliate?.bypassRestrictions || {
      geoBlocking: true,
      timeRestrictions: true
    },
    enabled: affiliate?.enabled !== undefined ? affiliate.enabled : true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBypassChange = (type: 'geoBlocking' | 'timeRestrictions', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      bypassRestrictions: {
        ...prev.bypassRestrictions,
        [type]: checked
      }
    }));
  };
  
  const handleSave = () => {
    onSave(formData);
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{isNew ? "Add New Affiliate Exception" : "Edit Affiliate Exception"}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Affiliate Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Premium Partner"
            className="w-full"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="utmSource">UTM Source</Label>
            <Input
              id="utmSource"
              name="utmSource"
              value={formData.utmSource}
              onChange={handleChange}
              placeholder="e.g. partner"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="utmMedium">UTM Medium</Label>
            <Input
              id="utmMedium"
              name="utmMedium"
              value={formData.utmMedium}
              onChange={handleChange}
              placeholder="e.g. affiliate"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="utmCampaign">UTM Campaign</Label>
            <Input
              id="utmCampaign"
              name="utmCampaign"
              value={formData.utmCampaign}
              onChange={handleChange}
              placeholder="e.g. summer2023"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code</Label>
            <Input
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="e.g. PARTNER10"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <Label>Bypass Settings</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bypassGeo"
              checked={formData.bypassRestrictions.geoBlocking}
              onCheckedChange={(checked) => 
                handleBypassChange('geoBlocking', checked as boolean)
              }
            />
            <Label htmlFor="bypassGeo" className="font-normal cursor-pointer">
              Bypass country/geo blocking restrictions
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bypassTime"
              checked={formData.bypassRestrictions.timeRestrictions}
              onCheckedChange={(checked) => 
                handleBypassChange('timeRestrictions', checked as boolean)
              }
            />
            <Label htmlFor="bypassTime" className="font-normal cursor-pointer">
              Bypass time-based restrictions
            </Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="enabled"
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
          />
          <Label htmlFor="enabled">Enable this exception</Label>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          {!isNew && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>
            {isNew ? (
              <>
                <Plus size={16} className="mr-2" />
                Add Exception
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AffiliateForm;
