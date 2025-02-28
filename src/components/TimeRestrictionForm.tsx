
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from 'uuid';

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
  
  const [formData, setFormData] = useState<TimeRestriction>({
    id: restriction?.id || uuidv4(),
    countries: restriction?.countries || [],
    startTime: restriction?.startTime || "09:00",
    endTime: restriction?.endTime || "18:00",
    days: restriction?.days || ["mon", "tue", "wed", "thu", "fri"],
    timezone: restriction?.timezone || "Europe/Amsterdam",
    enabled: restriction?.enabled !== undefined ? restriction.enabled : true
  });
  
  const [countriesOpen, setCountriesOpen] = useState(false);
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
    onSave(formData);
  };
  
  const selectedCountries = countries.filter(country => 
    formData.countries.includes(country.code)
  );
  
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
            <PopoverContent className="w-full p-0 max-h-[300px] overflow-y-auto">
              <Command>
                <CommandInput placeholder="Search timezone..." />
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandGroup>
                  {timezones.map((timezone) => (
                    <CommandItem
                      key={timezone.code}
                      value={timezone.code}
                      onSelect={() => {
                        setFormData({ ...formData, timezone: timezone.code });
                        setTimezonesOpen(false);
                      }}
                      className="flex items-center"
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
        
        <div className="space-y-2">
          <Label>Countries</Label>
          <Popover open={countriesOpen} onOpenChange={setCountriesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countriesOpen}
                className="w-full justify-between"
              >
                {selectedCountries.length > 0 
                  ? `${selectedCountries.length} countries selected` 
                  : "Select countries..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandEmpty>No country found.</CommandEmpty>
                <div className="max-h-[300px] overflow-y-auto">
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => {
                          setFormData(prev => {
                            const newCountries = prev.countries.includes(country.code)
                              ? prev.countries.filter(c => c !== country.code)
                              : [...prev.countries, country.code];
                            return { ...prev, countries: newCountries };
                          });
                        }}
                        className="flex items-center"
                      >
                        <Checkbox 
                          checked={formData.countries.includes(country.code)}
                          className="mr-2 h-4 w-4"
                        />
                        {country.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedCountries.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCountries.slice(0, 5).map((country) => (
                <div
                  key={country.code}
                  className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs"
                >
                  {country.name}
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      countries: prev.countries.filter(c => c !== country.code)
                    }))}
                    className="text-accent-foreground/70 hover:text-accent-foreground"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {selectedCountries.length > 5 && (
                <div className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs">
                  +{selectedCountries.length - 5} more
                </div>
              )}
            </div>
          )}
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
