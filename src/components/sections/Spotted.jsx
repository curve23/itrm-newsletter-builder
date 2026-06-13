import PhotoManager from '../PhotoManager';

export default function Spotted({ data, onUpdate }) {
  const addSighting = () => {
    const sightings = [...(data.sightings || []), { id: Date.now(), text: '' }];
    onUpdate('sightings', sightings);
  };
  const removeSighting = (id) => onUpdate('sightings', data.sightings.filter((s) => s.id !== id));
  const updateSighting = (id, text) => onUpdate('sightings', data.sightings.map((s) => s.id === id ? { ...s, text } : s));

  return (
    <div>
      <div className="section-header">📍 Spotted</div>
      <div className="card">
        <div className="field-group">
          <label>Sightings</label>
          {(data.sightings || []).map((s) => (
            <div key={s.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input placeholder="Who was spotted where..." value={s.text} onChange={(e) => updateSighting(s.id, e.target.value)} />
              <button onClick={() => removeSighting(s.id)} style={{ background: 'none', border: 'none', color: '#ff5566', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
          ))}
          <button className="btn-secondary" style={{ marginTop: 4 }} onClick={addSighting}>+ Add Sighting</button>
        </div>
        <div className="field-group">
          <label>Photo Grid</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => onUpdate('photoCount', n)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontFamily: 'DM Mono', fontSize: 12,
                  background: data.photoCount === n ? '#ff009d' : 'transparent',
                  color: data.photoCount === n ? 'white' : '#8899bb',
                  border: '1px solid ' + (data.photoCount === n ? '#ff009d' : '#2a3a5c'),
                  cursor: 'pointer'
                }}
              >
                {n === 0 ? 'None' : n === 4 ? '4 (2×2)' : `${n}`}
              </button>
            ))}
          </div>
        </div>
        {(data.photoCount || 0) > 0 && (
          <PhotoManager
            photos={data.photos || []}
            onChange={(photos) => onUpdate('photos', photos)}
          />
        )}
      </div>
    </div>
  );
}
