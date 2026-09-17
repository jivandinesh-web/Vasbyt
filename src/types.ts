export type TabType = 'home' | 'provinces' | 'races' | 'clubs' | 'profile' | 'admin';

export type DistanceCode = 'M' | 'H' | 'T' | 'F' | 'U' | 'X' | 'TR' | 'WK' | 'HK' | 'TK' | 'CY';

export type Discipline = 'road' | 'trail' | 'track' | 'walking' | 'trekking' | 'hiking' | 'cycling';

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
  courseType?: 'Point-to-Point' | 'Loop' | 'Out & Back' | 'Stage Run' | 'Stage Race';
  surface?:
    | 'Asphalt Road'
    | 'Mountain Singletrack'
    | 'Jeep Track & Trail'
    | 'Track Oval'
    | 'Paved Footpath & Promenade'
    | 'Mountain Hiking Trail & Rocky Path'
    | 'Wilderness Singletrack & Escarpment';
  waterTablesCount?: number;
  qualifierFor?: string;
  coordinates?: [number, number][]; // [lat, lng] path
  waypoints?: CourseWaypoint[];
  detailedElevation?: DetailedElevationPoint[];
}

export interface MajorRace {
  name: string;
  prov: string;
  city?: string;
  dist: string;
  discipline: Discipline;
  disciplines?: Discipline[];
  since: number;
  when: string;
  blurb: string;
  organiser?: string;
  site?: string;
  route?: RouteProfile;
}

export type RaceStatus =
  | 'scheduled'
  | 'cancelled'
  | 'postponed'
  | 'weather_delay'
  | 'rescheduled'
  | 'sold_out';

export interface Race {
  id?: string;
  name: string;
  prov: string;
  city: string;
  date: string; // ISO YYYY-MM-DD
  dist: DistanceCode[];
  discipline: Discipline;
  disciplines?: Discipline[];
  organiser?: string;
  site?: string;
  route: RouteProfile;
  isCommunity?: boolean;
  createdByUid?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: RaceStatus;
  statusNotice?: string;
  newDate?: string;
  originalName?: string;
  originalDate?: string;
  originalProv?: string;
  series?: string;
  isCorporate?: boolean;
}

export interface CommunityRaceSubmission {
  id?: string;
  name: string;
  prov: string;
  city: string;
  date: string;
  dist: DistanceCode[];
  discipline: Discipline;
  disciplines?: Discipline[];
  organiser?: string;
  site?: string;
  totalAscentM?: number;
  totalDescentM?: number;
  courseType?: 'Loop' | 'Point-to-Point' | 'Out & Back' | 'Stage Run' | 'Stage Race';
  surface?: string;
  cutoffTime?: string;
  waterTablesCount?: number;
  notes?: string;
  status?: RaceStatus;
  statusNotice?: string;
  newDate?: string;
  originalName?: string;
  originalDate?: string;
  originalProv?: string;
  series?: string;
  isCorporate?: boolean;
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
  disciplines?: Discipline[];
  customContact?: ClubContact;
}

export interface UserProfile {
  uid?: string;
  email?: string;
  photoURL?: string;
  name: string;
  province: string;
  club: string;
  licenseNumber?: string;
  category?: string;
  disciplines?: Discipline[];
  pb5k: string;
  pb10k: string;
  pbHalf: string;
  pbFull: string;
  pbUltra?: string;
  goal: string;
  isAdmin?: boolean;
  updatedAt?: string;
}

export interface UserFavorites {
  races: string[];
  clubs: string[];
}

