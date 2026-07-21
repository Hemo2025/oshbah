import { useEffect } from "react";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function VisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await setDoc(
          doc(db, "stats", "visits"),
          {
            total: increment(1),
          },
          { merge: true },
        );
      } catch (error) {
        console.error("Visit tracking error:", error);
      }
    };

    trackVisit();
  }, []);

  return null;
}
