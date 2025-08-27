#!/usr/bin/env node

/**
 * Knish.IO JavaScript SDK Self-Test Script
 * 
 * This script performs self-contained tests to validate SDK functionality
 * and ensure cross-SDK compatibility. It reads test configurations from a
 * shared JSON file and outputs results in a standardized format.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  generateSecret,
  generateBundleHash,
  Wallet,
  Molecule,
  Atom
} from './dist/client.es.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load shared test configuration
const configPath = path.resolve(__dirname, '../../validation/sdk-test-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Test results storage
const results = {
  sdk: 'JavaScript',
  version: JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')).version,
  timestamp: new Date().toISOString(),
  tests: {},
  molecules: {},
  crossSdkCompatible: true
};

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, errorDetail = null) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`  ${status}: ${testName}`, color);
  if (!passed && errorDetail) {
    log(`    ${errorDetail}`, 'red');
  }
}

/**
 * Debug utility to inspect molecule structure
 */
function inspectMolecule(molecule, name = 'molecule') {
  log(`\n🔍 INSPECTING ${name.toUpperCase()}:`, 'blue');
  log(`  Molecular Hash: ${molecule.molecularHash || 'NOT_SET'}`);
  log(`  Secret: ${molecule.secret ? 'SET (length: ' + molecule.secret.length + ')' : 'NOT_SET'}`);
  log(`  Bundle: ${molecule.bundle || 'NOT_SET'}`);
  log(`  Source Wallet: ${molecule.sourceWallet ? molecule.sourceWallet.address.substring(0, 16) + '...' : 'NOT_SET'}`);
  log(`  Remainder Wallet: ${molecule.remainderWallet ? molecule.remainderWallet.address.substring(0, 16) + '...' : 'NOT_SET'}`);
  log(`  Atoms (${molecule.atoms.length}):`);
  
  let totalValue = 0;
  molecule.atoms.forEach((atom, index) => {
    const value = parseFloat(atom.value) || 0;
    totalValue += value;
    log(`    [${index}] ${atom.isotope}: ${atom.value} (${atom.walletAddress.substring(0, 16)}...) index=${atom.index}`);
  });
  
  log(`  Total Value: ${totalValue} ${totalValue === 0 ? '✅ BALANCED' : '❌ UNBALANCED'}`);
  log(`  Cell Slug: ${molecule.cellSlug || 'NOT_SET'}`);
  log(`  Status: ${molecule.status || 'NOT_SET'}`);
}

/**
 * Step-by-step validation diagnostic 
 */
function diagnoseValidation(molecule, senderWallet, name = 'molecule') {
  log(`\n🔬 VALIDATING ${name.toUpperCase()} STEP-BY-STEP:`, 'blue');
  
  try {
    // For now, just do basic validation since CheckMolecule isn't easily accessible
    // But let's add more detailed logging around the validation itself
    log(`  Molecule has ${molecule.atoms.length} atoms`);
    log(`  First atom isotope: ${molecule.atoms[0].isotope}`);
    log(`  Molecular hash present: ${!!molecule.molecularHash}`);
    log(`  Source wallet provided: ${!!senderWallet}`);
    
    // Check for common issues
    if (!molecule.molecularHash) {
      log(`    ❌ Missing molecular hash`, 'red');
    }
    
    if (molecule.atoms.length === 0) {
      log(`    ❌ No atoms in molecule`, 'red');
    }
    
    // Check atom indices
    for (let i = 0; i < molecule.atoms.length; i++) {
      const atom = molecule.atoms[i];
      if (atom.index === null) {
        log(`    ❌ Atom ${i} has null index`, 'red');
      } else {
        log(`    ✅ Atom ${i} index: ${atom.index}`, 'green');
      }
    }
    
    // Try basic validation with error catching
    try {
      const result = molecule.check(senderWallet);
      log(`  Basic validation result: ${result}`, result ? 'green' : 'red');
    } catch (validationError) {
      log(`  Basic validation error: ${validationError.message}`, 'red');
    }
    
  } catch (error) {
    log(`  ❌ Diagnostic error: ${error.message}`, 'red');
  }
}

