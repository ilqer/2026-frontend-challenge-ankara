import { useMemo, useState, useEffect } from 'react';
import { PersonList } from '../components/PersonList';
import { ProfilePage } from '../components/ProfilePage';
import { EmptyState } from '../components/EmptyState';

export function LocationsView({ evidence }: { evidence: any[] }) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  useEffect(() => {
    const handleSelectLocation = (e: any) => {
      setSelectedLocationId(e.detail);
    };
    window.addEventListener('selectLocation', handleSelectLocation);
    return () => window.removeEventListener('selectLocation', handleSelectLocation);
  }, []);

  const locations = useMemo(() => {
    const lMap = new Map();
    evidence.forEach((e: any) => {
      const loc = e.details.location;
      if (!loc) return;
      if (!lMap.has(loc)) {
        lMap.set(loc, {
          id: loc,
          name: loc,
          status: 'unknown',
          avatar: loc.substring(0, 2).toUpperCase(),
          recordCount: 0,
          activities: []
        });
      }
      const locationEntity = lMap.get(loc);
      locationEntity.recordCount++;
      locationEntity.activities.push({
        id: e.id,
        type: e.type || 'checkin',
        timestamp: e.timestamp,
        suspicionLevel: e.details.suspicionLevel > 70 ? 'high' : e.details.suspicionLevel > 40 ? 'medium' : 'low',
        location: e.details.location,
        message: e.details.message || e.details.content,
        sender: e.details.sender,
        receiver: e.details.recipient || e.details.receiver,
        seenWith: e.details.seen_with,
        note: e.details.note
      });
      lMap.set(loc, locationEntity);
    });
    return Array.from(lMap.values());
  }, [evidence]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  return (
    <div className="flex flex-1 h-full w-full bg-slate-50 dark:bg-[#1C1F26] min-h-0">
      <div className="w-80 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1F26] flex-shrink-0 flex flex-col min-h-0">
        <PersonList
          people={locations}
          selectedPersonId={selectedLocationId}
          onSelectPerson={(l) => setSelectedLocationId(l.id)}
        />
      </div>
      <div className="flex-1 overflow-hidden h-full bg-slate-50 dark:bg-[#1C1F26] min-h-0">
        {selectedLocation ? (
          <ProfilePage
            person={selectedLocation}
            onPersonClick={(id, name) => {
              window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'users' }));
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('selectUser', { detail: name }));
              }, 50);
            }}
            onLocationClick={(loc) => setSelectedLocationId(loc)}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
