import { useContext } from 'react';
import { DataContext } from './context/DataContext';
import './App.css';

function App() {
  const { events, loading, error } = useContext(DataContext);

  if (loading) return <div style={{ padding: '2rem', fontSize: '1.5rem' }}>Gathering evidence...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', color: '#333' }}>

      {/* Sidebar - Case Summary */}
      <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '1.5rem', backgroundColor: '#f4f5f7' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Missing Podo</h1>
        <h2 style={{ fontSize: '1rem', color: '#666', marginTop: 0 }}>The Ankara Case</h2>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Case Stats</h3>
          <p><strong>Total Clues:</strong> {events.length}</p>
        </div>
      </div>

      {/* Main Content - Timeline View */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#fff' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
          Master Timeline
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((event) => (
            <div key={event.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fafafa',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#2563eb', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                  {event.type}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Loop through the normalized details and display them */}
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {Object.entries(event.details).map(([key, value]) => (
                  <div key={key}>
                    <strong style={{ color: '#475569', textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}:
                    </strong>
                    <span style={{ marginLeft: '0.5rem' }}>
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
