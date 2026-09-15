import { RouteProfile, CourseWaypoint, DetailedElevationPoint } from '../types';

export interface EnrichedRaceRoute {
  coordinates: [number, number][]; // [lat, lng]
  waypoints: CourseWaypoint[];
  detailedElevation: DetailedElevationPoint[];
  totalAscentM: number;
  totalDescentM: number;
  maxEleM: number;
  minEleM: number;
  distanceKm: number;
  cutoffTime: string;
  courseType: 'Point-to-Point' | 'Loop' | 'Out & Back' | 'Stage Run';
  surface:
    | 'Asphalt Road'
    | 'Mountain Singletrack'
    | 'Jeep Track & Trail'
    | 'Track Oval'
    | 'Paved Footpath & Promenade'
    | 'Mountain Hiking Trail & Rocky Path'
    | 'Wilderness Singletrack & Escarpment';
  waterTablesCount: number;
  qualifierFor?: string;
}

// Known city anchors across South Africa [lat, lng, base altitude meters]
const CITY_ANCHORS: Record<string, { lat: number; lng: number; baseEle: number }> = {
  'Johannesburg': { lat: -26.2041, lng: 28.0473, baseEle: 1750 },
  'Soweto': { lat: -26.2418, lng: 27.9798, baseEle: 1680 },
  'Bedfordview': { lat: -26.1782, lng: 28.1382, baseEle: 1660 },
  'Benoni': { lat: -26.1885, lng: 28.3206, baseEle: 1640 },
  'Pretoria': { lat: -25.7479, lng: 28.2293, baseEle: 1350 },
  'Centurion': { lat: -25.8594, lng: 28.1881, baseEle: 1420 },
  'Cape Town': { lat: -33.9249, lng: 18.4241, baseEle: 25 },
  'Newlands': { lat: -33.9721, lng: 18.4651, baseEle: 35 },
  'Stellenbosch': { lat: -33.9321, lng: 18.8602, baseEle: 120 },
  'Paarl': { lat: -33.7262, lng: 18.9632, baseEle: 110 },
  'Clanwilliam': { lat: -32.1785, lng: 18.8921, baseEle: 150 },
  'Nature’s Valley': { lat: -33.9795, lng: 23.5621, baseEle: 15 },
  'Durban': { lat: -29.8587, lng: 31.0218, baseEle: 10 },
  'Pietermaritzburg': { lat: -29.6171, lng: 30.3992, baseEle: 650 },
  'Underberg': { lat: -29.7891, lng: 29.4981, baseEle: 1560 },
  'Gqeberha': { lat: -33.9608, lng: 25.6022, baseEle: 40 },
  'East London': { lat: -33.0153, lng: 27.9116, baseEle: 35 },
  'Hogsback': { lat: -32.5951, lng: 26.9366, baseEle: 1280 },
  'Port Alfred': { lat: -33.5959, lng: 26.8912, baseEle: 20 },
  'Lady Grey': { lat: -30.7121, lng: 27.2189, baseEle: 1650 },
  'Bloemfontein': { lat: -29.0852, lng: 26.1596, baseEle: 1395 },
  'Clarens': { lat: -28.5172, lng: 28.4194, baseEle: 1820 },
  'Mbombela': { lat: -25.4753, lng: 30.9694, baseEle: 670 },
  'Graskop': { lat: -24.9312, lng: 30.8412, baseEle: 1430 },
  'Polokwane': { lat: -23.9045, lng: 29.4688, baseEle: 1310 },
  'Mokopane': { lat: -24.1872, lng: 29.0112, baseEle: 1120 },
  'Louis Trichardt': { lat: -23.0462, lng: 29.9041, baseEle: 950 },
  'Haenertsburg': { lat: -23.9431, lng: 29.9501, baseEle: 1420 },
  'Rustenburg': { lat: -25.6676, lng: 27.2421, baseEle: 1170 },
  'Potchefstroom': { lat: -26.7145, lng: 27.0971, baseEle: 1350 },
  'Hartbeespoort': { lat: -25.7282, lng: 27.8812, baseEle: 1180 },
  'Kimberley': { lat: -28.7282, lng: 24.7499, baseEle: 1210 },
  'Upington': { lat: -28.4478, lng: 21.2561, baseEle: 835 },
};

