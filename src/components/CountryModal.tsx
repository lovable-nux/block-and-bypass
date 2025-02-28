
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Country } from "@/utils/types";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  onSave: (selectedCountries: Country[]) => void;
}

const CountryModal = ({ isOpen, onClose, countries, onSave }: CountryModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);

  // Reset selections when modal opens with current blocked countries
  useEffect(() => {
    if (isOpen) {
      setSelectedCountries(countries.filter(c => c.blocked));
      setFilteredCountries(countries);
      setSearchTerm("");
    }
  }, [isOpen, countries]);

  // Filter countries when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(searchTermLower)
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  // Toggle a country selection
  const toggleCountry = (country: Country) => {
    setSelectedCountries(prev => {
      const isSelected = prev.some(c => c.code === country.code);
      if (isSelected) {
        return prev.filter(c => c.code !== country.code);
      } else {
        return [...prev, { ...country, blocked: true }];
      }
    });
  };

  // Select or deselect all visible countries
  const toggleAll = (select: boolean) => {
    if (select) {
      const newSelection = [...selectedCountries];
      filteredCountries.forEach(country => {
        if (!newSelection.some(c => c.code === country.code)) {
          newSelection.push({ ...country, blocked: true });
        }
      });
      setSelectedCountries(newSelection);
    } else {
      const filteredCodes = new Set(filteredCountries.map(c => c.code));
      setSelectedCountries(prev => prev.filter(c => !filteredCodes.has(c.code)));
    }
  };

  // Handle save
  const handleSave = () => {
    // Update all countries with new blocked status
    const updatedCountries = countries.map(country => ({
      ...country,
      blocked: selectedCountries.some(c => c.code === country.code)
    }));
    onSave(updatedCountries);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Countries to Block</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4 mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search countries..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between py-2 px-1">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all" 
              checked={filteredCountries.length > 0 && filteredCountries.every(country => 
                selectedCountries.some(c => c.code === country.code)
              )}
              onCheckedChange={(checked) => toggleAll(!!checked)}
            />
            <label htmlFor="select-all" className="text-sm cursor-pointer select-none">
              Select All ({filteredCountries.length} countries)
            </label>
          </div>
          <div className="text-sm text-muted-foreground">
            Selected: {selectedCountries.length}/245
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="overflow-y-auto flex-grow -mx-6 px-6">
          <div className="grid grid-cols-3 gap-2 py-2">
            {filteredCountries.map((country) => (
              <div 
                key={country.code}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  selectedCountries.some(c => c.code === country.code) 
                    ? "bg-accent" 
                    : "hover:bg-muted/50"
                )}
              >
                <Checkbox 
                  id={country.code} 
                  checked={selectedCountries.some(c => c.code === country.code)}
                  onCheckedChange={() => toggleCountry(country)}
                />
                <label htmlFor={country.code} className="text-sm cursor-pointer select-none">
                  {country.name}
                </label>
              </div>
            ))}
          </div>
          
          {filteredCountries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>No countries found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CountryModal;
