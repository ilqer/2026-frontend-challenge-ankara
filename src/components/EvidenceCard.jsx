import { motion } from 'motion/react';
import { 
  MapPin, 
  MessageSquare, 
  StickyNote, 
  Eye, 
  Info,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const typeConfig = {
  checkins: {
    icon: MapPin,
    label: 'Check-in',
    color: 'from-blue-500 to-cyan-500',
    bgDark: 'bg-blue-500/10',
    bgLight: 'bg-blue-50',
    borderDark: 'border-blue-500/30',
    borderLight: 'border-blue-200',
  },
  messages: {
    icon: MessageSquare,
    label: 'Message',
    color: 'from-purple-500 to-pink-500',
    bgDark: 'bg-purple-500/10',
    bgLight: 'bg-purple-50',
    borderDark: 'border-purple-500/30',
    borderLight: 'border-purple-200',
  },
  notes: {
    icon: StickyNote,
    label: 'Note',
    color: 'from-yellow-500 to-orange-500',
    bgDark: 'bg-yellow-500/10',
    bgLight: 'bg-yellow-50',
    borderDark: 'border-yellow-500/30',
    borderLight: 'border-yellow-200',
  },
  sightings: {
    icon: Eye,
    label: 'Sighting',
    color: 'from-green-500 to-emerald-500',
    bgDark: 'bg-green-500/10',
    bgLight: 'bg-green-50',
    borderDark: 'border-green-500/30',
    borderLight: 'border-green-200',
  },
  tips: {
    icon: Info,
    label: 'Tip',
    color: 'from-red-500 to-rose-500',
    bgDark: 'bg-red-500/10',
    bgLight: 'bg-red-50',
    borderDark: 'border-red-500/30',
    borderLight: 'border-red-200',
  },
};

export function EvidenceCard({ evidence, onClick }) {
  const config = typeConfig[evidence.type] || typeConfig.notes;
  const Icon = config.icon;
  const timestamp = new Date(evidence.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={onClick}
      className={`
        cursor-pointer p-4 rounded-lg border
        ${config.bgDark} dark:${config.bgDark} light:${config.bgLight}
        ${config.borderDark} dark:${config.borderDark} light:${config.borderLight}
        backdrop-blur-sm hover:shadow-lg transition-all
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                {config.label}
              </span>
              {evidence.details.suspicionLevel > 75 && (
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mt-0.5">
              <Clock className="w-3 h-3" />
              {format(timestamp, 'MMM dd, yyyy • HH:mm')}
            </div>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-600 dark:text-slate-600 light:text-slate-500">
          #{evidence.id.split('-')[1]}
        </span>
      </div>

      {/* Content */}
      <div className="mb-3">
        {(evidence.type === 'message' || evidence.type === 'messages') && evidence.details.sender && evidence.details.recipient && (
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">
            From <span className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">{evidence.details.sender}</span> to <span className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">{evidence.details.recipient}</span>
          </div>
        )}
        <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 line-clamp-2">
          {evidence.details.content}
        </p>
      </div>

      {/* Footer Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500 light:text-slate-600" />
          <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
            {evidence.details.person}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500 light:text-slate-600" />
          <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
            {evidence.details.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