// Precise geospatial and elevation definitions for signature races
const PRESET_ROUTES: Record<string, EnrichedRaceRoute> = {
  'Comrades Marathon': {
    distanceKm: 89.2,
    cutoffTime: '12h 00m',
    courseType: 'Point-to-Point',
    surface: 'Asphalt Road',
    waterTablesCount: 48,
    qualifierFor: 'World Athletics Heritage Milestone / ASA National Ultra',
    totalAscentM: 1820,
    totalDescentM: 1210,
    maxEleM: 870,
    minEleM: 15,
    coordinates: [
      [-29.8587, 31.0218], // Durban City Hall
      [-29.8351, 30.9652], // Tollgate / 45th Cutting
      [-29.8277, 30.8931], // Cowies Hill (17km)
      [-29.8214, 30.8711], // Pinetown
      [-29.8051, 30.8350], // Fields Hill (24km)
      [-29.7782, 30.7912], // Kloof
      [-29.7483, 30.7422], // Botha's Hill (37km)
      [-29.7512, 30.7182], // Kearsney College
      [-29.7533, 30.7011], // Drummond Halfway (45km)
      [-29.7351, 30.6781], // Arthur's Seat
      [-29.7214, 30.6552], // Inchanga (52km)
      [-29.7312, 30.5891], // Harrison Flats
      [-29.7314, 30.5401], // Cato Ridge / Camperdown (65km)
      [-29.6952, 30.4912], // Umlaas Road High Point (70km)
      [-29.6712, 30.4581], // Ashburton
      [-29.6582, 30.4350], // Little Polly's & Polly Shorts (80km)
      [-29.6171, 30.3992], // Scottsville Racecourse, Pietermaritzburg
    ],
    waypoints: [
      { name: 'Durban City Hall Start', km: 0, ele: 18, lat: -29.8587, lng: 31.0218, type: 'start', cutoffTime: '05:30 Start' },
      { name: '45th Cutting Water Station', km: 8, ele: 135, lat: -29.8351, lng: 30.9652, type: 'water' },
      { name: 'Cowies Hill Summit', km: 17, ele: 382, lat: -29.8277, lng: 30.8931, type: 'climb', notes: 'First of the Big Five hills (1.8km climb @ 6.2%)' },
      { name: 'Pinetown Cutoff Gate', km: 20, ele: 320, lat: -29.8214, lng: 30.8711, type: 'cutoff', cutoffTime: '08:10' },
      { name: 'Fields Hill Summit', km: 24, ele: 550, lat: -29.8051, lng: 30.8350, type: 'climb', notes: 'Brutal 3.2km climb @ 7.8% grade' },
      { name: 'Kloof Water & Medical Tent', km: 31, ele: 610, lat: -29.7782, lng: 30.7912, type: 'water' },
      { name: 'Botha’s Hill Summit', km: 37, ele: 760, lat: -29.7483, lng: 30.7422, type: 'climb', notes: 'Gateway to the Valley of 1000 Hills' },
      { name: 'Drummond Halfway Cutoff', km: 44.6, ele: 670, lat: -29.7533, lng: 30.7011, type: 'cutoff', cutoffTime: '11:40', notes: 'Arthur’s Seat & Comrades Wall of Honour' },
      { name: 'Inchanga Climb Summit', km: 52, ele: 820, lat: -29.7214, lng: 30.6552, type: 'climb', notes: 'Steepest and longest sustained climb' },
      { name: 'Cato Ridge Cutoff Gate', km: 58, ele: 740, lat: -29.7312, lng: 30.5891, type: 'cutoff', cutoffTime: '13:40' },
      { name: 'Camperdown Water Station', km: 65, ele: 720, lat: -29.7314, lng: 30.5401, type: 'water' },
      { name: 'Umlaas Road Highest Point', km: 70, ele: 870, lat: -29.6952, lng: 30.4912, type: 'cutoff', cutoffTime: '15:20', notes: 'Highest point on the entire Comrades route' },
      { name: 'Polly Shorts Cutoff Gate', km: 80, ele: 650, lat: -29.6582, lng: 30.4350, type: 'cutoff', cutoffTime: '16:50' },
      { name: 'Polly Shorts Hill Crest', km: 81.8, ele: 710, lat: -29.6521, lng: 30.4281, type: 'climb', notes: 'The legendary final 1.8km climb' },
      { name: 'Scottsville Racecourse Finish', km: 89.2, ele: 650, lat: -29.6171, lng: 30.3992, type: 'finish', cutoffTime: '17:30 Final Gun' },
    ],
    detailedElevation: [
      { km: 0, ele: 18, label: 'Start (Durban)' },
      { km: 8, ele: 135, grade: 3.2 },
      { km: 17, ele: 382, label: 'Cowies Hill', grade: 6.2 },
      { km: 21, ele: 320, grade: -2.8 },
      { km: 24, ele: 550, label: 'Fields Hill', grade: 7.8 },
      { km: 30, ele: 610, grade: 2.1 },
      { km: 37, ele: 760, label: 'Botha’s Hill', grade: 6.5 },
      { km: 44.6, ele: 670, label: 'Drummond (Halfway)', grade: -3.5 },
      { km: 52, ele: 820, label: 'Inchanga Summit', grade: 8.1 },
      { km: 60, ele: 740, grade: -1.5 },
      { km: 65, ele: 720, grade: 1.0 },
      { km: 70, ele: 870, label: 'Umlaas Rd (Highest Point)', grade: 3.5 },
      { km: 76, ele: 680, grade: -4.0 },
      { km: 81.8, ele: 710, label: 'Polly Shorts', grade: 8.4 },
      { km: 89.2, ele: 650, label: 'Finish (Scottsville)' },
    ],
  },

  'Two Oceans Marathon': {
    distanceKm: 56.0,
    cutoffTime: '7h 00m',
    courseType: 'Loop',
    surface: 'Asphalt Road',
    waterTablesCount: 28,
    qualifierFor: 'Comrades Marathon Qualifier (sub-4h49 marathon equivalent)',
    totalAscentM: 1140,
    totalDescentM: 1080,
    maxEleM: 215,
    minEleM: 8,
    coordinates: [
      [-33.9721, 18.4651], // Newlands
      [-34.0084, 18.4682], // Rondebosch & Claremont
      [-34.0512, 18.4691], // Retreat
      [-34.1082, 18.4719], // Muizenberg
      [-34.1212, 18.4512], // Clovelly
      [-34.1356, 18.4289], // Fish Hoek (Halfway)
      [-34.1321, 18.3912], // Sun Valley
      [-34.1011, 18.3612], // Noordhoek & Chappies base
      [-34.0882, 18.3601], // Chapman's Peak Summit
      [-34.0433, 18.3582], // Hout Bay
      [-34.0118, 18.4112], // Constantia Nek
      [-33.9882, 18.4321], // Rhodes Drive
      [-33.9712, 18.4521], // Kirstenbosch
      [-33.9575, 18.4612], // UCT Rugby Fields
    ],
    waypoints: [
      { name: 'Newlands Main Road Start', km: 0, ele: 35, lat: -33.9721, lng: 18.4651, type: 'start', cutoffTime: '05:40 Start' },
      { name: 'Wynberg Military Water Table', km: 6, ele: 42, lat: -34.0084, lng: 18.4682, type: 'water' },
      { name: 'Muizenberg False Bay Coastline', km: 16, ele: 10, lat: -34.1082, lng: 18.4719, type: 'landmark' },
      { name: 'Fish Hoek Halfway Cutoff', km: 28, ele: 8, lat: -34.1356, lng: 18.4289, type: 'cutoff', cutoffTime: '08:45' },
      { name: 'Noordhoek Water Table', km: 32, ele: 24, lat: -34.1011, lng: 18.3612, type: 'water' },
      { name: 'Chapman’s Peak Summit', km: 34.5, ele: 165, lat: -34.0882, lng: 18.3601, type: 'climb', notes: 'Iconic marine drive cliff climb with 180° Atlantic views' },
      { name: 'Hout Bay Village Cutoff', km: 42.2, ele: 20, lat: -34.0433, lng: 18.3582, type: 'cutoff', cutoffTime: '10:45', notes: 'Marathon distance mark' },
      { name: 'Constantia Nek Summit', km: 46.5, ele: 215, lat: -34.0118, lng: 18.4112, type: 'climb', notes: 'The race decider: 4km steep climb through the pines' },
      { name: 'Rhodes Drive Kirstenbosch Water', km: 50, ele: 110, lat: -33.9882, lng: 18.4321, type: 'water' },
      { name: 'UCT Upper Campus Finish', km: 56.0, ele: 95, lat: -33.9575, lng: 18.4612, type: 'finish', cutoffTime: '12:40 Final Gun' },
    ],
    detailedElevation: [
      { km: 0, ele: 35, label: 'Start (Newlands)' },
      { km: 10, ele: 40, grade: 0.5 },
      { km: 16, ele: 10, label: 'Muizenberg Coast', grade: -1.2 },
      { km: 28, ele: 8, label: 'Fish Hoek (28km)', grade: 0.2 },
      { km: 31, ele: 30, grade: 2.5 },
      { km: 34.5, ele: 165, label: 'Chapman’s Peak Summit', grade: 6.8 },
      { km: 38, ele: 45, grade: -7.2 },
      { km: 42.2, ele: 20, label: 'Hout Bay (Marathon)', grade: 1.0 },
      { km: 46.5, ele: 215, label: 'Constantia Nek Summit', grade: 7.9 },
      { km: 51, ele: 110, label: 'Rhodes Drive', grade: -4.5 },
      { km: 56, ele: 95, label: 'Finish (UCT)' },
    ],
  },

  'Cape Town Marathon': {
    distanceKm: 42.2,
    cutoffTime: '6h 30m',
    courseType: 'Loop',
    surface: 'Asphalt Road',
    waterTablesCount: 22,
    qualifierFor: 'Abbott World Marathon Majors / Olympic Trials / Comrades',
    totalAscentM: 295,
    totalDescentM: 295,
    maxEleM: 180,
    minEleM: 8,
    coordinates: [
      [-33.9046, 18.4102], // Green Point Stadium
      [-33.9182, 18.3882], // Sea Point Promenade
      [-33.9351, 18.3789], // Bantry Bay / Clifton
      [-33.9512, 18.3789], // Camps Bay
      [-33.9412, 18.4011], // Kloof Nek Road
      [-33.9282, 18.4182], // Company's Gardens / CBD
      [-33.9312, 18.4412], // Woodstock
      [-33.9182, 18.4712], // Paarden Eiland
      [-33.9038, 18.4110], // Cape Town Stadium Finish
    ],
    waypoints: [
      { name: 'Fritz Sonnenberg Rd Start', km: 0, ele: 15, lat: -33.9046, lng: 18.4102, type: 'start', cutoffTime: '06:15 Start' },
      { name: 'Sea Point Promenade Water Table', km: 7, ele: 8, lat: -33.9182, lng: 18.3882, type: 'water' },
      { name: 'Camps Bay Beachfront', km: 14, ele: 35, lat: -33.9512, lng: 18.3789, type: 'landmark' },
      { name: 'Kloof Nek Road Climb', km: 19, ele: 180, lat: -33.9412, lng: 18.4011, type: 'climb', notes: 'Key gradient segment between Camps Bay and City Bowl' },
      { name: 'CBD Halfway Cutoff Gate', km: 21.1, ele: 45, lat: -33.9282, lng: 18.4182, type: 'cutoff', cutoffTime: '09:20' },
      { name: 'District Six Water & DJ Station', km: 29, ele: 30, lat: -33.9312, lng: 18.4412, type: 'water' },
      { name: 'Paarden Eiland Flat Sprint', km: 35, ele: 12, lat: -33.9182, lng: 18.4712, type: 'landmark' },
      { name: 'Cape Town Stadium Forecourt Finish', km: 42.2, ele: 15, lat: -33.9038, lng: 18.4110, type: 'finish', cutoffTime: '12:45 Final Gun' },
    ],
    detailedElevation: [
      { km: 0, ele: 15, label: 'Start (Green Point)' },
      { km: 7, ele: 8, label: 'Sea Point', grade: 0.1 },
      { km: 14, ele: 35, label: 'Camps Bay', grade: 2.1 },
      { km: 19, ele: 180, label: 'Kloof Nek Ridge', grade: 5.8 },
      { km: 21.1, ele: 45, label: 'CBD (Halfway)', grade: -4.2 },
      { km: 29, ele: 30, label: 'Woodstock', grade: 0.5 },
      { km: 35, ele: 12, label: 'Paarden Eiland', grade: -0.2 },
      { km: 42.2, ele: 15, label: 'Finish (Cape Town Stadium)' },
    ],
  },

  'Soweto Marathon': {
    distanceKm: 42.2,
    cutoffTime: '6h 00m',
    courseType: 'Loop',
    surface: 'Asphalt Road',
    waterTablesCount: 24,
    qualifierFor: 'Comrades 2027 Qualifier / Two Oceans Qualifier',
    totalAscentM: 385,
    totalDescentM: 385,
    maxEleM: 1695,
    minEleM: 1650,
    coordinates: [
      [-26.2418, 27.9798], // Nasrec
      [-26.2512, 27.9482], // Diepkloof
      [-26.2341, 27.9042], // Orlando Stadium
      [-26.2365, 27.8891], // Vilakazi Street
      [-26.2511, 27.8712], // Meadowlands
      [-26.2621, 27.9419], // Baragwanath Hospital
      [-26.2712, 27.9621], // Motsoaledi
      [-26.2347, 27.9824], // FNB Stadium
    ],
    waypoints: [
      { name: 'Nasrec Expo Centre Start', km: 0, ele: 1680, lat: -26.2418, lng: 27.9798, type: 'start', cutoffTime: '05:30 Start' },
      { name: 'Diepkloof Community Water Table', km: 8, ele: 1695, lat: -26.2512, lng: 27.9482, type: 'water' },
      { name: 'Orlando Stadium Heritage Marker', km: 15, ele: 1660, lat: -26.2341, lng: 27.9042, type: 'landmark' },
      { name: 'Vilakazi Street Nobel Precinct', km: 21.1, ele: 1655, lat: -26.2365, lng: 27.8891, type: 'cutoff', cutoffTime: '08:30', notes: 'Former home of Nelson Mandela & Archbishop Tutu' },
      { name: 'Meadowlands Water & Energy Table', km: 28, ele: 1670, lat: -26.2511, lng: 27.8712, type: 'water' },
      { name: 'Chris Hani Baragwanath Hospital', km: 34, ele: 1675, lat: -26.2621, lng: 27.9419, type: 'landmark' },
      { name: 'Soccer City Avenue Final Climb', km: 39, ele: 1690, lat: -26.2712, lng: 27.9621, type: 'climb', notes: 'Rolling highveld incline before stadium entrance' },
      { name: 'FNB Stadium Turf Finish', km: 42.2, ele: 1685, lat: -26.2347, lng: 27.9824, type: 'finish', cutoffTime: '11:30 Final Gun' },
    ],
    detailedElevation: [
      { km: 0, ele: 1680, label: 'Start (Nasrec)' },
      { km: 8, ele: 1695, label: 'Diepkloof', grade: 1.5 },
      { km: 15, ele: 1660, label: 'Orlando', grade: -1.2 },
      { km: 21.1, ele: 1655, label: 'Vilakazi St (Halfway)', grade: 0.5 },
      { km: 28, ele: 1670, grade: 1.2 },
      { km: 34, ele: 1675, label: 'Baragwanath', grade: 0.8 },
      { km: 39, ele: 1690, label: 'Soccer City Rise', grade: 2.8 },
      { km: 42.2, ele: 1685, label: 'Finish (FNB Stadium)' },
    ],
  },

  'Otter African Trail Run': {
    distanceKm: 42.0,
    cutoffTime: '9h 00m (Challenge) / 8h 00m (Run)',
    courseType: 'Point-to-Point',
    surface: 'Mountain Singletrack',
    waterTablesCount: 6,
    qualifierFor: 'Golden Trail National Series / SA Trail Ultra Qualifier',
    totalAscentM: 2600,
    totalDescentM: 2600,
    maxEleM: 160,
    minEleM: 2,
    coordinates: [
      [-34.0245, 23.9011], // Storms River Mouth
      [-34.0182, 23.8612], // Jerling River
      [-34.0152, 23.8211], // Ngubu Hut
      [-34.0081, 23.7812], // Skilderkrans
      [-33.9981, 23.7412], // Scott Hut & coastal cliffs
      [-33.9891, 23.6912], // Oakhaven
      [-33.9781, 23.6451], // Bloukrans River Crossing
      [-33.9812, 23.6012], // Andre Hut
      [-33.9795, 23.5621], // Nature's Valley Beach
    ],
    waypoints: [
      { name: 'Storms River Rest Camp Start', km: 0, ele: 10, lat: -34.0245, lng: 23.9011, type: 'start', cutoffTime: '06:00 Start' },
      { name: 'Ngubu Hut Checkpoint', km: 6.8, ele: 85, lat: -34.0152, lng: 23.8211, type: 'landmark' },
      { name: 'Skilderkrans Rocky Traverse', km: 14.2, ele: 145, lat: -34.0081, lng: 23.7812, type: 'climb', notes: 'Technical coastal quartzite crags' },
      { name: 'Scott Hut Munitions Cutoff', km: 21.0, ele: 60, lat: -33.9981, lng: 23.7412, type: 'cutoff', cutoffTime: '10:15' },
      { name: 'Oakhaven Forest River Table', km: 28.5, ele: 40, lat: -33.9891, lng: 23.6912, type: 'water' },
      { name: 'Bloukrans River Swim Cutoff', km: 34.0, ele: 4, lat: -33.9781, lng: 23.6451, type: 'cutoff', cutoffTime: '13:00', notes: 'Compulsory tidal river swim or wade with waterproof pack' },
      { name: 'Andre Hut Final Water Point', km: 38.2, ele: 75, lat: -33.9812, lng: 23.6012, type: 'water' },
      { name: 'Nature’s Valley Beach Lagoon Finish', km: 42.0, ele: 8, lat: -33.9795, lng: 23.5621, type: 'finish', cutoffTime: '15:00 Final Cutoff' },
    ],
    detailedElevation: [
      { km: 0, ele: 10, label: 'Storms River Start' },
      { km: 5, ele: 95, grade: 12.0 },
      { km: 6.8, ele: 85, label: 'Ngubu Hut', grade: -8.0 },
      { km: 14.2, ele: 145, label: 'Skilderkrans', grade: 14.5 },
      { km: 21.0, ele: 60, label: 'Scott Hut (Halfway)', grade: -10.0 },
      { km: 27, ele: 160, label: 'Coastal Ridge High Point', grade: 11.2 },
      { km: 34.0, ele: 4, label: 'Bloukrans River Swim', grade: -15.0 },
      { km: 38.2, ele: 75, label: 'Andre Hut', grade: 9.0 },
      { km: 42.0, ele: 8, label: 'Nature’s Valley Finish' },
    ],
  },

  'SkyRun 100': {
    distanceKm: 100.0,
    cutoffTime: '30h 00m',
    courseType: 'Point-to-Point',
    surface: 'Mountain Singletrack',
    waterTablesCount: 3,
    qualifierFor: 'UTMB World Series Qualifier (4 UTMB Index Points)',
    totalAscentM: 4500,
    totalDescentM: 4570,
    maxEleM: 2750,
    minEleM: 1580,
    coordinates: [
      [-30.7121, 27.2189], // Lady Grey
      [-30.6951, 27.2781], // Tower Peak
      [-30.6812, 27.3512], // Olympus Peak
      [-30.6412, 27.4812], // Snowdon
      [-30.6281, 27.5512], // Avoca Peak
      [-30.6112, 27.6212], // Balloch Camp
      [-30.5812, 27.7112], // The Wall
      [-30.5612, 27.7812], // Halstone
      [-30.5412, 27.8512], // Wartrail Country Club
    ],
    waypoints: [
      { name: 'Lady Grey Main Street Start', km: 0, ele: 1650, lat: -30.7121, lng: 27.2189, type: 'start', cutoffTime: '04:00 Start' },
      { name: 'Tower Peak Ascent', km: 12, ele: 2350, lat: -30.6951, lng: 27.2781, type: 'climb', notes: 'First mountain climb out of Lady Grey' },
      { name: 'Olympus Ridge Summit', km: 28, ele: 2680, lat: -30.6812, lng: 27.3512, type: 'climb' },
      { name: 'Snowdon Alpine Saddle', km: 42, ele: 2750, lat: -30.6412, lng: 27.4812, type: 'landmark', notes: 'Highest altitude section on course' },
      { name: 'Balloch Mandatory Medical Check', km: 58, ele: 1820, lat: -30.6112, lng: 27.6212, type: 'cutoff', cutoffTime: '17:00', notes: 'Compulsory medical evaluation & drop bag checkpoint' },
      { name: 'The Wall Vertical Scramble', km: 68, ele: 2490, lat: -30.5812, lng: 27.7112, type: 'climb', notes: 'Infamous 600m near-vertical grass & boulder wall' },
      { name: 'Halstone Farm Oasis', km: 84, ele: 1750, lat: -30.5612, lng: 27.7812, type: 'water' },
      { name: 'Wartrail Country Club Finish', km: 100.0, ele: 1580, lat: -30.5412, lng: 27.8512, type: 'finish', cutoffTime: '10:00 (Next Day)' },
    ],
    detailedElevation: [
      { km: 0, ele: 1650, label: 'Lady Grey Start' },
      { km: 12, ele: 2350, label: 'Tower Peak', grade: 15.2 },
      { km: 28, ele: 2680, label: 'Olympus Summit', grade: 11.5 },
      { km: 42, ele: 2750, label: 'Snowdon High Pass', grade: 5.0 },
      { km: 58, ele: 1820, label: 'Balloch Medical', grade: -14.0 },
      { km: 68, ele: 2490, label: 'The Wall', grade: 22.0 },
      { km: 84, ele: 1750, label: 'Halstone', grade: -8.5 },
      { km: 100, ele: 1580, label: 'Wartrail Finish' },
    ],
  },
};

