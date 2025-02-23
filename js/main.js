const schema = new Schema();
const db = new Database(schema);
window.ui = new UI(db);