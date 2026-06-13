export default function ComingUp({ data, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="section-header">📅 Coming Up</div>
      {(data.events || []).map((e) => (
        <div key={e.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ background: '#173061', borderRadius: 8, padding: '8px 14px', minWidth: 90, textAlign: 'center' }}>
            <input
              placeholder="Date"
              value={e.date}
              onChange={(ev) => onUpdate(e.id, 'date', ev.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#ff99d8', fontFamily: 'League Spartan', fontWeight: 700, fontSize: 13, textAlign: 'center', width: '100%', padding: 0 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input placeholder="Event Title" value={e.title} onChange={(ev) => onUpdate(e.id, 'title', ev.target.value)} style={{ marginBottom: 8, fontWeight: 600 }} />
            <input placeholder="Details..." value={e.details} onChange={(ev) => onUpdate(e.id, 'details', ev.target.value)} />
          </div>
          <button className="btn-danger" onClick={() => onRemove(e.id)}>×</button>
        </div>
      ))}
      <button className="btn-primary" onClick={onAdd}>+ Add Event</button>
    </div>
  );
}
