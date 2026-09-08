import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// API រកមើល Stream Link និង Post ទៅ FB
app.post('/api/post-to-facebook', async (req, res) => {
  const { videoUrl, pageId, accessToken, title, description } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'សូមបញ្ចូល Video URL' });
  }

  // ប្រើ yt-dlp ទាញយក Direct Stream MP4 Link
  const command = `npx yt-dlp -g -f "best[ext=mp4]/best" "${videoUrl}"`;

  exec(command, async (error, stdout) => {
    if (error || !stdout) {
      return res.status(500).json({ error: 'មិនអាចទាញយក Direct Stream ពី Link នេះបានទេ!' });
    }

    const directStreamUrl = stdout.trim().split('\n')[0];

    try {
      const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/videos`;
      const fbResponse = await axios.post(fbUrl, {
        file_url: directStreamUrl,
        title: title || 'Auto Video Post',
        description: description || '',
        access_token: accessToken
      });

      return res.json({ success: true, data: fbResponse.data });
    } catch (err) {
      return res.status(500).json({ 
        error: err.response?.data?.error?.message || 'មានបញ្ហាក្នុងការ Post ទៅ Facebook' 
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