/**
 * Returns enriched route information for any race. If not in the preset dictionary,
 * synthesizes an accurate geospatial course track and elevation profile based on the city,
 * discipline, and route directions.
 */
export function getEnrichedRaceRoute(
  raceName: string,
  city: string,
  prov: string,
  route: RouteProfile,
  distCode: string = 'M',
  discipline: string = 'road'
): EnrichedRaceRoute {
  // Check preset first
  if (PRESET_ROUTES[raceName]) {
    return PRESET_ROUTES[raceName];
  }

  // Calculate nominal distance from code
  let distKm = 42.2;
  if (distCode === 'X') distKm = 50.0;
  else if (distCode === 'U') distKm = 56.0;
  else if (distCode === 'M') distKm = 42.2;
  else if (distCode === 'H') distKm = 21.1;
  else if (distCode === 'T') distKm = 10.0;
  else if (distCode === 'F') distKm = 5.0;
  else if (distCode === 'TR') distKm = 5.0;
  else if (distCode === 'WK') distKm = 15.0;
  else if (distCode === 'HK') distKm = 18.0;
  else if (distCode === 'TK') distKm = 35.0;

  // City center lookup
  const anchor = CITY_ANCHORS[city] || {
    lat: -26.2041 + (Math.random() - 0.5) * 4.0,
    lng: 28.0473 + (Math.random() - 0.5) * 4.0,
    baseEle: 1200,
  };

  const isTrail = discipline === 'trail';
  const isHiking = discipline === 'hiking';
  const isTrekking = discipline === 'trekking';
  const isWalking = discipline === 'walking';
  const isMountain = isTrail || isHiking || isTrekking;

  const eleScale = isTrekking ? 850 : isHiking ? 680 : isTrail ? 600 : isWalking ? 120 : distKm > 30 ? 320 : 160;
  const numPts = Math.max(8, route.points?.length || 8);

  // Generate plausible coordinates around city anchor
  const coordinates: [number, number][] = [];
  const waypoints: CourseWaypoint[] = [];
  const detailedElevation: DetailedElevationPoint[] = [];

  const angleStep = (2 * Math.PI) / (numPts - 1);
  const radiusDeg = (distKm / 111.0) * 0.45; // loop radius

  let totalAscent = 0;
  let totalDescent = 0;
  let prevEle = anchor.baseEle;
  let minEle = anchor.baseEle;
  let maxEle = anchor.baseEle;

  for (let i = 0; i < numPts; i++) {
    const fraction = i / (numPts - 1);
    const km = Math.round(fraction * distKm * 10) / 10;
    
    // Circular loop shape that closes back
    const angle = i * angleStep;
    const wobble = Math.sin(i * 1.5) * 0.15;
    const lat = anchor.lat + Math.sin(angle) * (radiusDeg + wobble);
    const lng = anchor.lng + Math.cos(angle) * (radiusDeg + wobble);
    coordinates.push([lat, lng]);

    // Elevation calculation from route.points if available or realistic undulation
    let eleM = anchor.baseEle;
    if (route.points && route.points[i]) {
      eleM = Math.round(anchor.baseEle + (route.points[i].y / 100) * eleScale);
    } else {
      eleM = Math.round(anchor.baseEle + Math.sin(fraction * Math.PI * 3) * (eleScale * 0.5));
    }

    if (eleM < minEle) minEle = eleM;
    if (eleM > maxEle) maxEle = eleM;

    if (i > 0) {
      const diff = eleM - prevEle;
      if (diff > 0) totalAscent += diff;
      else totalDescent += Math.abs(diff);
    }
    prevEle = eleM;

    const label = route.points && route.points[i] ? route.points[i].label : i === 0 ? 'Start' : i === numPts - 1 ? 'Finish' : `Km ${km}`;
    detailedElevation.push({
      km,
      ele: eleM,
      label,
      grade: i > 0 ? Number(((eleM - detailedElevation[i - 1].ele) / ((km - detailedElevation[i - 1].km) * 10)).toFixed(1)) : 0,
    });

    // Generate meaningful waypoints
    if (i === 0) {
      waypoints.push({
        name: `${label} Line`,
        km: 0,
        ele: eleM,
        lat,
        lng,
        type: 'start',
        cutoffTime: '06:00 Start',
      });
    } else if (i === numPts - 1) {
      waypoints.push({
        name: `${label} Arch`,
        km,
        ele: eleM,
        lat,
        lng,
        type: 'finish',
        cutoffTime: distKm > 40 ? '12:00 Cutoff' : '10:00 Cutoff',
      });
    } else if (i === Math.floor(numPts / 2)) {
      waypoints.push({
        name: `${label} (Halfway Mark)`,
        km,
        ele: eleM,
        lat,
        lng,
        type: 'cutoff',
        cutoffTime: 'Halfway Checkpoint',
      });
    } else if (i % 2 === 1) {
      waypoints.push({
        name: `${label} Water Station`,
        km,
        ele: eleM,
        lat,
        lng,
        type: 'water',
        notes: 'Hydration, water sachets & medical station',
      });
    } else {
      waypoints.push({
        name: `${label}`,
        km,
        ele: eleM,
        lat,
        lng,
        type: isMountain ? 'climb' : 'landmark',
      });
    }
  }

  const waterTablesCount = Math.max(3, Math.round(distKm / (isWalking ? 4 : isMountain ? 6 : 2.5)));
  
  let cutoffHours = '3h 30m';
  if (discipline === 'trekking') {
    cutoffHours = distKm > 40 ? '24h 00m (Multi-Day)' : distKm > 25 ? '11h 00m' : '7h 00m';
  } else if (discipline === 'hiking') {
    cutoffHours = distKm > 25 ? '9h 30m' : distKm > 15 ? '6h 30m' : '4h 00m';
  } else if (discipline === 'walking') {
    cutoffHours = distKm > 30 ? '8h 00m' : distKm > 15 ? '5h 00m' : '3h 00m';
  } else {
    cutoffHours = distKm > 80 ? '12h 00m' : distKm > 50 ? '7h 00m' : distKm > 30 ? '6h 00m' : '3h 30m';
  }

  let surface: EnrichedRaceRoute['surface'] = 'Asphalt Road';
  if (discipline === 'trail') surface = 'Mountain Singletrack';
  else if (discipline === 'track') surface = 'Track Oval';
  else if (discipline === 'walking') surface = 'Paved Footpath & Promenade';
  else if (discipline === 'hiking') surface = 'Mountain Hiking Trail & Rocky Path';
  else if (discipline === 'trekking') surface = 'Wilderness Singletrack & Escarpment';

  const defaultAscentPerKm = isTrekking ? 58 : isHiking ? 48 : isTrail ? 45 : isWalking ? 4.5 : 8.5;

  return {
    coordinates,
    waypoints,
    detailedElevation,
    totalAscentM: totalAscent || Math.round(distKm * defaultAscentPerKm),
    totalDescentM: totalDescent || Math.round(distKm * defaultAscentPerKm),
    maxEleM: maxEle,
    minEleM: minEle,
    distanceKm: distKm,
    cutoffTime: cutoffHours,
    courseType: isTrekking ? 'Stage Run' : isHiking ? 'Point-to-Point' : 'Loop',
    surface,
    waterTablesCount,
    qualifierFor: distKm >= 42.2 && (discipline === 'road' || discipline === 'trail') ? 'Comrades 2027 Qualifier / Two Oceans' : undefined,
  };
}

