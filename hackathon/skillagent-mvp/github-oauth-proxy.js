const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/github-oauth', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const params = {
      client_id: process.env.GITHUB_CLIENT_ID || 'Ov23liT9ntlaQmsYib4J',
      client_secret: process.env.GITHUB_CLIENT_SECRET || '6472d47c05d93af07d196f2cfcf277bb8e090a56',
      code,
    };
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      params,
      { headers: { Accept: 'application/json' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`GitHub OAuth proxy running on http://localhost:${PORT}`);
}); 