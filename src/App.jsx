import { useContext, useState, useMemo } from 'react';
import { DataContext } from './context/DataContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const { events, loading, error } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);

  // NEW: State for the Detail View Modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (activeFilter !== 'all' && event.type !== activeFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return Object.values(event.details).some(value =>
          String(value).toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [events, searchTerm, activeFilter]);

  const suspects = useMemo(() => {
    const nameCounts = {};
    events.forEach(event => {
      const potentialNames = [
        event.details.person, event.details.name, event.details.seen_with,
        event.details.sender, event.details.receiver, event.details.personName
      ];
      potentialNames.forEach(name => {
        if (name && typeof name === 'string' && name.trim() !== '') {
          nameCounts[name] = (nameCounts[name] || 0) + 1;
        }
      });
    });
    return Object.entries(nameCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [events]);

  const mostSuspicious = suspects.length > 0 ? suspects[0][0] : null;

  // NEW: Record Linking Algorithm
  const linkedRecords = useMemo(() => {
    if (!selectedEvent) return [];

    // Extract names and locations from the currently selected event
    const involvedNames = [
      selectedEvent.details.person, selectedEvent.details.name,
      selectedEvent.details.seen_with, selectedEvent.details.sender, selectedEvent.details.receiver
    ].filter(Boolean); // Filters out null/undefined

    const involvedLocations = [selectedEvent.details.location].filter(Boolean);

    // Find other events that share these names or locations
    return events.filter(e => {
      if (e.id === selectedEvent.id) return false; // Don't link the event to itself

      const hasNameMatch = involvedNames.some(name =>
        Object.values(e.details).includes(name)
      );
      const hasLocMatch = involvedLocations.some(loc =>
        Object.values(e.details).includes(loc)
      );

      return hasNameMatch || hasLocMatch;
    });
  }, [selectedEvent, events]);

  if (loading) return <div style={{ padding: '2rem', fontSize: '1.2rem' }}>Gathering evidence... 🕵️‍♂️</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  const mapEvents = filteredEvents.filter(e => e.details.coordinates);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', color: '#333', position: 'relative' }}>

      {/* Sidebar - Case Summary & Suspects */}
      <div style={{ width: '320px', borderRight: '1px solid #ddd', padding: '1.5rem', backgroundColor: '#f4f5f7', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Missing Podo</h1>
          <h2 style={{ fontSize: '1rem', color: '#666', marginTop: 0 }}>The Ankara Case</h2>
        </div>

        {mostSuspicious && (
          <div style={{ backgroundColor: '#fee2e2', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5' }}>
            <h3 style={{ marginTop: 0, color: '#991b1b', fontSize: '1.1rem' }}>Most Suspicious</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <strong style={{ fontSize: '1.2rem', color: '#7f1d1d' }}>{mostSuspicious}</strong>
            </div>
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Search clues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Persons of Interest</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {suspects.map(([name, count]) => (
              <li key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <span
                  style={{ cursor: 'pointer', color: '#2563eb', fontWeight: '500' }}
                  onClick={() => setSearchTerm(name)}
                >
                  {name}
                </span>
                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {count} mentions
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content - Timeline View */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'checkins', 'sightings', 'messages', 'notes', 'tips'].map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  fontWeight: '500', textTransform: 'capitalize',
                  backgroundColor: activeFilter === type ? '#2563eb' : '#e2e8f0',
                  color: activeFilter === type ? '#fff' : '#475569', transition: 'all 0.2s'
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontWeight: '500', backgroundColor: showMap ? '#059669' : '#10b981', color: '#fff'
            }}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {showMap ? (
          <div style={{ height: '600px', width: '100%', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer center={[39.93, 32.85]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {mapEvents.map(event => {
                const [lat, lng] = event.details.coordinates.split(',').map(Number);
                if (isNaN(lat) || isNaN(lng)) return null;
                return (
                  <Marker key={event.id} position={[lat, lng]}>
                    <Popup>
                      <strong>{event.type.toUpperCase()}</strong><br />
                      {event.details.location || event.details.personName}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No evidence found.</div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)} // NEW: Click to open detail
                  style={{
                    border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem',
                    backgroundColor: '#fafafa', cursor: 'pointer', // Changed cursor
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #2563eb',
                    transition: 'transform 0.1s', // Hover effect cue
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#2563eb', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                      {event.type}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {Object.entries(event.details).map(([key, value]) => {
                      if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) return null;
                      return (
                        <div key={key}>
                          <strong style={{ color: '#475569', textTransform: 'capitalize', display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                            {key.replace(/_/g, ' ')}
                          </strong>
                          <span style={{ color: '#0f172a' }}>
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* NEW: Detail Modal Overlay */}
      {selectedEvent && (
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '400px',
          backgroundColor: '#fff', borderLeft: '1px solid #ddd', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          padding: '2rem', overflowY: 'auto', zIndex: 10
        }}>
          <button
            onClick={() => setSelectedEvent(null)}
            style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
          >
            ×
          </button>
          <h2 style={{ marginTop: 0, textTransform: 'capitalize', color: '#2563eb' }}>{selectedEvent.type} Details</h2>
          <p style={{ color: '#64748b', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            {new Date(selectedEvent.timestamp).toLocaleString()}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            {Object.entries(selectedEvent.details).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ display: 'block', color: '#475569', textTransform: 'capitalize', fontSize: '0.85rem' }}>{key.replace(/_/g, ' ')}</strong>
                  <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                </div>
              );
            })}
          </div>

          <h3 style={{ borderTop: '2px solid #eee', paddingTop: '1rem' }}>Related Records ({linkedRecords.length})</h3>
          {linkedRecords.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>No direct links found for this record.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {linkedRecords.map(linked => (
                <div key={linked.id} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <strong style={{ textTransform: 'uppercase', color: '#2563eb', display: 'block', marginBottom: '0.25rem' }}>{linked.type}</strong>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>{new Date(linked.timestamp).toLocaleDateString()}</span>
                  <div style={{ color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {Object.values(linked.details).filter(v => typeof v === 'string').join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
