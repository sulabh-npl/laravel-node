const db = require('../../app/config/db');
const faker =  require('@faker-js/faker');
const { all } = require('./model');

class Seeder {

    constructor() {
        this.db = db;
    }

    async insert(tableName, data) {
        let fields = data.fields;
        let values = data.values;
        let query = '';
        let repeat = data.repeat || 1;
        let all_values = [];
        for (let h = 0; h<repeat; h++){
            all_values[h] = [];
            for (let i = 0; i < values.length; i++) {
                all_values[h][i] = [];
                for (let j = 0; j < values[i].length; j++) {
                    if (values[i][j].includes('___')) {
                        all_values[h][i][j] = this.fake(values[i][j]);
                    }else {
                        all_values[h][i][j] = values[i][j];
                    }
                }
            }   
        }
        for(let i = 0; i<repeat; i++){
            let values = all_values[i];
            if (fields) {
                query = `INSERT INTO ${tableName} (${fields.join(',')}) VALUES `;
                values = values.map(value => {
                    let temp_values = value.map((val, index) => {
                        if (typeof val == 'string' && val != 'NOW()') {
                            return `"${val}"`;
                        }
                        return val;
                    });

                    return temp_values.join(',');
                });
            }else {
                query = `INSERT INTO ${tableName} VALUES `;
                values = values.map(value => {
                    let temp_values = value.map(val => {
                        if (typeof val == 'string') {
                            return `'${val}'`;
                        }
                        return val;
                    });
                    temp_values.push('NOW()');
                    temp_values.push('NOW()');
                    temp_values = ['NULL', ...temp_values];

                    return temp_values.join(',');
                });
            }
            let queryValues = values.map(value => `(${value})`);
            query += queryValues.join(',');
            query += ';';
            await new Promise((resolve, reject) => {    
                this.db.query(query, (err, result) => {
                    if (err) {
                        console.log(`Error inserting data into ${tableName}, query: ${query}`);
                        console.error(err);
                        reject();
                        return;
                    }
                    if (result) {
                        resolve();
                        return;
                    }
                });
            });
        }
        console.log(`Data inserted into ${tableName} successfully`);

        return;
    }

    fake(type = 'default') {
        if(!type.includes('___')) {
            return '___' + type;
        }
        type = type.toLowerCase();
        type = type.replace('___', '');
        switch (type) {
            case 'name':
                return faker.name.findName();
            case 'email':
                return faker.internet.email();
            case 'password':
                return faker.internet.password();
            case 'text':
                return faker.lorem.text();
            case 'number':
                return faker.random.number();
            case 'float':
                return faker.random.float();
            case 'integer':
                return faker.random.integer();
            case 'phone':
                return faker.phone.phoneNumber();
            case 'address':
                return faker.address.streetAddress();
            case 'city':
                return faker.address.city();
            case 'country':
                return faker.address.country();
            case 'state':
                return faker.address.state();
            case 'zip':
                return faker.address.zipCode();
            case 'latitude':
                return faker.address.latitude();
            case 'longitude':
                return faker.address.longitude();
            case 'url':
                return faker.internet.url();
            case 'unique_id':
                return faker.random.uuid();
            case 'boolean':
                return faker.random.boolean();
            case 'date':
                return faker.date.recent();
            case 'time':
                return faker.time.recent();
            case 'datetime':
                return this.fake('___date') + ' ' + this.fake('___time');
            default:
                return faker.random.word();
        }
    }

}
module.exports = Seeder;