// test-connection.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://chaimaefaiz00_db_user:VOTRE_MOT_DE_PASSE@cluster0.zgchxj4.mongodb.net/internship-management?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB!');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();