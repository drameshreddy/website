import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";

interface SensorEntry {
  id: string;
  distance_cm: number;
  timestamp?: number;
}

const LiveSensorFeed = () => {
  const [data, setData] = useState<SensorEntry[]>([]);

  useEffect(() => {
    const sensorRef = ref(database, "/");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const snapshotVal = snapshot.val();
      if (snapshotVal) {
        const parsed = Object.entries(snapshotVal).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        }));
        setData(parsed.reverse()); // latest first
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live Sensor Readings</h2>
      <ul className="space-y-2">
        {data.map((entry) => (
          <li key={entry.id} className="border p-2 rounded shadow">
            <strong>{entry.distance_cm} cm</strong> –{" "}
            {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : "No time"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveSensorFeed;