/**
 * Test 1: Crypto Test
 * Validates that SDK generates correct secrets and bundle hashes
 */
async function testCrypto() {
  log('\n1. Crypto Test', 'blue');
  const testConfig = config.tests.crypto;
  
  try {
    // Generate secret from seed
    const secret = generateSecret(testConfig.seed);
    const secretMatch = secret === testConfig.secret;
    logTest(`Secret generation (seed: "${testConfig.seed}")`, secretMatch);
    
    // Generate bundle hash from secret
    const bundle = generateBundleHash(secret);
    const bundleMatch = bundle === testConfig.bundle;
    logTest(`Bundle hash generation`, bundleMatch);
    
    results.tests.crypto = {
      passed: secretMatch && bundleMatch,
      secret: secret,
      bundle: bundle,
      expectedSecret: testConfig.secret,
      expectedBundle: testConfig.bundle
    };
    
    return secretMatch && bundleMatch;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.crypto = {
      passed: false,
      error: error.message
    };
    return false;
  }
}

/**
 * Test 2: Metadata Creation Test
 * Creates and validates a metadata molecule
 */
async function testMetaCreation() {
  log('\n2. Metadata Creation Test', 'blue');
  const testConfig = config.tests.metaCreation;
  
  try {
    // Generate secret and create signing wallet
    const secret = generateSecret(testConfig.seed);
    const bundle = generateBundleHash(secret);
    
    const sourceWallet = new Wallet({
      secret: secret,
      token: testConfig.token,
      position: testConfig.sourcePosition
    });
    
    logTest('Source wallet creation', true);
    
    // Create molecule instance
    const molecule = new Molecule({
      secret: secret,
      bundle: bundle,
      sourceWallet: sourceWallet
    });
    
    // Convert metas array to object format
    const metaObject = {};
    testConfig.metas.forEach(m => {
      metaObject[m.key] = m.value;
    });
    
    // Initialize metadata molecule
    molecule.initMeta({
      metaType: testConfig.metaType,
      metaId: testConfig.metaId,
      meta: metaObject
    });
    
    logTest('Metadata molecule initialization', true);
    
    // Sign the molecule
    molecule.sign({});
    logTest('Molecule signing', true);
    
    // Debug: Inspect molecule before validation
    inspectMolecule(molecule, 'metadata molecule');
    
    // Step-by-step validation diagnostic
    diagnoseValidation(molecule, sourceWallet, 'metadata molecule');
    
    // Validate the molecule with detailed error capture
    let isValid = false;
    let validationError = null;
    try {
      isValid = molecule.check(sourceWallet);
      if (!isValid) {
        validationError = 'Validation returned false (no exception thrown)';
      }
    } catch (error) {
      isValid = false;
      validationError = error.message;
    }
    
    logTest('Molecule validation', isValid, validationError);
    
    // Store serialized molecule for cross-SDK verification
    results.molecules.metadata = JSON.stringify(molecule);
    
    results.tests.metaCreation = {
      passed: isValid,
      molecularHash: molecule.molecularHash,
      atomCount: molecule.atoms.length,
      validationError: validationError
    };
    
    return isValid;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.metaCreation = {
      passed: false,
      error: error.message
    };
    return false;
  }
}

/**
 * Test 3: Simple Transfer Test
 * Creates a value transfer with no remainder
 */
