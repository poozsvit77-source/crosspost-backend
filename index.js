const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const YTDLPWrapper = require('yt-dlp-wrap').default;

const app = express();
app.use(cors());
app.use(express.json());

const ytDlp = new YTDLPWrapper();

app.get('/', (req, res) => {
    res.send('Server កំពុងដំណើការយ៉ាងរលូន!');
});

app.post('/api/crosspost', async (req, res) => {
    const { videoUrl, accessToken, mainPageId, targetPages, title, description } = req.body;

    if (!videoUrl || !accessToken || !mainPageId) {
        return res.status(400).json({ error: 'សូមបំពេញ Link វីដេអូ, Access Token និង Page ID' });
    }

    const tempFilePath = path.join(__dirname, `temp_${Date.now()}.mp4`);

    try {
        console.log("កំពុងទាញយកវីដេអូពី Link:", videoUrl);

        await ytDlp.execPromise([
            videoUrl,
            '-o', tempFilePath,
            '-f', 'mp4/best'
        ]);

        const formData = new FormData();
        formData.append('title', title || 'Video Crosspost');
        formData.append('description', description || '');
        formData.append('access_token', accessToken);
        formData.append('crossposting_eligibility', 'ALLOW');
        
        const pagesArray = targetPages ? targetPages.split(',').map(id => id.trim()) : [];
        formData.append('crosspost_shared_pages', JSON.stringify(pagesArray));
        
        formData.append('source', fs.createReadStream(tempFilePath));

        const response = await axios.post(
            `https://graph-video.facebook.com/v19.0/${mainPageId}/videos`,
            formData,
            { headers: formData.getHeaders() }
        );

        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        res.json({ success: true, videoId: response.data.id });

    } catch (error) {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        const errorMsg = error.response ? error.response.data : error.message;
        res.status(500).json({ success: false, error: errorMsg });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));