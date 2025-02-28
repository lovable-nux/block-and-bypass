
import { GeoBlockingSettings, Country, TimeRestriction, AffiliateException, BlockMessage } from "./types";
import { countries, languages } from "./countries";

// Initial mock data
const initialSettings: GeoBlockingSettings = {
  blockedCountries: countries.map(country => ({ ...country, blocked: false })),
  timeRestrictions: [
    {
      id: "1",
      country: "RU",
      startTime: "09:00",
      endTime: "18:00",
      days: ["mon", "tue", "wed", "thu", "fri"],
      timezone: "Europe/Amsterdam",
      enabled: true
    }
  ],
  affiliateExceptions: [
    {
      id: "1",
      identifiers: [{ value: "PREMIUM001", type: "id" }],
      bypassRestrictions: {
        geoBlocking: true,
        timeRestrictions: true
      },
      enabled: true
    }
  ],
  blockMessages: languages.map(lang => ({
    language: lang.code,
    message: "Access to this service is currently restricted in your region.",
    showContactButton: true,
    showSocialLinks: true
  }))
};

// Simulated local storage key
const STORAGE_KEY = "geo_blocking_settings";

// Helper to get stored settings or initialize with defaults
const getStoredSettings = (): GeoBlockingSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsedSettings = JSON.parse(stored);
      
      // Handle migration from countries array to single country
      if (parsedSettings.timeRestrictions) {
        parsedSettings.timeRestrictions = parsedSettings.timeRestrictions.map((restriction: any) => {
          if (Array.isArray(restriction.countries) && restriction.countries.length > 0) {
            return {
              ...restriction,
              country: restriction.countries[0],
              countries: undefined
            };
          } else if (Array.isArray(restriction.countries) && restriction.countries.length === 0) {
            return {
              ...restriction,
              country: "",
              countries: undefined
            };
          }
          return restriction;
        });
      }

      // Make sure affiliateExceptions is initialized
      if (!parsedSettings.affiliateExceptions) {
        parsedSettings.affiliateExceptions = initialSettings.affiliateExceptions;
      }
      
      return parsedSettings;
    } catch (e) {
      console.error("Failed to parse stored settings", e);
    }
  }
  return initialSettings;
};

// Helper to save settings to storage
const saveSettings = (settings: GeoBlockingSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

// Mock API functions with 300ms delay to simulate network request
export const fetchSettings = (): Promise<GeoBlockingSettings> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(getStoredSettings());
    }, 300);
  });
};

export const updateBlockedCountries = (blockedCountries: Country[]): Promise<GeoBlockingSettings> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const settings = getStoredSettings();
      settings.blockedCountries = blockedCountries;
      saveSettings(settings);
      resolve(settings);
    }, 300);
  });
};

export const updateTimeRestrictions = (timeRestrictions: TimeRestriction[]): Promise<GeoBlockingSettings> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const settings = getStoredSettings();
      settings.timeRestrictions = timeRestrictions;
      saveSettings(settings);
      resolve(settings);
    }, 300);
  });
};

export const updateAffiliateExceptions = (affiliateExceptions: AffiliateException[]): Promise<GeoBlockingSettings> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const settings = getStoredSettings();
      settings.affiliateExceptions = affiliateExceptions;
      saveSettings(settings);
      resolve(settings);
    }, 300);
  });
};

export const updateBlockMessages = (blockMessages: BlockMessage[]): Promise<GeoBlockingSettings> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const settings = getStoredSettings();
      settings.blockMessages = blockMessages;
      saveSettings(settings);
      resolve(settings);
    }, 300);
  });
};

// Export a combined function for updating all settings at once
export const updateAllSettings = (settings: GeoBlockingSettings): Promise<GeoBlockingSettings> => {
  return new Promise(resolve => {
    setTimeout(() => {
      saveSettings(settings);
      resolve(settings);
    }, 300);
  });
};
