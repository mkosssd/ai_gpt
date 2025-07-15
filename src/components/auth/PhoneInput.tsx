import { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useCountries, Country } from '@/hooks/useCountries';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onValueChange: (value: string) => void;
  onCountryChange: (countryCode: string, dialCode: string) => void;
  placeholder?: string;
  error?: string;
}

export function PhoneInput({
  value,
  countryCode,
  onValueChange,
  onCountryChange,
  placeholder = "Enter phone number",
  error
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const { countries, loading, getDialCode } = useCountries();

  const selectedCountry = countries.find(c => c.cca2 === countryCode);
  const selectedDialCode = selectedCountry ? getDialCode(selectedCountry) : '';

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-32 justify-between"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                {selectedCountry && (
                  <>
                    <span className="text-sm">{selectedCountry.flag}</span>
                    <span className="text-sm font-mono">{selectedDialCode}</span>
                  </>
                )}
                {!selectedCountry && !loading && (
                  <span className="text-sm text-muted-foreground">Code</span>
                )}
                {loading && (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                )}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Search countries..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => {
                    const dialCode = getDialCode(country);
                    return (
                      <CommandItem
                        key={country.cca2}
                        onSelect={() => {
                          onCountryChange(country.cca2, dialCode);
                          setOpen(false);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <span>{country.flag}</span>
                        <span className="flex-1">{country.name.common}</span>
                        <span className="font-mono text-sm text-muted-foreground">
                          {dialCode}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
            className={cn("pl-10", error && "border-destructive")}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}