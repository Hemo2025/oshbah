import admin from "firebase-admin";

console.log("PROJECT ID:", process.env.FIREBASE_PROJECT_ID);
console.log(
  "CLIENT EMAIL:",
  process.env.FIREBASE_CLIENT_EMAIL ? "EXISTS" : "MISSING",
);
console.log(
  "PRIVATE KEY:",
  process.env.FIREBASE_PRIVATE_KEY ? "EXISTS" : "MISSING",
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = admin.firestore();
