import PhotoManager from '../PhotoManager';

export default function StorySection({ title, icon, sectionKey, data, onAddStory, onRemoveStory, onUpdateStory, onAddBridge, onRemoveBridge, onUpdateBridge }) {
  const stories = data?.stories || [];
  const bridges = data?.bridges || [];

  const items = [];
  stories.forEach((story, i) => {
    items.push({ type: 'story', data: story, index: i });
    const bridge = bridges[i];
    if (bridge) items.push({ type: 'bridge', data: bridge, index: i });
  });

  return (
    <div>
      <div className="section-header">{icon} {title}</div>

      {items.map((item) => {
        if (item.type === 'story') {
          const story = item.data;
          return (
            <div key={story.id} className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: '#ff009d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Story</span>
                <button className="btn-danger" onClick={() => onRemoveStory(sectionKey, story.id)}>× Remove</button>
              </div>
              <div className="field-group">
                <label>Tag / Label (optional)</label>
                <input placeholder="e.g. Breaking, Endorsement Watch" value={story.tag} onChange={(e) => onUpdateStory(sectionKey, story.id, 'tag', e.target.value)} />
              </div>
              <div className="field-group">
                <label>Headline</label>
                <input placeholder="Story headline..." value={story.headline} onChange={(e) => onUpdateStory(sectionKey, story.id, 'headline', e.target.value)} />
              </div>
              <div className="field-group">
                <label>Body Text</label>
                <textarea rows={6} placeholder="Story body..." value={story.body} onChange={(e) => onUpdateStory(sectionKey, story.id, 'body', e.target.value)} />
              </div>
              <PhotoManager
                photos={story.photos || []}
                onChange={(photos) => onUpdateStory(sectionKey, story.id, 'photos', photos)}
              />
            </div>
          );
        } else {
          const bridge = item.data;
          return (
            <div key={bridge.id} style={{ borderLeft: '3px solid #ff009d', paddingLeft: 16, marginBottom: 16, background: '#1a2740', borderRadius: '0 8px 8px 0', padding: '14px 14px 14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: '#8899bb', textTransform: 'uppercase' }}>Narrative Bridge</span>
                <button className="btn-danger" style={{ fontSize: 11 }} onClick={() => onRemoveBridge(sectionKey, bridge.id)}>× Remove</button>
              </div>
              <textarea
                rows={2}
                placeholder="Meanwhile... / Also happening... / Worth noting..."
                value={bridge.text}
                onChange={(e) => onUpdateBridge(sectionKey, bridge.id, e.target.value)}
                style={{ fontStyle: 'italic', fontSize: 14 }}
              />
            </div>
          );
        }
      })}

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn-primary" onClick={() => onAddStory(sectionKey)}>+ Add Story</button>
        <button className="btn-secondary" onClick={() => onAddBridge(sectionKey)}>+ Add Narrative Bridge</button>
      </div>
    </div>
  );
}
