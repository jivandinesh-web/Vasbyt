import { Province, MajorRace, Race, Club, DistanceCode, Discipline } from '../types';

export const PROVINCES: Province[] = [
  {
    id: 'gp',
    ab: 'GP',
    name: 'Gauteng',
    capital: 'Johannesburg',
    blurb: 'The engine room — Soweto, Jacaranda City and a highveld club scene with more affiliated athletics clubs than anywhere else in the country.'
  },
  {
    id: 'wc',
    ab: 'WC',
    name: 'Western Cape',
    capital: 'Cape Town',
    blurb: 'Sea-level starts and mountain backdrops. Home to Two Oceans and Africa’s first Abbott World Marathon Major.'
  },
  {
    id: 'kzn',
    ab: 'KZN',
    name: 'KwaZulu-Natal',
    capital: 'Pietermaritzburg',
    blurb: 'The Comrades province — rolling hills between Pietermaritzburg and Durban, and the country’s oldest athletic club.'
  },
  {
    id: 'ec',
    ab: 'EC',
    name: 'Eastern Cape',
    capital: 'Gqeberha',
    blurb: 'Windswept coastal marathons and a deep amateur running tradition from Gqeberha to East London.'
  },
  {
    id: 'fs',
    ab: 'FS',
    name: 'Free State',
    capital: 'Bloemfontein',
    blurb: 'Flat, fast highveld routes built for personal bests.'
  },
  {
    id: 'mp',
    ab: 'MP',
    name: 'Mpumalanga',
    capital: 'Mbombela',
    blurb: 'Escarpment trail-and-road hybrids through Barberton’s mountains and the Lowveld heat.'
  },
  {
    id: 'lp',
    ab: 'LP',
    name: 'Limpopo',
    capital: 'Polokwane',
    blurb: 'Bushveld marathons that share the road with game reserves.'
  },
  {
    id: 'nw',
    ab: 'NW',
    name: 'North West',
    capital: 'Mahikeng',
    blurb: 'University towns and mining-belt clubs around Potchefstroom and Rustenburg.'
  },
  {
    id: 'nc',
    ab: 'NC',
    name: 'Northern Cape',
    capital: 'Kimberley',
    blurb: 'Vast distances, small fields, and some of the toughest heat and wind in the calendar.'
  },
];

export const MAJORS: MajorRace[] = [
  {
    name: 'Comrades Marathon',
    prov: 'kzn',
    dist: '~90km Ultra',
    discipline: 'road',
    since: 1921,
    when: '16 June',
    blurb: 'Pietermaritzburg to Durban (or back). Run every year since 1921 bar the war years — the Up and Down run that defines South African endurance running.',
    organiser: 'Comrades Marathon Association',
    site: 'comrades.com',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed — the shape and hills are real, the exact gradients are not.',
      directions: [
        'Alternates direction each year: the "Up run" starts at Durban City Hall and finishes at Pietermaritzburg’s Scottsville, the "Down run" reverses it.',
        'The route crosses the same named climbs either way — collectively known as the Big Five hills.',
        'In Down-run order from Durban: Cowies Hill, Fields Hill, Botha’s Hill, Inchanga, then Polly Shorts before the Scottsville finish.'
      ],
      points: [
        { label: 'Start', y: 30 },
        { label: 'Cowies', y: 55 },
        { label: 'Fields', y: 68 },
        { label: 'Botha’s', y: 80 },
        { label: 'Inchanga', y: 90 },
        { label: 'Polly Shorts', y: 95 },
        { label: 'Finish', y: 40 }
      ]
    }
  },
  {
    name: 'Two Oceans Marathon',
    prov: 'wc',
    dist: '56km Ultra + Half',
    discipline: 'road',
    since: 1970,
    when: 'April',
    blurb: 'Started as a Comrades training run around the Cape Peninsula. Now sells out every year — often called the world’s most beautiful marathon.',
    organiser: 'Two Oceans Marathon NPC',
    site: 'twooceansmarathon.org.za',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Starts at Newlands, heads south along the False Bay coast through Muizenberg and Fish Hoek to Simon’s Town.',
        'Turns back north over Chapman’s Peak Drive ("Chappies") above the Atlantic, then through Hout Bay.',
        'Climbs Constantia Nek — the last major climb — before dropping through the southern suburbs to finish at the University of Cape Town.'
      ],
      points: [
        { label: 'Newlands', y: 25 },
        { label: 'Simon’s Town', y: 20 },
        { label: 'Chapman’s Peak', y: 75 },
        { label: 'Hout Bay', y: 30 },
        { label: 'Constantia Nek', y: 90 },
        { label: 'UCT', y: 45 }
      ]
    }
  },
  {
    name: 'Cape Town Marathon',
    prov: 'wc',
    dist: '42.2km',
    discipline: 'road',
    since: 1994,
    when: 'May',
    blurb: 'Confirmed in 2026 as Africa’s first Abbott World Marathon Major, run along Victoria Road with Table Mountain on your shoulder.',
    organiser: 'Western Province Athletics, ASEM Running & City of Cape Town',
    site: 'capetownmarathon.com',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Starts and finishes in the CBD, heading out along Victoria Road through Sea Point and Fresnaye.',
        'Skirts the foot of the Twelve Apostles toward Camps Bay before turning back via Kloof Nek.',
        'Returns through Gardens to the city-centre finish.'
      ],
      points: [
        { label: 'CBD', y: 30 },
        { label: 'Sea Point', y: 25 },
        { label: 'Camps Bay', y: 45 },
        { label: 'Kloof Nek', y: 70 },
        { label: 'Gardens', y: 35 },
        { label: 'Finish', y: 25 }
      ]
    }
  },
  {
    name: 'Soweto Marathon',
    prov: 'gp',
    dist: '42.2 / 21 / 10km',
    discipline: 'road',
    since: 1991,
    when: 'November',
    blurb: '"The People’s Race" — Nasrec to FNB Stadium through Orlando and the heart of Soweto’s heritage trail.',
    organiser: 'African Bank Soweto Marathon organising committee',
    site: 'sowetomarathon.com',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed — Soweto’s route is gently rolling rather than mountainous.',
      directions: [
        'Starts at Nasrec Expo Centre and heads into Orlando, past the Hector Pieterson Memorial and Vilakazi Street precinct.',
        'Passes Chris Hani Baragwanath Hospital and through Elias Motsoaledi.',
        'Finishes inside FNB Stadium (Soccer City).'
      ],
      points: [
        { label: 'Nasrec', y: 30 },
        { label: 'Orlando', y: 45 },
        { label: 'Baragwanath', y: 50 },
        { label: 'Motsoaledi', y: 40 },
        { label: 'FNB Stadium', y: 25 }
      ]
    }
  },
  {
    name: 'Big Five Marathon',
    prov: 'lp',
    dist: '42.2km',
    discipline: 'road',
    since: 2005,
    when: 'June',
    blurb: 'Runs through the Entabeni Game Reserve near Mokopane — armed rangers on the route, game on the horizon.',
    organiser: 'Big Five Marathon organisers (game-reserve permit event)',
    site: 'big-five-marathon.com',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'A single loop inside the Entabeni Game Reserve on dirt jeep-track, escorted by armed game rangers.',
        'Rolling bushveld terrain rather than tarmac — expect soft sand sections and river-bed crossings.'
      ],
      points: [
        { label: 'Start', y: 35 },
        { label: 'Waterhole loop', y: 55 },
        { label: 'Riverbed', y: 30 },
        { label: 'Ridge', y: 60 },
        { label: 'Finish', y: 35 }
      ]
    }
  },
];

