import React, { useState } from 'react';

// URL Backend របស់ Render
const RENDER_BACKEND_URL = "https://crosspost-backend-pjjy.onrender.com";

export default function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userPages, setUserPages] = useState([]);
  const [selectedMainPage, setSelectedMainPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // មុខងារជ្រើសរើស File MP4 Direct
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVideoUrl(''); // លុប Link វិញប្រសិនបើជ្រើសរើស File
    }
  };

  // មុខងារ Post វីដេអូទៅ Facebook (គាំទ្រទាំង File និង Link)
  const handlePost = async () => {
    if (!userToken) {
      alert('សូមបញ្ចូល Facebook Access Token ជាមុនសិន!');
      return;
    }
    if (!videoUrl && !file) {
      alert('សូមបញ្ចូល Link ឬជ្រើសរើស File វីដេអូជាមុនសិន!');
      return;
    }

    setLoading(true);
    setStatus('កំពុងដំណើរការបញ្ជូនទិន្នន័យ...');

    try {
      const targetMainPage = selectedMainPage || (userPages.length > 0 ? userPages[0].id : null);
      const targetPageObj = userPages.find(p => p.id === targetMainPage);
      const activeAccessToken = targetPageObj?.access_token || userToken;

      // ១. ករណី Upload File ផ្ទាល់ពីកុំព្យូទ័រ/ទូរស័ព្ទ
      if (file) {
        setStatus('កំពុង Upload File ទៅកាន់ Facebook...');
        const formData = new FormData();
        formData.append('source', file);
        formData.append('title', title || 'Video Post');
        formData.append('description', description || '');
        formData.append('access_token', activeAccessToken);

        const res = await fetch(`https://graph.facebook.com/v19.0/${targetMainPage}/videos`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.id) {
          setStatus(`🎉 បង្ហោះជោគជ័យ! Video ID: ${data.id}`);
        } else {
          setStatus(`❌ បរាជ័យ: ${data.error?.message}`);
        }
      } 
      // ២. ករណី បិទភ្ជាប់ Link (YouTube/TikTok/FB) -> ផ្ញើទៅ Render Backend
      else if (videoUrl) {
        setStatus('កំពុងផ្ញើ Link ទៅកាន់ Render Backend ដើម្បីទាញយក Stream...');
        const res = await fetch(`${RENDER_BACKEND_URL}/api/post-to-facebook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoUrl: videoUrl,
            pageId: targetMainPage,
            accessToken: activeAccessToken,
            title: title || 'Video Post',
            description: description || ''
          })
        });

        const data = await res.json();
        if (data.success) {
          setStatus(`🎉 បង្ហោះជោគជ័យ! Video ID: ${data.data.id}`);
        } else {
          setStatus(`❌ បរាជ័យ: ${data.error}`);
        }
      }
    } catch (err) {
      setStatus(`❌ មានបញ្ហា៖ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>MasterPost Pro - Video Publisher</h2>

        {/* ផ្នែកបញ្ចូល Facebook Token */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Facebook User / Page Access Token:</label>
          <input
            type="text"
            placeholder="EAA..."
            value={userToken}
            onChange={(e) => setUserToken(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* ផ្នែកបញ្ចូល Target Page ID */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Target Page ID:</label>
          <input
            type="text"
            placeholder="ឧទាហរណ៍៖ 1219052137967555"
            value={selectedMainPage}
            onChange={(e) => setSelectedMainPage(e.target.value)}
            style={styles.input}
          />
        </div>

        <hr style={styles.divider} />

        {/* ផ្នែកជ្រើសរើស File វីដេអូ */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>ជម្រើសទី ១៖ ជ្រើសរើស File វីដេអូ (MP4)</label>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            style={styles.fileInput} 
          />
        </div>

        <div style={{ textAlign: 'center', margin: '10px 0', color: '#888', fontWeight: 'bold' }}>ឬ</div>

        {/* ផ្នែកបញ្ចូល Link វីដេអូ */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>ជម្រើសទី ២៖ បិទភ្ជាប់ Link (YouTube / TikTok / FB)</label>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setFile(null); // លុប File វិញប្រសិនបើបញ្ចូល Link
            }}
            style={styles.input}
          />
        </div>

        {/* ផ្នែក Title & Description */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>ចំណងជើង (Title):</label>
          <input
            type="text"
            placeholder="ចំណងជើងវីដេអូ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>ការបរិយាយ (Description):</label>
          <textarea
            placeholder="រៀបរាប់ពីវីដេអូ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, height: '80px', resize: 'vertical' }}
          />
        </div>

        {/* ប៊ូតុង បង្ហោះ */}
        <button
          onClick={handlePost}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#6c757d' : '#1877f2',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'កំពុងដំណើរការ...' : 'បង្ហោះវីដេអូ (Post Video)'}
        </button>

        {/* ផ្ទាំងបង្ហាញ Status */}
        {status && (
          <div style={{
            ...styles.statusBox,
            backgroundColor: status.includes('🎉') ? '#e6f4ea' : '#fce8e6',
            color: status.includes('🎉') ? '#137333' : '#c5221f'
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '550px'
  },
  header: {
    marginTop: 0,
    marginBottom: '20px',
    textAlign: 'center',
    color: '#1c1e21'
  },
  fieldGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#4b4f56'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccd0d5',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    fontSize: '14px'
  },
  divider: {
    margin: '20px 0',
    border: 'none',
    borderTop: '1px solid #e4e6eb'
  },
  button: {
    width: '100%',
    padding: '12px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.2s'
  },
  statusBox: {
    marginTop: '20px',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    fontWeight: '500',
    wordBreak: 'break-word'
  }
};
