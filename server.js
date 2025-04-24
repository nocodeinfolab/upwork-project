// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID;
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
