const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Endpoint សម្រាប់ Download Preview Info (Bypassing yt-dlp)
app.post('/api/download-info', (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ success: false, error: 'សូមបញ្ចូល videoUrl' });
  }

  // ឆ្លើយតប Direct URL ទៅ Frontend វិញភ្លាមៗ ដោយមិនបាច់ Scraping
  return res.json({
    success: true,
    title: 'Video Content Stream',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60',
    directVideoUrl: videoUrl
  });
});

// 2. Endpoint សម្រាប់ Upload និង Crossposting ទៅ Facebook Graph API
app.post('/api/crosspost', async (req, res) => {
  const { videoUrl, accessToken, mainPageId, targetPages, title, description } = req.body;

  if (!videoUrl || !accessToken || !mainPageId) {
    return res.status(400).json({ 
      success: false, 
      error: 'ទិន្នន័យមិនគ្រប់គ្រាន់៖ ខ្វះ videoUrl, accessToken ឬ mainPageId' 
    });
  }

  try {
    const postUrl = `https://graph.facebook.com/v18.0/${mainPageId}/videos`;
    
    // រៀបចំ Payload សម្រាប់ Facebook Video API
    const postData = {
      file_url: videoUrl,
      title: title || 'New Video Post',
      description: description || '',
      access_token: accessToken,
    };

    // ប្រសិនបើមាន Target Pages សម្រាប់ Crosspost
    if (targetPages && targetPages.length > 0) {
      postData.crosspost_target_page_ids = Array.isArray(targetPages) 
        ? JSON.stringify(targetPages) 
        : JSON.stringify(targetPages.split(',').filter(Boolean));
    }

    const fbResponse = await axios.post(postUrl, postData);

    return res.json({
      success: true,
      videoId: fbResponse.data.id,
      message: 'បង្ហោះ និង Crosspost ជោគជ័យ!'
    });

  } catch (err) {
    console.error('FB API Error Detail:', err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message;
    return res.status(500).json({
      success: false,
      error: `Facebook API Error: ${errorMessage}`
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
