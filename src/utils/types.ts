
export interface Country {
  code: string;
  name: string;
  blocked: boolean;
}

export interface TimeRestriction {
  id: string;
  country: string;
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  timezone: string;
  enabled: boolean;
}

export interface AffiliateIdentifier {
  value: string;
  type: "id" | "email";
}

export interface AffiliateException {
  id: string;
  identifiers: AffiliateIdentifier[];
  bypassRestrictions: {
    geoBlocking: boolean;
    timeRestrictions: boolean;
  };
  enabled: boolean;
  countries: string[]; // Array of country codes where this exception applies (empty means global)
}

export interface Language {
  code: string;
  name: string;
}

export interface BlockMessage {
  language: string;
  message: string;
  showContactButton: boolean;
  showSocialLinks: boolean;
}

export interface GeoBlockingSettings {
  blockedCountries: Country[];
  timeRestrictions: TimeRestriction[];
  affiliateExceptions: AffiliateException[];
  blockMessages: BlockMessage[];
}
