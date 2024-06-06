const db = require("../../app/config/db");
const fs = require('fs');
const path = require('path');
process.loadEnvFile();

async function migrate() {

    try{
        // get command line arguments
        const actions = process.argv;

        await new Promise((resolve, reject) => {
            db.query('CREATE TABLE IF NOT EXISTS migrations (id INT AUTO_INCREMENT PRIMARY KEY, migration VARCHAR(255) NOT NULL, batch INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)', (err, result) => {
                if (err) {
                    console.log('Error creating migrations table');
                    console.error(err);
                    reject();
                }
                if (result) {
                    console.log('Started migration...');
                    resolve();
                }
            });
        });

        // db.beginTransaction(async()=>{

        const batch = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM migrations ORDER BY batch DESC LIMIT 1', (err, result) => {
                if (err) {
                    console.log('Error getting last batch number');
                    console.error(err);
                    reject();
                }
                if (result.length > 0) {
                    resolve(result[0].batch + 1);
                } else {
                    resolve(1);
                }
            });
        });

        // Create Migration Folder if not exists
        if (!fs.existsSync(path.join(__dirname, '/../../database'))){
            fs.mkdirSync(path.join(__dirname, '/../../database'));
        }

        if (!fs.existsSync(path.join(__dirname, '/../../database/migrations'))){
            fs.mkdirSync(path.join(__dirname, '/../../database/migrations'));
        }


        if (actions[2] =='fresh'){
            await new Promise((resolve, reject) => {
                db.query('DROP DATABASE IF EXISTS '+process.env.DB_DATABASE, (err, result) => {
                    if (err) {
                        console.log('Error dropping database');
                        console.error(err);
                        reject();
                        return;
                    }
                    if (result) {
                        db.query('CREATE DATABASE '+process.env.DB_DATABASE);
                        db.query('USE '+process.env.DB_DATABASE);
                        resolve();
                        console.log('Database cleared successfully');
                    }
                });
            });

            const allMigrationFiles = fs.readdirSync(path.join(__dirname, '/../../database/migrations'));
            if(allMigrationFiles.length === 0){
                console.log('Nothing to migrate');
            }

            delete process.argv.splice(process.argv.indexOf('fresh'), 1);

            await migrate();

            return;

        }else if (actions[2] =='migration'){
            const migrationName = actions[actions.indexOf('migration') + 1];
            const migration = require(path.join(__dirname, `/../../database/migrations/${migrationName}`));
            if(!migration){
                console.log('Migration not found');
                return;
            }
            await migration.up();
            await new Promise((resolve, reject) => {
                db.query('INSERT INTO migrations (migration, batch) VALUES (?, ?)', [migrationName, batch], (err, result) => {
                    if (err) {
                        console.log('Error inserting migration record');
                        console.error(err);
                        reject(err);
                    }
                    if (result) {
                        resolve();
                    }
                });
            });
            console.log('Migration executed successfully.');
        }else if (actions[2] =='rollback'){
            const migrationName = actions[actions.indexOf('rollback') + 1];
            if(!migrationName){
                console.log('Please provide migration name to rollback');
                await new Promise((resolve, reject) => {
                    db.query('SELECT * FROM migrations where batch="?"', [batch-1], async(err, result) => {
                        if (err) {
                            console.log('Error getting last migration');
                            console.error(err);
                            reject();
                        }
                        if (result.length > 0) {
                            for(const migration of result){
                                const migrationClass = require(path.join(__dirname, `/../../database/migrations/${migration.migration}`));
                                if(!migrationClass){
                                    console.log('Migration('+migration.migration+') not found');
                                    return;
                                }else{
                                    console.log('Rolling back migration: '+migration.migration);
                                }
                                await migrationClass.down();
                                console.log('Migration('+migration.migration+') rolled back successfully');
                                await new Promise((resolve, reject) => {
                                    db.query('DELETE FROM migrations WHERE migration = ?', [migration.migration], (err, result) => {
                                        if (err) {
                                            console.log('Error deleting migration record');
                                            console.error(err);
                                            reject(err);
                                            return;
                                        }
                                        if (result) {
                                            resolve();
                                            return;
                                        }
                                    });
                                });
                            }
                            console.log('Rollback executed successfully.');
                        }else{
                            console.log('Nothing to rollback');
                        }
                    });
                });
                return;
            }else{
                const migration = require(path.join(__dirname, `/../../database/migrations/${migrationName}`));
                if(!migration){
                    console.log('Migration not found');
                    return;
                }
                await migration.down();
                await new Promise((resolve, reject) => {
                    db.query('DELETE FROM migrations WHERE migration = ?', [migrationName], (err, result) => {
                        if (err) {
                            console.log('Error deleting migration record');
                            console.error(err);
                            reject(err);
                        }
                        if (result) {
                            resolve();
                        }
                    });
                });
            }
            console.log('Rollback executed successfully.');
        }else if (actions[2] =='refresh'){
            const migrationName = actions[actions.indexOf('refresh') + 1];
            const migration = require(path.join(__dirname, `/../../database/migrations/${migrationName}`));
            if(!migration){
                console.log('Migration not found');
                return;
            }
            await migration.down();
            await migration.up();
            await new Promise((resolve, reject) => {
                db.query('UPDATE migrations SET batch = ? WHERE migration = ?', [batch, migrationName], (err, result) => {
                    if (err) {
                        console.log('Error deleting migration record');
                        console.error(err);
                        reject(err);
                    }
                    if (result) {
                        resolve();
                    }
                });
            });
            console.log('Refresh executed successfully.');
        }else{
            await new Promise(async(resolve, reject) => {
                db.query(`SELECT * FROM migrations Where batch < '${batch}'`, async (err, result) => {
                    if (err) {
                        console.log('Error getting migrations');
                        console.error(err);
                        reject();
                    }
                    if (result.length > 0) {
                        const migrationFiles = await fs.readdirSync(path.join(__dirname, '/../../database/migrations'));
                        const migratedMigrations = result.map(migration => migration.migration);
                        const migrations = migrationFiles.filter(file => !migratedMigrations.includes(file));
                        if (migrations.length === 0){
                            console.log('Nothing to migrate');
                            resolve();
                            return;
                        }
                        for( const migrationFile of migrations){
                            const migration = require(path.join(__dirname, `/../../database/migrations/${migrationFile}`));
                            await migration.up();
                            await new Promise((resolve, reject) => {
                                db.query('INSERT INTO migrations (migration, batch) VALUES (?, ?)', [migrationFile, batch], (err, result) => {
                                    if (err) {
                                        console.log('Error inserting migration record');
                                        console.error(err);
                                        reject();
                                    }
                                    if (result) {
                                        resolve();
                                    }
                                });
                            });
                        }
                    }else{
                        const migrationFiles = await fs.readdirSync(path.join(__dirname, '/../../database/migrations'));
                        if(migrationFiles.length === 0){
                            console.log('Nothing to migrate');
                            resolve();
                            return;
                        }
                        for( const migrationFile of migrationFiles){
                            const migration = require(path.join(__dirname, `/../../database/migrations/${migrationFile}`));
                            await migration.up();
                            await new Promise((resolve, reject) => {
                                db.query('INSERT INTO migrations (migration, batch) VALUES (?, ?)', [migrationFile, batch], (err, result) => {
                                    if (err) {
                                        console.log('Error inserting migration record');
                                        console.error(err);
                                        reject();
                                    }
                                    if (result) {
                                        resolve();
                                    }
                                });
                            });
                        }
                    }

                    resolve();
                });
            });
        }

        console.log('Migration completed successfully.');
    // });

        // db.commit();

        db.end();

        return;

    }catch(err){
        console.error(err);
        db.end();

        return;
    }

}

migrate();
