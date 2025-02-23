import Schema from './Schema.js';
import Database from './Database.js';
import UI from './UI.js';

const schema = new Schema();
const db = new Database(schema);
window.ui = new UI(db);