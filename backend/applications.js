const { openDatabase } = require('./database');

const db = openDatabase();
try {
    const applications = db.prepare('SELECT id, kind, subject, name, email, phone, created_at FROM applications ORDER BY id DESC').all();
    console.log(JSON.stringify(applications, null, 2));
} finally {
    db.close();
}
