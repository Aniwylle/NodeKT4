const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

const db = new sqlite3.Database('./url_shortener.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_url TEXT NOT NULL,
            short_url TEXT NOT NULL UNIQUE
        )`);
    }
});

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener! Use /create?url=your_url to shorten a URL.');
});

// генерация короткого URL
function generateShortUrl(originalUrl) {
    return crypto.createHash('md5').update(originalUrl).digest('hex').substring(0, 6);
}

// создание сокращённого URL
app.get('/create', (req, res) => {
    const originalUrl = req.query.url;
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }
    const shortUrl = generateShortUrl(originalUrl);
    db.get('SELECT short_url FROM urls WHERE original_url = ?', [originalUrl], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(200).json({ short_url: `http://localhost:${PORT}/${row.short_url}` });
        }
        db.run('INSERT INTO urls (original_url, short_url) VALUES (?, ?)', [originalUrl, shortUrl], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ short_url: `http://localhost:${PORT}/${shortUrl}` });
        });
    });
});

app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    db.get('SELECT original_url FROM urls WHERE short_url = ?', [shortUrl], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'URL not found' });
        }
        res.redirect(row.original_url);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
