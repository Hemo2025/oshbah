import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../firebase/config";

const settingsRef = doc(db, "settings", "store");

export async function getSettings() {
  const snap = await getDoc(settingsRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}

export async function saveSettings(data) {
  await setDoc(settingsRef, data, {
    merge: true,
  });
}
