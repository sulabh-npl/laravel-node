const fs = require('fs');
const path = require('path');

// Get the model name from command line arguments
const modelName = process.argv[2];

// Check if the model name is provided
if (!modelName) {
    console.error('Please provide a model name as an argument.');
    process.exit(1);
}

// Create the models folder if it doesn't exist
const modelsFolderPath = path.join(__dirname, '/../database/models');

// check if app folder exists
if (!fs.existsSync(path.join(__dirname, '/../database'))) {
    fs.mkdirSync(path.join(__dirname, '/../database'));
}

if (!fs.existsSync(modelsFolderPath)) {
    fs.mkdirSync(modelsFolderPath);
}

// Create the model file if it doesn't exist
const modelFilePath = path.join(modelsFolderPath, `${modelName}.js`);
if (fs.existsSync(modelFilePath)) {
    console.error(`Model file "${modelName}.js" already exists.`);
    process.exit(1);
}

// Get the table name from command line arguments

var tableName = "";

if (!process.argv[3]) {
    tableName = (modelName.charAt(0).toLowerCase() + modelName.slice(1)).replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()+"s";
} else {
    tableName = process.argv[3];
}

// Write the model template to the file
fs.appendFileSync(modelFilePath, `const db = require('../config/db');
const Model = require('../../laravel/internal/model');

class ${modelName} extends Model {

    static tableName = '${tableName}';

    constructor(values = {}) {
        super(this.tableName, values);
    }

}

module.exports = ${modelName};
`);


console.log(`Model file "${modelName}.js" created successfully.`);