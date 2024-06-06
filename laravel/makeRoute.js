const fs = require('fs');
const path = require('path');

// Get the route name from command line arguments
const routeName = process.argv[2];

// Check if the route name is provided
if (!routeName) {
    console.error('Please provide a route name as an argument.');
    process.exit(1);
}

// format the route name to snake case
const snakeCasedRouteName = routeName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

// Get the route folder path
const routesFolderPath = path.join(__dirname, '/../routes');

// Create the routes folder if it doesn't exist
if (!fs.existsSync(routesFolderPath)) {
    fs.mkdirSync(routesFolderPath);
}

// Create the route file if it doesn't exist
const routeFilePath = path.join(routesFolderPath, `${routeName}.js`);
if (fs.existsSync(routeFilePath)) {
    console.error(`Route file "${routeName}.js" already exists.`);
    process.exit(1);
}

// Write the route template to the file
fs.appendFileSync(routeFilePath, `
const express = require('express');

const route= express.Router();

route.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = route;
`);

// add the route to the index.js file

const appFilePath = path.join(__dirname, '/../index.js');

if (!fs.existsSync(appFilePath)) {
    console.error('index.js file not found.');
    process.exit(1);
}

fs.appendFileSync(appFilePath, `
try{
    const ${routeName} = require('./routes/${routeName}');
    app.use('/${snakeCasedRouteName}', ${routeName});
}catch(e){
    console.log(e.message);
}
`);

console.log(`Route file "${routeName}.js" created successfully.`);