import { useState, useRef, useMemo } from "react";
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
import { AffiliateException, AffiliateIdentifier } from "@/utils/types";
import { Plus, Trash2, X, Check, ChevronsUpDown, Globe } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { countries } from "@/utils/countries";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<AffiliateException>({
    id: affiliate?.id || uuidv4(),
    identifiers: affiliate?.identifiers || [],
    bypassRestrictions: affiliate?.bypassRestrictions || {
      geoBlocking: true,
      timeRestrictions: true
    },
    enabled: affiliate?.enabled !== undefined ? affiliate.enabled : true,
    countries: affiliate?.countries || []
  });
  
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  
  const validateInput = (value: string): { valid: boolean; type?: "id" | "email" } => {
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return { valid: true, type: "email" };
    }
    
    // Check if it's an ID (alphanumeric, allowing uppercase)
    const idRegex = /^[A-Z0-9]+$/;
    if (idRegex.test(value)) {
      return { valid: true, type: "id" };
    }
    
    return { valid: false };
  };
  
  const addIdentifier = () => {
    if (!inputValue.trim()) {
      return;
    }
    
    const { valid, type } = validateInput(inputValue);
    
    if (!valid) {
      setInputError("Please enter a valid ID (e.g., PARTNER123) or email (e.g., example@domain.com)");
      return;
    }
    
    // Check for duplicates
    const isDuplicate = formData.identifiers.some(id => id.value.toLowerCase() === inputValue.trim().toLowerCase());
    if (isDuplicate) {
      setInputError("This identifier has already been added");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      identifiers: [...prev.identifiers, { value: inputValue.trim(), type: type! }]
    }));
    
    setInputValue("");
    setInputError(null);
    
    // Focus back on input for rapid entry
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const removeIdentifier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      identifiers: prev.identifiers.filter((_, i) => i !== index)
    }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIdentifier();
    }
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
    if (formData.identifiers.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one affiliate ID or email",
        variant: "destructive",
      });
      return;
    }
    
    onSave(formData);
  };

  const handleCountrySelect = (countryCode: string) => {
    // If already selected, remove it, otherwise add it
    if (formData.countries.includes(countryCode)) {
      setFormData(prev => ({
        ...prev, 
        countries: prev.countries.filter(code => code !== countryCode)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        countries: [...prev.countries, countryCode]
      }));
    }
  };

  const toggleAllCountries = () => {
    // If we have countries selected, clear them (global mode)
    // Otherwise, add all countries
    if (formData.countries.length > 0) {
      setFormData(prev => ({
        ...prev,
        countries: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        countries: countries.map(country => country.code)
      }));
    }
  };

  const removeCountry = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      countries: prev.countries.filter(code => code !== countryCode)
    }));
  };

  const selectedCountries = useMemo(() => {
    return formData.countries.map(code => {
      const country = countries.find(c => c.code === code);
      return country ? country.name : code;
    });
  }, [formData.countries]);
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{isNew ? "Add New Affiliate Exception" : "Edit Affiliate Exception"}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="affiliateId">Affiliate ID or Email</Label>
          <div className="flex space-x-2">
            <Input
              id="affiliateId"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Clear error when user starts typing
                if (inputError) setInputError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. PARTNER123 or example@domain.com"
              className="w-full"
            />
            <Button type="button" onClick={addIdentifier} size="sm">
              <Plus size={16} />
            </Button>
          </div>
          {inputError && (
            <p className="text-sm text-destructive mt-1">{inputError}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Enter affiliate ID or email address to identify traffic from this affiliate
          </p>
          
          {formData.identifiers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.identifiers.map((identifier, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-accent/50 border border-accent px-2 py-1 rounded-md text-sm"
                >
                  <span className="font-mono">
                    {identifier.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({identifier.type === "id" ? "ID" : "Email"})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeIdentifier(index)}
                    className="text-muted-foreground hover:text-foreground ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label>Countries Where Exception Applies</Label>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={toggleAllCountries}
                size="sm"
              >
                <Globe size={16} className="mr-2" />
                {formData.countries.length === 0 ? "Global (All Countries)" : "Clear Countries"}
              </Button>
              
              <Popover open={countrySearchOpen} onOpenChange={setCountrySearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countrySearchOpen}
                    size="sm"
                  >
                    Select Countries
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandList className="max-h-[300px]">
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => handleCountrySelect(country.code)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.countries.includes(country.code)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            {formData.countries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This exception applies to all countries (global)
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.countries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.countries.map(countryCode => {
                      const country = countries.find(c => c.code === countryCode);
                      return (
                        <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
                          {country?.name || countryCode}
                          <X 
                            size={14} 
                            className="cursor-pointer opacity-70 hover:opacity-100"
                            onClick={() => removeCountry(countryCode)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
