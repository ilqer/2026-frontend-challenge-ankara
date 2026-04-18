import { useState, useMemo } from 'react';
import { MapPin, MessageSquare, Eye, FileText, Clock, AlertTriangle, Lightbulb, User } from 'lucide-react';
import { Person, TimelineActivity } from '../types';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

interface ProfilePageProps {
  person: Person;
  onPersonClick: (personId: string, personName: string) => void;
  onLocationClick?: (locationName: string) => void;
}

type FilterTab = 'all' | 'checkins' | 'messages' | 'sightings' | 'notes' | 'tips';

export function ProfilePage({ person, onPersonClick, onLocationClick }: ProfilePageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const getStatusLabel = (status: Person['status']) => {
    switch (status) {
      case 'highly-suspicious':
        return 'HIGHLY SUSPICIOUS';
      case 'suspicious':
        return 'SUSPICIOUS';
      case 'cleared':
        return 'CLEARED';
    }
  };

  const getStatusColor = (status: Person['status']) => {
    switch (status) {
      case 'highly-suspicious':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'suspicious':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'cleared':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  // Calculate stats
  const stats = {
    checkins: person.activities.filter(a => a.type === 'checkins' || a.type === 'checkin').length,
    messages: person.activities.filter(a => a.type === 'messages' || a.type === 'message').length,
    sightings: person.activities.filter(a => a.type === 'sightings' || a.type === 'sighting').length,
    notes: person.activities.filter(a => a.type === 'notes' || a.type === 'note').length,
    tips: person.activities.filter(a => a.type === 'tips' || a.type === 'tip').length,
  };

  const dates = person.activities.map(a => new Date(a.timestamp).getTime()).filter(d => !isNaN(d));
  const firstSeen = dates.length ? new Date(Math.min(...dates)) : null;
  const lastSeen = dates.length ? new Date(Math.max(...dates)) : null;

  const connectedPersons = useMemo(() => {
    const connections = new Map<string, number>();
    person.activities.forEach(a => {
      const people = [a.sender, a.receiver, a.seenWith].filter(Boolean);
      people.forEach(p => {
        if (p && p !== person.name && !['unknown', 'event staff'].includes(p.toLowerCase())) {
          connections.set(p, (connections.get(p) || 0) + 1);
        }
      });
    });
    return Array.from(connections.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [person]);

  // Filter activities
  const filteredActivities = person.activities.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'checkins') return activity.type === 'checkins' || activity.type === 'checkin';
    if (activeFilter === 'messages') return activity.type === 'messages' || activity.type === 'message';
    if (activeFilter === 'sightings') return activity.type === 'sightings' || activity.type === 'sighting';
    if (activeFilter === 'notes') return activity.type === 'notes' || activity.type === 'note';
    if (activeFilter === 'tips') return activity.type === 'tips' || activity.type === 'tip';
    return true;
  });

  const filterTabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All Activity' },
    { id: 'checkins', label: 'Check-ins', count: stats.checkins },
    { id: 'messages', label: 'Messages', count: stats.messages },
    { id: 'sightings', label: 'Sightings', count: stats.sightings },
    { id: 'notes', label: 'Notes', count: stats.notes },
    { id: 'tips', label: 'Tips', count: stats.tips },
  ];

  const handlePersonLinkClick = (personName: string) => {
    // Find the person ID from the name
    onPersonClick('', personName);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-[#1C1F26]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium
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
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{person.name}</h1>
                <Badge className={getStatusColor(person.status)}>
                  {getStatusLabel(person.status)}
                </Badge>
              </div>

              {/* Time Clues */}
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                {firstSeen && (
                  <span>First seen: {format(firstSeen, 'MMM d, yyyy h:mm a')}</span>
                )}
                {lastSeen && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span>Last seen: {format(lastSeen, 'MMM d, yyyy h:mm a')}</span>
                  </>
                )}
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">Total Clues: {person.activities.length}</span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{stats.checkins} Check-ins</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>{stats.messages} Messages</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span>{stats.sightings} Sightings</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>{stats.notes} Notes</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-teal-500" />
                  <span>{stats.tips} Tips</span>
                </div>
              </div>

              {/* Connected Persons */}
              {connectedPersons.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Strongest Connections</h3>
                  <div className="flex flex-wrap gap-2">
                    {connectedPersons.map(cp => (
                      <button
                        key={cp.name}
                        onClick={() => handlePersonLinkClick(cp.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {cp.name}
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded-md ml-1">
                          {cp.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800'
                  }
                `}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1.5 ${activeFilter === tab.id ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    ({tab.count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pb-8">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200" />

          {/* Timeline Items */}
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                No activities found for this filter
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <TimelineItem
                  key={activity.id}
                  activity={activity}
                  onPersonClick={handlePersonLinkClick}
                  onLocationClick={onLocationClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  activity: TimelineActivity;
  onPersonClick: (personName: string) => void;
  onLocationClick?: (locationName: string) => void;
}

function TimelineItem({ activity, onPersonClick, onLocationClick }: TimelineItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'checkins':
      case 'checkin':
        return <MapPin className="w-4 h-4" />;
      case 'messages':
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'sightings':
      case 'sighting':
        return <Eye className="w-4 h-4" />;
      case 'notes':
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'tips':
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getIconColor = () => {
    if (activity.suspicionLevel === 'high') return 'bg-red-500 text-white';
    if (activity.suspicionLevel === 'medium') return 'bg-amber-500 text-white';
    switch (activity.type) {
      case 'checkins':
      case 'checkin':
        return 'bg-blue-500 text-white';
      case 'messages':
      case 'message':
        return 'bg-purple-500 text-white';
      case 'sightings':
      case 'sighting':
        return 'bg-indigo-500 text-white';
      case 'notes':
      case 'note':
        return 'bg-slate-500 text-white';
      case 'tips':
      case 'tip':
        return 'bg-teal-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getTitle = () => {
    switch (activity.type) {
      case 'checkins':
      case 'checkin':
        return 'Check-in';
      case 'messages':
      case 'message':
        return 'Message';
      case 'sightings':
      case 'sighting':
        return 'Sighting';
      case 'notes':
      case 'note':
        return 'Investigation Note';
      case 'tips':
      case 'tip':
        return 'Tip';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="relative flex gap-4">
      {/* Icon */}
      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor()}`}>
        {getIcon()}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">{getTitle()}</h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {activity.location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <button
                onClick={() => onLocationClick && onLocationClick(activity.location!)}
                className="text-left text-slate-700 dark:text-slate-300 font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {activity.location}
              </button>
            </div>
          )}

          {activity.message && (
            <div className="bg-slate-50 dark:bg-[#1C1F26] rounded-lg p-3 border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex flex-wrap items-center gap-1.5">
                {activity.sender && activity.receiver && (
                  <>
                    <span>From</span>
                    <button
                      onClick={() => onPersonClick(activity.sender!)}
                      className="font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                    >
                      {activity.sender}
                    </button>
                    <span>to</span>
                    <button
                      onClick={() => onPersonClick(activity.receiver!)}
                      className="font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                    >
                      {activity.receiver}
                    </button>
                  </>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic">"{activity.message}"</p>
            </div>
          )}

          {activity.seenWith && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400 text-sm">Seen with</span>
              <button
                onClick={() => onPersonClick(activity.seenWith!)}
                className="font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
              >
                {activity.seenWith}
              </button>
            </div>
          )}

          {activity.note && activity.note !== activity.message && (
            <div className="text-slate-700 dark:text-slate-300 mt-2">
              <p>{activity.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
