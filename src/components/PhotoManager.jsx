import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

function PhotoSlot({ photo, onUpdate, onRemove, showPosition = false }) {
  const [cropping, setCropping] = useState(!photo?.cropped);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const capRef = useRef(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
    capRef.current = pixels;
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ src: reader.result, cropped: null, position: 'full', crop: { x: 0, y: 0 }, zoom: 1 });
      setCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      capRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const confirmCrop = async () => {
    const pixels = capRef.current || croppedAreaPixels;
    if (!photo?.src || !pixels) return;
    setConfirming(true);
    try {
      const croppedImg = await getCroppedImg(photo.src, pixels);
      onUpdate({ ...photo, cropped: croppedImg });
      setCropping(false);
    } finally {
      setConfirming(false);
    }
  };

  if (!photo?.src) {
    return (
      <div style={{ border: '2px dashed #2a3a5c', borderRadius: 8, padding: 24, textAlign: 'center' }}>
        <label style={{ cursor: 'pointer', color: '#ff009d', fontFamily: 'League Spartan', fontSize: 13, fontWeight: 600 }}>
          + Upload Photo
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </label>
      </div>
    );
  }

  if (cropping) {
    return (
      <div style={{ background: '#0a1428', borderRadius: 8, padding: 16 }}>
        <div style={{ position: 'relative', width: '100%', height: 280, background: '#000', borderRadius: 6 }}>
          <Cropper
            image={photo.src}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, background: '#0a1428', padding: '8px 0 0' }}>
          <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: '#8899bb', whiteSpace: 'nowrap' }}>ZOOM</span>
          <input
            type="range" min={1} max={3} step={0.01} value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#ff009d' }}
          />
          <button
            className="btn-primary"
            onClick={confirmCrop}
            disabled={confirming}
            style={{ whiteSpace: 'nowrap', opacity: confirming ? 0.6 : 1 }}
          >
            {confirming ? '...' : '✓ Confirm'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a1428', borderRadius: 8, padding: 12 }}>
      {photo.cropped && <img src={photo.cropped} alt="" style={{ width: '100%', borderRadius: 6, display: 'block' }} />}
      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setCropping(true)}>✂ Re-crop</button>
        <label style={{ cursor: 'pointer' }}>
          <span className="btn-secondary" style={{ fontSize: 12, padding: '4px 10px', display: 'inline-block', border: '1px solid #2a3a5c', borderRadius: 6, color: '#8899bb', fontFamily: 'League Spartan', fontWeight: 600 }}>↑ Replace</span>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </label>
        {showPosition && (
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {['left', 'right', 'full'].map((pos) => (
              <button
                key={pos}
                onClick={() => onUpdate({ ...photo, position: pos })}
                style={{
                  padding: '4px 8px', fontSize: 11, borderRadius: 4, fontFamily: 'DM Mono',
                  background: photo.position === pos ? '#ff009d' : 'transparent',
                  color: photo.position === pos ? 'white' : '#8899bb',
                  border: '1px solid ' + (photo.position === pos ? '#ff009d' : '#2a3a5c'),
                  cursor: 'pointer'
                }}
              >
                {pos === 'left' ? '◧ Left' : pos === 'right' ? '◨ Right' : '▬ Full'}
              </button>
            ))}
          </div>
        )}
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#ff5566', fontSize: 16, cursor: 'pointer', marginLeft: 'auto' }}>×</button>
      </div>
    </div>
  );
}

export default function PhotoManager({ photos = [], onChange }) {
  const updatePhoto = (index, updated) => {
    const next = [...photos];
    next[index] = updated;
    onChange(next);
  };
  const removePhoto = (index) => {
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
  };
  const addSlot = () => {
    if (photos.length >= 3) return;
    onChange([...photos, null]);
  };

  return (
    <div>
      <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: '#8899bb', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Photos ({photos.length}/3)
        {photos.length < 3 && (
          <button onClick={addSlot} style={{ marginLeft: 10, background: 'none', border: '1px solid #2a3a5c', borderRadius: 4, color: '#ff009d', fontSize: 11, padding: '2px 8px', cursor: 'pointer', fontFamily: 'DM Mono' }}>
            + Add Photo
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {photos.map((photo, i) => (
          <PhotoSlot
            key={i}
            photo={photo}
            onUpdate={(updated) => updatePhoto(i, updated)}
            onRemove={() => removePhoto(i)}
            showPosition={photos.length === 1}
          />
        ))}
      </div>
    </div>
  );
}
