import { UserCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-[#1C1F26]">
      <div className="text-center max-w-md px-8">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 mb-2">Select a Suspect</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Choose a person from the list to view their complete investigation file and timeline of activities.
        </p>
      </div>
    </div>
  );
}
