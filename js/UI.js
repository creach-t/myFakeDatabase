class UI {
    constructor(db) {
        this.db = db;
        this.currentId = null;
        this.setupEventListeners();
        this.initializeTablesList();
    }

    setupEventListeners() {
        document.getElementById('table-form').addEventListener('submit', e => this.handleTableCreate(e));
        document.getElementById('field-form').addEventListener('submit', e => this.handleFieldAdd(e));
        document.getElementById('data-form').addEventListener('submit', e => this.handleDataSubmit(e));
        document.getElementById('search').addEventListener('input', e => this.handleSearch(e));
        document.getElementById('table-select').addEventListener('change', e => this.handleTableSelect(e));
    }

    initializeTablesList() {
        const tables = Object.keys(this.db.schema.tables);
        const tableSelect = document.getElementById('table-select');
        tableSelect.innerHTML = '<option value="">Sélectionner une table</option>' +
            tables.map(table => `<option value="${table}">${table}</option>`).join('');
    }

    handleTableCreate(e) {
        e.preventDefault();
        const tableName = document.getElementById('table-name').value.trim();
        this.db.schema.createTable(tableName, { 'id': 'number' });
        this.initializeTablesList();
        e.target.reset();
    }

    handleFieldAdd(e) {
        e.preventDefault();
        const tableName = document.getElementById('table-select').value;
        const fieldName = document.getElementById('field-name').value.trim();
        const fieldType = document.getElementById('field-type').value;
        
        if (!tableName) return;
        
        this.db.schema.addField(tableName, fieldName, fieldType);
        this.updateDataForm();
        e.target.reset();
    }

    handleTableSelect(e) {
        const tableName = e.target.value;
        if (tableName) {
            this.db.useTable(tableName);
            this.updateDataForm();
            this.render();
        }
    }

    handleDataSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        if (this.currentId) {
            this.db.update(this.currentId, data);
            this.currentId = null;
        } else {
            this.db.add(data);
        }

        this.render();
        e.target.reset();
    }

    handleSearch(e) {
        this.render(this.db.search(e.target.value));
    }

    updateDataForm() {
        const tableName = document.getElementById('table-select').value;
        if (!tableName) return;

        const fields = this.db.schema.getTableFields(tableName);
        const form = document.getElementById('data-form');
        form.innerHTML = Object.entries(fields)
            .filter(([name]) => name !== 'id')
            .map(([name, type]) => `
                <div class="form-group">
                    <label for="${name}">${name}:</label>
                    <input type="${type}" id="${name}" name="${name}" required>
                </div>
            `).join('') + '
            <button type="submit" class="button button--primary">Ajouter</button>';
    }

    edit(id) {
        const record = this.db.getAll().find(r => r.id === id);
        if (!record) return;

        Object.entries(record)
            .filter(([key]) => key !== 'id')
            .forEach(([key, value]) => {
                const input = document.getElementById(key);
                if (input) input.value = value;
            });

        this.currentId = id;
        document.querySelector('button[type="submit"]').textContent = 'Modifier';
    }

    delete(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) return;
        this.db.delete(id);
        this.render();
    }

    render(data) {
        const tableName = document.getElementById('table-select').value;
        if (!tableName) return;

        const fields = this.db.schema.getTableFields(tableName);
        const records = data || this.db.getAll();
        const headers = Object.keys(fields);

        document.getElementById('data-container').innerHTML = `
            <tr>
                ${headers.map(field => `<th>${field}</th>`).join('')}
                <th>Actions</th>
            </tr>
            ${records.map(record => `
                <tr>
                    ${headers.map(field => `<td>${record[field]}</td>`).join('')}
                    <td>
                        <button class="button button--primary" onclick="ui.edit(${record.id})">Modifier</button>
                        <button class="button button--delete" onclick="ui.delete(${record.id})">×</button>
                    </td>
                </tr>
            `).join('')}`;
    }
}

export default UI;