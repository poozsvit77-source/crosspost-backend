import React, { useState } from 'react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [mainPageId, setMainPageId] = useState('');
  const [targetPages, setTargetPages] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // ជំនួស URL នេះដោយ URL ដែលទទួលបានពី Render ពេលក្រោយ
  const BACKEND_URL = "http://localhost:5000";

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('កំពុងទាញយក និង រៀបចំផុស...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/crosspost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, accessToken, mainPageId, targetPages, title, description }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(`ផុសជោគជ័យ! Video ID: ${data.videoId}`);
      } else {
        setStatus(`បរាជ័យ: ${JSON.stringify(data.error)}`);
      }
    } catch (err) {
      setStatus(`មានបញ្ហាភ្ជាប់ទៅ Server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#1877f2' }}>Camtool Crossposter</h2>
      <form onSubmit={handleProcess}>
        <div style={{ marginBottom: '10px' }}>
          <label>Link វីដេអូ (TikTok, YouTube, FB):</label>
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Page Access Token:</label>
          <input type="text" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Main Page ID:</label>
          <input type="text" value={mainPageId} onChange={(e) => setMainPageId(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Target Page IDs (ប្រើសញ្ញា " , " ខណ្ឌរវាង ID):</label>
          <input type="text" value={targetPages} onChange={(e) => setTargetPages(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>ចំណងជើង:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>ការពិពណ៌នា (Caption):</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'កំពុងដំណើរការ...' : 'ទាញយក និង ផុសភ្លាមៗ'}
        </button>
      </form>
      {status && <div style={{ marginTop: '15px', padding: '10px', background: '#f0f2f5' }}>{status}</div>}
    </div>
  );
}
