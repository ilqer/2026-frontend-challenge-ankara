import { useState } from 'react';
import { Search } from 'lucide-react';
import { Person } from '../types';
import { Badge } from './ui/badge';

interface PersonListProps {
  people: Person[];
  selectedPersonId: string | null;
  onSelectPerson: (person: Person) => void;
}

export function PersonList({ people, selectedPersonId, onSelectPerson }: PersonListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Person['status']) => {
    switch (status) {
      case 'highly-suspicious':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'suspicious':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'cleared':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Sticky Search Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 text-slate-900 dark:text-slate-100 bg-transparent pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredPeople.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No people found
            </div>
          ) : (
            filteredPeople.map((person) => (
              <button
                key={person.id}
                onClick={() => onSelectPerson(person)}
                className={`
                  w-full p-3 mb-2 rounded-lg border transition-all
                  hover:shadow-md hover:border-blue-300
                  ${selectedPersonId === person.id
                    ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-medium
                    ${person.status === 'highly-suspicious'
                      ? 'bg-red-100 text-red-700'
                      : person.status === 'suspicious'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }
                  `}>
                    {person.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{person.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0 border-slate-300">
                        {person.recordCount} {person.recordCount === 1 ? 'record' : 'records'}
                      </Badge>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className={`w-2 h-2 rounded-full ${
                    person.status === 'highly-suspicious'
                      ? 'bg-red-500'
                      : person.status === 'suspicious'
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                  }`} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}