import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'itrm_newsletter_draft';

const defaultState = {
  issueDetails: {
    issueNumber: '',
    date: '',
    publication: 'In The Room Media',
    headerImageUrl: '',
    openingQuote: '',
    quoteAttribution: '',
    introParagraphs: '',
  },
  scene: { stories: [], bridges: [] },
  cityHall: { stories: [], bridges: [] },
  albanyRadar: { stories: [], bridges: [] },
  theRooms: { stories: [], bridges: [] },
  spotted: { sightings: [], photoCount: 0, photos: [] },
  overheard: { quotes: [] },
  comingUp: { events: [] },
  moversShakers: { stories: [], bridges: [] },
  skyelights: { text: '', photo: null },
};

function makeStory() {
  return { id: Date.now() + Math.random(), tag: '', headline: '', body: '', photos: [] };
}
function makeBridge() {
  return { id: Date.now() + Math.random(), text: '' };
}
function makeQuote() {
  return { id: Date.now() + Math.random(), text: '', attribution: '' };
}
function makeEvent() {
  return { id: Date.now() + Math.random(), date: '', title: '', details: '' };
}

export function useNewsletter() {
  const [data, setData] = useState(defaultState);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 10000);
    return () => clearInterval(timer);
  }, [data]);

  const save = useCallback((newData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const updateIssueDetails = (field, value) => {
    const next = { ...data, issueDetails: { ...data.issueDetails, [field]: value } };
    save(next);
  };

  const updateSection = (section, updater) => {
    const next = { ...data, [section]: updater(data[section]) };
    save(next);
  };

  const addStory = (section) => {
    updateSection(section, (s) => ({ ...s, stories: [...(s.stories || []), makeStory()] }));
  };
  const removeStory = (section, id) => {
    updateSection(section, (s) => ({ ...s, stories: s.stories.filter((x) => x.id !== id) }));
  };
  const updateStory = (section, id, field, value) => {
    updateSection(section, (s) => ({
      ...s,
      stories: s.stories.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    }));
  };

  const addBridge = (section) => {
    updateSection(section, (s) => ({ ...s, bridges: [...(s.bridges || []), makeBridge()] }));
  };
  const removeBridge = (section, id) => {
    updateSection(section, (s) => ({ ...s, bridges: s.bridges.filter((x) => x.id !== id) }));
  };
  const updateBridge = (section, id, value) => {
    updateSection(section, (s) => ({
      ...s,
      bridges: s.bridges.map((x) => (x.id === id ? { ...x, text: value } : x)),
    }));
  };

  const addQuote = () => {
    updateSection('overheard', (s) => ({ ...s, quotes: [...s.quotes, makeQuote()] }));
  };
  const removeQuote = (id) => {
    updateSection('overheard', (s) => ({ ...s, quotes: s.quotes.filter((x) => x.id !== id) }));
  };
  const updateQuote = (id, field, value) => {
    updateSection('overheard', (s) => ({
      ...s,
      quotes: s.quotes.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    }));
  };

  const addEvent = () => {
    updateSection('comingUp', (s) => ({ ...s, events: [...s.events, makeEvent()] }));
  };
  const removeEvent = (id) => {
    updateSection('comingUp', (s) => ({ ...s, events: s.events.filter((x) => x.id !== id) }));
  };
  const updateEvent = (id, field, value) => {
    updateSection('comingUp', (s) => ({
      ...s,
      events: s.events.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    }));
  };

  const updateSkyelights = (field, value) => {
    updateSection('skyelights', (s) => ({ ...s, [field]: value }));
  };

  const updateSpotted = (field, value) => {
    updateSection('spotted', (s) => ({ ...s, [field]: value }));
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultState);
  };

  const hasContent = {
    issueDetails: !!(data.issueDetails.issueNumber || data.issueDetails.introParagraphs),
    scene: (data.scene.stories?.length || 0) > 0,
    cityHall: (data.cityHall.stories?.length || 0) > 0,
    albanyRadar: (data.albanyRadar.stories?.length || 0) > 0,
    theRooms: (data.theRooms.stories?.length || 0) > 0,
    spotted: (data.spotted.sightings?.length || 0) > 0,
    overheard: (data.overheard.quotes?.length || 0) > 0,
    comingUp: (data.comingUp.events?.length || 0) > 0,
    moversShakers: (data.moversShakers.stories?.length || 0) > 0,
    skyelights: !!(data.skyelights.text),
  };

  return {
    data,
    hasContent,
    showToast,
    updateIssueDetails,
    addStory, removeStory, updateStory,
    addBridge, removeBridge, updateBridge,
    addQuote, removeQuote, updateQuote,
    addEvent, removeEvent, updateEvent,
    updateSkyelights,
    updateSpotted,
    reset,
    save,
  };
}
