export interface TimelineActivity {
  id: string;
  type: string;
  timestamp: string;
  suspicionLevel?: string;
  location?: string;
  message?: string;
  sender?: string;
  receiver?: string;
  seenWith?: string;
  note?: string;
}
export interface Person {
  id: string;
  name: string;
  status: string;
  avatar: string;
  recordCount: number;
  activities: TimelineActivity[];
}
export interface LocationData {
  id: string;
  name: string;
  status: string;
  recordCount: number;
  activities: TimelineActivity[];
}
