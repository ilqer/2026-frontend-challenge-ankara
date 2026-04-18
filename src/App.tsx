import { useState, useMemo, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { DetailDrawer } from './components/DetailDrawer';
import { TimelineView } from './views/TimelineView';
import { MapView } from './views/MapView';
import { SuspectsView } from './views/SuspectsView';
import { UsersView } from './views/UsersView';
import { LocationsView } from './views/LocationsView';
import { Clock, Map, Users, MapPin, UserSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from './components/ui/tooltip';
import { useIsMobile } from './components/ui/use-mobile';

const tabs = [
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'map', label: 'Map Board', icon: Map },
  { id: 'suspects', label: 'Suspects', icon: Users },
  { id: 'users', label: 'Users', icon: UserSquare },
  { id: 'locations', label: 'Locations', icon: MapPin },
];

function AppContent() {
  const { evidence, loading } = useData();
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleNavTab = (e: any) => setActiveTab(e.detail);
    window.addEventListener('navigateTab', handleNavTab);
    return () => window.removeEventListener('navigateTab', handleNavTab);
  }, []);

  // Calculate related evidence based on shared person or location
  const relatedEvidence = useMemo(() => {
    if (!selectedEvidence) return [];
    
    return evidence.filter(e => {
      const hasPerson = !!selectedEvidence.details.person;
      if (hasPerson) {
        return e.details.person === selectedEvidence.details.person;
      }
      return e.details.location === selectedEvidence.details.location;
    });
  }, [selectedEvidence, evidence]);

  const handleEvidenceClick = (item: any) => {
    setSelectedEvidence(item);
    setIsDrawerOpen(true);
  };

  const handleSuspectClick = (suspect: any) => {
    // Find evidence related to this suspect and open the first one
    const suspectEvidence = evidence.find(e => e.details.person === suspect.name);
    if (suspectEvidence) {
      handleEvidenceClick(suspectEvidence);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 dark:bg-slate-950 bg-slate-50">
      <Header
        onToggleNavigation={() => {
          if (isMobile) {
            setIsMobileNavOpen((open) => !open);
            return;
          }
          setIsNavCollapsed((collapsed) => !collapsed);
        }}
      />

      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar Navigation */}
        <aside
          className={`hidden md:flex shrink-0 border-r border-slate-800 dark:border-slate-800 border-slate-200 bg-slate-950 dark:bg-slate-950 bg-white transition-all duration-300 ${
            isNavCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <nav className="w-full p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              const navButton = (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-mono transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-900 dark:hover:bg-slate-900 hover:bg-slate-100 hover:text-slate-200 dark:hover:text-slate-200 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeSidebarIndicator"
                      className="absolute left-1 top-1 bottom-1 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isNavCollapsed && <span>{tab.label}</span>}
                </button>
              );

              if (isNavCollapsed) {
                return (
                  <Tooltip key={tab.id}>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>{tab.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={tab.id}>{navButton}</div>;
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-950 dark:bg-slate-950 bg-slate-50">
          {activeTab === 'timeline' && (
            <TimelineView
              evidence={evidence}
              onEvidenceClick={handleEvidenceClick}
            />
          )}
          {activeTab === 'map' && (
            <MapView
              evidence={evidence}
              onEvidenceClick={handleEvidenceClick}
            />
          )}
          {activeTab === 'suspects' && (
            <SuspectsView
              evidence={evidence}
              onSuspectClick={handleSuspectClick}
            />
          )}
          {activeTab === 'users' && (
            <UsersView
              evidence={evidence}
            />
          )}
          {activeTab === 'locations' && (
            <LocationsView
              evidence={evidence}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-r border-slate-800 bg-slate-950 text-slate-100"
        >
          <SheetHeader className="border-b border-slate-800 pb-4">
            <SheetTitle className="text-left font-mono text-slate-100">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 space-y-2 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-mono transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* DetailDrawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        evidence={selectedEvidence}
        relatedEvidence={relatedEvidence}
        onEvidenceClick={handleEvidenceClick}
        onPersonClick={(personName) => {
          setIsDrawerOpen(false);
          setActiveTab('users');
          // Use a timeout to ensure the tab switch has happened before we dispatch a custom event
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('selectUser', { detail: personName }));
          }, 50);
        }}
        onLocationClick={(locationName) => {
          setIsDrawerOpen(false);
          setActiveTab('locations');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('selectLocation', { detail: locationName }));
          }, 50);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}
