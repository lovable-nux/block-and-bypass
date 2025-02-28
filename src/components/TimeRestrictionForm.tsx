
import { useState, useEffect } from "react";
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
import { TimeRestriction } from "@/utils/types";
import { countries, timezones } from "@/utils/countries";
import { Check, ChevronsUpDown, X, Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem,
  CommandList 
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import countryTimezone from 'country-timezone';

interface TimeRestrictionFormProps {
  restriction?: TimeRestriction;
  onSave: (restriction: TimeRestriction) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const TimeRestrictionForm = ({ 
  restriction, 
  onSave, 
  onCancel,
  onDelete
}: TimeRestrictionFormProps) => {
  const isNew = !restriction;
  
  // Initialize with a single country (either from restriction or empty)
  const [formData, setFormData] = useState<TimeRestriction>({
    id: restriction?.id || uuidv4(),
    country: restriction?.country || "",
    startTime: restriction?.startTime || "09:00",
    endTime: restriction?.endTime || "18:00",
    days: restriction?.days || ["mon", "tue", "wed", "thu", "fri"],
    timezone: restriction?.timezone || "Europe/Amsterdam",
    enabled: restriction?.enabled !== undefined ? restriction.enabled : true
  });
  
  const [countryOpen, setCountryOpen] = useState(false);
  const [timezonesOpen, setTimezonesOpen] = useState(false);
  
  const dayOptions = [
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
  ];
  
  // Effect to update timezone based on country selection
  useEffect(() => {
    if (formData.country) {
      // Get timezones for the selected country
      const countryTzs = countryTimezone.getTimezones(formData.country);
      
      // If we have timezones for this country, use the first one
      if (countryTzs && countryTzs.length > 0) {
        // Check if the timezone is in our supported list
        const foundTimezone = timezones.find(tz => tz.code === countryTzs[0]);
        
        if (foundTimezone) {
          setFormData(prev => ({ ...prev, timezone: foundTimezone.code }));
        } else {
          // If not in our supported list, try to find a supported timezone for this region
          // For example, if country timezone is Europe/Moscow but we only support Europe/Amsterdam
          const region = countryTzs[0].split('/')[0];
          const regionTimezone = timezones.find(tz => tz.code.startsWith(`${region}/`));
          
          if (regionTimezone) {
            setFormData(prev => ({ ...prev, timezone: regionTimezone.code }));
          }
          // If no match, keep the current timezone
        }
      }
    }
  }, [formData.country]);
  
  const toggleDay = (day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun") => {
    setFormData(prev => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };
  
  const handleSave = () => {
    // Validate that a country is selected
    if (!formData.country) {
      alert("Please select a country before saving");
      return;
    }
    
    onSave(formData);
  };
  
  // Find the country object for the selected country code
  const selectedCountry = formData.country ? countries.find(c => c.code === formData.country) : null;
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{isNew ? "Add New Restriction" : "Edit Restriction"}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              type="time"
              id="endTime"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Country</Label>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countryOpen}
                className="w-full justify-between"
              >
                {selectedCountry ? selectedCountry.name : "Select a country..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => {
                          setFormData({ ...formData, country: country.code });
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.country === country.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {country.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedCountry && (
            <div className="flex items-center bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-sm w-fit mt-2">
              {selectedCountry.name}
              <button
                onClick={() => setFormData(prev => ({ ...prev, country: "" }))}
                className="ml-2 text-accent-foreground/70 hover:text-accent-foreground"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Popover open={timezonesOpen} onOpenChange={setTimezonesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={timezonesOpen}
                className="w-full justify-between"
              >
                {formData.timezone ? timezones.find(tz => tz.code === formData.timezone)?.name : "Select timezone..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search timezone..." />
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {timezones.map((timezone) => (
                      <CommandItem
                        key={timezone.code}
                        value={timezone.name}
                        onSelect={() => {
                          setFormData({ ...formData, timezone: timezone.code });
                          setTimezonesOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.timezone === timezone.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {timezone.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Days of Week</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {dayOptions.map((day) => (
              <div
                key={day.value}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors",
                  formData.days.includes(day.value as any)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
                onClick={() => toggleDay(day.value as any)}
              >
                {day.label.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
          />
          <Label htmlFor="enabled">Enable this restriction</Label>
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
                Add Restriction
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

export default TimeRestrictionForm;
