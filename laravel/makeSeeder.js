const fs = require('fs');
const path = require('path');

// Get the seeder name from command line arguments
const seederName = process.argv[2];

// Check if the seeder name is provided
if (!seederName) {
    console.error('Please provide a seeder name as an argument.');
    process.exit(1);
}

// Get the seeder folder path
const seederFolderPath = path.join(__dirname, '/../database/seeders');

// check if app folder exists create it if it doesn't
if (!fs.existsSync(path.join(__dirname, '/../database'))) {
    fs.mkdirSync(path.join(__dirname, '/../database'));
}

// Create the seeders folder if it doesn't exist
if (!fs.existsSync(seederFolderPath)) {
    fs.mkdirSync(seederFolderPath);
}
// Create the seeder file if it doesn't exist
const seederFilePath = path.join(seederFolderPath, `${seederName}.js`);

// Check if the seeder file already exists
if (fs.existsSync(seederFilePath)) {
    console.error(`seeder file "${seederName}.js" already exists.`);
    process.exit(1);
}

// Write the seeder template to the file
fs.appendFileSync(seederFilePath, 
`const Seeder = require('../../laravel/internal/seeder');
class ${seederName} extends Seeder{
    constructor() {
        super();
    }
    async seed() {
        await this.insert('tableName', {
            fields: ['field1', 'field2'], // optional -default order of fields excluding id, created_at, updated_at
            values: [
                ['value1', 'value2'],
                ['value3', 'value4'],
                [this.fake('name'), this.fake('email')],
            ],
            repeat: 10, // optional- default 1
        });
    }
}

module.exports = new ${seederName};`);

console.log(`seeder file "${seederName}.js" created successfully.`);