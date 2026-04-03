const axios = require('axios');

const aiPredict = async (req, res) => {
  try {
    const { bp, sugar, heartRate } = req.body;
    
    const aiUrl = process.env.AI_API_URL || 'http://localhost:8000';
    const response = await axios.post(`${aiUrl}/ai-predict`, {
      bp, sugar, heartRate
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Predict Error:', error.message);
    res.status(500).json({ message: 'Error communicating with AI service' });
  }
};

module.exports = { aiPredict };
