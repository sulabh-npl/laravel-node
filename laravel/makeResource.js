const fs = require('fs');
const path = require('path');

// Get the resource name from command line arguments
const resourceName = process.argv[2];

// Check if the resource name is provided
if (!resourceName) {
    console.error('Please provide a resource name as an argument.');
    process.exit(1);
}

// Get the resource folder path
const resourceFolderPath = path.join(__dirname, '/../app/resources');

// check if app folder exists create it if it doesn't
if (!fs.existsSync(path.join(__dirname, '/../app'))) {
    fs.mkdirSync(path.join(__dirname, '/../app'));
}

// Create the resources folder if it doesn't exist
if (!fs.existsSync(resourceFolderPath)) {
    fs.mkdirSync(resourceFolderPath);
}
// Create the resource file if it doesn't exist
const resourceFilePath = path.join(resourceFolderPath, `${resourceName}.js`);

// Check if the resource file already exists
if (fs.existsSync(resourceFilePath)) {
    console.error(`Resource file "${resourceName}.js" already exists.`);
    process.exit(1);
}

// Write the resource template to the file
fs.appendFileSync(resourceFilePath, 
`class ${resourceName} {
    static make(data) {

        return data;

        // return {
        //     key: data.field_name,
        // }
    }

    static collection(datas) {
        return datas.map(data => this.make(data));
    }
}

module.exports = ${resourceName};`);

console.log(`Resource file "${resourceName}.js" created successfully.`);