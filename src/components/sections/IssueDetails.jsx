export default function IssueDetails({ data, onChange }) {
  return (
    <div>
      <div className="section-header">⚙️ Issue Details</div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="field-group">
            <label>Issue Number</label>
            <input placeholder="#112" value={data.issueNumber || ''} onChange={(e) => onChange('issueNumber', e.target.value)} />
          </div>
          <div className="field-group">
            <label>Date</label>
            <input placeholder="June 8, 2026" value={data.date || ''} onChange={(e) => onChange('date', e.target.value)} />
          </div>
        </div>
        <div className="field-group">
          <label>Publication</label>
          <input value={data.publication || ''} onChange={(e) => onChange('publication', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Header Image URL (CC-hosted)</label>
          <input placeholder="https://..." value={data.headerImageUrl || ''} onChange={(e) => onChange('headerImageUrl', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Opening Quote</label>
          <textarea rows={2} placeholder="A memorable quote..." value={data.openingQuote || ''} onChange={(e) => onChange('openingQuote', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Quote Attribution</label>
          <input placeholder="— Name, Title" value={data.quoteAttribution || ''} onChange={(e) => onChange('quoteAttribution', e.target.value)} />
        </div>
        <div className="field-group">
          <label>Intro Paragraphs</label>
          <textarea rows={6} placeholder="This week in New York..." value={data.introParagraphs || ''} onChange={(e) => onChange('introParagraphs', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
