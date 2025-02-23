class Schema {
    constructor() {
        this.tables = {};
        this.loadSchema();
    }

    createTable(tableName, fields) {
        if (this.tables[tableName]) {
            throw new Error(`La table ${tableName} existe déjà`);
        }
        this.tables[tableName] = fields;
        this.saveSchema();
        localStorage.setItem(`table_${tableName}`, JSON.stringify([]));
    }

    deleteTable(tableName) {
        if (!this.tables[tableName]) return;
        delete this.tables[tableName];
        localStorage.removeItem(`table_${tableName}`);
        this.saveSchema();
    }

    addField(tableName, fieldName, fieldType) {
        if (!this.tables[tableName]) return;
        this.tables[tableName][fieldName] = fieldType;
        this.saveSchema();
    }

    saveSchema() {
        localStorage.setItem('schema', JSON.stringify(this.tables));
    }

    loadSchema() {
        const savedSchema = localStorage.getItem('schema');
        this.tables = savedSchema ? JSON.parse(savedSchema) : {};
    }

    getTableFields(tableName) {
        return this.tables[tableName] || null;
    }
}

export default Schema;