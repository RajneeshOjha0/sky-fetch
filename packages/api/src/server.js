const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }); // Resolve from src/ to root
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Verification of shared package linking
try {
    require('@skyfetch/shared');
    console.log('Shared package loaded successfully');
} catch (err) {
    console.error('Failed to load shared package:', err);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
