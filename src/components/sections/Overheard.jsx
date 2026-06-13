export default function Overheard({ data, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="section-header">💬 Overheard</div>
      {(data.quotes || []).map((q) => (
        <div key={q.id} className="card" style={{ borderLeft: '3px solid #f7e951' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="btn-danger" onClick={() => onRemove(q.id)}>× Remove</button>
          </div>
          <div className="field-group">
            <label>Quote</label>
            <textarea rows={3} placeholder="Quote text..." value={q.text} onChange={(e) => onUpdate(q.id, 'text', e.target.value)} style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 15 }} />
          </div>
          <div className="field-group">
            <label>Attribution</label>
            <input placeholder="— Name, Title" value={q.attribution} onChange={(e) => onUpdate(q.id, 'attribution', e.target.value)} />
          </div>
        </div>
      ))}
      <button className="btn-primary" onClick={onAdd}>+ Add Quote</button>
    </div>
  );
}
