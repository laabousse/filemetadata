const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Configure multer for handling file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Basic middleware
app.use(cors());
// Serve static files from public directory
app.use('/public', express.static(__dirname + '/public'));

// Main page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// File upload endpoint
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    // Return file metadata
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large' });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});