import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' ឬ 'crosspost'
  const [videoUrl, setVideoUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [mainPageId, setMainPageId] = useState('');
  const [targetPages, setTargetPages] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const BACKEND_URL = "https://crosspost-backend-pjjy.onrender.com";

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
        setStatus(`បរាជ័យ: ${typeof data.error === 'object' ? JSON.stringify(data.error) : data.error}`);
      }
    } catch (err) {
      setStatus(`មានបញ្ហាភ្ជាប់ទៅ Server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'crosspost',
      title: 'ផុស PE',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="13" height="13" rx="3" fill="#2563EB"/>
          <path d="M10 9.5L13.5 11.5L10 13.5V9.5Z" fill="white"/>
          <rect x="9" y="8" width="13" height="13" rx="3" fill="#60A5FA" fillOpacity="0.8"/>
          <path d="M17 12.5L20.5 14.5L17 16.5V12.5Z" fill="white"/>
        </svg>
      )
    },
    {
      id: 'video',
      title: 'ផុសវីដេអូ',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="url(#grad1)"/>
          <path d="M7 6H17C18.1046 6 19 6.89543 19 8V16C19 17.1046 18.1046 18 17 18H7C5.89543 18 5 17.1046 5 16V8C5 6.89543 5.89543 6 7 6Z" stroke="white" strokeWidth="2"/>
          <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="white"/>
          <line x1="8" y1="6" x2="8" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="2 2"/>
          <line x1="16" y1="6" x2="16" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="2 2"/>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF6B6B"/>
              <stop offset="1" stopColor="#FF8E53"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'soundy',
      title: 'Soundy AI',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="9" width="2" height="6" rx="1" fill="#8B5CF6"/>
          <rect x="7" y="5" width="2" height="14" rx="1" fill="#8B5CF6"/>
          <rect x="11" y="3" width="2" height="18" rx="1" fill="#8B5CF6"/>
          <rect x="15" y="7" width="2" height="10" rx="1" fill="#8B5CF6"/>
          <rect x="19" y="10" width="2" height="4" rx="1" fill="#8B5CF6"/>
        </svg>
      )
    },
    {
      id: 'download',
      title: 'ទាញយកវីដេអូ',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#3B82F6"/>
          <path d="M12 7V14M12 14L9 11M12 14L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'carousel',
      title: 'រូបភាព Carousel',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="4" width="12" height="16" rx="2" stroke="#60A5FA" strokeWidth="2"/>
          <path d="M8 14L11 11L13 13L15 10L16 11" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="10" cy="8" r="1" fill="#60A5FA"/>
          <line x1="2" y1="7" x2="2" y2="17" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="22" y1="7" x2="22" y2="17" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'split',
      title: 'បំបែកវីដេអូ',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4Z" stroke="#1E293B" strokeWidth="2"/>
          <path d="M6 16C4.89543 16 4 16.8954 4 18C4 19.1046 4.89543 20 6 20C7.10457 20 8 19.1046 8 18C8 16.8954 7.10457 16 6 16Z" stroke="#1E293B" strokeWidth="2"/>
          <path d="M7.5 7.5L18 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7.5 16.5L12 12" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 9L18 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 6L18 10" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'about',
      title: 'អំពីយើង',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#14B8A6"/>
          <path d="M12 11V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="8" r="1" fill="white"/>
        </svg>
      )
    }
  ];

  return (
    <div style={{ backgroundColor: '#F3F5F9', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Bar */}
      <header style={{ backgroundColor: '#181E2A', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#2563EB', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            MP
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>MasterPost Pro</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Creator Studio 2025</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>
            + គណនី
          </button>
          <div style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="7" y1="12" x2="21" y2="12"/>
              <line x1="11" y1="18" x2="21" y2="18"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px' }}>
        {activeTab === 'home' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {cards.map((card) => (
              <div 
                key={card.id}
                onClick={() => {
                  if (card.id === 'crosspost') setActiveTab('crosspost');
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  cursor: card.id === 'crosspost' ? 'pointer' : 'default',
                  transition: 'transform 0.1s'
                }}
              >
                <div style={{ marginBottom: '12px' }}>{card.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1E293B', textAlign: 'center' }}>
                  {card.title}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crosspost Form Section */}
        {activeTab === 'crosspost' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <button 
              onClick={() => setActiveTab('home')}
              style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px' }}
            >
              ← ត្រឡប់ក្រោយ
            </button>
            <h3 style={{ margin: '0 0 16px 0', color: '#1E293B' }}>ផុស PE (Video Crosspost)</h3>

            <form onSubmit={handleProcess}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Link វីដេអូ (TikTok, YouTube, FB):</label>
                <input 
                  type="url" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Page Access Token:</label>
                <input 
                  type="text" 
                  value={accessToken} 
                  onChange={(e) => setAccessToken(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Main Page ID:</label>
                <input 
                  type="text" 
                  value={mainPageId} 
                  onChange={(e) => setMainPageId(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Target Page IDs:</label>
                <input 
                  type="text" 
                  value={targetPages} 
                  onChange={(e) => setTargetPages(e.target.value)} 
                  placeholder="ID_1, ID_2"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>ចំណងជើង:</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>ការពិពណ៌នា:</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows="3" 
                  style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ width: '100%', padding: '12px', background: loading ? '#94A3B8' : '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {loading ? 'កំពុងដំណើរការ...' : 'ទាញយក និង ផុសភ្លាមៗ'}
              </button>
            </form>

            {status && (
              <div style={{ marginTop: '16px', padding: '10px', background: '#F1F5F9', borderRadius: '8px', fontSize: '13px' }}>
                {status}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
