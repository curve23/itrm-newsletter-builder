import { useState, useRef } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import IssueDetails from './components/sections/IssueDetails';
import StorySection from './components/sections/StorySection';
import Spotted from './components/sections/Spotted';
import Overheard from './components/sections/Overheard';
import ComingUp from './components/sections/ComingUp';
import Skyelights from './components/sections/Skyelights';
import PasteSortModal from './components/PasteSortModal';
import { useNewsletter } from './hooks/useNewsletter';

export default function App() {
  const [activeSection, setActiveSection] = useState('issueDetails');
  const [showPasteSort, setShowPasteSort] = useState(false);
  const {
    data, hasContent, showToast,
    updateIssueDetails,
    addStory, removeStory, updateStory,
    addBridge, removeBridge, updateBridge,
    addQuote, removeQuote, updateQuote,
    addEvent, removeEvent, updateEvent,
    updateSkyelights, updateSpotted,
    reset, save,
  } = useNewsletter();

  const mainRef = useRef(null);

  const navigate = (key) => {
    setActiveSection(key);
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReset = () => {
    if (confirm('Reset all content? This cannot be undone.')) reset();
  };

  const storySections = [
    { key: 'scene', icon: '🎬', title: 'The Scene' },
    { key: 'cityHall', icon: '🏛️', title: 'City Hall' },
    { key: 'albanyRadar', icon: '🗳️', title: 'Albany Radar' },
    { key: 'theRooms', icon: '🍸', title: 'The Rooms' },
    { key: 'moversShakers', icon: '🎯', title: 'Movers & Shakers' },
  ];

  const handleApplyParsed = (parsed) => {
    save({ ...data, ...parsed });
  };

  return (
    <div className="app">
      <TopBar data={data} onReset={handleReset} onPasteSort={() => setShowPasteSort(true)} />
      <div className="app-body">
        <Sidebar active={activeSection} hasContent={hasContent} onNavigate={navigate} />
        <div className="main-content" ref={mainRef}>
          <div id="section-issueDetails">
            <IssueDetails data={data.issueDetails} onChange={updateIssueDetails} />
          </div>
          {storySections.map((s) => (
            <div key={s.key} id={`section-${s.key}`} style={{ marginTop: 40 }}>
              <StorySection
                title={s.title}
                icon={s.icon}
                sectionKey={s.key}
                data={data[s.key]}
                onAddStory={addStory}
                onRemoveStory={removeStory}
                onUpdateStory={updateStory}
                onAddBridge={addBridge}
                onRemoveBridge={removeBridge}
                onUpdateBridge={updateBridge}
              />
            </div>
          ))}
          <div id="section-spotted" style={{ marginTop: 40 }}>
            <Spotted data={data.spotted} onUpdate={updateSpotted} />
          </div>
          <div id="section-overheard" style={{ marginTop: 40 }}>
            <Overheard data={data.overheard} onAdd={addQuote} onRemove={removeQuote} onUpdate={updateQuote} />
          </div>
          <div id="section-comingUp" style={{ marginTop: 40 }}>
            <ComingUp data={data.comingUp} onAdd={addEvent} onRemove={removeEvent} onUpdate={updateEvent} />
          </div>
          <div id="section-skyelights" style={{ marginTop: 40, marginBottom: 60 }}>
            <Skyelights data={data.skyelights} onUpdate={updateSkyelights} />
          </div>
        </div>
      </div>
      {showToast && <div className="toast">✓ Draft restored!</div>}
      {showPasteSort && (
        <PasteSortModal
          onApply={handleApplyParsed}
          onClose={() => setShowPasteSort(false)}
        />
      )}
    </div>
  );
}
