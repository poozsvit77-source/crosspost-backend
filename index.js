import express from 'express';
import cors from 'cors';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YTDLPWrapper from 'yt-dlp-wrap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const ytDlp = new YTDLPWrapper.default();

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

        console.log("ទាញយកវីដេអូរួចរាល់! កំពុង Upload ទៅ Facebook Graph API...");

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
        console.error("Error:", errorMsg);
        res.status(500).json({ success: false, error: errorMsg });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