async function testSimpleTransfer() {
  log('\n3. Simple Transfer Test', 'blue');
  const testConfig = config.tests.simpleTransfer;
  
  try {
    // Create source wallet for value transfer (must use same token for all transfer wallets)
    const sourceSecret = generateSecret(testConfig.sourceSeed);
    const sourceBundle = generateBundleHash(sourceSecret);
    
    const sourceWallet = new Wallet({
      secret: sourceSecret,
      token: testConfig.token,
      position: testConfig.sourcePosition
    });
    
    // Set balance manually for testing
    sourceWallet.balance = testConfig.balance;
    
    logTest('Source wallet creation', true);
    
    // Create recipient wallet
    const recipientSecret = generateSecret(testConfig.recipientSeed);
    
    const recipientWallet = new Wallet({
      secret: recipientSecret,
      token: testConfig.token,
      position: testConfig.recipientPosition
    });
    
    logTest('Recipient wallet creation', true);
    
    // Create molecule for value transfer
    const molecule = new Molecule({
      secret: sourceSecret,
      bundle: sourceBundle,
      sourceWallet: sourceWallet
    });
    
    // Initialize value transfer
    await molecule.initValue({
      token: testConfig.token,
      amount: testConfig.amount,
      recipientWallet: recipientWallet
    });
    
    logTest('Value transfer initialization', true);
    
    // Sign the molecule
    molecule.sign({});
    logTest('Molecule signing', true);
    
    // Debug: Inspect molecule before validation
    inspectMolecule(molecule, 'simple transfer molecule');
    
    // Validate the molecule with detailed error capture
    let isValid = false;
    let validationError = null;
    try {
      isValid = molecule.check(sourceWallet);
      if (!isValid) {
        validationError = 'Validation returned false (no exception thrown)';
      }
    } catch (error) {
      isValid = false;
      validationError = error.message;
    }
    
    logTest('Molecule validation', isValid, validationError);
    
    // Store serialized molecule for cross-SDK verification
    results.molecules.simpleTransfer = JSON.stringify(molecule);
    
    results.tests.simpleTransfer = {
      passed: isValid,
      molecularHash: molecule.molecularHash,
      atomCount: molecule.atoms.length,
      validationError: validationError
    };
    
    return isValid;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.simpleTransfer = {
      passed: false,
      error: error.message
    };
    return false;
  }
}

/**
 * Test 4: Complex Transfer Test
 * Creates a value transfer with remainder
 */
async function testComplexTransfer() {
  log('\n4. Complex Transfer Test', 'blue');
  const testConfig = config.tests.complexTransfer;
  
  try {
    // Create source wallet for value transfer (must use same token for all transfer wallets)
    const sourceSecret = generateSecret(testConfig.sourceSeed);
    const sourceBundle = generateBundleHash(sourceSecret);
    
    const sourceWallet = new Wallet({
      secret: sourceSecret,
      token: testConfig.token,
      position: testConfig.sourcePosition
    });
    
    // Set balance manually for testing  
    sourceWallet.balance = testConfig.balance;
    
    logTest('Source wallet creation', true);
    
    // Create remainder wallet
    const remainderWallet = new Wallet({
      secret: sourceSecret,
      token: testConfig.token,
      position: testConfig.remainderPosition
    });
    
    logTest('Remainder wallet creation', true);
    
    // Create recipient wallet
    const recipientSecret = generateSecret(testConfig.recipientSeed);
    
    const recipientWallet = new Wallet({
      secret: recipientSecret,
      token: testConfig.token,
      position: testConfig.recipientPosition
    });
    
    logTest('Recipient wallet creation', true);
    
    // Create molecule for value transfer with remainder
    const molecule = new Molecule({
      secret: sourceSecret,
      bundle: sourceBundle,
      sourceWallet: sourceWallet,
      remainderWallet: remainderWallet
    });
    
    // Initialize value transfer with remainder
    await molecule.initValue({
      token: testConfig.token,
      amount: testConfig.amount,
      recipientWallet: recipientWallet
    });
    
    logTest('Value transfer with remainder initialization', true);
    
    // Sign the molecule
    molecule.sign({});
    logTest('Molecule signing', true);
    
    // Debug: Inspect molecule before validation
    inspectMolecule(molecule, 'complex transfer molecule');
    
    // Step-by-step validation diagnostic
    diagnoseValidation(molecule, sourceWallet, 'complex transfer molecule');
    
    // Validate the molecule with detailed error capture
    let isValid = false;
    let validationError = null;
    try {
      isValid = molecule.check(sourceWallet);
      if (!isValid) {
        validationError = 'Validation returned false (no exception thrown)';
      }
    } catch (error) {
      isValid = false;
      validationError = error.message;
    }
    
    logTest('Molecule validation', isValid, validationError);
    
    // Store serialized molecule for cross-SDK verification
    results.molecules.complexTransfer = JSON.stringify(molecule);
    
    results.tests.complexTransfer = {
      passed: isValid,
      molecularHash: molecule.molecularHash,
      atomCount: molecule.atoms.length,
      hasRemainder: molecule.atoms.some(atom => atom.walletAddress === remainderWallet.address),
      validationError: validationError
    };
    
    return isValid;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.complexTransfer = {
      passed: false,
      error: error.message
    };
    return false;
  }
}

