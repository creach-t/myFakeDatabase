class Database {
    constructor() {
        this.data = [];
        this.load();
    }

    add(item) {
        const id = this.getNextId();
        const newItem = { id, ...item };
        this.data.push(newItem);
        this.save();
        return newItem;
    }

    update(id, newData) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...newData };
            this.save();
        }
    }

    delete(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.save();
    }

    getNextId() {
        return this.data.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    }

    save() {
        localStorage.setItem('database', JSON.stringify(this.data));
    }

    load() {
        const saved = localStorage.getItem('database');
        this.data = saved ? JSON.parse(saved) : [];
    }

    search(query) {
        if (!query) return this.data;
        query = query.toLowerCase();
        return this.data.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.age.toString().includes(query)
        );
    }
}

class UI {
    constructor() {
        this.db = new Database();
        this.form = document.getElementById('data-form');
        this.searchInput = document.getElementById('search');
        this.currentId = null;

        this.form.addEventListener('submit', e => this.handleSubmit(e));
        this.searchInput.addEventListener('input', e => this.handleSearch(e));
        this.render();
    }

    handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const age = parseInt(document.getElementById('age').value);

        const errors = this.validate(name, age);
        if (errors.length > 0) {
            this.showErrors(errors);
            return;
        }

        if (this.currentId) {
            this.db.update(this.currentId, { name, age });
            this.currentId = null;
        } else {
            this.db.add({ name, age });
        }

        this.form.reset();
        document.querySelector('button[type="submit"]').textContent = 'Ajouter';
        this.clearErrors();
        this.render();
    }

    handleSearch(e) {
        this.render(this.db.search(e.target.value));
    }

    validate(name, age) {
        const errors = [];
        if (name.length < 2) errors.push('Le nom doit contenir au moins 2 caractères');
        if (!age || age < 0 || age > 150) errors.push('L\'âge doit être entre 0 et 150');
        return errors;
    }

    showErrors(errors) {
        const container = document.getElementById('errors');
        container.innerHTML = errors.map(error => `<div>${error}</div>`).join('');
    }

    clearErrors() {
        document.getElementById('errors').innerHTML = '';
    }

    edit(id) {
        const item = this.db.data.find(item => item.id === id);
        if (!item) return;

        document.getElementById('name').value = item.name;
        document.getElementById('age').value = item.age;
        this.currentId = id;
        document.querySelector('button[type="submit"]').textContent = 'Modifier';
    }

    delete(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
            this.db.delete(id);
            if (this.currentId === id) {
                this.form.reset();
                this.currentId = null;
                document.querySelector('button[type="submit"]').textContent = 'Ajouter';
            }
            this.render();
        }
    }

    render(data = this.db.data) {
        const container = document.getElementById('data-container');
        container.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>
                    <button class="button button--primary" onclick="ui.edit(${item.id})">Modifier</button>
                    <button class="button button--delete" onclick="ui.delete(${item.id})">×</button>
                </td>
            </tr>
        `).join('');
    }
}

const ui = new UI();