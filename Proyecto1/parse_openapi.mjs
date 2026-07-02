import fs from 'fs';
const data = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));
const paths = Object.keys(data.paths);
console.log('--- ALL ENDPOINTS ---');
paths.forEach(p => {
    const methods = Object.keys(data.paths[p]).join(', ').toUpperCase();
    console.log(`[${methods}] ${p}`);
});
