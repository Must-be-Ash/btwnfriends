#!/usr/bin/env node

/**
 * Database Cleanup Script
 * 
 * This script cleans all data from the MongoDB database while preserving
 * the collection structure. This allows for fresh testing without old/stale data.
 * 
 * Usage: node scripts/clean-database.js
 */

const { MongoClient } = require('mongodb');

// Read environment from .env.local file manually
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Could not read .env.local file:', error.message);
    return {};
  }
}

const env = loadEnv();
const MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function cleanDatabase() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    // Explicitly use the 'paypall' database
    const db = client.db('paypall');
    console.log(`✅ Connected to database: ${db.databaseName}`);
    
    // List all collections first
    const collections = await db.listCollections().toArray();
    console.log('📁 Found collections:', collections.map(c => c.name).join(', '));
    
    // Collections to clean (preserve structure, delete data)
    const collectionsToClean = [
      'users',
      'contacts', 
      'transactions',
      'pending_transfers'
    ];
    
    console.log('\n🧹 Starting database cleanup...\n');
    
    for (const collectionName of collectionsToClean) {
      try {
        const collection = db.collection(collectionName);
        
        // Count documents before deletion
        const countBefore = await collection.countDocuments();
        
        if (countBefore === 0) {
          console.log(`📭 ${collectionName}: Already empty`);
          continue;
        }
        
        // Delete all documents in the collection
        const result = await collection.deleteMany({});
        
        console.log(`🗑️  ${collectionName}: Deleted ${result.deletedCount} documents (was ${countBefore})`);
        
        // Verify deletion
        const countAfter = await collection.countDocuments();
        if (countAfter === 0) {
          console.log(`✅ ${collectionName}: Successfully cleaned`);
        } else {
          console.log(`⚠️  ${collectionName}: Warning - ${countAfter} documents remain`);
        }
        
      } catch (error) {
        console.error(`❌ Error cleaning ${collectionName}:`, error.message);
      }
    }
    
    console.log('\n📊 Final verification...');
    
    // Verify all collections are empty
    for (const collectionName of collectionsToClean) {
      const count = await db.collection(collectionName).countDocuments();
      const status = count === 0 ? '✅' : '❌';
      console.log(`${status} ${collectionName}: ${count} documents`);
    }
    
    console.log('\n🎉 Database cleanup completed!');
    console.log('📝 Collection structure preserved, all data removed');
    console.log('🔄 Ready for fresh testing');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Confirmation prompt
console.log('⚠️  DATABASE CLEANUP WARNING ⚠️');
console.log('This will permanently delete ALL data from:');
console.log('- users');
console.log('- contacts'); 
console.log('- transactions');
console.log('- pending_transfers');
console.log('');
console.log('Collection structure will be preserved.');
console.log('');

// Simple confirmation (for Node.js environment)
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Type "CONFIRM" to proceed with cleanup: ', (answer) => {
  rl.close();
  
  if (answer === 'CONFIRM') {
    cleanDatabase();
  } else {
    console.log('❌ Cleanup cancelled');
    process.exit(0);
  }
});