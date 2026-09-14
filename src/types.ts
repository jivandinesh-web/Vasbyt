export type TabType = 'home' | 'provinces' | 'races' | 'clubs' | 'profile';

export type DistanceCode = 'M' | 'H' | 'T' | 'F' | 'U' | 'X' | 'TR';

export type Discipline = 'road' | 'trail' | 'track';

export interface Province {
  id: string;
  ab: string;
  name: string;
  capital: string;
  blurb: string;
}

export interface ElevationPoint {
  label: string;
  y: number; // 0 to 100
}

export type WaypointType = 'start' | 'finish' | 'water' | 'climb' | 'cutoff' | 'landmark';

export interface CourseWaypoint {
  name: string;
  km: number;
  ele: number; // meters ASL
  lat: number;
  lng: number;
  type: WaypointType;
  cutoffTime?: string;
  notes?: string;
}

export interface DetailedElevationPoint {
  km: number;
  ele: number; // meters ASL
  label?: string;
  grade?: number; // % slope
}

export interface RouteProfile {
  note: string;
  directions: string[];
  points: ElevationPoint[];
  // Rich race profile metrics:
  totalAscentM?: number;
  totalDescentM?: number;
  maxEleM?: number;
  minEleM?: number;
  distanceKm?: number;
  cutoffTime?: string;
  courseType?: 'Point-to-Point' | 'Loop' | 'Out & Back' | 'Stage Run';
  surface?: 'Asphalt Road' | 'Mountain Singletrack' | 'Jeep Track & Trail' | 'Track Oval';
  waterTablesCount?: number;
  qualifierFor?: string;
  coordinates?: [number, number][]; // [lat, lng] path
  waypoints?: CourseWaypoint[];
  detailedElevation?: DetailedElevationPoint[];
}

export interface MajorRace {
  name: string;
  prov: string;
  dist: string;
  discipline: Discipline;
  since: number;
  when: string;
  blurb: string;
  organiser?: string;
  site?: string;
  route?: RouteProfile;
}

export interface Race {
  name: string;
  prov: string;
  city: string;
  date: string; // ISO YYYY-MM-DD
  dist: DistanceCode[];
  discipline: Discipline;
  organiser?: string;
  site?: string;
  route: RouteProfile;
}

export interface ClubContact {
  contactPerson?: string;
  role?: string;
  phoneOrEmail?: string;
  trainingSchedule?: string;
}

export interface Club {
  name: string;
  prov: string;
  city: string;
  founded?: number;
  affiliation?: string;
  blurb: string;
  customContact?: ClubContact;
}

export interface UserProfile {
  name: string;
  province: string;
  club: string;
  pb5k: string;
  pb10k: string;
  pbHalf: string;
  pbFull: string;
  goal: string;
}

export interface UserFavorites {
  races: string[];
  clubs: string[];
}

