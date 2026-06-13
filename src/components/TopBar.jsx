import { exportHtml } from '../utils/exportHtml';

export default function TopBar({ data, onReset }) {
  const handleExport = () => exportHtml(data);

  return (
    <div style={{
      background: '#0f1a2e',
      borderBottom: '2px solid #ff009d',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      height: 60,
      gap: 16,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <span style={{ fontFamily: 'League Spartan', fontWeight: 700, fontSize: 20, color: '#ffffff' }}>
          Skye's Sundae Scoops
        </span>
        <span style={{
          fontFamily: 'DM Mono', fontSize: 10, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#ff009d',
          border: '1px solid #ff009d', borderRadius: 4, padding: '2px 8px'
        }}>
          Newsletter Builder
        </span>
      </div>
      <button className="btn-secondary" onClick={onReset} style={{ fontSize: 13 }}>↺ Reset</button>
      <button className="btn-primary" onClick={handleExport} style={{ fontSize: 13 }}>↓ Export HTML</button>
    </div>
  );
}