export const RACES: Race[] = [
  // --- TRAIL RACES ---
  {
    name: 'Otter African Trail Run',
    prov: 'wc',
    city: 'Nature’s Valley',
    date: '2026-09-25',
    dist: ['X'],
    discipline: 'trail',
    organiser: 'Otter African Trail Run',
    site: 'otter.run',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Point-to-point along the Otter hiking trail between Storms River and Nature’s Valley (direction alternates yearly as "Otter" or "Retto").',
        'Rugged Indian Ocean coastline through indigenous forest, with roughly 11 steep climbs and four river crossings.',
        'Includes a swim across the Bloukrans River — cut-offs of 9 or 11 hours depending on the race option.'
      ],
      points: [
        { label: 'Start', y: 30 },
        { label: 'Forest climb', y: 60 },
        { label: 'Bloukrans swim', y: 15 },
        { label: 'Coastal climbs', y: 75 },
        { label: 'Finish', y: 35 }
      ]
    }
  },
  {
    name: 'SkyRun 100',
    prov: 'ec',
    city: 'Lady Grey',
    date: '2026-11-14',
    dist: ['X'],
    discipline: 'trail',
    organiser: 'SkyRun',
    site: 'skyrun.co.za',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Self-navigated, self-supported point-to-point across the remote Witteberg range: Lady Grey → Tower → Olympus → Snowden → Avoca → Skidaw.',
        'Continues Balloch (compulsory medical check) → The Wall → Edgehill → The Turn → Halstone, finishing at Wartrail.',
        'Runners carry map/GPS, food, water and survival gear at 2,200–2,500m altitude.'
      ],
      points: [
        { label: 'Lady Grey', y: 20 },
        { label: 'Tower', y: 65 },
        { label: 'Olympus', y: 80 },
        { label: 'Balloch', y: 50 },
        { label: 'The Wall', y: 85 },
        { label: 'Wartrail', y: 40 }
      ]
    }
  },
  {
    name: 'Giant’s Cup Trail Run',
    prov: 'kzn',
    city: 'Underberg',
    date: '2026-05-21',
    dist: ['X'],
    discipline: 'trail',
    organiser: 'SDCTO / The Giant’s Cup',
    site: 'thegiantscuptrail.com',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Two-day staged run on the Giant’s Cup hiking trail in the Southern Drakensberg (Maloti-Drakensberg World Heritage Site).',
        'Day 1: Trading Store → Swiman Hut → along the Garden Castle Ridge → Black Eagle Pass → Wintershoek Hut → finish at Castleburn Farm.',
        'Full option covers 30km + 32km over two days with roughly 1,160m of climbing.'
      ],
      points: [
        { label: 'Trading Store', y: 25 },
        { label: 'Langalibalele saddle', y: 85 },
        { label: 'Garden Castle Ridge', y: 65 },
        { label: 'Black Eagle Pass', y: 75 },
        { label: 'Castleburn Farm', y: 30 }
      ]
    }
  },
  {
    name: 'AfricanX Trailrun',
    prov: 'wc',
    city: 'Overberg region',
    date: '2026-10-08',
    dist: ['X'],
    discipline: 'trail',
    organiser: 'Stillwater Sports',
    site: 'stillwatersports.com',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Three-day stage race through Overberg farmland and mountains (roughly 24km, 32km and 18km per day).',
        'Mixed farm track, fynbos singletrack and mountain climbs, run as a team event.'
      ],
      points: [
        { label: 'Day 1', y: 40 },
        { label: 'Day 1 climb', y: 70 },
        { label: 'Day 2', y: 55 },
        { label: 'Day 2 climb', y: 80 },
        { label: 'Day 3', y: 35 }
      ]
    }
  },
  {
    name: 'Ultra X South Africa',
    prov: 'wc',
    city: 'Cederberg',
    date: '2026-10-19',
    dist: ['X'],
    discipline: 'trail',
    organiser: 'Ultra X',
    site: 'ultra-x.co',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'Six-stage, 330km self-navigated stage race through the Cederberg Conservancy.',
        'Sandstone cliffs, remote mountain passes and fynbos wilderness, camping between stages.'
      ],
      points: [
        { label: 'Stage 1', y: 35 },
        { label: 'Stage 2', y: 55 },
        { label: 'Stage 3', y: 75 },
        { label: 'Stage 4', y: 60 },
        { label: 'Stage 5', y: 80 },
        { label: 'Stage 6', y: 40 }
      ]
    }
  },
  {
    name: 'Skyrunning Series — Table Mountain',
    prov: 'wc',
    city: 'Cape Town',
    date: '2026-11-01',
    dist: ['X'],
    discipline: 'trail',
    organiser: 'Skyrunning South Africa',
    site: 'skyrunning.co.za',
    route: {
      note: 'Illustrative profile sketch, not GPS-surveyed.',
      directions: [
        'One leg of a four-race series (Robertson, Cape Town, Genadendal, Franschhoek) built on European-style skyrunning.',
        'Runs directly up and over Table Mountain from the City Bowl side — short distance, relentless climbing.'
      ],
      points: [
        { label: 'City Bowl', y: 20 },
        { label: 'Platteklip', y: 90 },
        { label: 'Summit plateau', y: 95 },
        { label: 'Descent', y: 30 }
      ]
    }
  },
  {
    name: 'Blyde Canyon Escarpment Trail',
    prov: 'mp',
    city: 'Graskop',
    date: '2026-10-17',
    dist: ['X', 'H'],
    discipline: 'trail',
    organiser: 'Lowveld Trail Running & Mpumalanga Parks Board',
    site: 'lowveldtrailrunning.co.za',
    route: {
      note: 'Technical escarpment ridge running with panoramic drops into the Lowveld gorge.',
      directions: [
        'Starts at Graskop Gorge Lift base, climbs along indigenous afro-montane forest paths towards God’s Window.',
        'Follows the Belvedere singletrack hugging sandstone cliff edges above the Blyde River.',
        'Technical descent past Bourke’s Luck Potholes and finishes overlooking the Three Rondavels.'
      ],
      points: [
        { label: 'Graskop Lift', y: 35 },
        { label: 'God’s Window', y: 75 },
        { label: 'Belvedere Ridge', y: 88 },
        { label: 'Bourke’s Potholes', y: 45 },
        { label: 'Three Rondavels', y: 60 }
      ]
    }
  },
  {
    name: 'Soutpansberg Mist Mountain Trail',
    prov: 'lp',
    city: 'Louis Trichardt',
    date: '2026-11-21',
    dist: ['X', 'H'],
    discipline: 'trail',
    organiser: 'Limpopo Trail Series & Soutpansberg AC',
    site: 'limpopotrails.co.za',
    route: {
      note: 'Ancient indigenous mist-belt trails through yellowwood forests and quartzite ridges.',
      directions: [
        'Depart from Mountain View basecamp in Louis Trichardt.',
        'Climb steeply through the Hanglip State Forest following historic forestry logging trails.',
        'Traverse along the Hanglip peak knife-edge ridge at 1,700m elevation before descending switchbacks to the forestry station.'
      ],
      points: [
        { label: 'Town Base', y: 25 },
        { label: 'Hanglip Pine Forest', y: 55 },
        { label: 'Hanglip Summit', y: 90 },
        { label: 'Crest Ridge', y: 78 },
        { label: 'Station Finish', y: 30 }
      ]
    }
  },
  {
    name: 'Maluti Highlands Sandstone Trail',
    prov: 'fs',
    city: 'Clarens',
    date: '2026-10-31',
    dist: ['X', 'H', 'T'],
    discipline: 'trail',
    organiser: 'Free State Mountain Club & Clarens Trail Hub',
    site: 'clarenstrails.co.za',
    route: {
      note: 'High-altitude trail running across Golden Gate’s glowing ochre sandstone cliffs.',
      directions: [
        'Departs the Clarens village square onto Titanic Rock singletrack.',
        'Climbs onto the Rooiberge sandstone rim overlooking the Lesotho Maluti range.',
        'Navigates slippery riverbeds and rocky ledges before a flowing grass downhill finish back in Clarens.'
      ],
      points: [
        { label: 'Clarens Square', y: 40 },
        { label: 'Titanic Rock', y: 65 },
        { label: 'Rooiberge Rim', y: 85 },
        { label: 'Spruit Crossing', y: 42 },
        { label: 'Village Finish', y: 40 }
      ]
    }
  },
  {
    name: 'Kgaswane Mountain Trail Challenge',
    prov: 'nw',
    city: 'Rustenburg',
    date: '2026-11-28',
    dist: ['X', 'H'],
    discipline: 'trail',
    organiser: 'Rustenburg Mountain Runners',
    site: 'rustenburgtrail.co.za',
    route: {
      note: 'Rocky quartzite scrambles and high-plateau grassland above the platinum belt.',
      directions: [
        'Starts at Kgaswane Nature Reserve main gate.',
        'Follows the Peglarae Trail steeply up to the Magaliesberg escarpment crest.',
        'Loops around the central vleis past Tierkloof waterfall before a technical rocky descent.'
      ],
      points: [
        { label: 'Reserve Gate', y: 30 },
        { label: 'Peglarae Climb', y: 72 },
        { label: 'Magaliesberg Ridge', y: 88 },
        { label: 'Tierkloof', y: 50 },
        { label: 'Main Gate', y: 30 }
      ]
    }
  },
  {
    name: 'Augrabies Kalahari Gorge Run',
    prov: 'nc',
    city: 'Augrabies Falls',
    date: '2026-10-24',
    dist: ['X', 'H', 'T'],
    discipline: 'trail',
    organiser: 'Kalahari Extreme Athletics & SANParks',
    site: 'sanparks.org/parks/augrabies',
    route: {
      note: 'Hot arid desert moonscape, quartz sand washes and 18-km of ancient granite gorge paths.',
      directions: [
        'Starts at Augrabies Falls rest camp above the thundering cascade.',
        'Traverses the Klipspringer Trail over Moon Rock and dry camelthorn washes.',
        'Climbs Swart Rante black dolerite hills with blazing sun exposure before returning along the river canyon rim.'
      ],
      points: [
        { label: 'Falls Camp', y: 30 },
        { label: 'Moon Rock', y: 52 },
        { label: 'Gorge Wash', y: 25 },
        { label: 'Swart Rante', y: 65 },
        { label: 'Camp Rest', y: 30 }
      ]
    }
  },
  {
    name: 'Hogsback Amatola Forest Trail',
    prov: 'ec',
    city: 'Hogsback',
    date: '2026-12-12',
    dist: ['X', 'H'],
    discipline: 'trail',
    organiser: 'Amatola Trail Running Guild',
    site: 'amatolatrails.co.za',
    route: {
      note: 'Mist-shrouded indigenous canopy, moss-covered boulders, and dramatic mountain waterfalls.',
      directions: [
        'Starts in Hogsback village centre at The Edge cliff viewpoint.',
        'Descends into the deep Tyhume River valley past Madonna and Child falls.',
        'Demanding technical singletrack scramble up Gaika’s Kop peak returning along the contour path.'
      ],
      points: [
        { label: 'The Edge', y: 60 },
        { label: 'Tyhume Valley', y: 20 },
        { label: 'Waterfall Steps', y: 50 },
        { label: 'Gaika’s Kop', y: 92 },
        { label: 'Village', y: 60 }
      ]
    }
  },

  // --- ROAD RACES ---
  {
    name: 'Barberton Makhonjwa Mountain Marathon',
    prov: 'mp',
    city: 'Barberton',
    date: '2026-09-12',
    dist: ['M', 'H', 'T', 'F'],
    discipline: 'road',
    organiser: 'Barberton Genaad Athletics Club',
    site: 'barbertonmarathon.co.za',
    route: {
      note: 'UNESCO World Heritage geological route over the twisting Bulembu pass to Eswatini border.',
      directions: [
        'Departs from Barberton Rugby Club and heads out onto the steep R40 Bulembu mountain pass.',
        'Reaches the turnaround apex at the Josefsdal / Eswatini border checkpoint (elevation ~1,400m).',
        'Relentless fast quad-burning descent down mountain switchbacks into town finish.'
      ],
      points: [
        { label: 'Rugby Club', y: 25 },
        { label: 'Pass Foot', y: 40 },
        { label: 'Saddle Summit', y: 85 },
        { label: 'Border Apex', y: 92 },
        { label: 'Descent Curves', y: 55 },
        { label: 'Barberton', y: 25 }
      ]
    }
  },
  {
    name: 'Kaapsehoop 4-in-1 Marathon',
    prov: 'mp',
    city: 'Mbombela',
    date: '2026-11-07',
    dist: ['M', 'H', 'T', 'F'],
    discipline: 'road',
    organiser: 'Nelspruit Marathon Club',
    site: 'nelspruitmc.co.za',
    route: {
      note: 'Legendary Comrades qualifier known as South Africa’s fastest downhill marathon.',
      directions: [
        'Starts in the misty high-altitude historic gold-mining hamlet of Kaapsehoop (~1,600m).',
        'Descends continuously along the winding pine forestry road into the Lowveld heat.',
        'Flat final 5km cruise through Mbombela suburbs finishing inside Mbombela Stadium.'
      ],
      points: [
        { label: 'Kaapsehoop Village', y: 95 },
        { label: 'Forest Pine KM 15', y: 70 },
        { label: 'Crocodile Valley KM 30', y: 45 },
        { label: 'Mbombela Approach', y: 25 },
        { label: 'Stadium Finish', y: 20 }
      ]
    }
  },
  {
    name: 'Masingita Mall 4-in-1 Marathon',
    prov: 'lp',
    city: 'Giyani',
    date: '2026-09-12',
    dist: ['M', 'H', 'T', 'F'],
    discipline: 'road',
    organiser: 'Giyani Athletics Club & Limpopo Athletics (LIMA)',
    site: 'masingitamall.co.za',
    route: {
      note: 'Fast, flat rural road course under open Highveld Limpopo sun.',
      directions: [
        'Starts outside Masingita Mall on the R81 main artery.',
        'Runs out towards Kremetart village on smooth tarmac shoulders with subtle rolling undulations.',
        'Turnaround point at 21.1km marker returns directly back to cheering crowds at the mall.'
      ],
      points: [
        { label: 'Masingita Mall', y: 30 },
        { label: 'Kremetart Turn', y: 35 },
        { label: 'Mid-loop Out', y: 38 },
        { label: 'R81 Straight', y: 32 },
        { label: 'Mall Finish', y: 30 }
      ]
    }
  },
  {
    name: 'Sani Stagger Marathon',
    prov: 'kzn',
    city: 'Sani Pass',
    date: '2026-11-14',
    dist: ['M', 'H'],
    discipline: 'road',
    organiser: 'Sani Stagger AC / Underberg Athletics',
    site: 'sanistagger.com',
    route: {
      note: 'Brutal mountain gravel pass climb from South Africa to the Mountain Kingdom of Lesotho.',
      directions: [
        'Starts at Premier Resort Sani Pass at the base of the Drakensberg escarpment.',
        'Climbs relentlessly over dirt switchbacks past South African border post.',
        'Reaches Lesotho border peak (2,876m altitude) and Sani Mountain Lodge before harrowing steep descent back down.'
      ],
      points: [
        { label: 'Sani Base', y: 20 },
        { label: 'SA Border Post', y: 48 },
        { label: 'Hairpin Switchbacks', y: 78 },
        { label: 'Sani Top Summit', y: 98 },
        { label: 'Descent Base', y: 20 }
      ]
    }
  },
  {
    name: 'SAPS Striders Heritage Challenge',
    prov: 'kzn',
    city: 'Durban',
    date: '2026-09-12',
    dist: ['H', 'T'],
    discipline: 'road',
    organiser: 'SAPS Striders Athletic Club & KZNA',
    site: 'kzna.co.za',
    route: {
      note: 'Fast coastal sea-level road course alongside the Indian Ocean promenade.',
      directions: [
        'Starts on Battery Beach Road outside the SAPS complex.',
        'Heads north along Snell Parade and Blue Lagoon bridge over the Umgeni River mouth.',
        'U-turns back along the paved beachfront promenade finishing at Kings Park athletic precinct.'
      ],
      points: [
        { label: 'Battery Beach', y: 20 },
        { label: 'Snell Parade', y: 22 },
        { label: 'Umgeni Bridge', y: 25 },
        { label: 'Promenade Loop', y: 20 },
        { label: 'Kings Park', y: 20 }
      ]
    }
  },
  {
    name: 'Vaal River City Marathon',
    prov: 'gp',
    city: 'Vanderbijlpark',
    date: '2026-09-13',
    dist: ['M', 'H', 'T', 'F'],
    discipline: 'road',
    organiser: 'ArcelorMittal Athletics Club',
    site: 'vaalmarathon.co.za',
    route: {
      note: 'One of Gauteng’s flattest marathon courses, premier qualifying run for Comrades.',
      directions: [
        'Departs Isak Steyl Stadium along Delfos Boulevard.',
        'Two laps on broad tree-lined avenues bordering the Vaal River and Emerald Casino.',
        'Smooth tarmac with virtually zero gradients ideal for marathon PB chasing.'
      ],
      points: [
        { label: 'Stadium', y: 25 },
        { label: 'Vaal River Bridge', y: 28 },
        { label: 'Emerald Loop', y: 24 },
        { label: 'Lap 2 Split', y: 26 },
        { label: 'Stadium Finish', y: 25 }
      ]
    }
  },
  {
    name: 'Voet van Afrika',
    prov: 'wc',
    city: 'Bredasdorp',
    date: '2026-09-19',
    dist: ['T', 'F', 'H', 'M'],
    discipline: 'road',
    organiser: 'Bredasdorp Athletic Club & Overberg Athletics',
    site: 'voetvanafrika.co.za',
    route: {
      note: 'Africa’s southernmost marathon across Cape Agulhas farming wheat fields.',
      directions: [
        'Starts in Struisbaai coastal village near the southernmost tip of the African continent.',
        'Passes limestone fynbos dunes into the rolling gravel and tar roads of the Overberg.',
        'Climbs the tough Bredasdorp mountain pass before entering the showgrounds finish.'
      ],
      points: [
        { label: 'Struisbaai Start', y: 15 },
        { label: 'Wheatfield Flats', y: 28 },
        { label: 'Napier Turn', y: 40 },
        { label: 'Mountain Pass', y: 75 },
        { label: 'Showgrounds', y: 35 }
      ]
    }
  },
  {
    name: 'Jeppe Marathon',
    prov: 'gp',
    city: 'Senderwood',
    date: '2026-09-20',
    dist: ['M', 'H'],
    discipline: 'road',
    organiser: 'Jeppe Quondam Athletic Club',
    site: 'jeppequondam.co.za',
    route: {
      note: 'Classic hilly double-lap highveld test across Bedfordview and Senderwood.',
      directions: [
        'Starts at Jeppe Quondam Sports Club in Senderwood.',
        'Wind through the leafy suburbs of Bedfordview, climbing St Andrews hill.',
        'Descends past Gillooly’s Farm before taking on the testing second lap.'
      ],
      points: [
        { label: 'Jeppe Club', y: 35 },
        { label: 'Bedfordview Hill', y: 62 },
        { label: 'St Andrews', y: 70 },
        { label: 'Gillooly’s Cut', y: 40 },
        { label: 'Lap 2 Summit', y: 68 },
        { label: 'Club Finish', y: 35 }
      ]
    }
  },
  {
    name: 'Kwagga 100 Run',
    prov: 'wc',
    city: 'George',
    date: '2026-09-18',
    dist: ['T', 'F', 'H'],
    discipline: 'road',
    organiser: 'Outeniqua Harriers',
    site: 'outeniquaharriers.co.za',
    route: {
      note: 'Scenic Garden Route run under the majestic Outeniqua mountain range.',
      directions: [
        'Starts at Outeniqua High School sports fields in George.',
        'Circles the picturesque Camphersdrift suburb with lush oak-lined streets.',
        'Gradual climb towards the Witfontein forest border followed by an easy rolling return.'
      ],
      points: [
        { label: 'Outeniqua High', y: 28 },
        { label: 'Camphersdrift', y: 35 },
        { label: 'Witfontein Forest', y: 55 },
        { label: 'Davidson Road', y: 38 },
        { label: 'School Oval', y: 28 }
      ]
    }
  },
  {
    name: 'Blouberg Marathon',
    prov: 'wc',
    city: 'Table Bay Mall',
    date: '2026-10-03',
    dist: ['M', 'H', 'T'],
    discipline: 'road',
    organiser: 'West Coast Athletic Club',
    site: 'westcoastac.co.za',
    route: {
      note: 'Flat coastal race with world-famous Table Mountain horizon views.',
      directions: [
        'Departs Table Bay Mall heading onto Otto du Plessis Drive.',
        'Coast alongside Big Bay and Bloubergstrand with sea breezes off the Atlantic.',
        'Loops past Melkbosstrand before a lightning-fast flat sprint to the mall finish.'
      ],
      points: [
        { label: 'Table Bay Mall', y: 20 },
        { label: 'Big Bay Coast', y: 18 },
        { label: 'Bloubergstrand', y: 22 },
        { label: 'Melkbos Turn', y: 19 },
        { label: 'Mall Finish', y: 20 }
      ]
    }
  },
  {
    name: 'Jacaranda City Challenge',
    prov: 'gp',
    city: 'Pretoria',
    date: '2026-10-24',
    dist: ['M', 'H', 'T', 'F'],
    discipline: 'road',
    organiser: 'Agapé Athletics Club & Athletics Gauteng North',
    site: 'jacarandacitychallenge.co.za',
    route: {
      note: 'Pretoria’s signature road run beneath full-bloom purple Jacaranda trees.',
      directions: [
        'Starts and finishes at SuperSport Park Cricket Stadium in Centurion.',
        'Route navigates through Irene and Highveld business precincts on gently undulating tarmac.',
        'Shaded boulevards with festive community support water stations every 3km.'
      ],
      points: [
        { label: 'SuperSport Park', y: 30 },
        { label: 'Irene Dairy Farms', y: 42 },
        { label: 'Botha Ave Climb', y: 56 },
        { label: 'Centurion Drop', y: 38 },
        { label: 'Cricket Oval', y: 30 }
      ]
    }
  },
  {
    name: 'Oppikampus Letsgo Potch! Marathon',
    prov: 'nw',
    city: 'Potchefstroom',
    date: '2026-10-24',
    dist: ['M', 'H', 'T', 'F'],
    discipline: 'road',
    organiser: 'NWU Athletics & Athletics Central North West',
    site: 'potchmarathon.co.za',
    route: {
      note: 'High-speed flat university town route, fertile ground for setting national qualifiers.',
      directions: [
        'Starts on the North-West University (NWU) Fanie du Toit sports grounds.',
        'Follows the tree-lined Bult precinct and Mooi River green belt.',
        'Out-and-back course with smooth wide avenues designed for uninterrupted rhythm.'
      ],
      points: [
        { label: 'NWU Sports', y: 24 },
        { label: 'The Bult', y: 26 },
        { label: 'Mooi River Bank', y: 25 },
        { label: 'Agricultural Loop', y: 28 },
        { label: 'Campus Finish', y: 24 }
      ]
    }
  },
  {
    name: 'Nelson Mandela Bay 1City Marathon',
    prov: 'ec',
    city: 'Gqeberha',
    date: '2026-12-05',
    dist: ['M', 'H', 'T'],
    discipline: 'road',
    organiser: 'Eastern Province Athletics & NMB Municipality',
    site: 'epa.co.za',
    route: {
      note: 'Coast-to-city urban route traversing historical Nelson Mandela Bay landmarks.',
      directions: [
        'Begins in Motherwell township community grounds.',
        'Traverses along the M17 freeway crossing the Swartkops River estuary.',
        'Sweeps along the Summerstrand beachfront finishing at the iconic Kings Beach.'
      ],
      points: [
        { label: 'Motherwell', y: 40 },
        { label: 'Swartkops River', y: 18 },
        { label: 'Humewood Hill', y: 48 },
        { label: 'Summerstrand', y: 22 },
        { label: 'Kings Beach', y: 15 }
      ]
    }
  },
  {
    name: 'Diamond Marathon',
    prov: 'nc',
    city: 'Kimberley',
    date: '2026-11-07',
    dist: ['M', 'H', 'T'],
    discipline: 'road',
    organiser: 'Kimberley Harriers & Athletics Griqualand West',
    site: 'agwathletics.co.za',
    route: {
      note: 'Historic loop passing Kimberley’s famous Big Hole diamond mining heritage sites.',
      directions: [
        'Starts at Griqua Park sports grounds on Cassandra street.',
        'Passes the Open Mine Museum and Kimberley Big Hole viewing platforms.',
        'Flat and windy Karoo tarmac loops finishing with a lap on the local club track.'
      ],
      points: [
        { label: 'Griqua Park', y: 32 },
        { label: 'Big Hole Museum', y: 36 },
        { label: 'Karoo Plains KM 18', y: 34 },
        { label: 'Memorial Road', y: 38 },
        { label: 'Club Oval', y: 32 }
      ]
    }
  },
  {
    name: 'Bloemfontein City Marathon',
    prov: 'fs',
    city: 'Bloemfontein',
    date: '2026-10-10',
    dist: ['M', 'H', 'T'],
    discipline: 'road',
    organiser: 'Bloemfontein Striders & Athletics Free State',
    site: 'striders.co.za',
    route: {
      note: 'The City of Roses premier road race skirting around Naval Hill.',
      directions: [
        'Starts at Tempe Military base athletic grounds.',
        'Wind through Dan Pienaar and climbs the scenic loop around Naval Hill game reserve.',
        'Passes the Nelson Mandela statue overlooking the city before returning on Brandfort Road.'
      ],
      points: [
        { label: 'Tempe Grounds', y: 30 },
        { label: 'Dan Pienaar', y: 38 },
        { label: 'Naval Hill Climb', y: 68 },
        { label: 'Mandela Statue', y: 72 },
        { label: 'Tempe Finish', y: 30 }
      ]
    }
  },

  // --- TRACK RACES & EVENTS ---
  {
    name: 'CGA Track & Field Provincial Series',
    prov: 'gp',
    city: 'Germiston',
    date: '2026-10-10',
    dist: ['TR', 'F', 'T'],
    discipline: 'track',
    organiser: 'Central Gauteng Athletics (CGA)',
    site: 'centralgautengathletics.co.za',
    route: {
      note: 'Official World Athletics certified 400m synthetic polyurethane track. 12.5 laps for 5000m, 25 laps for 10000m.',
      directions: [
        'Events hosted on Germiston Stadium’s standard 8-lane 400m running track.',
        'Back straight, bend 3, home straight and bend 1 precision rhythm running.',
        'Electric photo-finish timing gates, electronic lap counter and bell lap ringing.'
      ],
      points: [
        { label: 'Lane Start', y: 10 },
        { label: 'First Turn', y: 10 },
        { label: 'Back Straight', y: 10 },
        { label: 'Final Bend', y: 10 },
        { label: 'Bell Lap / Finish', y: 10 }
      ]
    }
  },
  {
    name: 'ASA Grand Prix Night Classic',
    prov: 'fs',
    city: 'Bloemfontein',
    date: '2026-11-20',
    dist: ['TR', 'F'],
    discipline: 'track',
    organiser: 'Athletics South Africa (ASA) & AFS',
    site: 'athletics.org.za',
    route: {
      note: 'Premier national floodlit track meet at 1,400m highveld altitude, ideal for middle & long-distance qualifying times.',
      directions: [
        'Held at Free State Athletics Stadium in Mangaung under high-powered stadium floodlights.',
        'World Athletics sanctioned 400m all-weather Rekortan track with paced pacing lights.',
        'Races include elite 1500m, 3000m steeplechase, and 5000m distance track classics.'
      ],
      points: [
        { label: 'Paced Start', y: 10 },
        { label: 'Turn 1', y: 10 },
        { label: 'Opposite Straight', y: 10 },
        { label: 'Curve 2', y: 10 },
        { label: 'Home Straight Finish', y: 10 }
      ]
    }
  },
  {
    name: 'WPA Track Championship 10000m',
    prov: 'wc',
    city: 'Green Point, Cape Town',
    date: '2026-11-27',
    dist: ['TR', 'T'],
    discipline: 'track',
    organiser: 'Western Province Athletics (WPA)',
    site: 'wpa.org.za',
    route: {
      note: 'Sea-level certified Mondo track meet inside Green Point Athletics Stadium under Table Mountain.',
      directions: [
        '25 laps of precision aerobic pacing around the red synthetic track at Green Point Stadium.',
        'Constant sea-level oxygen density creates the ideal environment for sub-30 minute 10,000m attempts.',
        'Split timing sensors at 200m intervals with electronic lap boards.'
      ],
      points: [
        { label: 'Lap 1 Start', y: 10 },
        { label: 'Turn 1', y: 10 },
        { label: 'Back Stretch', y: 10 },
        { label: 'Turn 4', y: 10 },
        { label: 'Photo Finish', y: 10 }
      ]
    }
  },

  // --- WALKING EVENTS & FIXTURES ---
  {
    name: 'Cape Town Big Walk',
    prov: 'wc',
    city: 'Cape Town',
    date: '2026-11-08',
    dist: ['WK', 'F', 'T'],
    discipline: 'walking',
    organiser: 'Cape Town Big Walk Foundation',
    site: 'bigwalk.co.za',
    route: {
      note: 'South Africa’s premier mass-participation fitness walk winding along the Atlantic Seaboard and Sea Point promenade.',
      directions: [
        'Starts at Foreshore and traces along the coastline toward Sea Point and Camps Bay.',
        'Continuous smooth sea-level ocean views with festive hydration and community encouragement points.',
        'Finishes at Green Point Track with live entertainment and walker commemorative medals.'
      ],
      points: [
        { label: 'Foreshore Start', y: 5 },
        { label: 'Sea Point Pavilion', y: 8 },
        { label: 'Bantry Bay Turn', y: 12 },
        { label: 'Mouille Point Light', y: 6 },
        { label: 'Green Point Finish', y: 5 }
      ]
    }
  },
  {
    name: 'Gauteng 50km Walk Classic',
    prov: 'gp',
    city: 'Centurion',
    date: '2026-10-18',
    dist: ['WK', 'T', 'H'],
    discipline: 'walking',
    organiser: 'Central Gauteng & AGN Race Walking Commission',
    site: 'athleticsgautengnorth.co.za',
    route: {
      note: 'Official ASA-sanctioned endurance race walking and fitness walk championship on certified highveld roads.',
      directions: [
        'Multi-loop road course through Centurion’s wide scenic avenues.',
        'Strict World Athletics race-walking judges for competitive divisions alongside mass-field fitness walkers.',
        'Hydration tables every 2.5km with electrolyte fluids and medical support.'
      ],
      points: [
        { label: 'Centurion Arch', y: 20 },
        { label: 'Highveld Loop 1', y: 28 },
        { label: 'Southdowns Corner', y: 35 },
        { label: 'Loop 2 Return', y: 25 },
        { label: 'Stadium Finish', y: 20 }
      ]
    }
  },
  {
    name: 'Durban Golden Mile Coastal Walk',
    prov: 'kzn',
    city: 'Durban',
    date: '2026-10-25',
    dist: ['WK', 'F', 'T'],
    discipline: 'walking',
    organiser: 'Athletics KwaZulu-Natal (KZNA)',
    site: 'athleticskzn.co.za',
    route: {
      note: 'Breezy sunrise coastal walk spanning the legendary paved Durban beachfront promenade from Suncoast to uShaka.',
      directions: [
        'Starts at Suncoast Casino beach plaza at sunrise, moving south along the warm Indian Ocean.',
        'Passes North Beach pier, skate park, and Moses Mabhida promenade.',
        'Reaches uShaka Marine World and loops back along the oceanfront boardwalk.'
      ],
      points: [
        { label: 'Suncoast Pier', y: 5 },
        { label: 'North Beach Pier', y: 6 },
        { label: 'South Beach', y: 5 },
        { label: 'uShaka Point', y: 7 },
        { label: 'Promenade Finish', y: 5 }
      ]
    }
  },
  {
    name: 'Bloemfontein Botanical Gardens Walk',
    prov: 'fs',
    city: 'Bloemfontein',
    date: '2026-10-31',
    dist: ['WK', 'T', 'F'],
    discipline: 'walking',
    organiser: 'Athletics Free State & SANBI',
    site: 'sanbi.org/gardens/free-state',
    route: {
      note: 'Spring season walking event through indigenous Free State flora, woodland valleys, and botanical garden walkways.',
      directions: [
        'Wind through the scenic paved trails of the Free State National Botanical Garden.',
        'Gentle undulating dolerite koppie inclines with marked bird-watching points.',
        'Shaded tree canopy walkways finishing near the garden amphitheatre.'
      ],
      points: [
        { label: 'Main Gates', y: 15 },
        { label: 'Koppie Walkway', y: 32 },
        { label: 'Arboretum View', y: 28 },
        { label: 'Wetland Boardwalk', y: 18 },
        { label: 'Amphitheatre Finish', y: 15 }
      ]
    }
  },
  {
    name: 'Karoo Open Plains 25km Walk',
    prov: 'nc',
    city: 'Kimberley',
    date: '2026-11-14',
    dist: ['WK', 'H'],
    discipline: 'walking',
    organiser: 'Athletics Griqualand West (AGW)',
    site: 'agwathletics.co.za',
    route: {
      note: 'Big sky endurance walking fixture through the vast semi-desert plains of the Northern Cape.',
      directions: [
        'Out-and-back route stretching across quiet flat Karoo terrain under the expansive open skies.',
        'Steady rhythm walking with dedicated water stations and sun protection checkpoints.',
        'Finishes at Kimberley Harriers clubhouse with traditional Karoo hospitality.'
      ],
      points: [
        { label: 'Clubhouse Start', y: 20 },
        { label: 'Mile 5 Windmill', y: 22 },
        { label: 'Plains Turnaround', y: 25 },
        { label: 'Mile 20 Hydration', y: 23 },
        { label: 'Diamond Gate Finish', y: 20 }
      ]
    }
  },
  {
    name: 'Eastern Cape Sunshine Coast 20km Walk',
    prov: 'ec',
    city: 'Port Alfred',
    date: '2026-11-21',
    dist: ['WK', 'H', 'T'],
    discipline: 'walking',
    organiser: 'Eastern Province Athletics (EPA)',
    site: 'epathletics.co.za',
    route: {
      note: 'Picturesque coastal fitness walk between the Kowie River mouth and pristine seaside nature paths.',
      directions: [
        'Walk alongside the tidal Kowie River estuary out to the pier.',
        'Follow ocean pathways with coastal dunes, sea breezes, and indigenous coastal bush.',
        'Concludes at the Royal St. Andrews sports grounds.'
      ],
      points: [
        { label: 'Kowie River Wharf', y: 5 },
        { label: 'West Beach Pier', y: 8 },
        { label: 'Kelly’s Blue Flag Beach', y: 12 },
        { label: 'Dune Overlook', y: 20 },
        { label: 'River Estuary Finish', y: 5 }
      ]
    }
  },

  // --- HIKING EVENTS & MOUNTAIN FIXTURES ---
  {
    name: 'Table Mountain Skyline & Contour Hike',
    prov: 'wc',
    city: 'Cape Town',
    date: '2026-10-17',
    dist: ['HK', 'T', 'H'],
    discipline: 'hiking',
    organiser: 'Table Mountain Hikers & SANParks',
    site: 'sanparks.org/parks/table-mountain',
    route: {
      note: 'Spectacular alpine day hike traversing Platteklip Gorge, Maclear’s Beacon (1,086m), and descending via Skeleton Gorge.',
      directions: [
        'Ascend the dramatic rock steps of Platteklip Gorge onto Table Mountain’s flat table summit.',
        'Navigate the rocky high plateau past ancient reservoirs to Maclear’s Beacon summit cairn.',
        'Traverse contour singletracks through indigenous fynbos and descend under Kirstenbosch’s indigenous yellowwoods.'
      ],
      points: [
        { label: 'Kloof Nek Base', y: 15 },
        { label: 'Platteklip Steps', y: 65 },
        { label: 'Maclear’s Beacon (1,086m)', y: 96 },
        { label: 'Hely-Hutchinson Dam', y: 78 },
        { label: 'Skeleton Gorge Finish', y: 22 }
      ]
    }
  },
  {
    name: 'Drakensberg Amphitheatre & Tugela Falls Hike',
    prov: 'kzn',
    city: 'Underberg',
    date: '2026-11-07',
    dist: ['HK', 'H', 'X'],
    discipline: 'hiking',
    organiser: 'Drakensberg Mountain Hikers Club',
    site: 'kznwildlife.com',
    route: {
      note: 'One of the world’s ultimate mountain day hikes to the top of the 3,000m Drakensberg escarpment and Tugela Falls crest.',
      directions: [
        'Start at Sentinel Car Park (2,500m) and hike along the sheer Sentinel Peak contours.',
        'Scale the iconic vertical chain ladders bolted into the basalt cliff face.',
        'Walk along the high alpine plateau to stand where Tugela Falls plunges nearly 1,000m down the cliff face.'
      ],
      points: [
        { label: 'Sentinel Car Park (2,500m)', y: 50 },
        { label: 'Witches Rock Contour', y: 68 },
        { label: 'Chain Ladders Base', y: 84 },
        { label: 'Amphitheatre Plateau (2,980m)', y: 98 },
        { label: 'Tugela Falls Crest', y: 94 }
      ]
    }
  },
  {
    name: 'Magaliesberg Ridge Heritage Hike',
    prov: 'nw',
    city: 'Rustenburg',
    date: '2026-10-24',
    dist: ['HK', 'T', 'H'],
    discipline: 'hiking',
    organiser: 'Magaliesberg Biosphere Mountain Club',
    site: 'magaliesbergbiosphere.org.za',
    route: {
      note: 'Hike across the ancient quartzite formations and kloofs of one of Earth’s oldest mountain ranges (2.3 billion years old).',
      directions: [
        'Climb through pristine rocky quartzite scrambles and indigenous protea veld.',
        'Traverse high cliffs overlooking the Buffelspoort valley and nesting Cape Vulture colonies.',
        'Descend through a crystal mountain stream kloof with shaded rock pools.'
      ],
      points: [
        { label: 'Valley Base', y: 20 },
        { label: 'Quartzite Ridge', y: 60 },
        { label: 'Beacon Peak Crest', y: 88 },
        { label: 'Vulture Gorge Viewpoint', y: 72 },
        { label: 'Mountain Stream Base', y: 20 }
      ]
    }
  },
  {
    name: 'Blyde River Canyon Panorama Summit Hike',
    prov: 'mp',
    city: 'Graskop',
    date: '2026-11-15',
    dist: ['HK', 'H', 'T'],
    discipline: 'hiking',
    organiser: 'Mpumalanga Lowveld Escarpment Hikers',
    site: 'mtpa.co.za',
    route: {
      note: 'Breathtaking Drakensberg escarpment hike gazing 800m down into the world’s largest green canyon.',
      directions: [
        'Trail winds from Bourke’s Luck Potholes along the canyon rim path.',
        'Spectacular panoramic vistas of the Three Rondavels and the winding Blyde River below.',
        'Climbs through mist-belt afro-montane vegetation to God’s Window escarpment.'
      ],
      points: [
        { label: 'Bourke’s Luck Start', y: 30 },
        { label: 'Lowveld Rim Edge', y: 62 },
        { label: 'Three Rondavels Overlook', y: 85 },
        { label: 'God’s Window Mist Crest', y: 92 },
        { label: 'Graskop Gorge Base', y: 35 }
      ]
    }
  },
  {
    name: 'Amatola Mist Belt Mountain Hike',
    prov: 'ec',
    city: 'Hogsback',
    date: '2026-10-11',
    dist: ['HK', 'H', 'X'],
    discipline: 'hiking',
    organiser: 'Amatola Hikers & Forestry Heritage',
    site: 'visithogsback.co.za',
    route: {
      note: 'Fairytale mountain hike through ancient Afrotemperate yellowwood rainforests, fern gorges, and misty mountain waterfalls.',
      directions: [
        'Begins in misty Hogsback village and heads deep into the indigenous Tyhume river valley.',
        'Hike past Madonna and Child Waterfall and giant 800-year-old Outeniqua yellowwood trees.',
        'Climbs to the three Hogs peaks offering views over the Tyhume basin.'
      ],
      points: [
        { label: 'Hogsback Arboretum', y: 35 },
        { label: 'Tyhume Waterfall', y: 48 },
        { label: 'Yellowwood Giant', y: 65 },
        { label: 'Tor Doone Ridge', y: 88 },
        { label: 'Forest Eco-Camp Finish', y: 40 }
      ]
    }
  },
  {
    name: 'Soutpansberg Bushveld Ridge Hike',
    prov: 'lp',
    city: 'Louis Trichardt',
    date: '2026-11-28',
    dist: ['HK', 'T', 'H'],
    discipline: 'hiking',
    organiser: 'Limpopo Mountain & Birding Hikers',
    site: 'golimpopo.com',
    route: {
      note: 'Wild mountain hike through the Soutpansberg (Salt Pan Mountain) biodiversity hotspot in northern South Africa.',
      directions: [
        'Ascend through rare cycad and baobab territory into sub-tropical mountain forest.',
        'Traverse high rocky bluffs with views stretching north toward the Limpopo river basin.',
        'Cross pristine mountain streams where samango monkeys and narina trogons reside.'
      ],
      points: [
        { label: 'Mountain Base Camp', y: 25 },
        { label: 'Cycad Ridge Climb', y: 55 },
        { label: 'Hanglip Summit (1,719m)', y: 92 },
        { label: 'Forest Ravine Descent', y: 60 },
        { label: 'Trailhead Finish', y: 28 }
      ]
    }
  },

  // --- TREKKING EXPEDITIONS & WILDERNESS TRAVERSES ---
  {
    name: 'Otter Wilderness Coastal Trek',
    prov: 'ec',
    city: 'Nature’s Valley',
    date: '2026-10-30',
    dist: ['TK', 'X', 'U'],
    discipline: 'trekking',
    organiser: 'SANParks Garden Route National Park',
    site: 'sanparks.org/parks/garden-route',
    route: {
      note: 'The grail of Southern African trekking — 45km across dramatic ocean cliffs, rocky beaches, and the tidal Bloukrans River crossing.',
      directions: [
        'Trek along rugged Indian Ocean wave-cut terraces from Storms River mouth.',
        'Navigate tidal sea caves, steep waterfall gorges, and indigenous coastal fynbos.',
        'Cross the famous Bloukrans River mouth at low tide and finish on the white sands of Nature’s Valley.'
      ],
      points: [
        { label: 'Storms River Mouth', y: 10 },
        { label: 'Ngubu Sea Caves', y: 45 },
        { label: 'Elandsbos River Mouth', y: 38 },
        { label: 'Bloukrans River Crossing', y: 15 },
        { label: 'Nature’s Valley Beach', y: 5 }
      ]
    }
  },
  {
    name: 'Cederberg Wilderness Multi-Peak Trek',
    prov: 'wc',
    city: 'Clanwilliam',
    date: '2026-11-13',
    dist: ['TK', 'X', 'U'],
    discipline: 'trekking',
    organiser: 'CapeNature Cederberg Wilderness',
    site: 'capenature.co.za/reserves/cederberg-wilderness-area',
    route: {
      note: 'Expedition-style wilderness trek through red sandstone arches, Wolfberg Crags, and the remote Maltese Cross.',
      directions: [
        'Depart Algeria campsite into the rugged heart of the Cederberg mountain wilderness.',
        'Navigate the surreal narrow slot canyons of the Wolfberg Crags.',
        'Camp under crystal clear starlit skies beside the 20-meter tall Maltese Cross rock pillar.'
      ],
      points: [
        { label: 'Algeria Trailhead', y: 20 },
        { label: 'Uitkyk Pass', y: 62 },
        { label: 'Wolfberg Crags Slot', y: 88 },
        { label: 'Maltese Cross Plateau', y: 95 },
        { label: 'Sanddrif Valley Finish', y: 30 }
      ]
    }
  },
  {
    name: 'Drakensberg Grand Escarpment Trek',
    prov: 'kzn',
    city: 'Underberg',
    date: '2026-12-05',
    dist: ['TK', 'X', 'U'],
    discipline: 'trekking',
    organiser: 'Mountain Club of SA (MCSA)',
    site: 'mcsa.org.za',
    route: {
      note: 'Epic high-altitude mountain expedition traversing the 3,000-metre crest of the uKhahlamba-Drakensberg World Heritage Site.',
      directions: [
        'Self-supported wilderness trek across unmarked high alpine afro-alpine tundra.',
        'Traverses iconic peaks: Cathedral Peak, Champagne Castle (3,377m), and Giant’s Castle.',
        'Experience wild weather, soaring bearded vultures, and absolute remote mountain isolation.'
      ],
      points: [
        { label: 'Cathedral Peak Base', y: 30 },
        { label: 'Bell Traverse Saddle', y: 80 },
        { label: 'Windy Gap Ridge', y: 92 },
        { label: 'Champagne Castle (3,377m)', y: 99 },
        { label: 'Monk’s Cowl Valley', y: 35 }
      ]
    }
  },
  {
    name: 'Golden Gate Maluti Escarpment Trek',
    prov: 'fs',
    city: 'Clarens',
    date: '2026-11-22',
    dist: ['TK', 'X', 'H'],
    discipline: 'trekking',
    organiser: 'SANParks Golden Gate Highlands',
    site: 'sanparks.org/parks/golden-gate-highlands',
    route: {
      note: 'Multi-day trek through brilliant golden and amber sandstone cliffs at the foothills of the Maluti Mountains.',
      directions: [
        'Follow the Ribbok wilderness trail through rolling highland grasslands and sandstone domes.',
        'Ascend to Generaalskop peak (2,732m) with panoramic views across the Kingdom of Lesotho.',
        'Trek past ancient San rock art shelters and crystal mountain tarns.'
      ],
      points: [
        { label: 'Glen Reenen Base', y: 35 },
        { label: 'Brandwag Sandstone Buttress', y: 65 },
        { label: 'Ribbok Wild Valley', y: 78 },
        { label: 'Generaalskop Peak (2,732m)', y: 97 },
        { label: 'Highland Sanctuary Finish', y: 40 }
      ]
    }
  },
  {
    name: 'Richtersveld Desert Wilderness Trek',
    prov: 'nc',
    city: 'Upington',
    date: '2026-10-23',
    dist: ['TK', 'X', 'U'],
    discipline: 'trekking',
    organiser: 'SANParks / Ai-Ais Richtersveld Transfrontier',
    site: 'sanparks.org/parks/ai-ais-richtersveld',
    route: {
      note: 'Extraordinary mountain desert wilderness trek through the jagged volcanic gorges and halfmens succulents of the Northern Cape.',
      directions: [
        'Trek through dramatic lunar landscapes carved by the Gariep (Orange) River.',
        'Navigate the remote mountain desert passes of the Richtersveld cultural landscape.',
        'Camp under the clearest dark-sky Milky Way in the Southern Hemisphere beside the roaring river.'
      ],
      points: [
        { label: 'Sendelingsdrift Base', y: 15 },
        { label: 'Halfmens Koppie Pass', y: 45 },
        { label: 'Helskloof Mountain Canyon', y: 75 },
        { label: 'De Hoop Orange River Bank', y: 20 },
        { label: 'Potjiespram Oasis Finish', y: 18 }
      ]
    }
  },
  {
    name: 'Magoebaskloof Mist Valley Wilderness Trek',
    prov: 'lp',
    city: 'Haenertsburg',
    date: '2026-12-12',
    dist: ['TK', 'X', 'U'],
    discipline: 'trekking',
    organiser: 'Komatiland Forests & Magoebaskloof Trekkers',
    site: 'magoebasklooftourism.co.za',
    route: {
      note: 'Challenging subtropical rainforest and escarpment trek through mist belts, giant tree ferns, and thunderous mountain waterfalls.',
      directions: [
        'Trail winds down into the deep gorge of the Groot Letaba river basin.',
        'Trek through towering indigenous forests where samango monkeys call from the canopy.',
        'Hike past the roaring Debengeni Falls and climb out onto the misty Wolkberg wilderness ridges.'
      ],
      points: [
        { label: 'Haenertsburg Trailhead', y: 35 },
        { label: 'Dokolewa River Hut', y: 55 },
        { label: 'Debengeni Falls Gorge', y: 40 },
        { label: 'Iron Crown Peak (2,126m)', y: 94 },
        { label: 'Woodbush Rainforest Finish', y: 45 }
      ]
    }
  },
];

