const fs = require('fs');
const path = require('path');

// Get the Controller name from command line arguments
const controllerName = process.argv[2];

// Check if the Controller name is provided
if (!controllerName) {
    console.error('Please provide a Controller name as an argument.');
    process.exit(1);
}

// Get the Controller folder path
const controllersFolderPath = path.join(__dirname, '/../app/controllers');

// check if app folder exists
if (!fs.existsSync(path.join(__dirname, '/../app'))) {
    fs.mkdirSync(path.join(__dirname, '/../app'));
}

// Create the controllers folder if it doesn't exist
if (!fs.existsSync(controllersFolderPath)) {
    fs.mkdirSync(controllersFolderPath);
}

// Create the Controller file if it doesn't exist
const controllerFilePath = path.join(controllersFolderPath, `${controllerName}.js`);
if (fs.existsSync(controllerFilePath)) {
    console.error(`Controller file "${controllerName}.js" already exists.`);
    process.exit(1);
}

// Write the Controller template to the file

fs.appendFileSync(controllerFilePath, `
class ${controllerName} {

    // constructor 
    constructor() {
        // Add your constructor code here
    }

    // Add your controller methods here

}

module.exports = new ${controllerName};
`
);

console.log(`Controller file "${controllerName}.js" created successfully.`);

