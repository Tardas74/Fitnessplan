import { openDB } from 'idb';

const DB_NAME = 'puls-os-fitness';
const DB_VERSION = 1;

let db = null;

export async function initDB() {
  if (db) return db;

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store für Session Feedback
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
        sessionStore.createIndex('date', 'date', { unique: false });
      }

      // Store für Sleep Data
      if (!db.objectStoreNames.contains('sleep')) {
        const sleepStore = db.createObjectStore('sleep', { keyPath: 'id', autoIncrement: true });
        sleepStore.createIndex('date', 'date', { unique: true });
      }

      // Store für Water Intake
      if (!db.objectStoreNames.contains('water')) {
        const waterStore = db.createObjectStore('water', { keyPath: 'id', autoIncrement: true });
        waterStore.createIndex('date', 'date', { unique: false });
      }

      // Store für Body Measurements
      if (!db.objectStoreNames.contains('measurements')) {
        const measureStore = db.createObjectStore('measurements', { keyPath: 'id', autoIncrement: true });
        measureStore.createIndex('date', 'date', { unique: false });
      }

      // Store für Workout Log
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutStore = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
        workoutStore.createIndex('date', 'date', { unique: false });
      }

      // Store für Fotos
      if (!db.objectStoreNames.contains('photos')) {
        const photoStore = db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
        photoStore.createIndex('date', 'date', { unique: false });
      }

      // Store für Sync Queue (GitHub)
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    },
  });

  return db;
}

// SESSION FEEDBACK
export async function addSession(sessionData) {
  const database = await initDB();
  return database.add('sessions', {
    ...sessionData,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
  });
}

export async function getSessions(dateFrom, dateTo) {
  const database = await initDB();
  const index = database.transaction('sessions').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

export async function getSessionsThisWeek() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const dateFrom = weekStart.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  return getSessions(dateFrom, dateTo);
}

// SLEEP TRACKING
export async function setSleepData(sleepData) {
  const database = await initDB();
  const date = sleepData.date || new Date().toISOString().split('T')[0];
  const existing = await database.get('sleep', date);
  if (existing) {
    return database.put('sleep', { ...sleepData, id: existing.id, date });
  }
  return database.add('sleep', { ...sleepData, date });
}

export async function getSleepData(date) {
  const database = await initDB();
  return database.get('sleep', date || new Date().toISOString().split('T')[0]);
}

export async function getSleepThisWeek() {
  const database = await initDB();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const dateFrom = weekStart.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  const index = database.transaction('sleep').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

export async function getSleepLastWeek() {
  const database = await initDB();
  const today = new Date();
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
  const lastWeekEnd = new Date(today);
  lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
  const dateFrom = lastWeekStart.toISOString().split('T')[0];
  const dateTo = lastWeekEnd.toISOString().split('T')[0];
  const index = database.transaction('sleep').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

export async function getSleepThisMonth() {
  const database = await initDB();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateFrom = monthStart.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  const index = database.transaction('sleep').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

// WATER TRACKING
export async function addWaterIntake(amount) {
  const database = await initDB();
  return database.add('water', {
    amount,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
  });
}

export async function getWaterToday() {
  const database = await initDB();
  const today = new Date().toISOString().split('T')[0];
  const index = database.transaction('water').store.index('date');
  const records = await index.getAll(today);
  return records.reduce((sum, r) => sum + r.amount, 0);
}

export async function getWaterThisWeek() {
  const database = await initDB();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const dateFrom = weekStart.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  const index = database.transaction('water').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

// MEASUREMENTS
export async function addMeasurement(data) {
  const database = await initDB();
  return database.add('measurements', {
    ...data,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
  });
}

export async function getMeasurementsThisMonth() {
  const database = await initDB();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateFrom = monthStart.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  const index = database.transaction('measurements').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

// PHOTOS
export async function addPhoto(photoData) {
  const database = await initDB();
  return database.add('photos', {
    ...photoData,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
  });
}

export async function getPhotosThisMonth() {
  const database = await initDB();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateFrom = monthStart.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  const index = database.transaction('photos').store.index('date');
  return index.getAll(IDBKeyRange.bound(dateFrom, dateTo));
}

// SYNC QUEUE
export async function addToSyncQueue(data) {
  const database = await initDB();
  return database.add('syncQueue', {
    ...data,
    timestamp: Date.now(),
    synced: false,
  });
}

export async function getSyncQueue() {
  const database = await initDB();
  const tx = database.transaction('syncQueue');
  return tx.store.getAll();
}

export async function markSynced(id) {
  const database = await initDB();
  const record = await database.get('syncQueue', id);
  if (record) {
    record.synced = true;
    return database.put('syncQueue', record);
  }
}

export async function clearSyncedItems() {
  const database = await initDB();
  const items = await getSyncQueue();
  for (const item of items) {
    if (item.synced) {
      await database.delete('syncQueue', item.id);
    }
  }
}
