
export interface Country {
  code: string;
  name: string;
  blocked: boolean;
}

export interface TimeRestriction {
  id: string;
  countries: string[];
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  timezone: string;
  enabled: boolean;
}

export interface AffiliateException {
  id: string;
  name: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralCode?: string;
  bypassRestrictions: {
    geoBlocking: boolean;
    timeRestrictions: boolean;
  };
  enabled: boolean;
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
