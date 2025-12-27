const app = require('./app');

const port = process.env.PORT || 3000;

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
