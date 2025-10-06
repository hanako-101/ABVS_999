// test-after-ip.js
const { MongoClient } = require('mongodb');

// Test avec le nouvel utilisateur que vous allez créer
const uri = "mongodb+srv://internship_admin:Admin123456@cluster0.zgchxj4.mongodb.net/internship-management?retryWrites=true&w=majority";

async function testWithRetry() {
  console.log('🔄 Testing connection after IP whitelist...');
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('🎉 SUCCÈS! Connexion établie!');
    
    const db = client.db();
    console.log('📊 Base de données:', db.databaseName);
    
    // Créer une collection test
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({ 
      message: 'Test réussi', 
      timestamp: new Date() 
    });
    console.log('✅ Document test inséré');
    
    const count = await testCollection.countDocuments();
    console.log('📈 Documents dans test_connection:', count);
    
  } catch (error) {
    console.log('❌ Échec:', error.message);
    console.log('');
    console.log('🔧 Prochaines étapes:');
    console.log('1. Vérifiez que l\'IP est bien ajoutée dans Network Access');
    console.log('2. Attendez 2-3 minutes pour que les changements prennent effet');
    console.log('3. Créez un NOUVEL utilisateur si nécessaire');
  } finally {
    await client.close();
  }
}

// Attendre un peu puis tester
setTimeout(testWithRetry, 2000);