const AUTO_BOLD_NAMES = [
  'Adriano Espaillat', 'Julie Menin', 'Zohran Mamdani', 'Kathy Hochul',
  'Kathryn Garcia', 'Donovan Richards', 'Vanessa Gibson', 'Justin Brannan',
  'Mark Levine', 'Scott Stringer', 'Eric Adams', 'Letitia James', 'Patrick Gaspard',
  'Brad Lander', 'Alicia Glen', 'Brad Hoylman', 'Jimmy Van Bramer',
];

function autoBold(text) {
  if (!text) return '';
  let result = text;
  AUTO_BOLD_NAMES.forEach((name) => {
    result = result.replace(new RegExp(name, 'g'), `<strong>${name}</strong>`);
  });
  return result.replace(/\n/g, '<br>');
}

const RAINBOW_STRIPE = `background: repeating-linear-gradient(90deg,#173061 0px,#173061 8px,#ff009d 8px,#ff009d 16px,#f7e951 16px,#f7e951 24px,#3271c8 24px,#3271c8 32px);`;

function rainbowDivider() {
  return `<div style="height:6px;${RAINBOW_STRIPE}margin:0 0 0 0;"></div>`;
}

const SECTION_STYLES = {
  scene:         { bg: '#fff5fa', accent: '#ff009d', label: 'THE SCENE' },
  cityHall:      { bg: '#f0f5ff', accent: '#3271c8', label: 'CITY HALL' },
  albanyRadar:   { bg: '#f0f2f8', accent: '#173061', label: 'ALBANY RADAR' },
  theRooms:      { bg: '#f5f0ff', accent: '#7c3aed', label: 'THE ROOMS' },
  spotted:       { bg: '#f0faf5', accent: '#059669', label: 'SPOTTED' },
  overheard:     { bg: '#fffef0', accent: '#c4a000', label: 'OVERHEARD' },
  moversShakers: { bg: '#fff5f5', accent: '#dc2626', label: 'MOVERS & SHAKERS' },
  comingUp:      { bg: '#fff0fa', accent: '#ff99d8', label: 'COMING UP' },
  skyelights:    { bg: '#ffe6f5', accent: '#ff009d', label: 'SKYELIGHTS' },
};

function buildPhotoHtml(photos) {
  if (!photos || photos.length === 0) return '';
  const validPhotos = photos.filter((p) => p && p.cropped);
  if (validPhotos.length === 0) return '';

  if (validPhotos.length === 1) {
    const p = validPhotos[0];
    const pos = p.position || 'full';
    if (pos === 'left') {
      return `<img src="${p.cropped}" style="float:left;width:44%;margin:0 16px 12px 0;border-radius:6px;display:block;">`;
    } else if (pos === 'right') {
      return `<img src="${p.cropped}" style="float:right;width:44%;margin:0 0 12px 16px;border-radius:6px;display:block;">`;
    } else {
      return `<img src="${p.cropped}" style="width:100%;display:block;border-radius:6px;margin-bottom:12px;">`;
    }
  }

  if (validPhotos.length === 2) {
    return `<table width="100%" cellpadding="0" cellspacing="4" style="margin-bottom:12px;">
      <tr>
        <td width="50%"><img src="${validPhotos[0].cropped}" style="width:100%;height:260px;object-fit:cover;border-radius:6px;display:block;"></td>
        <td width="50%"><img src="${validPhotos[1].cropped}" style="width:100%;height:260px;object-fit:cover;border-radius:6px;display:block;"></td>
      </tr>
    </table>`;
  }

  if (validPhotos.length === 3) {
    return `<table width="100%" cellpadding="0" cellspacing="4" style="margin-bottom:12px;">
      <tr>
        ${validPhotos.map((p) => `<td width="33%"><img src="${p.cropped}" style="width:100%;height:200px;object-fit:cover;border-radius:6px;display:block;"></td>`).join('')}
      </tr>
    </table>`;
  }

  return '';
}

