const fs = require('fs');
const path = require('path');

// Get the middleware name from command line arguments
const middlewareName = process.argv[2];

// Check if the middleware name is provided
if (!middlewareName) {
    console.error('Please provide a middleware name as an argument.');
    process.exit(1);
}

// Get the middleware folder path
const middlewareFolderPath = path.join(__dirname, '/../app/middlewares');

// check if app folder exists
if (!fs.existsSync(path.join(__dirname, '/../app'))) {
    fs.mkdirSync(path.join(__dirname, '/../app'));
}

// Create the middlewares folder if it doesn't exist
if (!fs.existsSync(middlewareFolderPath)) {
    fs.mkdirSync(middlewareFolderPath);
}

// Create the middleware file if it doesn't exist
const middlewareFilePath = path.join(middlewareFolderPath, `${middlewareName}.js`);

if (fs.existsSync(middlewareFilePath)) {
    console.error(`Middleware file "${middlewareName}.js" already exists.`);
    process.exit(1);
}

// Write the middleware template to the file
fs.appendFileSync(middlewareFilePath, `
function ${middlewareName} {
    // Add your middleware code here
}

module.exports = ${middlewareName};
`);

console.log(`Middleware file "${middlewareName}.js" created successfully.`);