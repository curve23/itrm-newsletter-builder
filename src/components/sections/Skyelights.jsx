import PhotoManager from '../PhotoManager';

export default function Skyelights({ data, onUpdate }) {
  return (
    <div>
      <div className="section-header">💡 Skyelights</div>
      <div className="card">
        <div className="field-group">
          <label>Reflection</label>
          <textarea
            rows={8}
            placeholder="Skye's closing reflection..."
            value={data.text || ''}
            onChange={(e) => onUpdate('text', e.target.value)}
            style={{ fontFamily: 'Playfair Display', fontSize: 15 }}
          />
        </div>
        <div className="field-group">
          <label>Optional Photo (floats right)</label>
          <PhotoManager
            photos={data.photo ? [data.photo] : []}
            onChange={(photos) => onUpdate('photo', photos[0] || null)}
          />
        </div>
      </div>
    </div>
  );
}
