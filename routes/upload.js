import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const result = await uploadFile(req.file.buffer);
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;