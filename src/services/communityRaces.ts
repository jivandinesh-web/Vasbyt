import {
  db,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  FirebaseUser,
} from '../lib/firebase';
import { Race, CommunityRaceSubmission, RouteProfile } from '../types';
import { getEnrichedRaceRoute } from '../utils/routeData';

const LOCAL_STORAGE_KEY = 'vasbyt:custom_races';

export interface StoredCommunityRace extends CommunityRaceSubmission {
  id: string;
  createdByUid: string;
  createdByName: string;
  createdAt: string;
}

// Convert a community race document into a standard application Race object
export function transformCommunityRaceToRace(item: StoredCommunityRace): Race {
  const customRoute: RouteProfile = {
    note: item.notes || `${item.name} fixture in ${item.city}, ${item.prov.toUpperCase()}`,
    directions: [
      `Start at ${item.city} staging area`,
      item.courseType === 'Loop'
        ? `Follow scenic loop through ${item.city}`
        : item.courseType === 'Out & Back'
        ? `Turn around at halfway mark`
        : `Progress point-to-point along designated course`,
      `Official finish line with hydration and medal ceremony`,
    ],
    points: [
      { label: 'Start', y: 20 },
      { label: 'Q1', y: item.totalAscentM && item.totalAscentM > 300 ? 55 : 35 },
      { label: 'Half', y: item.totalAscentM && item.totalAscentM > 500 ? 80 : 45 },
      { label: 'Q3', y: 40 },
      { label: 'Finish', y: 20 },
    ],
    totalAscentM: item.totalAscentM,
    totalDescentM: item.totalDescentM,
    courseType: item.courseType || 'Loop',
    surface: (item.surface as any) || (item.discipline === 'trail' ? 'Mountain Singletrack' : 'Asphalt Road'),
    cutoffTime: item.cutoffTime || '06:00:00',
    waterTablesCount: item.waterTablesCount || 4,
  };

  // Ensure distance codes array exists
  const distCodes = item.dist && item.dist.length > 0 ? item.dist : ['10k' as any];

  return {
    id: item.id,
    name: item.name,
    prov: item.prov.toLowerCase(),
    city: item.city,
    date: item.date,
    dist: distCodes,
    discipline: item.discipline,
    organiser: item.organiser || (item.createdByName ? `Club / ${item.createdByName}` : 'Community Submitted'),
    site: item.site || '',
    route: customRoute,
    isCommunity: true,
    createdByUid: item.createdByUid,
    createdByName: item.createdByName,
    createdAt: item.createdAt,
  };
}

// Load local races from localStorage
export function getLocalCommunityRaces(): StoredCommunityRace[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load custom races from localStorage', err);
    return [];
  }
}

// Save local races to localStorage
export function saveLocalCommunityRaces(races: StoredCommunityRace[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(races));
  } catch (err) {
    console.error('Failed to save custom races to localStorage', err);
  }
}

// Subscribe to real-time community races from Firestore
export function subscribeToCommunityRaces(
  onRacesChanged: (races: StoredCommunityRace[]) => void
): () => void {
  const collectionPath = 'communityRaces';
  try {
    const colRef = collection(db, collectionPath);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const cloudRaces: StoredCommunityRace[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StoredCommunityRace;
          cloudRaces.push({
            ...data,
            id: docSnap.id,
          });
        });

        // Merge with local storage (ensure local races are not lost if offline)
        const localRaces = getLocalCommunityRaces();
        const mergedMap = new Map<string, StoredCommunityRace>();

        // Cloud takes precedence for confirmed shared fixtures
        cloudRaces.forEach((r) => mergedMap.set(r.id, r));
        localRaces.forEach((r) => {
          if (!mergedMap.has(r.id)) {
            mergedMap.set(r.id, r);
          }
        });

        const allRaces = Array.from(mergedMap.values());
        // Sort chronologically by date
        allRaces.sort((a, b) => a.date.localeCompare(b.date));
        onRacesChanged(allRaces);
      },
      (error) => {
        console.warn('Firestore community races subscription error; falling back to local storage:', error.message);
        const fallback = getLocalCommunityRaces();
        fallback.sort((a, b) => a.date.localeCompare(b.date));
        onRacesChanged(fallback);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('Could not initialize Firestore community listener:', error);
    const fallback = getLocalCommunityRaces();
    onRacesChanged(fallback);
    return () => {};
  }
}

// Create / Publish a race
export async function createCommunityRace(
  submission: CommunityRaceSubmission,
  currentUser: FirebaseUser | null
): Promise<StoredCommunityRace> {
  // Generate safe alphanumeric document ID
  const sanitizedSlug = submission.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const raceId = `race-${sanitizedSlug}-${randomSuffix}`;

  const record: StoredCommunityRace = {
    ...submission,
    id: raceId,
    createdByUid: currentUser ? currentUser.uid : 'local-runner',
    createdByName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Community Athlete',
    createdAt: new Date().toISOString(),
  };

  // Always save to localStorage immediately for instant UI feedback
  const localList = getLocalCommunityRaces();
  saveLocalCommunityRaces([record, ...localList.filter((r) => r.id !== raceId)]);

  // If user is authenticated, sync to Firestore
  if (currentUser) {
    const docPath = `communityRaces/${raceId}`;
    try {
      const docRef = doc(db, 'communityRaces', raceId);
      // Clean undefined values for Firestore serialization
      const payload: Record<string, any> = {
        name: record.name,
        prov: record.prov,
        city: record.city,
        date: record.date,
        dist: record.dist,
        discipline: record.discipline,
        createdByUid: record.createdByUid,
        createdByName: record.createdByName,
        createdAt: record.createdAt,
      };

      if (record.organiser) payload.organiser = record.organiser;
      if (record.site) payload.site = record.site;
      if (typeof record.totalAscentM === 'number') payload.totalAscentM = record.totalAscentM;
      if (typeof record.totalDescentM === 'number') payload.totalDescentM = record.totalDescentM;
      if (record.courseType) payload.courseType = record.courseType;
      if (record.surface) payload.surface = record.surface;
      if (record.cutoffTime) payload.cutoffTime = record.cutoffTime;
      if (typeof record.waterTablesCount === 'number') payload.waterTablesCount = record.waterTablesCount;
      if (record.notes) payload.notes = record.notes;

      await setDoc(docRef, payload);
    } catch (error) {
      console.warn('Could not publish race to cloud Firestore; saved locally:', error);
      // Do not crash, since local storage was already updated
    }
  }

  return record;
}

// Delete a race
export async function deleteCommunityRace(
  raceId: string,
  currentUser: FirebaseUser | null
): Promise<void> {
  // Remove from local storage
  const localList = getLocalCommunityRaces();
  saveLocalCommunityRaces(localList.filter((r) => r.id !== raceId));

  // If authenticated, attempt deletion in Firestore
  if (currentUser) {
    try {
      const docRef = doc(db, 'communityRaces', raceId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Could not delete race from cloud Firestore:', error);
    }
  }
}