export const DIST_LABEL: Record<DistanceCode, string> = {
  M: 'Marathon',
  H: 'Half',
  T: '10km',
  F: '5km',
  U: 'Ultra',
  X: 'Trail',
  TR: 'Track',
  WK: 'Walk',
  HK: 'Hike',
  TK: 'Trek',
};

export const CLUBS: Club[] = [
  {
    name: 'Benoni Northerns AC',
    prov: 'gp',
    city: 'Benoni, East Rand',
    founded: 1980,
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'East Rand athletics since 1980 — one of the anchor clubs of the CGA scene.'
  },
  {
    name: 'Boksburg Athletic Club',
    prov: 'gp',
    city: 'Boksburg',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'A welcoming local running community on the East Rand.'
  },
  {
    name: 'Benoni Harriers',
    prov: 'gp',
    city: 'Morehill, Benoni',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'Community club built around healthy living and inclusive weekly runs.'
  },
  {
    name: 'Daveyton Hearts Athletic Club',
    prov: 'gp',
    city: 'Daveyton, Benoni',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'Township-based club encouraging road running as a way of life.'
  },
  {
    name: 'Gallopers',
    prov: 'gp',
    city: 'Mapleton, Boksburg',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'East Rand club known for its Gallopers time trial series.'
  },
  {
    name: 'Germiston Callies Harriers',
    prov: 'gp',
    city: 'Germiston',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'Old-guard Ekurhuleni harriers club with a long CGA history.'
  },
  {
    name: 'Rand Athletic Club',
    prov: 'gp',
    city: 'Johannesburg',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'One of Joburg’s classic social-and-competitive running clubs.'
  },
  {
    name: 'Randburg Harriers',
    prov: 'gp',
    city: 'Randburg',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'Popular north Joburg club, strong weekly time trials.'
  },
  {
    name: '32Gi Running Club',
    prov: 'gp',
    city: 'Johannesburg South',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'CGA-affiliated club backed by the 32Gi nutrition brand, with race-day fuelling support.'
  },
  {
    name: 'Durban Athletic Club',
    prov: 'kzn',
    city: 'Durban',
    founded: 1879,
    affiliation: 'Athletics KwaZulu-Natal (KZNA)',
    blurb: 'South Africa’s oldest athletic club — running continuously since 1879.'
  },
  {
    name: 'Westville Athletic Club',
    prov: 'kzn',
    city: 'Westville, Durban',
    affiliation: 'Athletics KwaZulu-Natal (KZNA)',
    blurb: 'Nearly 50 years old, with clubhouse facilities and deep KZN road-race representation.'
  },
  {
    name: 'Dolphin Coast Striders',
    prov: 'kzn',
    city: 'Ballito',
    affiliation: 'Athletics KwaZulu-Natal (KZNA)',
    blurb: 'North Coast club drawing runners along the Dolphin Coast.'
  },
  {
    name: 'WP Road Runners Association',
    prov: 'wc',
    city: 'Cape Town',
    affiliation: 'Western Province Athletics',
    blurb: 'Umbrella road-running body coordinating clubs across the Western Cape.'
  },
  {
    name: 'Burnt Run Club Cape Town',
    prov: 'wc',
    city: 'Cape Town',
    affiliation: 'Western Province Athletics',
    blurb: 'Saturday-morning summer running crew based in the city.'
  },
  {
    name: 'Bloemfontein Striders',
    prov: 'fs',
    city: 'Langenhoven Park, Bloemfontein',
    affiliation: 'Athletics Free State (AFS)',
    blurb: '"Where runners become friends" — a social Free State club.'
  },
  {
    name: 'Footprint Athletics Club',
    prov: 'gp',
    city: 'Zuurbekom, Westonaria',
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'CGA-affiliated community club on the West Rand.'
  },
  {
    name: 'Nelspruit Marathon Club',
    prov: 'mp',
    city: 'Mbombela, Lowveld',
    founded: 1982,
    affiliation: 'Athletics Mpumalanga (AMPU)',
    blurb: 'Organisers of the legendary Kaapsehoop Marathon and heart of Lowveld distance running.'
  },
  {
    name: 'Polokwane Athletic Club',
    prov: 'lp',
    city: 'Polokwane',
    affiliation: 'Limpopo Athletics (LIMA)',
    blurb: 'Anchor club of the Capricorn district with regular road and trail time trials.'
  },
  {
    name: 'Kimberley Harriers',
    prov: 'nc',
    city: 'Kimberley',
    founded: 1974,
    affiliation: 'Athletics Griqualand West (AGW)',
    blurb: 'Historic diamond fields running club hosting the annual Diamond Marathon.'
  },
  {
    name: 'Potchefstroom Dorp Harriers',
    prov: 'nw',
    city: 'Potchefstroom',
    affiliation: 'Athletics Central North West (ACNW)',
    blurb: 'Active university town club training on the high altitude North West plains.',
    disciplines: ['road', 'track'],
  },

  // --- WALKING CLUBS ---
  {
    name: 'Cape Town Walking & Striders',
    prov: 'wc',
    city: 'Cape Town',
    founded: 1994,
    affiliation: 'Western Province Athletics (WPA)',
    blurb: 'Premier Western Cape walking club hosting weekend distance walks, speed training, and Sea Point promenades.',
    disciplines: ['walking', 'road'],
  },
  {
    name: 'Johannesburg Race Walkers & Striders',
    prov: 'gp',
    city: 'Johannesburg',
    founded: 1988,
    affiliation: 'Central Gauteng Athletics (CGA)',
    blurb: 'Dedicated race walking and power-walking squad training along Zoo Lake and Westcliff ridges.',
    disciplines: ['walking', 'road'],
  },
  {
    name: 'Durban Golden Mile Walkers',
    prov: 'kzn',
    city: 'Durban',
    founded: 2002,
    affiliation: 'Athletics KwaZulu-Natal (KZNA)',
    blurb: 'Beachfront walking community meeting every dawn along the Golden Mile for 5k-20k fitness walks.',
    disciplines: ['walking'],
  },
  {
    name: 'Friendly City Walking Club',
    prov: 'ec',
    city: 'Gqeberha',
    founded: 2005,
    affiliation: 'Eastern Province Athletics (EPA)',
    blurb: 'Active coastal fitness and race-walking club training along Kings Beach and Cape Recife paths.',
    disciplines: ['walking'],
  },
  {
    name: 'Bloemfontein Nordic & Power Walkers',
    prov: 'fs',
    city: 'Bloemfontein',
    founded: 2011,
    affiliation: 'Athletics Free State (AFS)',
    blurb: 'Passionate Free State walking society training through Tempe, Naval Hill, and botanical garden routes.',
    disciplines: ['walking'],
  },

  // --- HIKING CLUBS ---
  {
    name: 'Mountain Club of South Africa (MCSA Cape Town)',
    prov: 'wc',
    city: 'Cape Town',
    founded: 1891,
    affiliation: 'MCSA National',
    blurb: 'Founded in 1891, South Africa’s premier mountaineering and hiking body maintaining Table Mountain, Cederberg, and Hex River trails.',
    disciplines: ['hiking', 'trekking'],
  },
  {
    name: 'MCSA Johannesburg Section',
    prov: 'gp',
    city: 'Johannesburg',
    founded: 1931,
    affiliation: 'MCSA National',
    blurb: 'Historic mountaineering and hiking club organizing weekend kloofing, Magaliesberg ridge traverses, and Drakensberg hikes.',
    disciplines: ['hiking', 'trekking'],
  },
  {
    name: 'Drakensberg Bushmen Hiking Club',
    prov: 'kzn',
    city: 'Pietermaritzburg',
    founded: 1978,
    affiliation: 'KZN Mountain & Wilderness Guild',
    blurb: 'Leading mountain hiking club exploring the uKhahlamba-Drakensberg escarpment, rock art shelters, and high peaks.',
    disciplines: ['hiking', 'trekking'],
  },
  {
    name: 'Magaliesberg Hikers & Ramblers',
    prov: 'nw',
    city: 'Rustenburg',
    founded: 1985,
    affiliation: 'North West Outdoor & Hiking Association',
    blurb: 'Passionate ridge hikers traversing ancient quartzite kloofs, waterfalls, and biosphere nature sanctuaries.',
    disciplines: ['hiking'],
  },
  {
    name: 'Lowveld Escarpment Hiking Society',
    prov: 'mp',
    city: 'Mbombela',
    founded: 1990,
    affiliation: 'Mpumalanga Trail & Escarpment Union',
    blurb: 'Weekend mountain hikers exploring the breathtaking Blyde River Canyon, God’s Window, and Kaapsehoop trails.',
    disciplines: ['hiking'],
  },
  {
    name: 'Amatola Mountain Ramblers',
    prov: 'ec',
    city: 'Hogsback',
    founded: 1996,
    affiliation: 'Eastern Cape Wilderness Society',
    blurb: 'Hogsback-based mountain hiking guild exploring indigenous yellowwood mist-forests, waterfalls, and Tor Doone.',
    disciplines: ['hiking'],
  },

  // --- TREKKING CLUBS ---
  {
    name: 'Cape Wilderness Trekkers',
    prov: 'wc',
    city: 'Stellenbosch',
    founded: 2004,
    affiliation: 'Western Cape Expedition Society',
    blurb: 'Multi-day backpacking and wilderness trek group covering the Cederberg, Boland trails, and Swartberg passes.',
    disciplines: ['trekking', 'hiking'],
  },
  {
    name: 'Highveld Alpine & Backpacking Club',
    prov: 'gp',
    city: 'Pretoria',
    founded: 1998,
    affiliation: 'Gauteng Wilderness Alliance',
    blurb: 'Self-supported long-distance trekking club training on highveld altitudes for Drakensberg and Karoo traverses.',
    disciplines: ['trekking', 'hiking'],
  },
  {
    name: 'Drakensberg Wilderness Expeditions',
    prov: 'kzn',
    city: 'Underberg',
    founded: 2001,
    affiliation: 'Southern Berg Wilderness Collective',
    blurb: 'Specialists in high-alpine Drakensberg traverses, pass crossings, and alpine plateau survival trekking.',
    disciplines: ['trekking', 'hiking'],
  },
  {
    name: 'Kalahari & Karoo Trekking Society',
    prov: 'nc',
    city: 'Kimberley',
    founded: 2008,
    affiliation: 'Northern Cape Eco-Trekking Forum',
    blurb: 'Endurance desert and canyon trekkers traversing the Richtersveld, Orange River gorge, and vast Karoo plains.',
    disciplines: ['trekking', 'walking'],
  },
  {
    name: 'Limpopo Bushveld Trekkers',
    prov: 'lp',
    city: 'Polokwane',
    founded: 2012,
    affiliation: 'Limpopo Wilderness Collective',
    blurb: 'Wilderness backpacking guild exploring the Soutpansberg peaks, Blouberg wilderness, and Magoebaskloof rain forests.',
    disciplines: ['trekking', 'hiking'],
  },
];

export const PROV_HUE: Record<string, string> = {
  gp: '#e28b37',
  wc: '#4f8fb0',
  kzn: '#b5502f',
  ec: '#7c8f5c',
  fs: '#d8b34a',
  mp: '#9c6bb0',
  lp: '#6ba370',
  nw: '#c96d8e',
  nc: '#8f8f6b',
};

export function getProvince(id: string): Province | undefined {
  return PROVINCES.find((p) => p.id === id);
}

export function formatRaceDate(iso: string): { day: number; mon: string; year: number } {
  const d = new Date(iso + 'T00:00:00');
  const day = d.getDate();
  const mon = d.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();
  return { day, mon, year };
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getClubInitials(name: string): string {
  const words = name
    .replace(/[’']/g, '')
    .split(/\s+/)
    .filter((w) => !['of', 'the', 'and', '&', 'a'].includes(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
