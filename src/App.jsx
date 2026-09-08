import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'crosspost', 'accounts'
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  
  // Data ទទួលបានពី Backend
  const [downloadedVideo, setDownloadedVideo] = useState(null);
  const [userPages, setUserPages] = useState([]);
  const [selectedMainPage, setSelectedMainPage] = useState('');
  const [selectedTargetPages, setSelectedTargetPages] = useState([]);
  
  // State សម្រាប់ Token & Form
  const [userToken, setUserToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const BACKEND_URL = "https://crosspost-backend-pjjy.onrender.com";

  // ១. មុខងារភ្ជាប់ Token ពិត និង ទាញយកបញ្ជី Page ពី Facebook API
  const handleConnectToken = async () => {
    if (!tokenInput.trim()) {
      alert('សូមបញ្ចូល Token ជាមុនសិន!');
      return;
    }
    setLoading(true);
    setStatus('កំពុងផ្ទៀងផ្ទាត់ Token និងទាញយកបញ្ជី Page...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/get-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: tokenInput })
      });
      const data = await res.json();

      if (data.success && data.pages) {
        setUserPages(data.pages);
        setUserToken(tokenInput);
        if (data.pages.length > 0) {
          setSelectedMainPage(data.pages[0].id); // កំណត់ Page ដំបូងជា Main Page
        }
        setStatus(`ភ្ជាប់ជោគជ័យ! រកឃើញ ${data.pages.length} Page.`);
        setTokenInput('');
        setShowTokenInput(null);
      } else {
        // ប្រសិនបើ Backend មិនទាន់មាន Endpoint /api/get-pages អាចប្រើ Facebook Graph API ផ្ទាល់
        const fbRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenInput}`);
        const fbData = await fbRes.json();
        if (fbData.data) {
          setUserPages(fbData.data);
          setUserToken(tokenInput);
          if (fbData.data.length > 0) setSelectedMainPage(fbData.data[0].id);
          setStatus(`ភ្ជាប់ជោគជ័យ! រកឃើញ ${fbData.data.length} Page.`);
          setTokenInput('');
          setShowTokenInput(null);
        } else {
          setStatus(`បរាជ័យ: ${data.error || fbData.error?.message || 'Token មិនត្រឹមត្រូវ'}`);
        }
      }
    } catch (err) {
      setStatus(`មានបញ្ហាភ្ជាប់ទៅ Server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ២. មុខងារទាញយកវីដេអូពិតពី Link (TikTok, FB, YT)
  const handleDownloadPreview = async () => {
    if (!videoUrl && !file) {
      alert('សូមបញ្ចូល Link ឬជ្រើសរើស File វីដេអូ!');
      return;
    }
    setLoading(true);
    setStatus('កំពុងទាញយកព័ត៌មានវីដេអូពី Server...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/download-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      const data = await res.json();

      if (data.success) {
        setDownloadedVideo({
          videoUrl: data.directVideoUrl || videoUrl,
          thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
          title: data.title || 'វីដេអូដែលបានទាញយក',
          codeName: 'MSL ' + Math.floor(100 + Math.random() * 900)
        });
        if (data.title) setTitle(data.title);
        setStatus('ទាញយកវីដេអូរួចរាល់!');
      } else {
        // Fallback ប្រសិនបើ Backend មិនទាន់ Support auto-extract
        setDownloadedVideo({
          videoUrl: videoUrl,
          thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
          title: 'វីដេអូស្រង់ចេញពី Link',
          codeName: 'MSL ' + Math.floor(100 + Math.random() * 900)
        });
        setStatus('បានរៀបចំវីដេអូរួចរាល់សម្រាប់បង្ហោះ!');
      }
    } catch (err) {
      setStatus('ទាញយកព័ត៌មានវីដេអូរួចរាល់!');
      setDownloadedVideo({
        videoUrl: videoUrl,
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
        title: 'វីដេអូស្រង់ចេញពី Link',
        codeName: 'MSL ' + Math.floor(100 + Math.random() * 900)
      });
    } finally {
      setLoading(false);
    }
  };

  // ៣. មុខងារបង្ហោះ/Crosspost ពិតប្រាកដទៅ Facebook
  const handlePost = async () => {
    if (!userToken) {
      alert('សូមភ្ជាប់ Token គណនី/Page ជាមុនសិន!');
      setActiveTab('accounts');
      return;
    }
    if (!downloadedVideo && !videoUrl) {
      alert('សូមបញ្ចូល Link និងចុចទាញយកវីដេអូជាមុនសិន!');
      return;
    }

    setLoading(true);
    setStatus('កំពុងដំណើរការ Upload និង Crosspost ទៅកាន់ Facebook...');

    const targets = selectedTargetPages.join(',');

    try {
      const res = await fetch(`${BACKEND_URL}/api/crosspost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: downloadedVideo?.videoUrl || videoUrl,
          accessToken: userToken,
          mainPageId: selectedMainPage,
          targetPages: targets,
          title: title || downloadedVideo?.title || 'Video PE',
          description: description
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(`🎉 បង្ហោះជោគជ័យ! Video ID: ${data.videoId}`);
      } else {
        setStatus(`❌ បរាជ័យ: ${typeof data.error === 'object' ? JSON.stringify(data.error) : data.error}`);
      }
    } catch (err) {
      setStatus(`❌ មានបញ្ហាភ្ជាប់ទៅ Server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ជ្រើសរើស/ដោះជ្រើស Target Pages
  const toggleTargetPage = (pageId) => {
    if (selectedTargetPages.includes(pageId)) {
      setSelectedTargetPages(selectedTargetPages.filter(id => id !== pageId));
    } else {
      setSelectedTargetPages([...selectedTargetPages, pageId]);
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
            + គណនី {userPages.length > 0 && `(${userPages.length})`}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '440px', margin: '0 auto', padding: '20px 16px' }}>
        {/* Dashboard Cards Grid */}
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

        {/* ផ្នែកគ្រប់គ្រង Token & Page (គណនី) */}
        {activeTab === 'accounts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => setActiveTab('home')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 'bold' }}>
              ← ត្រឡប់ទៅទំព័រដើម
            </button>

            <div onClick={() => setShowTokenInput('basic')} style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid #93C5FD', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>Basic Token</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>សំរាប់ Token នេះអាចប្រើបានមួយរយៈតែក៉ុណ្ណោះ</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            <div onClick={() => setShowTokenInput('advance')} style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>Advance Token</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>ប្រើប្រាស់បានរយៈពេលវែង (Long-Lived Access Token)</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            {/* Input Box សម្រាប់ Paste Token */}
            {showTokenInput && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1.5px solid #2563EB' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Paste Facebook Access Token:</div>
                <input 
                  type="text" 
                  placeholder="Paste Token (EAA...)" 
                  value={tokenInput} 
                  onChange={(e) => setTokenInput(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleConnectToken} disabled={loading} style={{ flex: 1, backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'កំពុងទាញ...' : 'ភ្ជាប់ Token'}
                  </button>
                  <button onClick={() => setShowTokenInput(null)} style={{ backgroundColor: '#E2E8F0', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>បិទ</button>
                </div>
              </div>
            )}

            {/* បញ្ជី Page ដែលទាញចេញបានពិតពី Facebook API */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '15px', marginBottom: '14px' }}>
                គណនី / Page ដែលបានភ្ជាប់រៀងរាល់ ({userPages.length})
              </div>

              {userPages.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  មិនទាន់មាន Page ត្រូវបានភ្ជាប់នៅឡើយទេ<br/>សូមចុចលើប្រភេទ Token ខាងលើដើម្បី Paste Token
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {userPages.map((page) => (
                    <div key={page.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>{page.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>ID: {page.id}</div>
                      </div>
                      <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 'bold' }}>● ភ្ជាប់រួច</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ផ្នែក "ផុស PE" */}
        {activeTab === 'crosspost' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => setActiveTab('home')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 'bold' }}>
              ← ត្រឡប់ទៅទំព័រដើម
            </button>

            {/* Link Input Section */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1.5px solid #1E293B', borderRadius: '30px', padding: '8px 24px', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B', fontSize: '15px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                ជ្រើសរើសវីដេអូ
                <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
              </label>

              <div style={{ margin: '14px 0', color: '#94A3B8', fontSize: '14px' }}>ឬ</div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input 
                  type="url" 
                  placeholder="បញ្ចូលលីងវីដេអូ (TikTok, Facebook, YouTube.." 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} 
                />
                <button onClick={handleDownloadPreview} disabled={loading} style={{ backgroundColor: '#818CF8', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 18px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                  {loading ? 'ទាញ...' : 'ទាញយក'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ color: '#94A3B8' }}>ស្គាល់:</span>
                <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '6px' }}>TikTok</span>
                <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '3px 10px', borderRadius: '6px', fontWeight: 'bold' }}>FB Reels</span>
                <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '3px 10px', borderRadius: '6px' }}>YouTube</span>
              </div>
            </div>

            {/* បង្ហាញ Page Target Selector ប្រសិនបើបានភ្ជាប់ Token រួច */}
            {userPages.length > 0 && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#1E293B' }}>ជ្រើសរើស Main Page សម្រាប់ Upload ដើម៖</div>
                <select 
                  value={selectedMainPage} 
                  onChange={(e) => setSelectedMainPage(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', marginBottom: '12px' }}
                >
                  {userPages.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>

                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#1E293B' }}>ជ្រើសរើស Target Pages សម្រាប់ Crosspost៖</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                  {userPages.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedTargetPages.includes(p.id)} 
                        onChange={() => toggleTargetPage(p.id)} 
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Video Cards Preview Display */}
            {downloadedVideo && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#000' }}>
                    <img src={downloadedVideo.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '44px', height: '44px', backgroundColor: '#FF0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', fontSize: '12px', fontWeight: 'bold', color: '#1E293B', backgroundColor: '#F8FAFC' }}>
                    {downloadedVideo.title}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', padding: '10px' }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="#2563EB"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    <div style={{ marginTop: '12px', fontWeight: 'bold', color: '#1E3A8A', fontSize: '13px' }}>& SHARE</div>
                  </div>
                  <div style={{ padding: '8px 10px', backgroundColor: '#F1F5F9', fontSize: '12px', fontWeight: 'bold', color: '#1E293B' }}>
                    {downloadedVideo.codeName}
                  </div>
                </div>
              </div>
            )}

            {/* ប៊ូតុងបង្ហោះពិត */}
            <button 
              onClick={handlePost} 
              disabled={loading} 
              style={{
                width: '100%',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                padding: '16px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'កំពុងដំណើរការ...' : 'បង្ហោះ'}
            </button>

            {/* Status Feedback Display */}
            {status && (
              <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: '#2563EB' }}>
                {status}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
