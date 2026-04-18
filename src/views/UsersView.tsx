import { useMemo, useState, useEffect } from 'react';
import { PersonList } from '../components/PersonList';
import { ProfilePage } from '../components/ProfilePage';
import { EmptyState } from '../components/EmptyState';

export function UsersView({ evidence }: { evidence: any[] }) {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  useEffect(() => {
    const handleSelectUser = (e: any) => {
      setSelectedPersonId(e.detail);
    };
    window.addEventListener('selectUser', handleSelectUser);
    return () => window.removeEventListener('selectUser', handleSelectUser);
  }, []);

  const people = useMemo(() => {
    const pMap = new Map();
    evidence.forEach((e: any) => {
      const p = e.details.person || e.details.sender || e.details.receiver;
      if (!p || ["unknown", "event staff"].includes(p.toLowerCase())) return;
      if (!pMap.has(p)) {
        pMap.set(p, {
          id: p,
          name: p,
          status: 'unknown',
          avatar: p.substring(0, 2).toUpperCase(),
          recordCount: 0,
          activities: []
        });
      }
      const person = pMap.get(p);
      person.recordCount++;
      person.activities.push({
        id: e.id,
        type: e.type || 'note',
        timestamp: e.timestamp,
        suspicionLevel: e.details.suspicionLevel > 70 ? 'high' : e.details.suspicionLevel > 40 ? 'medium' : 'low',
        location: e.details.location,
        message: e.details.message || e.details.content,
        sender: e.details.sender,
        receiver: e.details.recipient || e.details.receiver,
        seenWith: e.details.seen_with,
        note: e.details.note
      });
      pMap.set(p, person);
    });
    return Array.from(pMap.values()).sort((a: any, b: any) => b.recordCount - a.recordCount);
  }, [evidence]);

  const selectedPerson = people.find(p => p.id === selectedPersonId);

  return (
    <div className="flex flex-1 h-full w-full bg-slate-50 dark:bg-[#1C1F26] min-h-0">
      <div className="w-80 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1F26] flex-shrink-0 flex flex-col min-h-0">
        <PersonList
          people={people}
          selectedPersonId={selectedPersonId}
          onSelectPerson={(p) => setSelectedPersonId(p.id)}
        />
      </div>
      <div className="flex-1 overflow-hidden h-full bg-slate-50 dark:bg-[#1C1F26] min-h-0">
        {selectedPerson ? (
          <ProfilePage
            person={selectedPerson}
            validPersonNames={people.map((p: any) => p.name)}
            onPersonClick={(id, name) => setSelectedPersonId(name)}
            onLocationClick={(loc) => {
              window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'locations' }));
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('selectLocation', { detail: loc }));
              }, 50);
            }}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
