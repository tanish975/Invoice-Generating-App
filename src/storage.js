import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "lr_records_v1";
const SEQ_KEY = "lr_seq_v1";

export async function loadRecords() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveRecords(records) {
  await AsyncStorage.setItem(KEY, JSON.stringify(records));
}

export async function nextCNNo() {
  const raw = await AsyncStorage.getItem(SEQ_KEY);
  const n = (raw ? parseInt(raw, 10) : 2930) + 1;
  await AsyncStorage.setItem(SEQ_KEY, String(n));
  return n;
}

export async function addRecord(record) {
  const records = await loadRecords();
  records.unshift(record);
  await saveRecords(records);
  return records;
}

export async function removeRecord(id) {
  const records = await loadRecords();
  const next = records.filter((r) => r.id !== id);
  await saveRecords(next);
  return next;
}
