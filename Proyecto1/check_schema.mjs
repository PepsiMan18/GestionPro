import fs from 'fs';
const data = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));
const schemas = Object.keys(data.components.schemas);
console.log("All schemas:", schemas.join(', '));
