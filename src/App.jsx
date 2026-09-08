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

  // ភ្ជាប់ទៅកាន់ Backend URL លើ Render របស់អ្នក
  const BACKEND_URL = "https://crosspost-backend-pjjy.onrender.com";

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('កំពុងទាញយកវីដេអូ និង រៀបចំផុសទៅ Facebook...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/crosspost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoUrl, 
          accessToken, 
          mainPageId, 
          targetPages, 
          title, 
          description 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(`ផុសជោគជ័យ! Video ID: ${data.videoId}`);
      } else {
        setStatus(`បរាជ័យ: ${typeof data.error === 'object' ? JSON.stringify(data.error) : data.error}`);
      }
    } catch (err) {
      setStatus(`មានបញ្ហាភ្ជាប់ទៅ Server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '24px', fontFamily: 'Arial, sans-serif', border: '1px solid #e1e4e8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' }}>
      <h2 style={{ color: '#1877f2', textAlign: 'center', marginBottom: '20px' }}>Camtool Video Crossposter</h2>
      
      <form onSubmit={handleProcess}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Link វីដេអូ (TikTok, YouTube, Facebook):</label>
          <input 
            type="url" 
            placeholder="https://www.tiktok.com/@user/video/..." 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Page Access Token:</label>
          <input 
            type="text" 
            placeholder="EAA..."
            value={accessToken} 
            onChange={(e) => setAccessToken(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Main Page ID (Page ដើម):</label>
          <input 
            type="text" 
            placeholder="1000..."
            value={mainPageId} 
            onChange={(e) => setMainPageId(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Target Page IDs (Crosspost) [ប្រើសញ្ញា " , " ខណ្ឌរវាង ID]:</label>
          <input 
            type="text" 
            placeholder="PAGE_ID_1, PAGE_ID_2" 
            value={targetPages} 
            onChange={(e) => setTargetPages(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>ចំណងជើង (Title):</label>
          <input 
            type="text" 
            placeholder="ចំណងជើងវីដេអូ..."
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>ការពិពណ៌នា (Caption):</label>
          <textarea 
            placeholder="ការពិពណ៌នាអំពីវីដេអូ..."
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows="3" 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '12px', background: loading ? '#888' : '#1877f2', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          {loading ? 'កំពុងដំណើរការ...' : 'ទាញយក និង ផុសភ្លាមៗ'}
        </button>
      </form>

      {status && (
        <div style={{ marginTop: '20px', padding: '12px', background: '#f0f2f5', borderRadius: '6px', borderLeft: '4px solid #1877f2', wordBreak: 'break-word' }}>
          {status}
        </div>
      )}
    </div>
  );
}
