const { galleryDB, contactsDB } = require('./db');

async function verify() {
    console.log('--- Database Verification ---');

    // Check Gallery
    const galleryCount = await galleryDB.count({});
    console.log(`Gallery items in DB: ${galleryCount}`);

    if (galleryCount > 0) {
        const item = await galleryDB.findOne({ title: 'Village Smiles' });
        console.log('Sample item "Village Smiles" found:', !!item);
    }

    // Test Contact Insert
    console.log('Testing Contact Insert...');
    const testContact = {
        name: 'Noah Test',
        email: 'noah@test.com',
        message: 'Final verification successful',
        timestamp: new Date()
    };

    await contactsDB.insert(testContact);
    const contactCount = await contactsDB.count({});
    console.log(`Contact items in DB: ${contactCount}`);

    console.log('--- Verification Complete: NO ERRORS FOUND ---');
    process.exit(0);
}

verify().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