/**
 * Cross-SDK Validation
 * Loads and validates molecules from other SDKs (if available)
 */
async function testCrossSdkValidation() {
  log('\n5. Cross-SDK Validation', 'blue');
  
  const resultsDir = path.resolve(__dirname, '../../validation/results');
  
  if (!fs.existsSync(resultsDir)) {
    log('  ⏭️  No other SDK results found for cross-validation', 'yellow');
    return true;
  }
  
  const resultFiles = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json') && !f.includes('javascript'));
  
  if (resultFiles.length === 0) {
    log('  ⏭️  No other SDK results found for cross-validation', 'yellow');
    return true;
  }
  
  let allValid = true;
  
  for (const file of resultFiles) {
    const sdkName = file.replace('-results.json', '');
    const otherResults = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
    
    // Validate molecules from other SDK
    for (const [moleculeType, moleculeData] of Object.entries(otherResults.molecules || {})) {
      try {
        const molecule = Molecule.fromJson(moleculeData);
        const isValid = await molecule.check();
        logTest(`${sdkName} ${moleculeType} molecule validation`, isValid);
        
        if (!isValid) {
          allValid = false;
        }
      } catch (error) {
        logTest(`${sdkName} ${moleculeType} molecule validation`, false);
        log(`    Error: ${error.message}`, 'red');
        allValid = false;
      }
    }
  }
  
  results.crossSdkCompatible = allValid;
  return allValid;
}

/**
 * Save test results to file
 */
function saveResults() {
  const resultsDir = path.resolve(__dirname, '../../validation/results');
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const resultsFile = path.join(resultsDir, 'javascript-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  
  log(`\n📁 Results saved to: ${resultsFile}`, 'blue');
}

/**
 * Print summary report
 */
function printSummary() {
  log('\n═══════════════════════════════════════════', 'blue');
  log('            TEST SUMMARY REPORT', 'blue');
  log('═══════════════════════════════════════════', 'blue');
  
  const totalTests = Object.keys(results.tests).length;
  const passedTests = Object.values(results.tests).filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;
  
  log(`\nSDK: ${results.sdk} v${results.version}`);
  log(`Timestamp: ${results.timestamp}`);
  log(`\nTests Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'red');
  
  if (failedTests > 0) {
    log('\nFailed Tests:', 'red');
    for (const [testName, testResult] of Object.entries(results.tests)) {
      if (!testResult.passed) {
        log(`  - ${testName}: ${testResult.error || 'Validation failed'}`, 'red');
      }
    }
  }
  
  if (results.crossSdkCompatible !== undefined) {
    log(`\nCross-SDK Compatible: ${results.crossSdkCompatible ? '✅ YES' : '❌ NO'}`, 
        results.crossSdkCompatible ? 'green' : 'red');
  }
  
  log('\n═══════════════════════════════════════════', 'blue');
}

/**
 * Main test runner
 */
async function runTests() {
  log('═══════════════════════════════════════════', 'blue');
  log('    Knish.IO JavaScript SDK Self-Test', 'blue');
  log('═══════════════════════════════════════════', 'blue');
  
  // Run all tests
  await testCrypto();
  await testMetaCreation();
  await testSimpleTransfer();
  await testComplexTransfer();
  await testCrossSdkValidation();
  
  // Save results and print summary
  saveResults();
  printSummary();
  
  // Exit with appropriate code
  const allPassed = Object.values(results.tests).every(t => t.passed) && results.crossSdkCompatible;
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});