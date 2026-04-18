import { useMemo, useState } from 'react';
import { SuspectCard } from '../components/SuspectCard';
import { SearchBar } from '../components/SearchBar';
import { FacetedFilter } from '../components/FacetedFilter';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';

export function SuspectsView({ evidence, onSuspectClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const typeOptions = useMemo(() => {
    const types = [...new Set(evidence.map((e) => e.type).filter(Boolean))];
    return types.map((type) => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type }));
  }, [evidence]);

  const locationOptions = useMemo(() => {
    const locations = [...new Set(evidence.map((e) => e.details.location).filter(Boolean))];
    return locations.map((location) => ({ label: location, value: location }));
  }, [evidence]);

  const facetedEvidence = useMemo(() => {
    let filtered = evidence;

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((e) => selectedTypes.includes(e.type));
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((e) => selectedLocations.includes(e.details.location));
    }

    return filtered;
  }, [evidence, selectedTypes, selectedLocations]);

  // Extract unique suspects from evidence
  const suspects = useMemo(() => {
    const suspectMap = new Map();

    facetedEvidence.forEach(e => {
      const person = e.details.person;
      if (!person) return;

      if (!suspectMap.has(person)) {
        suspectMap.set(person, {
          name: person,
          occupation: e.details.occupation,
          suspicionLevel: e.details.suspicionLevel,
          evidenceCount: 1,
          lastSeen: e.timestamp,
        });
      } else {
        const existing = suspectMap.get(person);
        existing.evidenceCount += 1;
        if (new Date(e.timestamp) > new Date(existing.lastSeen)) {
          existing.lastSeen = e.timestamp;
        }
      }
    });

    const suspectsArray = Array.from(suspectMap.values());
    const maxEvidence = Math.max(1, ...suspectsArray.map(s => s.evidenceCount));

    return suspectsArray.map(s => ({
      ...s,
      // Calculate a realistic suspicion level based on how often they appear in case files
      suspicionLevel: Math.round((s.evidenceCount / maxEvidence) * 100)
    })).sort((a, b) => b.suspicionLevel - a.suspicionLevel);
  }, [facetedEvidence]);

  // Filter suspects by search
  const filteredSuspects = useMemo(() => {
    if (!searchQuery.trim()) return suspects;
    
    const query = searchQuery.toLowerCase();
    return suspects.filter(s => 
      s.name?.toLowerCase().includes(query) ||
      (s.occupation || '').toLowerCase().includes(query)
    );
  }, [suspects, searchQuery]);

  // Get top 3 most suspicious
  const topSuspects = suspects.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
          <div>
            <h2 className="text-xl font-mono text-slate-200 dark:text-slate-200 light:text-slate-900">
              Persons of Interest
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 light:text-slate-600">
              {suspects.length} suspects identified
            </p>
          </div>
        </div>
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="flex flex-wrap items-center gap-2">
          <FacetedFilter
            title="Type"
            options={typeOptions}
            selectedValues={selectedTypes}
            onChange={setSelectedTypes}
          />
          <FacetedFilter
            title="Location"
            options={locationOptions}
            selectedValues={selectedLocations}
            onChange={setSelectedLocations}
          />
          {(searchQuery || selectedTypes.length > 0 || selectedLocations.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTypes([]);
                setSelectedLocations([]);
              }}
              className="h-8 rounded-md border border-slate-700 px-3 text-xs font-mono text-slate-300 hover:bg-slate-800"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div data-scroll-container="true" className="flex-1 overflow-y-auto">
        {/* Most Suspicious Panel */}
        {!searchQuery && topSuspects.length > 0 && (
          <div className="p-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 bg-red-500/5 dark:bg-red-500/5 light:bg-red-50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-red-400 dark:text-red-400 light:text-red-600" />
              <h3 className="text-sm font-mono text-red-400 dark:text-red-400 light:text-red-600 uppercase">
                Most Suspicious
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {topSuspects.map((suspect, index) => (
                <motion.div
                  key={suspect.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SuspectCard
                    suspect={suspect}
                    onClick={() => onSuspectClick(suspect)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Suspects Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuspects.map((suspect, index) => (
              <motion.div
                key={suspect.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <SuspectCard
                  suspect={suspect}
                  onClick={() => onSuspectClick(suspect)}
                />
              </motion.div>
            ))}
          </div>

          {filteredSuspects.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Users className="w-16 h-16 text-slate-700 dark:text-slate-700 light:text-slate-300 mb-4" />
              <h3 className="text-lg font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2">
                No Suspects Found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-600 light:text-slate-500">
                Try adjusting your search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
