import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchAllData } from "../services/api";
import { normalizeEvents } from "../utils/normalizer";

interface EvidenceDetails {
  location?: string;
  coordinates?: [number, number];
  person?: string;
  occupation?: string;
  suspicionLevel?: number;
  content?: string;
  duration?: string;
  source?: string;
  sender?: string;
  recipient?: string;
  reliability?: number;
  account?: string;
  note?: string;
  message?: string;
  seen_with?: string;
}

interface Evidence {
  id: string;
  type: string;
  timestamp: string;
  details: EvidenceDetails | any;
}

interface DataContextType {
  evidence: Evidence[];
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchAllData();
        const processedEvents = normalizeEvents(rawData);

        const mappedEvidence = processedEvents.map((evt: any) => {
          let coords = undefined;
          if (evt.details.coordinates) {
             const lat = parseFloat(evt.details.coordinates.split(",")[0]);
             const lng = parseFloat(evt.details.coordinates.split(",")[1]);
             if (!isNaN(lat) && !isNaN(lng)) {
               coords = [lat, lng];
             }
          }

          return {
            id: evt.id,
            type: evt.type,
            timestamp: evt.timestamp,
            details: {
              ...evt.details,
              person: evt.details.person || evt.details.personName || evt.details.suspectName || evt.details.senderName || evt.details.authorName || evt.details.name || 'Unknown',
              content: evt.details.note || evt.details.tip || evt.details.text || evt.details.message || '',
              coordinates: coords,
              sender: evt.details.senderName || evt.details.authorName,
              recipient: evt.details.recipientName || evt.details.seenWith || evt.details.mentionedPeople,
              reliability: evt.details.confidence || evt.details.urgency,
            }
          };
        });

        setEvidence(mappedEvidence);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load case files.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ evidence, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}
