const sections = [
  { key: 'issueDetails', icon: '⚙️', label: 'Issue Details' },
  { key: 'scene', icon: '🎬', label: 'The Scene' },
  { key: 'cityHall', icon: '🏛️', label: 'City Hall' },
  { key: 'albanyRadar', icon: '🗳️', label: 'Albany Radar' },
  { key: 'theRooms', icon: '🍸', label: 'The Rooms' },
  { key: 'spotted', icon: '📍', label: 'Spotted' },
  { key: 'overheard', icon: '💬', label: 'Overheard' },
  { key: 'moversShakers', icon: '🎯', label: 'Movers & Shakers' },
  { key: 'comingUp', icon: '📅', label: 'Coming Up' },
  { key: 'skyelights', icon: '💡', label: 'Skyelights' },
];

export default function Sidebar({ active, hasContent, onNavigate }) {
  return (
    <div style={{
      width: 220, background: '#0d1828', borderRight: '1px solid #1e2e4a',
      display: 'flex', flexDirection: 'column', padding: '16px 0', flexShrink: 0, overflowY: 'auto',
    }}>
      {sections.map((s) => (
        <button
          key={s.key}
          onClick={() => onNavigate(s.key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
            background: active === s.key ? '#1a2740' : 'transparent',
            border: 'none', borderLeft: active === s.key ? '3px solid #ff009d' : '3px solid transparent',
            color: active === s.key ? '#ffffff' : '#8899bb',
            fontFamily: 'League Spartan', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            textAlign: 'left', width: '100%', transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 16 }}>{s.icon}</span>
          <span style={{ flex: 1 }}>{s.label}</span>
          {hasContent[s.key] && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          )}
        </button>
      ))}
    </div>
  );
}
