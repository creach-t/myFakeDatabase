class Database {
    constructor(schema) {
        this.schema = schema;
        this.currentTable = null;
    }

    useTable(tableName) {
        if (!this.schema.tables[tableName]) return;
        this.currentTable = tableName;
    }

    add(data) {
        if (!this.currentTable) return;
        const records = this.getAll();
        const id = this.getNextId(records);
        const newRecord = { id, ...data };
        records.push(newRecord);
        this.saveRecords(records);
        return newRecord;
    }

    update(id, data) {
        const records = this.getAll();
        const index = records.findIndex(record => record.id === parseInt(id));
        if (index !== -1) {
            records[index] = { ...records[index], ...data };
            this.saveRecords(records);
        }
    }

    delete(id) {
        const records = this.getAll();
        this.saveRecords(records.filter(record => record.id !== parseInt(id)));
    }

    getAll() {
        if (!this.currentTable) return [];
        const saved = localStorage.getItem(`table_${this.currentTable}`);
        return saved ? JSON.parse(saved) : [];
    }

    getNextId(records) {
        return records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
    }

    saveRecords(records) {
        localStorage.setItem(`table_${this.currentTable}`, JSON.stringify(records));
    }

    search(query) {
        if (!query) return this.getAll();
        const records = this.getAll();
        query = query.toLowerCase();
        return records.filter(record =>
            Object.values(record).some(value =>
                String(value).toLowerCase().includes(query)
            )
        );
    }
}