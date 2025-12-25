const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Verification of shared package linking
// In JS we don't import types, but we can verify the module loads
try {
    require('@skyfetch/shared');
    console.log('Shared package loaded successfully');
} catch (err) {
    console.error('Failed to load shared package:', err);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});