import { useMemo, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FacetedFilter } from '../components/FacetedFilter';
import { EvidenceCard } from '../components/EvidenceCard';
import { motion } from 'motion/react';
import { FileSearch } from 'lucide-react';

export function TimelineView({ evidence, onEvidenceClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const typeOptions = useMemo(() => {
    const types = [...new Set(evidence.map((e) => e.type).filter(Boolean))];
    return types.map((type) => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type }));
  }, [evidence]);

  const peopleOptions = useMemo(() => {
    const people = [...new Set(evidence.map((e) => e.details.person).filter(Boolean))];
    return people.map((person) => ({ label: person, value: person }));
  }, [evidence]);

  const locationOptions = useMemo(() => {
    const locations = [...new Set(evidence.map((e) => e.details.location).filter(Boolean))];
    return locations.map((location) => ({ label: location, value: location }));
  }, [evidence]);

  // Filter and search logic
  const filteredEvidence = useMemo(() => {
    let filtered = evidence;

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((e) => selectedTypes.includes(e.type));
    }

    if (selectedPeople.length > 0) {
      filtered = filtered.filter((e) => selectedPeople.includes(e.details.person));
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((e) => selectedLocations.includes(e.details.location));
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((e) =>
        e.details.content?.toLowerCase().includes(query) ||
        e.details.person?.toLowerCase().includes(query) ||
        e.details.location?.toLowerCase().includes(query) ||
        e.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [evidence, selectedTypes, selectedPeople, selectedLocations, searchQuery]);

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedPeople.length > 0 ||
    selectedLocations.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search and Filters */}
      <div className="p-6 space-y-4 border-b border-slate-800 dark:border-slate-800 border-slate-200">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="flex flex-wrap items-center gap-2">
          <FacetedFilter
            title="Type"
            options={typeOptions}
            selectedValues={selectedTypes}
            onChange={setSelectedTypes}
          />
          <FacetedFilter
            title="Person"
            options={peopleOptions}
            selectedValues={selectedPeople}
            onChange={setSelectedPeople}
          />
          <FacetedFilter
            title="Location"
            options={locationOptions}
            selectedValues={selectedLocations}
            onChange={setSelectedLocations}
          />
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTypes([]);
                setSelectedPeople([]);
                setSelectedLocations([]);
              }}
              className="h-8 rounded-md border border-slate-700 px-3 text-xs font-mono text-slate-300 hover:bg-slate-800"
            >
              Reset
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-500 text-slate-600 font-mono">
            {filteredEvidence.length} {filteredEvidence.length === 1 ? 'record' : 'records'} found
          </p>
          {searchQuery && (
            <p className="text-xs text-cyan-400 dark:text-cyan-400 text-cyan-600 font-mono">
              Searching: "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Evidence List */}
      <div data-scroll-container="true" className="flex-1 overflow-y-auto p-6">
        {filteredEvidence.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileSearch className="w-16 h-16 text-slate-700 dark:text-slate-700 text-slate-300 mb-4" />
            <h3 className="text-lg font-mono text-slate-400 dark:text-slate-400 text-slate-600 mb-2">
              No Evidence Found
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-600 text-slate-500">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvidence.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EvidenceCard 
                  evidence={item} 
                  onClick={() => onEvidenceClick(item)} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
