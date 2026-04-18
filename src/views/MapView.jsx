import { MapBoard } from '../components/MapBoard';

export function MapView({ evidence, onEvidenceClick }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 p-6">
      <div className="flex-1 rounded-lg overflow-hidden border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl relative">
        <MapBoard evidence={evidence} onEvidenceClick={onEvidenceClick} />
      </div>
    </div>
  );
}
