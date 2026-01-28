require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { galleryDB, contactsDB, migrateIfNeeded } = require('./db');

// Migrate data if needed
migrateIfNeeded().catch(err => console.error('Migration error:', err));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/gallery', async (req, res) => {
    try {
        const data = await galleryDB.find({});
        // Convert array of objects back to title-keyed object for frontend compatibility if needed,
        // or just return the array. The existing frontend expects { title: description }.
        const result = {};
        data.forEach(item => {
            result[item.title] = item.description;
        });
        res.json(result);
    } catch (err) {
        console.error('Error fetching gallery data from DB:', err);
        res.status(500).json({ error: 'Failed to read gallery data' });
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await contactsDB.insert({
            name,
            email,
            message,
            timestamp: new Date()
        });
        console.log(`Saved message from ${name} (${email}) to Database.`);
        res.json({ success: true, message: 'Message received and saved!' });
    } catch (err) {
        console.error('Error saving contact message:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Serve frontend fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
