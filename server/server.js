const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 8080;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

app.use(express.json());

app.post('/getCustomToken', async (req, res) => {
  const apiKey = req.body.apiKey;
  
  // Verify the API key (implement your own logic)
  if (apiKey !== 'ba5b11aa64f16d9cc7310d1e046aa1bea44406eedeb660cba0720c24fe39f919') {
    console.log("HEEEEEEEEEEEEEEEEELP");
    return res.status(403).send('Unauthorized');
  }

  try {
    const customToken = await admin.auth().createCustomToken('some-uid');
    res.json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).send('Error creating token');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});