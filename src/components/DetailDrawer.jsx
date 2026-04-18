import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, User, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export function DetailDrawer({ isOpen, onClose, evidence, relatedEvidence = [], onPersonClick, onLocationClick }) {
  if (!evidence) return null;

  const timestamp = new Date(evidence.timestamp);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-slate-950 dark:bg-slate-950 light:bg-white border-l border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl z-[9999] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-950 dark:bg-slate-950 light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-mono text-slate-200 dark:text-slate-200 light:text-slate-900 mb-1">
                    Evidence Details
                  </h2>
                  <p className="text-sm font-mono text-slate-500 dark:text-slate-500 light:text-slate-600">
                    {evidence.id}
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400 dark:text-slate-400 light:text-slate-600" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Primary Info */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase">
                      {evidence.type}
                    </div>
                    {evidence.details.suspicionLevel > 75 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className="text-xs text-red-400 font-mono">HIGH PRIORITY</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
                    {evidence.details.content}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50">
                    <Calendar className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mb-1">
                        Timestamp
                      </p>
                      <p className="text-sm font-mono text-slate-200 dark:text-slate-200 light:text-slate-900">
                        {format(timestamp, 'MMMM dd, yyyy')}
                        <span className="text-slate-500 dark:text-slate-500 light:text-slate-600"> at </span>
                        {format(timestamp, 'HH:mm:ss')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50">
                    <MapPin className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mb-2">
                        Location
                      </p>
                      <button
                        onClick={() => onLocationClick && onLocationClick(evidence.details.location)}
                        className="text-left font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                      >
                        {evidence.details.location}
                      </button>
                      {evidence.details.coordinates && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mt-2 font-mono">
                          {evidence.details.coordinates[0].toFixed(4)}, {evidence.details.coordinates[1].toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>

                  {evidence.details.person && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50">
                      <User className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mb-2">
                          Person of Interest
                        </p>
                        <button
                          onClick={() => onPersonClick && onPersonClick(evidence.details.person)}
                          className="text-left font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                        >
                          {evidence.details.person}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mt-2">
                          {evidence.details.occupation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                {(evidence.details.sender || evidence.details.recipient || evidence.details.duration || evidence.details.reliability || evidence.details.seen_with) && (
                  <div className="p-4 rounded-lg border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-3">
                    <h3 className="text-sm font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 mb-4">
                      Additional Information
                    </h3>
                    {evidence.details.sender && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-500 light:text-slate-600">Sender:</span>
                        <button
                          onClick={() => onPersonClick && onPersonClick(evidence.details.sender)}
                          className="text-left font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                        >
                          {evidence.details.sender}
                        </button>
                      </div>
                    )}
                    {evidence.details.recipient && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-500 light:text-slate-600">Recipient:</span>
                        <button
                          onClick={() => onPersonClick && onPersonClick(evidence.details.recipient)}
                          className="text-left font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                        >
                          {evidence.details.recipient}
                        </button>
                      </div>
                    )}
                    {evidence.details.seen_with && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-500 light:text-slate-600">Seen With:</span>
                        <button
                          onClick={() => onPersonClick && onPersonClick(evidence.details.seen_with)}
                          className="text-left font-medium text-blue-600 dark:text-blue-400  cursor-pointer transition-colors"
                        >
                          {evidence.details.seen_with}
                        </button>
                      </div>
                    )}
                    {evidence.details.duration && (
                      <div className="flex justify-between text-sm mt-3">
                        <span className="text-slate-500 dark:text-slate-500 light:text-slate-600">Duration:</span>
                        <span className="text-slate-300 dark:text-slate-300 light:text-slate-900 font-mono">{evidence.details.duration}</span>
                      </div>
                    )}
                    {evidence.details.reliability && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-500 light:text-slate-600">Reliability:</span>
                        <span className="text-slate-300 dark:text-slate-300 light:text-slate-900 font-mono capitalize">
                          {evidence.details.reliability}
                          {!isNaN(Number(evidence.details.reliability)) ? '%' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Related Evidence */}
              {relatedEvidence.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <LinkIcon className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
                    <h3 className="text-sm font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Connected Evidence ({relatedEvidence.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {relatedEvidence.slice(0, 5).map((related) => (
                      <div
                        key={related.id}
                        className="p-3 rounded-lg bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-cyan-500 dark:hover:border-cyan-500 light:hover:border-cyan-400 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-cyan-400 dark:text-cyan-400 light:text-cyan-600 uppercase">
                            {related.type}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 font-mono">
                            {related.id}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 line-clamp-2">
                          {related.details.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
