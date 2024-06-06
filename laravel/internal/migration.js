const db = require('../../app/config/db');

class Migration {
    constructor(tableName) {
        this.db = db;
        this.tableName = tableName;
    }

    async createTable(columnData) {
        
        let columns = '';
        columns += 'id INT AUTO_INCREMENT PRIMARY KEY, ';
        for (let column in columnData) {
            if(column == 'id' || column == 'created_at' || column == 'updated_at') {
                console.log('Cannot create column with name id, created_at or updated_at they are reserved field names and will be created automatically.');
                continue;
            }
            columnData[column] = columnData[column].replace('string', 'VARCHAR(255)');            
            
            columns += `${column} ${columnData[column]}, `;
        }
        columns+= 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
        this.db.query(`CREATE TABLE ${this.tableName} (${columns})`, (err, result) => {
            if(err) {
                console.log(`Error creating table ${this.tableName}`);
                console.error(err);
            }
            if(result) {
                console.log(`Table ${this.tableName} created successfully`);
            }
        });
    }

    dropTable() {
        this.db.query(`DROP TABLE ${this.tableName}`, (err, result) => {
            if(err) {
                console.log(`Error dropping table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Table ${this.tableName} dropped successfully`);
                return;
            }
        });
    }

    renameTable(newTableName) {
        this.db.query(`RENAME TABLE ${this.tableName} TO ${newTableName}`, (err, result) => {
            if(err) {
                console.log(`Error renaming table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Table ${this.tableName} renamed to ${newTableName} successfully`);
                return;
            }
        });
    }

    addColumn(columnData, afterColumn = null) {
        for (let column in columnData) {
            columnData[column] = columnData[column].replace('string', 'VARCHAR(255)');            

            columnData[column] = columnData[column].replace('string', 'VARCHAR(255)');
            
            this.db.query(`ALTER TABLE ${this.tableName} ADD ${column} ${columnData[column]} ${afterColumn ? 'AFTER ' + afterColumn : ''}`, (err, result) => {
                if(err) {
                    console.log(`Error adding column ${column} to table ${this.tableName}`);
                    console.error(err);
                    return;
                }
                if(result) {
                    console.log(`Column ${column} added to table ${this.tableName} successfully`);
                    return;
                }
            });
        }
    }

    dropColumn(columnName) {
        if(Array.isArray(columnName)) {
            for (let column in columnName) {
                if(columnName[column] === 'id' || columnName[column] === 'created_at' || columnName[column] === 'updated_at') {
                    console.log(`Cannot drop ${columnName[column]} column`);
                    continue;
                }
                this.db.query(`ALTER TABLE ${this.tableName} DROP COLUMN ${columnName[column]}`, (err, result) => {
                    if(err) {
                        console.log(`Error dropping column ${columnName[column]} from table ${this.tableName}`);
                        console.error(err);
                        return;
                    }
                    if(result) {
                        console.log(`Column ${columnName[column]} dropped from table ${this.tableName} successfully`);
                        return;
                    }
                });
            }
            return;
        }
        if(columnName === 'id' || columnName === 'created_at' || columnName === 'updated_at') {
            console.log(`Cannot drop ${columnName} column`);
            return;
        }
        this.db.query(`ALTER TABLE ${this.tableName} DROP COLUMN ${columnName}`, (err, result) => {
            if(err) {
                console.log(`Error dropping column ${columnName} from table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Column ${columnName} dropped from table ${this.tableName} successfully`);
                return;
            }
        });

    }

    modifyColumn(columnData) {
        for (let column in columnData) {

            let columnName = column;

            if(columnName === 'id' || columnName === 'created_at' || columnName === 'updated_at') {
                console.log(`Cannot modify ${columnName} column`);
                continue;
            }

            columnData[column] = columnData[column].replace('string', 'VARCHAR(255)');            
            
            this.db.query(`ALTER TABLE ${this.tableName} MODIFY ${column} ${columnData[column]}`, (err, result) => {
                if(err) {
                    console.log(`Error modifying column ${column} in table ${this.tableName}`);
                    return;
                }
                if(result) {
                    console.log(`Column ${column} modified in table ${this.tableName} successfully`);
                    return;
                }
            });
        }
    }

    renameColumn(oldColumnName, newColumnName) {
        this.db.query(`ALTER TABLE ${this.tableName} CHANGE ${oldColumnName} ${newColumnName}`, (err, result) => {
            if(oldColumnName === 'id' || oldColumnName === 'created_at' || oldColumnName === 'updated_at') {
                console.log(`Cannot rename ${oldColumnName} column`);
                return;
            }
            if(err) {
                console.log(`Error renaming column ${oldColumnName} in table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Column ${oldColumnName} renamed to ${newColumnName} in table ${this.tableName} successfully`);
                return;
            }
        });
    }

    addIndex(indexName, columns) {
        this.db.query(`CREATE INDEX ${indexName} ON ${this.tableName} (${columns.join(', ')})`, (err, result) => {
            if(err) {
                console.log(`Error creating index ${indexName} on table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Index ${indexName} created on table ${this.tableName} successfully`);
                return;
            }
        });
    }

    dropIndex(indexName) {
        this.db.query(`DROP INDEX ${indexName} ON ${this.tableName}`, (err, result) => {
            if(err) {
                console.log(`Error dropping index ${indexName} from table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Index ${indexName} dropped from table ${this.tableName} successfully`);
                return;
            }
        });
    }

    addForeignKey(foreignKeyName, columnName, referencedTable, referencedColumnName) {
        this.db.query(`ALTER TABLE ${this.tableName} ADD CONSTRAINT ${foreignKeyName} FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(${referencedColumnName})`, (err, result) => {
            if(err) {
                console.log(`Error adding foreign key ${foreignKeyName} to table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Foreign key ${foreignKeyName} added to table ${this.tableName} successfully`);
                return;
            }
        });
    }

    dropForeignKey(foreignKeyName) {
        this.db.query(`ALTER TABLE ${this.tableName} DROP FOREIGN KEY ${foreignKeyName}`, (err, result) => {
            if(err) {
                console.log(`Error dropping foreign key ${foreignKeyName} from table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Foreign key ${foreignKeyName} dropped from table ${this.tableName} successfully`);
                return;
            }
        });
    }

    truncateTable() {
        this.db.query(`TRUNCATE TABLE ${this.tableName}`, (err, result) => {
            if(err) {
                console.log(`Error truncating table ${this.tableName}`);
                console.error(err);
                return;
            }
            if(result) {
                console.log(`Table ${this.tableName} truncated successfully`);
                return;
            }
        });
    }
}

module.exports = Migration;