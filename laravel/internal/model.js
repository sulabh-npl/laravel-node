const db = require('../../app/config/db');

class Model {

    constructor(tableName, values = {}) {
        this.tableName = tableName;
        this.values = values;
    }

    static create(data) {
        fields = Object.keys(data).join(', ');
        values = Object.values(data).map(value => `'${value}'`).join(', ');

        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${this.tableName} (${fields}) VALUES (${values})`, async(err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(await this.find(results.insertId));
            });
        });
    }

    static update(conditions, data) {

        const where = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ');
        const set = Object.keys(data).map(key => `${key} = '${data[key]}'`).join(', ');

        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${this.tableName} SET ${set} WHERE ${where}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                updatedWhere = {...conditions, ...data};
                return this.findOne(updatedWhere).then(resolve).catch(reject);
            });
        });
    }

    static find(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName} WHERE id = ${id}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve( new Model(this.tableName, results[0]));
            });
        });
    }

    static findOne(conditions) {
        const where = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ');

        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName} WHERE ${where}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                this.values = results;
                resolve( new Model(this.tableName, results[0]));
            });
        });
    }

    static all() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve( new Model(this.tableName, results));
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${this.tableName} WHERE id = ${id}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve( new Model(this.tableName, results));
            });
        });
    }

    static deleteWhere(conditions) {

        const where = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ');

        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${this.tableName} WHERE ${where}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve( new Model(this.tableName, results));
            });
        });
    }

    static search(conditions) {
        const where = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ');

        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName} WHERE ${where}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve( new Model(this.tableName, results));
            });
        });
    }

    static lockForUpdate(conditions) {
        const where = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ');

        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName} WHERE ${where} FOR UPDATE`, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve( new Model(this.tableName, results));
            });
        });
    }

    static findOrCreate(conditions, data) {
        const where = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ');

        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName} WHERE ${where}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length > 0) {
                    resolve( new Model(this.tableName, results[0]));
                } else {
                    this.create(data).then(resolve).catch(reject);
                }
            });
        });
    }

    get() {
        return this.values;
    }

    count() {
        if (Array.isArray(this.values)) {
            return this.values.length;
        }
        if(this.values) {
            return 1;
        }
        return 0;
    }

    create(data) {
        const fields = Object.keys(data.values).join(', ');
        const values = Object.values(data.values).map(value => `'${value}'`).join(', ');

        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${this.tableName} (${fields}) VALUES (${values})`, async(err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(await this.find(results.insertId));
            });
        });
    }

    update(data) {
        const set = Object.keys(data).map(key => `${key} = '${data[key]}'`).join(', ');

        if (Array.isArray(this.values)) {
            // Handle array of rowdatapackets
            const ids = this.values.map(row => row.id).join(', ');
            return new Promise((resolve, reject) => {
                db.query(`UPDATE ${this.tableName} SET ${set} WHERE id IN (${ids})`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    this.values = this.values.map(row => {
                        return {...row, ...data};
                    });
                    resolve(this);
                });
            });
        } else {
            // Handle single rowdatapacket
            return new Promise((resolve, reject) => {
                db.query(`UPDATE ${this.tableName} SET ${set} WHERE id = ${this.values.id}`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    this.values = {...this.values, ...data};
                    resolve(this);
                });
            });
        }
    }

    delete() {

        if (Array.isArray(this.values)) {
            return {
                error: 'Cannot delete multiple rows at once, use deleteAll() instead.'
            };
        } else {
            // Handle single rowdatapacket
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM ${this.tableName} WHERE id = ${this.values.id}`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                });
            });
        }
    }

    deleteAll() {

        if(Array.isArray(this.values)) {
            const ids = this.values.map(row => row.id).join(', ');
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM ${this.tableName} WHERE id IN (${ids})`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM ${this.tableName}`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                });
            });
        }
    }

    search(conditions) {
        if(Array.isArray(this.values)) {
            const values = this.values.filter(row => {
                return Object.keys(conditions).every(key => {
                    return row[key] == conditions[key];
                });
            });
            this.values = values;
        }
        return this;
    }

    find(id) {
        if (Array.isArray(this.values)) {
            return this.values.find(row => row.id == id);
        }
        return this.values;
    }

    findOne(conditions) {
        if (Array.isArray(this.values)) {
            return this.values.find(row => {
                return Object.keys(conditions).every(key => {
                    return row[key] == conditions[key];
                });
            });
        }
        return this.values;
    }

    lockForUpdate() {

        if (Array.isArray(this.values)) {
            const ids = this.values.map(row => row.id).join(', ');
            return new Promise((resolve, reject) => {
                db.query(`SELECT * FROM ${this.tableName} WHERE id IN (${ids}) FOR UPDATE`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve( new Model(this.tableName, results));
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                db.query(`SELECT * FROM ${this.tableName} WHERE id = ${this.values.id} FOR UPDATE`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve( new Model(this.tableName, results));
                });
            });
        }
    }

    refresh() {
        if(Array.isArray(this.values)) {
            const ids = this.values.map(row => row.id).join(', ');
            return new Promise((resolve, reject) => {
                db.query(`SELECT * FROM ${this.tableName} WHERE id IN (${ids})`, (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    this.values = results;
                    resolve( new Model(this.tableName, results));
                });
            });
        }
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this.tableName} WHERE id = ${this.values.id}`, (err, results) => {
                if (err) {
                    reject(err);
                }
                this.values = results[0];
                resolve( new Model(this.tableName, results[0]));
            });
        });
    }

}
module.exports = Model;