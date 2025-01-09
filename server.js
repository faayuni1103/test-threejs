import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();

// Enable CORS for all routes
app.use(cors());

// API endpoint to fetch data from Google Sheets
app.get('/get-data', async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './client_secret.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

        const spreadsheetId = '1xM5YA5lwo10NSp9SfxQEWaROSj2PPPVFb2n5yjELDtc';
        const range = 'Sheet1!A2:Z';
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

        res.json({ data: response.data.values || [] });
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start Vite dev server alongside Express
async function startServer() {
    const vite = await createViteServer({
        server: { middlewareMode: true }, // Use middleware mode for integrating with express
    });

    // Use Vite's middleware to serve the frontend
    app.use(vite.middlewares);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();