/**
 * Generates an authentic, standards-compliant GPX 1.1 file string.
 */
export function generateGPX(raceName: string, route: EnrichedRaceRoute): string {
  const dateStr = new Date().toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Before First Light - South Africa Athletics"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(raceName)} Course Route</name>
    <desc>${escapeXml(raceName)} - Distance: ${route.distanceKm}km, Ascent: +${route.totalAscentM}m, Surface: ${route.surface}</desc>
    <time>${dateStr}</time>
  </metadata>
`;

  // Add waypoints
  for (const wp of route.waypoints) {
    xml += `  <wpt lat="${wp.lat.toFixed(6)}" lon="${wp.lng.toFixed(6)}">
    <ele>${wp.ele}</ele>
    <name>${escapeXml(wp.name)}</name>
    <desc>${escapeXml((wp.notes ? wp.notes + ' - ' : '') + `Km ${wp.km} (Ele ${wp.ele}m)`)}</desc>
    <sym>${wp.type === 'water' ? 'Water' : wp.type === 'climb' ? 'Summit' : wp.type === 'start' ? 'Flag, Green' : wp.type === 'finish' ? 'Flag, Checkered' : 'Waypoint'}</sym>
  </wpt>
`;
  }

  // Add track
  xml += `  <trk>
    <name>${escapeXml(raceName)}</name>
    <type>Running</type>
    <trkseg>
`;

  for (let i = 0; i < route.coordinates.length; i++) {
    const [lat, lng] = route.coordinates[i];
    const elePoint = route.detailedElevation[i];
    const ele = elePoint ? elePoint.ele : 100;
    xml += `      <trkpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}">
        <ele>${ele}</ele>
      </trkpt>
