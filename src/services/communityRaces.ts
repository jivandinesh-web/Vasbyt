import {
  db,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  FirebaseUser,
} from '../lib/firebase';
import { Race, CommunityRaceSubmission, RouteProfile, Discipline } from '../types';
import { isAdminUser } from '../utils/admin';

const LOCAL_STORAGE_KEY = 'vasbyt:custom_races';

export interface StoredCommunityRace extends CommunityRaceSubmission {
  id: string;
  createdByUid: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
  updatedByUid?: string;
}

/**
 * Generates a normalized signature key to detect duplicate race fixtures
 * across cloud Firestore records, local storage, and static datasets.
 */
export function getRaceDeduplicationKey(name: string, date: string, prov: string): string {
  const normName = (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const normDate = (date || '').trim();
  const normProv = (prov || '').trim().toLowerCase();
  return `${normName}|${normDate}|${normProv}`;
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
  const discList: Discipline[] = (
    item.disciplines && item.disciplines.length > 0
      ? item.disciplines
      : item.discipline
      ? [item.discipline]
      : ['road']
  ) as Discipline[];

  return {
    id: item.id,
    name: item.name,
    prov: item.prov.toLowerCase(),
    city: item.city,
    date: item.date,
    dist: distCodes,
    discipline: discList[0] || 'road',
    disciplines: discList,
    organiser: item.organiser || (item.createdByName ? `Club / ${item.createdByName}` : 'Community Submitted'),
    site: item.site || '',
    route: customRoute,
    isCommunity: true,
    createdByUid: item.createdByUid,
    createdByName: item.createdByName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    status: item.status || 'scheduled',
    statusNotice: item.statusNotice || '',
    newDate: item.newDate,
    originalName: item.originalName,
    originalDate: item.originalDate,
    originalProv: item.originalProv,
    series: item.series,
    isCorporate: item.isCorporate,
  };
}

/**
 * Merges official static fixtures and community/custom fixtures, ensuring that:
 * 1. Community fixtures take precedence over official fixtures.
 * 2. If an official fixture was edited by an admin (tracked via originalName or key),
 *    the admin's edited fixture cleanly overrides and replaces the static fixture.
 * 3. Duplicate fixtures are eliminated.
 */
export function mergeRacesWithOverrides(
  communityRaces: StoredCommunityRace[],
  staticRaces: Race[]
): Race[] {
  const customList = communityRaces.map(transformCommunityRaceToRace);

  // Set of keys and names overridden by custom/admin updates
  const overriddenKeys = new Set<string>();
  const overriddenNames = new Set<string>();

  for (const cr of customList) {
    if (cr.originalName) {
      overriddenNames.add(cr.originalName.trim().toLowerCase());
      if (cr.originalDate) {
        overriddenKeys.add(getRaceDeduplicationKey(cr.originalName, cr.originalDate, cr.originalProv || cr.prov));
      }
    }
    // Also match the current name/date/prov
    overriddenKeys.add(getRaceDeduplicationKey(cr.name, cr.date, cr.prov));
  }

  const result: Race[] = [...customList];
  const seenKeys = new Set<string>();
  for (const cr of customList) {
    seenKeys.add(getRaceDeduplicationKey(cr.name, cr.date, cr.prov));
  }

  for (const sr of staticRaces) {
    const key = getRaceDeduplicationKey(sr.name, sr.date, sr.prov);
    const normName = sr.name.trim().toLowerCase();
    if (!overriddenKeys.has(key) && !overriddenNames.has(normName) && !seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(sr);
    }
  }

  return result;
}

// Load local races from localStorage with automatic duplicate elimination
export function getLocalCommunityRaces(): StoredCommunityRace[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Deduplicate by race key to prevent duplicate entries from piling up
    const seenKeys = new Set<string>();
    const deduplicated: StoredCommunityRace[] = [];
    for (const r of parsed) {
      if (!r || !r.name || !r.date) continue;
      const key = getRaceDeduplicationKey(r.name, r.date, r.prov || '');
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        deduplicated.push(r);
      }
    }
    return deduplicated;
  } catch (err) {
    console.error('Failed to load custom races from localStorage', err);
    return [];
  }
}