function storyCardHtml(story, accent) {
  if (!story.headline && !story.body) return '';

  const photoHtml = buildPhotoHtml(story.photos || []);

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;">
  <tr><td style="padding:20px 24px;">
    ${story.tag ? `<div style="display:inline-block;background:${accent};color:#ffffff !important;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;padding:3px 10px;border-radius:4px;margin-bottom:10px;">${story.tag}</div>` : ''}
    ${story.headline ? `<h3 style="font-family:'League Spartan',sans-serif;font-size:22px;font-weight:700;color:#173061 !important;margin:0 0 12px 0;line-height:1.2;">${story.headline}</h3>` : ''}
    ${photoHtml}
    ${story.body ? `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1a1a2e !important;margin:0;">${autoBold(story.body)}</p>` : ''}
  </td></tr>
</table>`;
}

function storySectionHtml(sectionData, sectionKey) {
  const style = SECTION_STYLES[sectionKey];
  const stories = sectionData?.stories || [];
  const bridges = sectionData?.bridges || [];

  const hasContent = stories.some((s) => s.headline || s.body);
  if (!hasContent) return '';

  let content = '';
  stories.forEach((story, i) => {
    content += storyCardHtml(story, style.accent);
    const bridge = bridges[i];
    if (bridge && bridge.text) {
      content += `<div style="border-left:3px solid #ff009d;padding:12px 16px;margin-bottom:16px;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:15px;color:#333 !important;">${bridge.text}</div>`;
    }
  });

  return `
${rainbowDivider()}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${style.bg};">
  <tr><td style="padding:32px 40px;">
    <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${style.accent} !important;margin-bottom:4px;">In The Room Media</div>
    <h2 style="font-family:'League Spartan',sans-serif;font-size:32px;font-weight:700;color:${style.accent} !important;margin:0 0 24px 0;border-bottom:2px solid ${style.accent};padding-bottom:12px;">${style.label}</h2>
    ${content}
    <div style="clear:both;"></div>
  </td></tr>
</table>`;
}

function spottedSectionHtml(data) {
  const sightings = data?.sightings || [];
  const photos = (data?.photos || []).filter((p) => p && p.cropped);
  const photoCount = data?.photoCount || 0;
  if (sightings.length === 0 && photos.length === 0) return '';

  const style = SECTION_STYLES.spotted;

  const sightingsHtml = sightings
    .filter((s) => s.text)
    .map((s) => `<li style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#1a1a2e !important;margin-bottom:8px;line-height:1.6;">${autoBold(s.text)}</li>`)
    .join('');

  let photoGridHtml = '';
  if (photos.length > 0) {
    if (photoCount === 1) {
      photoGridHtml = `<img src="${photos[0].cropped}" style="width:100%;border-radius:8px;margin-top:16px;display:block;">`;
    } else if (photoCount === 2 || photoCount === 3) {
      const cols = photoCount;
      photoGridHtml = `<table width="100%" cellpadding="0" cellspacing="4" style="margin-top:16px;"><tr>
        ${photos.slice(0, cols).map((p) => `<td width="${Math.floor(100/cols)}%"><img src="${p.cropped}" style="width:100%;height:220px;object-fit:cover;border-radius:6px;display:block;"></td>`).join('')}
      </tr></table>`;
    } else if (photoCount === 4) {
      const rows = [photos.slice(0, 2), photos.slice(2, 4)];
      photoGridHtml = `<table width="100%" cellpadding="0" cellspacing="4" style="margin-top:16px;">
        ${rows.map((row) => `<tr>${row.map((p) => `<td width="50%"><img src="${p.cropped}" style="width:100%;height:200px;object-fit:cover;border-radius:6px;display:block;"></td>`).join('')}</tr>`).join('')}
      </table>`;
    }
  }

  return `
${rainbowDivider()}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${style.bg};">
  <tr><td style="padding:32px 40px;">
    <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${style.accent} !important;margin-bottom:4px;">In The Room Media</div>
    <h2 style="font-family:'League Spartan',sans-serif;font-size:32px;font-weight:700;color:${style.accent} !important;margin:0 0 24px 0;border-bottom:2px solid ${style.accent};padding-bottom:12px;">SPOTTED</h2>
    ${sightingsHtml ? `<ul style="padding-left:20px;margin:0;">${sightingsHtml}</ul>` : ''}
    ${photoGridHtml}
  </td></tr>
</table>`;
}