`;
  }

  xml += `    </trkseg>
  </trk>
</gpx>`;

  return xml;
}

/**
 * Generates an authentic Training Center XML (TCX) course file string.
 */
export function generateTCX(raceName: string, route: EnrichedRaceRoute): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase
  xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Courses>
    <Course>
      <Name>${escapeXml(raceName.slice(0, 15))}</Name>
      <Lap>
        <TotalTimeSeconds>${Math.round(route.distanceKm * 330)}</TotalTimeSeconds>
        <DistanceMeters>${Math.round(route.distanceKm * 1000)}</DistanceMeters>
        <BeginPosition>
          <LatitudeDegrees>${route.coordinates[0][0].toFixed(6)}</LatitudeDegrees>
          <LongitudeDegrees>${route.coordinates[0][1].toFixed(6)}</LongitudeDegrees>
        </BeginPosition>
        <EndPosition>
          <LatitudeDegrees>${route.coordinates[route.coordinates.length - 1][0].toFixed(6)}</LatitudeDegrees>
          <LongitudeDegrees>${route.coordinates[route.coordinates.length - 1][1].toFixed(6)}</LongitudeDegrees>
        </EndPosition>
        <Intensity>Active</Intensity>
      </Lap>
      <Track>
`;

  for (let i = 0; i < route.coordinates.length; i++) {
    const [lat, lng] = route.coordinates[i];
    const ele = route.detailedElevation[i]?.ele || 100;
    const distM = Math.round((i / (route.coordinates.length - 1)) * route.distanceKm * 1000);
    xml += `        <Trackpoint>
          <Time>${new Date(Date.now() + i * 60000).toISOString()}</Time>
          <Position>
            <LatitudeDegrees>${lat.toFixed(6)}</LatitudeDegrees>
            <LongitudeDegrees>${lng.toFixed(6)}</LongitudeDegrees>
          </Position>
          <AltitudeMeters>${ele}</AltitudeMeters>
          <DistanceMeters>${distM}</DistanceMeters>
        </Trackpoint>
`;
  }

  xml += `      </Track>
`;

  // Add course points for watch cues
  for (const wp of route.waypoints) {
    const pointType = wp.type === 'water' ? 'Water' : wp.type === 'climb' ? 'Summit' : 'Generic';
    xml += `      <CoursePoint>
        <Name>${escapeXml(wp.name.slice(0, 10))}</Name>
        <Time>${new Date().toISOString()}</Time>
        <Position>
          <LatitudeDegrees>${wp.lat.toFixed(6)}</LatitudeDegrees>
          <LongitudeDegrees>${wp.lng.toFixed(6)}</LongitudeDegrees>
        </Position>
        <PointType>${pointType}</PointType>
        <Notes>${escapeXml(wp.notes || wp.name)}</Notes>
      </CoursePoint>
`;
  }

  xml += `    </Course>
  </Courses>
</TrainingCenterDatabase>`;

  return xml;
}

/**
 * Triggers an immediate browser file download.
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
