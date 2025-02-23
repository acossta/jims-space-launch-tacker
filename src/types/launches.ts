export interface LaunchPad {
  name: string;
  location: {
    name: string;
    country_code: string;
    latitude: number;
    longitude: number;
  };
}

export interface Rocket {
  configuration: {
    id: string;
    name: string;
    family: string;
    full_name: string;
    variant: string;
  };
}

export interface Mission {
  name: string;
  description: string;
  type: string;
}

export interface Launch {
  id: string;
  name: string;
  net: string; // UTC launch time
  window_start: string;
  window_end: string;
  status: {
    name: string;
    description: string;
  };
  pad: LaunchPad;
  rocket: Rocket;
  mission: Mission;
  webcast_live: boolean;
  image: string;
  probability: number | null;
  weather_concerns: string | null;
  vidURLs?: {
    youtube_id?: string;
    twitter_id?: string;
  };
}

export interface LaunchesResponse {
  results: Launch[];
  count: number;
  next: string | null;
  previous: string | null;
}