// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// In server.js
const corsOptions = {
  origin: 'https://baserow.io',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID;
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
const HISTORY_TABLE_ID = process.env.HISTORY_TABLE_ID;

// Proxy endpoint for Baserow API
app.get('/api/matters', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.baserow.io/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`,
            {
                headers: {
                    'Authorization': `Token ${BASEROW_TOKEN}`
                }
            }
        );
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching from Baserow:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Add this to your existing server.js
app.get('/api/matters-overview', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.baserow.io/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`,
            {
                headers: {
                    'Authorization': `Token ${BASEROW_TOKEN}`
                }
            }
        );
        
        // Filter only "In Progress" matters for the overview page
        const inProgressMatters = response.data.results.filter(matter => {
            const status = matter.Status && (matter.Status.value || matter.Status);
            return status === 'In Progress';
        });
        
        res.json(inProgressMatters);
    } catch (error) {
        console.error('Error fetching matters overview:', error);
        res.status(500).json({ error: 'Failed to fetch matters overview' });
    }
});

// Add these endpoints to your existing server.js

// Get specific matter details
app.get('/api/matter/:id', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.baserow.io/api/database/rows/table/${BASEROW_TABLE_ID}/${req.params.id}/?user_field_names=true`,
            {
                headers: {
                    'Authorization': `Token ${BASEROW_TOKEN}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching matter details:', error);
        res.status(500).json({ error: 'Failed to fetch matter details' });
    }
});

// Get history logs for a matter
app.get('/api/matter/:id/history', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.baserow.io/api/database/rows/table/${HISTORY_TABLE_ID}/?user_field_names=true&filter__Matter__link_row_contains=${req.params.id}`,
            {
                headers: {
                    'Authorization': `Token ${BASEROW_TOKEN}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching matter history:', error);
        res.status(500).json({ error: 'Failed to fetch matter history' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
