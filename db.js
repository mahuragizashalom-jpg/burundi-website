const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

// Initialize datastores
const galleryDB = Datastore.create({
    filename: path.join(__dirname, 'data', 'gallery.db'),
    autoload: true
});

const contactsDB = Datastore.create({
    filename: path.join(__dirname, 'data', 'contacts.db'),
    autoload: true
});

/**
 * Migrates data from JSON to the gallery database if the DB is empty.
 */
async function migrateIfNeeded() {
    const count = await galleryDB.count({});
    if (count === 0) {
        const jsonPath = path.join(__dirname, 'data', 'gallery.json');
        if (fs.existsSync(jsonPath)) {
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            const entries = Object.entries(jsonData).map(([title, description]) => ({
                title,
                description
            }));
            await galleryDB.insert(entries);
            console.log('Migrated gallery data from JSON to Database.');
        }
    }
}

module.exports = {
    galleryDB,
    contactsDB,
    migrateIfNeeded
};
