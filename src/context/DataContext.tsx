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

const normalizeName = (name: string): string => {
  if (!name) return name;

  // Custom normalization rules for known variants
  const n = name.trim();
  if (n.match(/kagan/i) || n.match(/kağan/i)) return 'Kağan';
  if (n.match(/gülşah/i) || n.match(/gulsah/i)) return 'Gülşah';

  return n
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
    })
    .join(' ');
};

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

          let personRaw = evt.details.person || evt.details.personName || evt.details.suspectName || evt.details.senderName || evt.details.authorName || evt.details.name || 'Unknown';
          const person = personRaw === 'Unknown' ? personRaw : normalizeName(personRaw);
          const sender = evt.details.senderName || evt.details.authorName || evt.details.sender;
          const recipient = evt.details.recipientName || evt.details.seenWith || evt.details.mentionedPeople || evt.details.recipient || evt.details.receiver;

          return {
            id: evt.id,
            type: evt.type,
            timestamp: evt.timestamp,
            details: {
              ...evt.details,
              person: person,
              content: evt.details.note || evt.details.tip || evt.details.text || evt.details.message || '',
              coordinates: coords,
              sender: sender ? normalizeName(sender) : sender,
              recipient: recipient ? normalizeName(recipient) : recipient,
              seen_with: evt.details.seen_with ? normalizeName(evt.details.seen_with) : evt.details.seen_with,
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