function overheardSectionHtml(data) {
  const quotes = (data?.quotes || []).filter((q) => q.text);
  if (quotes.length === 0) return '';
  const style = SECTION_STYLES.overheard;

  const quotesHtml = quotes.map((q) => `
<div style="background:#ffffff;border-radius:10px;padding:20px 24px;margin-bottom:16px;border-left:4px solid #f7e951;">
  <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:18px;color:#1a1a2e !important;margin:0 0 10px 0;line-height:1.5;">"${q.text}"</p>
  ${q.attribution ? `<div style="font-family:'League Spartan',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888 !important;">${q.attribution}</div>` : ''}
</div>`).join('');

  return `
${rainbowDivider()}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${style.bg};">
  <tr><td style="padding:32px 40px;">
    <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${style.accent} !important;margin-bottom:4px;">In The Room Media</div>
    <h2 style="font-family:'League Spartan',sans-serif;font-size:32px;font-weight:700;color:${style.accent} !important;margin:0 0 24px 0;border-bottom:2px solid ${style.accent};padding-bottom:12px;">OVERHEARD</h2>
    ${quotesHtml}
  </td></tr>
</table>`;
}

function comingUpSectionHtml(data) {
  const events = (data?.events || []).filter((e) => e.title || e.date);
  if (events.length === 0) return '';
  const style = SECTION_STYLES.comingUp;

  const eventsHtml = events.map((e) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;margin-bottom:12px;">
  <tr>
    <td width="100" style="padding:16px;vertical-align:top;">
      <div style="background:#173061;border-radius:8px;padding:10px;text-align:center;">
        <div style="font-family:'League Spartan',sans-serif;font-size:13px;font-weight:700;color:#ff99d8 !important;">${e.date || '—'}</div>
      </div>
    </td>
    <td style="padding:16px;vertical-align:top;">
      <div style="font-family:'League Spartan',sans-serif;font-size:17px;font-weight:700;color:#173061 !important;margin-bottom:4px;">${e.title || ''}</div>
      ${e.details ? `<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#555 !important;">${e.details}</div>` : ''}
    </td>
  </tr>
</table>`).join('');

  return `
${rainbowDivider()}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${style.bg};">
  <tr><td style="padding:32px 40px;">
    <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${style.accent} !important;margin-bottom:4px;">In The Room Media</div>
    <h2 style="font-family:'League Spartan',sans-serif;font-size:32px;font-weight:700;color:${style.accent} !important;margin:0 0 24px 0;border-bottom:2px solid ${style.accent};padding-bottom:12px;">COMING UP</h2>
    ${eventsHtml}
  </td></tr>
</table>`;
}

function skyelightsSectionHtml(data) {
  if (!data?.text) return '';
  const style = SECTION_STYLES.skyelights;
  const photo = data.photo && data.photo.cropped
    ? `<img src="${data.photo.cropped}" style="float:right;width:40%;margin:0 0 12px 20px;border-radius:8px;display:block;">`
    : '';

  return `
${rainbowDivider()}
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${style.bg};">
  <tr><td style="padding:32px 40px;">
    <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${style.accent} !important;margin-bottom:4px;">In The Room Media</div>
    <h2 style="font-family:'League Spartan',sans-serif;font-size:32px;font-weight:700;color:${style.accent} !important;margin:0 0 24px 0;border-bottom:2px solid ${style.accent};padding-bottom:12px;">SKYELIGHTS</h2>
    <div style="background:#ffffff;border-radius:10px;padding:24px;">
      ${photo}
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:16px;line-height:1.8;color:#1a1a2e !important;margin:0;">${autoBold(data.text).replace(/\n/g, '<br>')}</p>
      <div style="clear:both;"></div>
    </div>
  </td></tr>
</table>`;
}

export function exportHtml(data) {
  const { issueDetails: d, scene, cityHall, albanyRadar, theRooms, spotted, overheard, moversShakers, comingUp, skyelights } = data;

  const tocSections = [
    { key: 'scene', label: '🎬 The Scene' },
    { key: 'cityHall', label: '🏛️ City Hall' },
    { key: 'albanyRadar', label: '🗳️ Albany Radar' },
    { key: 'theRooms', label: '🍸 The Rooms' },
    { key: 'spotted', label: '📍 Spotted' },
    { key: 'overheard', label: '💬 Overheard' },
    { key: 'moversShakers', label: '🎯 Movers & Shakers' },
    { key: 'comingUp', label: '📅 Coming Up' },
    { key: 'skyelights', label: '💡 Skyelights' },
  ];

  const tocHtml = `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#173061;">
  <tr><td style="padding:28px 40px;">
    <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#ff99d8 !important;margin-bottom:16px;">IN THIS ISSUE</div>
    <table width="100%" cellpadding="4" cellspacing="0">
      <tr>
        ${tocSections.map((s) => `<td style="font-family:'League Spartan',sans-serif;font-size:12px;color:#ffffff !important;padding:4px 8px;">• ${s.label}</td>`).join('')}
      </tr>
    </table>
  </td></tr>
</table>`;

  const html = `<!DOCTYPE html>
<html lang="en" style="color-scheme:light;">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Skye's Sundae Scoops — ${d?.issueNumber || ''} ${d?.date || ''}</title>
<link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
  @media (prefers-color-scheme: dark) { :root { color-scheme: light !important; } * { background: inherit !important; } }
  body { background: #ffffff !important; color: #1a1a2e !important; margin: 0; padding: 0; }
  img { max-width: 100%; }
</style>
</head>
<body style="background:#ffffff !important;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;margin:0 auto;background:#ffffff;">

<!-- HEADER -->
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    ${d?.headerImageUrl ? `<tr><td><img src="${d.headerImageUrl}" width="100%" style="display:block;width:100%;"></td></tr>` : ''}
    <tr><td style="background-color:#173061;padding:10px 32px;text-align:center;">
      <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#ffffff !important;">
        ${[d?.issueNumber, d?.date, d?.publication].filter(Boolean).join(' | ')}
      </div>
    </td></tr>
  </table>
</td></tr>

<!-- OPENING QUOTE -->
${d?.openingQuote ? `<tr><td style="background:#ff009d;padding:20px 40px;text-align:center;">
  <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:18px;color:#ffffff !important;margin:0 0 8px 0;">"${d.openingQuote}"</p>
  ${d?.quoteAttribution ? `<div style="font-family:'League Spartan',sans-serif;font-size:12px;color:#fff0fa !important;letter-spacing:0.1em;">${d.quoteAttribution}</div>` : ''}
</td></tr>` : ''}

<!-- INTRO -->
${d?.introParagraphs ? `<tr><td style="padding:28px 40px;">
  <p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.8;color:#1a1a2e !important;margin:0;">${autoBold(d.introParagraphs)}</p>
</td></tr>` : ''}

<!-- TOC -->
<tr><td>${tocHtml}</td></tr>

<!-- SECTIONS -->
<tr><td>${storySectionHtml(scene, 'scene')}</td></tr>
<tr><td>${storySectionHtml(cityHall, 'cityHall')}</td></tr>
<tr><td>${storySectionHtml(albanyRadar, 'albanyRadar')}</td></tr>
<tr><td>${storySectionHtml(theRooms, 'theRooms')}</td></tr>
<tr><td>${spottedSectionHtml(spotted)}</td></tr>
<tr><td>${overheardSectionHtml(overheard)}</td></tr>
<tr><td>${storySectionHtml(moversShakers, 'moversShakers')}</td></tr>
<tr><td>${comingUpSectionHtml(comingUp)}</td></tr>
<tr><td>${skyelightsSectionHtml(skyelights)}</td></tr>

<!-- FOOTER -->
<tr><td>
  ${rainbowDivider()}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#173061;">
    <tr><td style="padding:28px 40px;text-align:center;">
      <div style="font-family:'League Spartan',sans-serif;font-size:18px;font-weight:700;color:#ffffff !important;margin-bottom:4px;">In The Room Media</div>
      <div style="font-family:'DM Mono',monospace;font-size:10px;color:#ff99d8 !important;letter-spacing:0.15em;text-transform:uppercase;">Skye's Sundae Scoops Newsletter</div>
    </td></tr>
  </table>
</td></tr>

</table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sundae-scoops-${d?.issueNumber || 'draft'}-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
