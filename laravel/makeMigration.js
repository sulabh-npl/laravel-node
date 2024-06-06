const { time, timeStamp } = require('console');
const fs = require('fs');
const path = require('path');

// Get the migration name from command line arguments
const migrationFileName = process.argv[2];
let migrationName = migrationFileName;
let tableName = '';
const migrationTypes = ['create', 'alter', 'drop', 'rename', 'truncate'];
let migrationType = null;

// Check if the migration name is provided
if (!migrationName) {
    console.error('Please provide a migration name as an argument.');
    process.exit(1);
}

if(migrationName.includes('create_')){
    migrationName = migrationName.replace('create_', '');
    migrationType = 0;
    if(migrationName.includes('_table')){
        tableName = migrationName.split('_table')[0];
        migrationName = migrationName.replace('_table', '');

    }else{
        console.error('Please provide a valid migration name. create_users_table(You may add anything after this except space to distinguish files) to create a table named users.');
        process.exit(1);
    }
    // create_table
}

if(migrationName.includes('alter_')){
    migrationName = migrationName.replace('alter_', '');
    migrationType = 1;
    if(migrationName.includes('_table')){
        tableName = migrationName.split('_table')[0];
        migrationName = migrationName.replace('_table', '');
    }else{
        console.error('Please provide a valid migration name. alter_users_table(You may add anything after this except space to distinguish files) to alter a table named users.');
        process.exit(1);
    }
}

if(migrationName.includes('drop_')){
    migrationName = migrationName.replace('drop_', '');
    migrationType = 2;
    if(migrationName.includes('_table')){
        tableName = migrationName.split('_table')[0];
        migrationName = migrationName.replace('_table', '');
    }else{
        console.error('Please provide a valid migration name. drop_users_table(You may add anything after this except space to distinguish files) to drop a table named users.');
        process.exit(1);
    }
}

if(migrationName.includes('rename_')){
    migrationName = migrationName.replace('rename_', '');
    migrationType = 3;
    if(migrationName.includes('_table')){
        tableName = migrationName.split('_table')[0];
        migrationName = migrationName.replace('_table', '');
    }else{
        console.error('Please provide a valid migration name. rename_users_table(You may add anything after this except space to distinguish files) to rename a table named users.');
        process.exit(1);
    }
}

if(migrationName.includes('truncate_')){
    migrationName = migrationName.replace('truncate_', '');
    migrationType = 4;
    if(migrationName.includes('_table')){
        tableName = migrationName.split('_table')[0];
        migrationName = migrationName.replace('_table', '');
    }else{
        console.error('Please provide a valid migration name. truncate_users_table(You may add anything after this except space to distinguish files) to truncate a table named users.');
        process.exit(1);
    }
}

// if(tableName == '' || migrationType == null){
//     console.error('Please provide a valid migration name.Example create_users_table(You may add anything after this except space to distinguish files) to create a table named users.');
//     process.exit(1);
// }

// Get the migration folder path
const migrationsFolderPath = path.join(__dirname, '/../database/migrations');

// check if app folder exists
if (!fs.existsSync(path.join(__dirname, '/../app'))) {
    fs.mkdirSync(path.join(__dirname, '/../app'));
}

// Create the migrations folder if it doesn't exist
if (!fs.existsSync(migrationsFolderPath)) {
    fs.mkdirSync(migrationsFolderPath);
}

// Create the migration file 
const date = new Date().toISOString().replace(/[-:.]/g, '-').replace('T', '_');
const migrationFilePath = path.join(migrationsFolderPath, `${date}_${migrationFileName}.js`);
if (fs.existsSync(migrationFilePath)) {
    console.error(`migration file "${migrationFileName}.js" already exists.`);
    process.exit(1);
}

const migrationClassName = migrationFileName.split('_').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}).join('');

// Write the migration template to the file

fs.appendFileSync(migrationFilePath, `
const Migration = require('../../laravel/internal/migration');
class ${migrationClassName} extends Migration{

    // constructor 
    constructor() {
        super('${tableName ? tableName : 'table_name'}');
    }

    up(){
        try {
            ${migrationType == 0 ? `
            this.createTable({
                field1: 'type',
                field2: 'type any more details'
            });` : ''}${migrationType == 1 ? `
            this.addColumn({
                field1: 'type',
                field2: 'type any more details'
            }, after_which_column_this_field_is_optional);

            this.dropColumn('column_name');

            this.modifyColumn({
                field1: 'type',
                field2: 'type any more details'
            });
            this.renameColumn('old_column_name', 'new_column_name');

            this.addIndex('index_name', ['column1', 'column2']);

            this.addForeignKey('foreign_key_name', 'column_name', 'referenced_table', 'referenced_column');

            this.dropIndex('index_name');

            this.dropForeignKey('foreign_key_name');` : ''}${migrationType == 2 ? `
            this.dropTable();` : ''}${migrationType == 3 ? `
            this.renameTable('new_table_name');` : ''}${migrationType == 4 ? `
            this.truncateTable();` : ''}
        }catch(error){
            return false;
        }

    }

    down(){
        try{
            ${migrationType == 0 ? `
            this.dropTable();` : ''}${migrationType == 1 ? `
            this.dropColumn('column_name');

            this.addColumn({
                field1: 'type',
                field2: 'type any more details'
            }, after_which_column_this_field_is_optional);

            this.modifyColumn({
                field1: 'type',
                field2: 'type any more details'
            });

            this.renameColumn('new_column_name', 'old_column_name');

            this.dropIndex('index_name');

            this.dropForeignKey('foreign_key_name');

            this.addIndex('index_name', ['column1', 'column2']);

            this.addForeignKey('foreign_key_name', 'column_name', 'referenced_table', 'referenced_column');` : ''}${migrationType == 2 ? `
            this.createTable({
                field1: 'type',
                field2: 'type any more details'
            });` : ''}${migrationType == 3 ? `
            this.renameTable('old_table_name');` : ''}
            
        }catch(error){
            return false;
        }
    }

}

module.exports = new ${migrationClassName};
`
);

console.log(`Migration file "${migrationFileName}.js" created successfully.`);

