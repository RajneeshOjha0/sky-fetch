const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../../../.env');
const content = `MONGODB=mongodb+srv://rajneeshojha0:Rajneesh23@cluster0.okal0.mongodb.net/skyfetch?appName=Cluster0
PORT=3000
NODE_ENV=development`;

fs.writeFileSync(envPath, content, 'utf8');
console.log('Fixed .env encoding to UTF-8');
