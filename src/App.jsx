import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'crosspost', 'accounts'
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const [downloadedVideo, setDownloadedVideo] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [mainPageId, setMainPageId] = useState('');
  const [targetPages, setTargetPages] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // គ្រប់គ្រង Token & Pages list
  const [connectedPages, setConnectedPages] = useState([]);
  const [showTokenInput, setShowTokenInput] = useState(null); // 'basic', 'advance', 'easy'
  const [tokenPasteValue, setTokenPasteValue] = useState('');

  const BACKEND_URL = "https://crosspost-backend-pjjy.onrender.com";

  // ទាញយក Preview វីដេអូ
  const handleDownloadPreview = async () => {
    if (!videoUrl && !file) return;
    setLoading(true);
    setStatus('កំពុងទាញយកវីដេអូ...');
    
    setTimeout(() => {
      setDownloadedVideo({
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
        title: 'ចុច Like Page ដើម្បីបានវីដេអូថ្មីៗ',
        codeName: 'MSL 179'
      });
      setLoading(false);
      setStatus('');
    }, 1200);
  };

  // មុខងារបន្ថែម Token
  const handleAddToken = () => {
    if (!tokenPasteValue) return;
    // បញ្ចូល Page គំរូ ឬ Token ទៅក្នុងបញ្ជី
    setConnectedPages([
      ...connectedPages, 
      { id: Date.now(), name: 'Page Demo', pageId: '1000' + Math.floor(Math.random() * 10000), type: showTokenInput }
    ]);
    setAccessToken(tokenPasteValue);
    setTokenPasteValue('');
    setShowTokenInput(null);
  };

  // មុខងារបង្ហោះទៅ Facebook
  const handlePost = async () => {
    setLoading(true);
    setStatus('កំពុងបង្ហោះទៅ Facebook...');

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
    { id: 'crosspost', title: 'ផុស PE', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="13" height="13" rx="3" fill="#2563EB"/><path d="M10 9.5L13.5 11.5L10 13.5V9.5Z" fill="white"/><rect x="9" y="8" width="13" height="13" rx="3" fill="#60A5FA" fillOpacity="0.8"/><path d="M17 12.5L20.5 14.5L17 16.5V12.5Z" fill="white"/></svg> },
    { id: 'video', title: 'ផុសវីដេអូ', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="url(#grad1)"/><path d="M7 6H17C18.1046 6 19 6.89543 19 8V16C19 17.1046 18.1046 18 17 18H7C5.89543 18 5 17.1046 5 16V8C5 6.89543 5.89543 6 7 6Z" stroke="white" strokeWidth="2"/><path d="M10 9.5L15 12L10 14.5V9.5Z" fill="white"/><defs><linearGradient id="grad1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#FF6B6B"/><stop offset="1" stopColor="#FF8E53"/></linearGradient></defs></svg> },
    { id: 'soundy', title: 'Soundy AI', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="2" height="6" rx="1" fill="#8B5CF6"/><rect x="7" y="5" width="2" height="14" rx="1" fill="#8B5CF6"/><rect x="11" y="3" width="2" height="18" rx="1" fill="#8B5CF6"/><rect x="15" y="7" width="2" height="10" rx="1" fill="#8B5CF6"/><rect x="19" y="10" width="2" height="4" rx="1" fill="#8B5CF6"/></svg> },
    { id: 'download', title: 'ទាញយកវីដេអូ', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#3B82F6"/><path d="M12 7V14M12 14L9 11M12 14L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'carousel', title: 'រូបភាព Carousel', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="#60A5FA" strokeWidth="2"/><circle cx="10" cy="8" r="1" fill="#60A5FA"/><line x1="2" y1="7" x2="2" y2="17" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="7" x2="22" y2="17" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'split', title: 'បំបែកវីដេអូ', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4Z" stroke="#1E293B" strokeWidth="2"/><path d="M6 16C4.89543 16 4 16.8954 4 18C4 19.1046 4.89543 20 6 20C7.10457 20 8 19.1046 8 18C8 16.8954 7.10457 16 6 16Z" stroke="#1E293B" strokeWidth="2"/><path d="M7.5 7.5L18 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/><path d="M15 9L18 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'about', title: 'អំពីយើង', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#14B8A6"/><path d="M12 11V16" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="white"/></svg> }
  ];

  return (
    <div style={{ backgroundColor: '#F4F7FC', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Bar */}
      <header style={{ backgroundColor: '#1B2430', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{ backgroundColor: '#2563EB', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            MP
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>MasterPost Pro</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Creator Studio 2025</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('accounts')}
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
          >
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
      <main style={{ maxWidth: '440px', margin: '0 auto', padding: '20px 16px' }}>
        {/* Dashboard Grid */}
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

        {/* ផ្នែកគ្រប់គ្រង គណនី / Token Page UI */}
        {activeTab === 'accounts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => setActiveTab('home')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 'bold' }}>
              ← ត្រឡប់ទៅទំព័រដើម
            </button>

            {/* Basic Token Option */}
            <div 
              onClick={() => setShowTokenInput('basic')}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid #93C5FD', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>Basic Token</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>សំរាប់ Token នេះអាចប្រើបានមួយរយៈតែក៉ុណ្ណោះ</div>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            {/* Advance Token Option */}
            <div 
              onClick={() => setShowTokenInput('advance')}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>Advance Token</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>សំរាប់ Token នេះអាចប្រើបានប្រហែល ៣ខែ ប្រសិនបើអ្នកមិនមានការផ្លាស់ប្តូរពាក្យសម្ងាត់ហ្វេសប៊ុករបស់អ្នក</div>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            {/* Easy Token Option */}
            <div 
              onClick={() => setShowTokenInput('easy')}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <path d="M12 8l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>Easy Token</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>សំរាប់ Token នេះអាចប្រើបានប្រហែល ៣ខែ ប្រសិនបើអ្នកមិនមានការផ្លាស់ប្តូរពាក្យសម្ងាត់ហ្វេសប៊ុករបស់អ្នក</div>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            {/* Modal/Input Form ពេលចុចលើ Token ណាមួយ */}
            {showTokenInput && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #2563EB' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Paste Token ({showTokenInput.toUpperCase()}):</div>
                <input 
                  type="text" 
                  placeholder="Paste Token នៅទីនេះ (EAA...)" 
                  value={tokenPasteValue} 
                  onChange={(e) => setTokenPasteValue(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleAddToken} style={{ flex: 1, backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ភ្ជាប់ Token</button>
                  <button onClick={() => setShowTokenInput(null)} style={{ backgroundColor: '#E2E8F0', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>បិទ</button>
                </div>
              </div>
            )}

            {/* Connected Pages List Container */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#1E293B', fontSize: '15px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  គណនី / Page ដែលបានភ្ជាប់រួម ({connectedPages.length})
                </div>
                <div style={{ color: '#94A3B8', fontSize: '13px' }}>0 កំពុងជ្រើសរើស</div>
              </div>

              {connectedPages.length === 0 ? (
                /* Empty State Display */
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1E293B', marginBottom: '6px' }}>
                    មិនទាន់មាន Page ត្រូវបានភ្ជាប់នៅឡើយទេ
                  </div>
                  <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                    សូមជ្រើសរើសប្រភេទ Token ខាងលើ រួចបិទភ្ជាប់ (Paste)
                  </div>
                </div>
              ) : (
                /* Joined Pages List */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {connectedPages.map((page) => (
                    <div key={page.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>{page.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>ID: {page.pageId} ({page.type})</div>
                      </div>
                      <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 'bold' }}>● ភ្ជាប់រួច</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content: ផុស PE */}
        {activeTab === 'crosspost' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => setActiveTab('home')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 'bold' }}>
              ← ត្រឡប់ទៅទំព័រដើម
            </button>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1.5px solid #1E293B', borderRadius: '30px', padding: '8px 24px', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B', fontSize: '15px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                ជ្រើសរើសវីដេអូ
                <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
              </label>

              <div style={{ margin: '14px 0', color: '#94A3B8', fontSize: '14px' }}>ឬ</div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input type="url" placeholder="បញ្ចូលលីងវីដេអូ (TikTok, Facebook, YouTube.." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={handleDownloadPreview} style={{ backgroundColor: '#818CF8', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 18px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>ទាញយក</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ color: '#94A3B8' }}>ស្គាល់:</span>
                <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '6px' }}>TikTok</span>
                <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '3px 10px', borderRadius: '6px', fontWeight: 'bold' }}>FB Reels</span>
                <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '3px 10px', borderRadius: '6px' }}>YouTube</span>
              </div>
            </div>

            {downloadedVideo && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#000' }}>
                    <img src={downloadedVideo.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>▶ ចុចតភ្ជាប់វីដេអូ</div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', backgroundColor: '#FF0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <div style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1E293B' }}>{downloadedVideo.title}</span>
                    <div style={{ backgroundColor: '#2563EB', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', padding: '10px' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#2563EB"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    <div style={{ marginTop: '16px', fontWeight: 'bold', color: '#1E3A8A', fontSize: '14px' }}>& SHARE</div>
                  </div>
                  <div style={{ padding: '10px 12px', backgroundColor: '#F1F5F9', fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>
                    {downloadedVideo.codeName}
                  </div>
                </div>
              </div>
            )}

            <button onClick={handlePost} disabled={loading} style={{ width: '100%', backgroundColor: '#1E293B', color: '#FFFFFF', padding: '16px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'កំពុងដំណើរការ...' : 'បង្ហោះ'}
            </button>

            {status && (
              <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '12px', textAlign: 'center', fontSize: '14px', color: '#2563EB' }}>
                {status}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
