const db = require("../../app/config/db");
const fs = require('fs');
const path = require('path');
process.loadEnvFile();

async function seed() {

    try{
        // get command line arguments
        const actions = process.argv;

        // Create Seeder Folder if not exists
        if (!fs.existsSync(path.join(__dirname, '/../../database'))){
            fs.mkdirSync(path.join(__dirname, '/../../database'));
        }

        if (!fs.existsSync(path.join(__dirname, '/../../database/seeders'))){
            fs.mkdirSync(path.join(__dirname, '/../../database/seeders'));
        }
        await new Promise(async(resolve, reject) => {

            const seederFiles = await fs.readdirSync(path.join(__dirname, '/../../database/seeders'));

            if (seederFiles.length === 0){
                console.log('Nothing to seed');
                reject();
                return;
            }

            for( const seederFile of seederFiles){
                const seeder = require(path.join(__dirname, `/../../database/seeders/${seederFile}`));

                await new Promise(async(resolve, reject) => {
                    await seeder.seed();
                    resolve();
                    return;
                });
            }

            console.log('Seeding completed successfully.');
            resolve();
            process.exit(0);
        });

        return;
    }catch(err){

        console.error(err);
        return;

    }

}

seed();
