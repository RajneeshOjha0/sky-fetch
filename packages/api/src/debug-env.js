const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../../../.env');
console.log('Resolved .env path:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    console.log('File content preview:', fs.readFileSync(envPath, 'utf8').substring(0, 50) + '...');
}

require('dotenv').config({ path: envPath });
console.log('MONGODB env var:', process.env.MONGODB);
