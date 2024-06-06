const fs = require('fs');
const path = require('path');

// Get the request name from command line arguments
const requestName = process.argv[2];

// Check if the request name is provided
if (!requestName) {
    console.error('Please provide a request name as an argument.');
    process.exit(1);
}

// Get the request folder path
const requestFolderPath = path.join(__dirname, '/../app/requests');

// check if app folder exists create it if it doesn't
if (!fs.existsSync(path.join(__dirname, '/../app'))) {
    fs.mkdirSync(path.join(__dirname, '/../app'));
}

// Create the requests folder if it doesn't exist
if (!fs.existsSync(requestFolderPath)) {
    fs.mkdirSync(requestFolderPath);
}
// Create the request file if it doesn't exist
const requestFilePath = path.join(requestFolderPath, `${requestName}.js`);

// Check if the request file already exists
if (fs.existsSync(requestFilePath)) {
    console.error(`request file "${requestName}.js" already exists.`);
    process.exit(1);
}

// Write the request template to the file
fs.appendFileSync(requestFilePath, 
`
const {validateRequest} = require('check_requests');
class ${requestName} {
    rules= {
        // name: ['required', 'string', 'min:3', 'max:255'],
    }

    // messages = {
    //     name: {
    //         required: 'Name is required',
    //         string: 'Name must be a string',
    //         min: 'Name must be at least 3 characters',
    //         max: 'Name must not be greater than 255 characters'
    //     }
    // }

    validate(req, res) {
        let [isValid, errors, successes] = validateRequest(req, this.rules, this.messages || []);
        if (!isValid) {
            return res.status(400).json({errors, successes});
        }else{
            return true;
        }
    }
}

module.exports = new ${requestName};`);

console.log(`request file "${requestName}.js" created successfully.`);