// Save local races to localStorage ensuring no duplicates exist
export function saveLocalCommunityRaces(races: StoredCommunityRace[]): void {
  try {
    const seenKeys = new Set<string>();
    const deduplicated: StoredCommunityRace[] = [];
    for (const r of races) {
      if (!r || !r.name || !r.date) continue;
      const key = getRaceDeduplicationKey(r.name, r.date, r.prov || '');
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        deduplicated.push(r);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deduplicated));
  } catch (err) {
    console.error('Failed to save custom races to localStorage', err);
  }
}

// Subscribe to real-time community races from Firestore with auto-pruning of duplicate documents
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

        // Deduplicate cloud races: if multiple cloud documents share the same name + date + prov,
        // keep the earliest one and silently prune redundant duplicates from Firestore
        const seenCloudKeys = new Map<string, string>(); // key -> docId
        const uniqueCloudRaces: StoredCommunityRace[] = [];

        for (const r of cloudRaces) {
          const key = getRaceDeduplicationKey(r.name, r.date, r.prov);
          if (!seenCloudKeys.has(key)) {
            seenCloudKeys.set(key, r.id);
            uniqueCloudRaces.push(r);
          } else {
            // Redundant duplicate document in Firestore! Prune it from the database
            const dupId = r.id;
            try {
              const docRef = doc(db, 'communityRaces', dupId);
              deleteDoc(docRef).catch((e) => {
                console.warn('Could not auto-prune duplicate race doc from Firestore:', dupId, e);
              });
            } catch (err) {
              console.warn('Auto-prune error:', err);
            }
          }
        }

        // Merge with local storage (ensure local races are not lost if offline)
        const localRaces = getLocalCommunityRaces();
        const merged: StoredCommunityRace[] = [...uniqueCloudRaces];
        const cleanedLocal: StoredCommunityRace[] = [];

        localRaces.forEach((r) => {
          const key = getRaceDeduplicationKey(r.name, r.date, r.prov);
          if (!seenCloudKeys.has(key)) {
            seenCloudKeys.set(key, r.id);
            merged.push(r);
            cleanedLocal.push(r);
          }
        });

        // Sync deduplicated clean list back to local storage
        saveLocalCommunityRaces(cleanedLocal);

        // Sort chronologically by date
        merged.sort((a, b) => a.date.localeCompare(b.date));
        onRacesChanged(merged);
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

