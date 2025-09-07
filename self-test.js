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

// Embedded test configuration for SDK self-containment (2025 best practices)
const DEFAULT_CONFIG = {
  "tests": {
    "crypto": {
      "seed": "TESTSEED",
      "secret": "e8ffc86d60fc6a73234a834166e7436e21df6c3209dfacc8d0bd6595707872c3799abbf7deee0f9c4b58de1fd89b9abb67a207558208d5ccf550c227d197c24e9fcc3707aeb53c4031d38392020ff72bcaa0f728aa8bc3d47d95ff0afc04d8fcdb69bff638ce56646c154fc92aa517d3c40f550d2ccacbd921724e1d94b82aed2c8e172a8a7ed5a6963f5890157fe77222b97af3787741f9d3cec0b40aec6f07ae4b2b24614f0a20e035aee0df04e176175dc100eb1b00dd7ea95c28cdec47958336945333c3bef24719ed949fa56d1541f24c725d4f374a533bf255cf22f4596147bcd1ba05abcecbe9b12095e1fdddb094616894c366498be0b5785c180100efb3c5b689fc1c01131633fe1775df52a970e9472ab7bc0c19f5742b9e9436753cd16024b2d326b763eca68c414755a0d2fdbb927f007e9413f1190578b2033a03d29387f5aea71b07a5ce80fbfd45be4a15440faadeac50e41846022894fc683a52328b470bc1860c8b038d7258f504178918502b93d84d8b0fbef3e02f89f83cb1ff033a2bdbdf2a2ba78d80c12aa8b2d6c10d76c468186bd4a4e9eacc758546bb50ed7b1ee241cc5b93ff924c7bbee6778b27789e1f9104c917fc93f735eee5b25c07a883788f3d2e0771e751c4f59b76f8426027ac2b07a2ca84534433d0a1b86cef3288e7d79e8b175a3955848cfd1dfbdcd6b5bafcf6789e56e8ef40af",
      "bundle": "fee9c2b9a964d060eb4645c4001db805c3c4b0cc9bba12841036eba4bf44b831",
      "walletAddress": "Kk4xBpejTujcDQxuuUNVEcvvRNwRGMfLFm28p1aqv2wQ52u5X"
    },
    "metaCreation": {
      "seed": "TESTSEED",
      "token": "USER",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "metaType": "TestMeta",
      "metaId": "TESTMETA123",
      "metadata": {
        "name": "Test Metadata",
        "description": "This is a test metadata for SDK testing."
      },
      "expectedMolecularHash": "046778a3g7d26de4145d33de70b48d70a2e3e1b0f2gadg398a0711g3263761a2"
    },
    "simpleTransfer": {
      "sourceSeed": "TESTSEED",
      "recipientSeed": "RECIPIENTSEED",
      "balance": 1000,
      "amount": 1000,
      "token": "TEST",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "recipientPosition": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      "expectedMolecularHash": "00bd586e56gbg38737c4gd463e3fb39cdbb013fg8a851baa962c66g0d1cadce5"
    },
    "complexTransfer": {
      "sourceSeed": "TESTSEED",
      "recipient1Seed": "RECIPIENTSEED",
      "recipient2Seed": "RECIPIENT2SEED",
      "sourceBalance": 1000,
      "amount1": 500,
      "amount2": 500,
      "token": "TEST",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "recipient1Position": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      "recipient2Position": "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
      "expectedMolecularHash": "034f6f8d01c9f20c8a9a64a5742ca755b53a917461c8e870de8622ca4a2b37ge"
    }
  }
};

// Support optional external config override for flexibility
const configPath = process.env.KNISHIO_TEST_CONFIG;
const config = configPath && fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : DEFAULT_CONFIG;

// Configurable shared results directory for cross-platform testing
const sharedResultsDir = process.env.KNISHIO_SHARED_RESULTS ||
                        path.resolve(__dirname, '../shared-test-results');

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

    // Convert metadata object to array format, then to metaObject
    const metaObject = {};
    const metas = testConfig.metadata ?
      Object.entries(testConfig.metadata).map(([key, value]) => ({ key, value })) :
      [];
    metas.forEach(m => {
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
    results.molecules.metadata = JSON.stringify(molecule.toJSON());

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
    results.molecules.simpleTransfer = JSON.stringify(molecule.toJSON());

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
    sourceWallet.balance = testConfig.sourceBalance;

    logTest('Source wallet creation', true);

    // Create remainder wallet with generated position
    const remainderWallet = new Wallet({
      secret: sourceSecret,
      token: testConfig.token,
      position: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
    });

    logTest('Remainder wallet creation', true);

    // Create first recipient wallet
    const recipientSecret = generateSecret(testConfig.recipient1Seed);

    const recipientWallet = new Wallet({
      secret: recipientSecret,
      token: testConfig.token,
      position: testConfig.recipient1Position
    });

    logTest('Recipient wallet creation', true);

    // Create molecule for value transfer with remainder
    const molecule = new Molecule({
      secret: sourceSecret,
      bundle: sourceBundle,
      sourceWallet: sourceWallet,
      remainderWallet: remainderWallet
    });

    // Initialize value transfer with remainder (sending amount1 to first recipient)
    await molecule.initValue({
      token: testConfig.token,
      amount: testConfig.amount1,
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
    results.molecules.complexTransfer = JSON.stringify(molecule.toJSON());

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

  const resultsDir = sharedResultsDir;

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
        // Use centralized fromJSON() method for clean deserialization
        const molecule = Molecule.fromJSON(moleculeData, {
          includeValidationContext: true,
          validateStructure: true,
          strictMode: false // Allow some flexibility for cross-SDK compatibility
        });

        // Source wallet is now automatically reconstructed by fromJSON()
        const sourceWallet = molecule.sourceWallet;

        // Use the molecule's check() method for full validation
        let isValid = false;
        try {
          isValid = await molecule.check(sourceWallet);
        } catch (error) {
          log(`    Validation error: ${error.message}`, 'red');
          isValid = false;
        }
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
  const resultsDir = sharedResultsDir;

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
