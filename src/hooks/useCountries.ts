import { useState, useEffect } from 'react';

export interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
        const data = await response.json();
        
        // Filter and sort countries with valid dial codes
        const validCountries = data
          .filter((country: Country) => country.idd?.root && country.idd?.suffixes)
          .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
          
        setCountries(validCountries);
      } catch (err) {
        setError('Failed to fetch countries');
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const getDialCode = (country: Country) => {
    if (!country.idd?.root || !country.idd?.suffixes) return '';
    return country.idd.root + (country.idd.suffixes[0] || '');
  };

  return { countries, loading, error, getDialCode };
};