// Create / Publish a race with deterministic document ID and admin authorization
export async function createCommunityRace(
  submission: CommunityRaceSubmission,
  currentUser: FirebaseUser | null
): Promise<StoredCommunityRace> {
  // Enforce admin permission: Only admins can publish race fixtures
  if (!currentUser || !isAdminUser(currentUser)) {
    throw new Error('Unauthorized: Only administrators (jivandinesh@gmail.com) can add or publish race fixtures to the calendar.');
  }

  // Generate deterministic slug based on race name, date, and province
  // This guarantees that re-submitting or re-saving the same race updates the document rather than duplicating it!
  const sanitizedSlug = submission.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 36);
  const dateKey = (submission.date || '').replace(/[^0-9]/g, '');
  const provKey = (submission.prov || '').toLowerCase().trim();
  const raceId = `race-${sanitizedSlug}-${dateKey}-${provKey}`;

  const record: StoredCommunityRace = {
    ...submission,
    id: raceId,
    createdByUid: currentUser.uid,
    createdByName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Administrator',
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage with duplicate filtering
  const localList = getLocalCommunityRaces();
  saveLocalCommunityRaces([record, ...localList.filter((r) => r.id !== raceId)]);

  // Persist to cloud Firestore
  try {
    const docRef = doc(db, 'communityRaces', raceId);
    const discList = record.disciplines && record.disciplines.length > 0
      ? record.disciplines
      : [record.discipline];
    // Clean undefined values for Firestore serialization
    const payload: Record<string, any> = {
      name: record.name,
      prov: record.prov,
      city: record.city,
      date: record.date,
      dist: record.dist,
      discipline: discList[0] || record.discipline,
      disciplines: discList,
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
    if (record.waterTablesCount !== undefined) payload.waterTablesCount = record.waterTablesCount;
    if (record.notes) payload.notes = record.notes;
    if (record.status) payload.status = record.status;
    if (record.statusNotice) payload.statusNotice = record.statusNotice;
    if (record.newDate) payload.newDate = record.newDate;
    if (record.originalName) payload.originalName = record.originalName;
    if (record.originalDate) payload.originalDate = record.originalDate;
    if (record.originalProv) payload.originalProv = record.originalProv;
    if (record.series) payload.series = record.series;
    if (typeof record.isCorporate === 'boolean') payload.isCorporate = record.isCorporate;
    if (record.updatedAt) payload.updatedAt = record.updatedAt;

    await setDoc(docRef, payload);
  } catch (error) {
    console.warn('Could not publish race to cloud Firestore; saved locally:', error);
  }

  return record;
}

// Update an existing community or customized race fixture
export async function updateCommunityRace(
  raceId: string,
  submission: CommunityRaceSubmission,
  currentUser: FirebaseUser | null
): Promise<StoredCommunityRace> {
  if (!currentUser || !isAdminUser(currentUser)) {
    throw new Error('Unauthorized: Only administrators (jivandinesh@gmail.com) can edit race fixtures.');
  }

  const localList = getLocalCommunityRaces();
  const existing = localList.find((r) => r.id === raceId);

  const updatedRecord: StoredCommunityRace = {
    ...submission,
    id: raceId,
    createdByUid: existing?.createdByUid || currentUser.uid,
    createdByName: existing?.createdByName || currentUser.displayName || currentUser.email?.split('@')[0] || 'Administrator',
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update local storage
  saveLocalCommunityRaces([
    updatedRecord,
    ...localList.filter((r) => r.id !== raceId),
  ]);

  // Persist to cloud Firestore
  try {
    const docRef = doc(db, 'communityRaces', raceId);
    const discList = updatedRecord.disciplines && updatedRecord.disciplines.length > 0
      ? updatedRecord.disciplines
      : [updatedRecord.discipline];
    const payload: Record<string, any> = {
      name: updatedRecord.name,
      prov: updatedRecord.prov,
      city: updatedRecord.city,
      date: updatedRecord.date,
      dist: updatedRecord.dist,
      discipline: discList[0] || updatedRecord.discipline,
      disciplines: discList,
      createdByUid: updatedRecord.createdByUid,
      createdByName: updatedRecord.createdByName,
      createdAt: updatedRecord.createdAt,
      updatedAt: updatedRecord.updatedAt,
      status: updatedRecord.status || 'scheduled',
      statusNotice: updatedRecord.statusNotice || '',
    };

    if (updatedRecord.organiser) payload.organiser = updatedRecord.organiser;
    if (updatedRecord.site) payload.site = updatedRecord.site;
    if (typeof updatedRecord.totalAscentM === 'number') payload.totalAscentM = updatedRecord.totalAscentM;
    if (typeof updatedRecord.totalDescentM === 'number') payload.totalDescentM = updatedRecord.totalDescentM;
    if (updatedRecord.courseType) payload.courseType = updatedRecord.courseType;
    if (updatedRecord.surface) payload.surface = updatedRecord.surface;
    if (updatedRecord.cutoffTime) payload.cutoffTime = updatedRecord.cutoffTime;
    if (typeof updatedRecord.waterTablesCount === 'number') payload.waterTablesCount = updatedRecord.waterTablesCount;
    if (updatedRecord.notes) payload.notes = updatedRecord.notes;
    if (updatedRecord.newDate) payload.newDate = updatedRecord.newDate;
    if (updatedRecord.originalName) payload.originalName = updatedRecord.originalName;
    if (updatedRecord.originalDate) payload.originalDate = updatedRecord.originalDate;
    if (updatedRecord.originalProv) payload.originalProv = updatedRecord.originalProv;
    if (updatedRecord.series) payload.series = updatedRecord.series;
    if (typeof updatedRecord.isCorporate === 'boolean') payload.isCorporate = updatedRecord.isCorporate;

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.warn('Could not update race in cloud Firestore; saved locally:', error);
  }

  return updatedRecord;
}

/**
 * Universal handler to edit ANY event in the portal (whether an existing custom race
 * or an official race that was previously static).
 */
export async function saveOrUpdateRace(
  submission: CommunityRaceSubmission,
  originalRace: Race,
  currentUser: FirebaseUser | null
): Promise<StoredCommunityRace> {
  if (!currentUser || !isAdminUser(currentUser)) {
    throw new Error('Unauthorized: Only administrators can edit race fixtures.');
  }

  if (originalRace.id && originalRace.isCommunity) {
    // Updating an existing community-managed race
    return updateCommunityRace(originalRace.id, submission, currentUser);
  }

  // Overriding/editing an official static race fixture for the first time
  const sanitizedSlug = originalRace.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 32);
  const dateKey = (originalRace.date || '').replace(/[^0-9]/g, '');
  const provKey = (originalRace.prov || '').toLowerCase().trim();
  const overrideId = `race-override-${sanitizedSlug}-${dateKey}-${provKey}`;

  const submissionWithOriginal: CommunityRaceSubmission = {
    ...submission,
    originalName: originalRace.name,
    originalDate: originalRace.date,
    originalProv: originalRace.prov,
  };

  const record: StoredCommunityRace = {
    ...submissionWithOriginal,
    id: overrideId,
    createdByUid: currentUser.uid,
    createdByName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Administrator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const localList = getLocalCommunityRaces();
  saveLocalCommunityRaces([record, ...localList.filter((r) => r.id !== overrideId)]);

  try {
    const docRef = doc(db, 'communityRaces', overrideId);
    const discList = record.disciplines && record.disciplines.length > 0
      ? record.disciplines
      : [record.discipline];
    const payload: Record<string, any> = {
      name: record.name,
      prov: record.prov,
      city: record.city,
      date: record.date,
      dist: record.dist,
      discipline: discList[0] || record.discipline,
      disciplines: discList,
      createdByUid: record.createdByUid,
      createdByName: record.createdByName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      status: record.status || 'scheduled',
      statusNotice: record.statusNotice || '',
      originalName: originalRace.name,
      originalDate: originalRace.date,
      originalProv: originalRace.prov,
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
    if (record.newDate) payload.newDate = record.newDate;

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.warn('Could not save race override to Firestore; saved locally:', error);
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

  // Attempt deletion in Firestore
  try {
    const docRef = doc(db, 'communityRaces', raceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Could not delete race from cloud Firestore:', error);
  }
}

/**
 * Scans all community races and prunes any duplicate entries across cloud & local storage,
 * keeping the original fixture and removing redundant duplicates.
 * Returns the count of deleted duplicate documents.
 */
export async function pruneDuplicateCommunityRaces(
  currentRaces: StoredCommunityRace[],
  currentUser: FirebaseUser | null
): Promise<number> {
  const seenKeys = new Map<string, string>(); // key -> primary id
  const duplicateIds: string[] = [];

  for (const r of currentRaces) {
    if (!r.name || !r.date) continue;
    const key = getRaceDeduplicationKey(r.name, r.date, r.prov || '');
    if (seenKeys.has(key)) {
      duplicateIds.push(r.id);
    } else {
      seenKeys.set(key, r.id);
    }
  }

  for (const id of duplicateIds) {
    await deleteCommunityRace(id, currentUser);
  }

  return duplicateIds.length;
}


