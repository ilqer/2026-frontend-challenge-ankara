import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function MapBoard({ evidence, onEvidenceClick }) {
  // Filter evidence that has coordinates
  const evidenceWithCoords = useMemo(() => {
    return evidence.filter(e => e.details.coordinates);
  }, [evidence]);

  // Group evidence by location string to prevent duplicate markers
  const groupedLocations = useMemo(() => {
    const groups = new Map();
    evidenceWithCoords.forEach((e) => {
      const loc = e.details.location;
      if (!groups.has(loc)) {
        groups.set(loc, {
          location: loc,
          coordinates: e.details.coordinates,
          events: [],
          id: `loc-${loc.replace(/\s+/g, '-').toLowerCase()}`,
        });
      }
      groups.get(loc).events.push(e);
    });
    return Array.from(groups.values());
  }, [evidenceWithCoords]);

  // Calculate center of all markers
  const center = useMemo(() => {
    if (evidenceWithCoords.length === 0) return [39.9334, 32.8597]; // Ankara default
    const avgLat = evidenceWithCoords.reduce((sum, e) => sum + e.details.coordinates[0], 0) / evidenceWithCoords.length;
    const avgLng = evidenceWithCoords.reduce((sum, e) => sum + e.details.coordinates[1], 0) / evidenceWithCoords.length;
    return [avgLat, avgLng];
  }, [evidenceWithCoords]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full rounded-lg"
        style={{ background: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {groupedLocations.map((group) => (
          <Marker
            key={group.id}
            position={group.coordinates}
            eventHandlers={{
              click: () => {
                const syntheticEvent = {
                  id: group.id,
                  type: 'Location Summary',
                  timestamp: group.events[0].timestamp,
                  details: {
                    location: group.location,
                    coordinates: group.coordinates,
                    content: `${group.events.length} connected events recorded at this territory.`,
                  },
                };
                onEvidenceClick(syntheticEvent);
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold mb-1">{group.location}</p>
                <p className="text-xs text-slate-600">{group.events.length} events recorded here.</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-950/90 dark:bg-slate-950/90 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-slate-800 dark:border-slate-800 border-slate-200 shadow-xl z-[1000]">
        <h3 className="text-sm font-mono text-slate-400 dark:text-slate-400 text-slate-600 mb-2">
          Evidence Markers
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-500 text-slate-700">
          {groupedLocations.length} locations plotted
        </p>
      </div>
    </div>
  );
}
