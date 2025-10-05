const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Set proper MIME types for GLB files
app.use((req, res, next) => {
  if (req.url.endsWith('.glb')) {
    res.type('model/gltf-binary');
  }
  next();
});

// Route for main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Open your browser and navigate to the URL above to view the GLB model');
});