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
} from '../../dist/client.es.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fixed timestamp for deterministic testing (preserves timestamp in hash while ensuring consistency)
const FIXED_TEST_TIMESTAMP_BASE = 1700000000000; // Fixed base timestamp for deterministic testing

// Helper function to set fixed timestamps for deterministic testing
function setFixedTimestamps(molecule) {
  for (let i = 0; i < molecule.atoms.length; i++) {
    // Set deterministic timestamp: base + (index * 1000) to ensure unique but predictable timestamps
    molecule.atoms[i].createdAt = String(FIXED_TEST_TIMESTAMP_BASE + (i * 1000));
  }
}

// Helper function to create fixed remainder wallets for deterministic testing
function createFixedRemainderWallet(secret, token) {
  return new Wallet({
    secret: secret,
    token: token,
    position: 'bbbb000000000000cccc111111111111dddd222222222222eeee333333333333', // Fixed deterministic position
    bundle: generateBundleHash(secret, 'Test::createFixedRemainderWallet')
  });
}

// Embedded test configuration for SDK self-containment (2025 best practices)
const DEFAULT_CONFIG = {
  "tests": {
    "crypto": {
      "seed": "TESTSEED",
      "secret": "e8ffc86d60fc6a73234a834166e7436e21df6c3209dfacc8d0bd6595707872c3799abbf7deee0f9c4b58de1fd89b9abb67a207558208d5ccf550c227d197c24e9fcc3707aeb53c4031d38392020ff72bcaa0f728aa8bc3d47d95ff0afc04d8fcdb69bff638ce56646c154fc92aa517d3c40f550d2ccacbd921724e1d94b82aed2c8e172a8a7ed5a6963f5890157fe77222b97af3787741f9d3cec0b40aec6f07ae4b2b24614f0a20e035aee0df04e176175dc100eb1b00dd7ea95c28cdec47958336945333c3bef24719ed949fa56d1541f24c725d4f374a533bf255cf22f4596147bcd1ba05abcecbe9b12095e1fdddb094616894c366498be0b5785c180100efb3c5b689fc1c01131633fe1775df52a970e9472ab7bc0c19f5742b9e9436753cd16024b2d326b763eca68c414755a0d2fdbb927f007e9413f1190578b2033a03d29387f5aea71b07a5ce80fbfd45be4a15440faadeac50e41846022894fc683a52328b470bc1860c8b038d7258f504178918502b93d84d8b0fbef3e02f89f83cb1ff033a2bdbdf2a2ba78d80c12aa8b2d6c10d76c468186bd4a4e9eacc758546bb50ed7b1ee241cc5b93ff924c7bbee6778b27789e1f9104c917fc93f735eee5b25c07a883788f3d2e0771e751c4f59b76f8426027ac2b07a2ca84534433d0a1b86cef3288e7d79e8b175a3955848cfd1dfbdcd6b5bafcf6789e56e8ef40af09a764147640eb10b426349f6ffc8e299cdcebffc3a9d6be362ba33fbf648bf06ea4c35890c705df479030fd1d0669d289dcbabaaf78f945c37fc69f3823dbfa99bdf3cf7bb7be8f810a7eab5167e26691642c3982aa203687d0e674154c970cfc1822f9917f2100ae8950cf0fcab074bfb578f4f6e78df490f0fd9becdba7151f2a5733cc2a3df845aa17bdc49765163d635de5c3a1c376683e622fe3e0a6092a35dfedc4bc5bc9c120d2ed06d899775bcd16417318f4b5c7ba27fdc0a442884a69e71543a13cb26762a0df4f47807924a15da7895b6c96accb09394fdf0232d922a99f4a9f95d46da7b9050eb661f3329fe98372175a82d5e5296e4a31c040da6407194251b5baa7338071d1edfc51f55ca409ffd885045e47412f97a4bbe2e73794d8b276ccb446843bbc38c7e580dc4dc2ba94556de0d80681f60d1b2953021e08a60e26685adf61eff91d9ca7daa04a72de9dc2822655648f3c0f5016967b0e8104d70add65b9b9ce98b3aaa10106f5f32133775a71ab9b006307e390b697c77bb828c3ad07bfdcc3ecf3149ac98dc8a230c281365719d67fd2450c717ad1391880d9c17cb8ba96b6254ac783aeae04f84f14829e4efc6ee73b77670cb9ea96dc73e5464bc4cf46cdd2ebe75009d9c4ce6097eab2858ef2899b3dcd147c579939f45c4ad2aa283b6e9c8ca2539abd5e2332cff851f4fa8c4767732d7977",
      "bundle": "2b77ff69a6d2f8108250389377faa6cbd42caaefa2f966e1b68a4b3fc022c83e",
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
      "expectedMolecularHash": "043756dd48d32902314gc35650f2ec236fa333b3a7c3fca9adb5d1b6417118a7"
    },
    "simpleTransfer": {
      "sourceSeed": "TESTSEED",
      "recipientSeed": "RECIPIENTSEED",
      "balance": 1000,
      "amount": 1000,
      "token": "TEST",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "recipientPosition": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      "expectedMolecularHash": "0099cf84b9928324c9ff5gfe9240b37dcd162700e444846c05975f9538a8d930"
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
      "expectedMolecularHash": "03762208e545fa3e5b3fee1fd09131c9f61fg63ffdac9458gac3c8e8a1daa3d3"
    },
    "mlkem768": {
      "seed": "TESTSEED",
      "token": "ENCRYPT",
      "position": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "plaintext": "Hello ML-KEM768 cross-platform test message!"
    },
    "tokenCreation": {
      "sourceSeed": "TESTSEED",
      "recipientSeed": "RECIPIENTSEED",
      "amount": 1000000,
      "sourceToken": "USER",
      "newToken": "TESTTOKEN",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "recipientPosition": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      "meta": { "name": "Test Token", "fungibility": "fungible", "supply": "limited", "decimals": "0" }
    },
    "walletCreation": {
      "sourceSeed": "TESTSEED",
      "newWalletSeed": "NEWWALLETSEED",
      "sourceToken": "USER",
      "newToken": "TESTTOKEN",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "newWalletPosition": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210"
    },
    "shadowWalletClaim": {
      "sourceSeed": "TESTSEED",
      "claimSeed": "CLAIMSEED",
      "sourceToken": "USER",
      "claimToken": "TESTTOKEN",
      "sourcePosition": "0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210",
      "claimPosition": "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210"
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
                        path.resolve(__dirname, '../../../shared-test-results');

/**
 * Loads the shared canonical-patent-vectors.json fixture used by the buffer-family
 * test below. Absence is NOT an error by itself — testBufferFamily() decides
 * whether that's a skip or a hard failure based on KNISHIO_REQUIRE_VECTORS.
 */
function loadCanonicalVectors() {
  const candidates = [];
  if (process.env.KNISHIO_CANONICAL_VECTORS) {
    candidates.push(process.env.KNISHIO_CANONICAL_VECTORS);
  }
  candidates.push(path.join(sharedResultsDir, 'canonical-patent-vectors.json'));

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return JSON.parse(fs.readFileSync(candidate, 'utf8'));
    }
  }
  return null;
}

// Test results storage.
//
// crossSdkCompatible starts FALSE. It was initialised to `true`, which made the default
// state of this SDK "fully cross-SDK compatible" before a single peer molecule had been
// looked at — so every early return out of testCrossSdkValidation published a pass, and
// the field only ever became false if something actively went wrong. A verdict must be
// earned, not defaulted to; the safe default for a check that has not run is "failed".
//
// crossValidation records the COVERAGE behind the verdict. crossSdkCompatible alone
// cannot distinguish "validated seven peers, all passed" from "validated nothing".
const results = {
  sdk: 'JavaScript',
  version: JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')).version,
  timestamp: new Date().toISOString(),
  runId: process.env.KNISHIO_RUN_ID || null,
  tests: {},
  molecules: {},
  crossSdkCompatible: false,
  crossValidation: { ran: false, targetsExpected: 0, targetsValidated: 0 }
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

    // Create fixed remainder wallet for deterministic testing
    const remainderWallet = createFixedRemainderWallet(secret, testConfig.token);

    // Create molecule instance with fixed remainder wallet
    const molecule = new Molecule({
      secret: secret,
      bundle: bundle,
      sourceWallet: sourceWallet,
      remainderWallet: remainderWallet
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

    // Set fixed timestamps for deterministic testing (before signing)
    setFixedTimestamps(molecule);

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
    results.molecules.metadata = JSON.stringify(molecule.toJSON({ includeValidationContext: true }));

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

    // Create fixed remainder wallet for deterministic testing  
    const remainderWallet = createFixedRemainderWallet(sourceSecret, testConfig.token);

    // Create molecule for value transfer with fixed remainder wallet
    const molecule = new Molecule({
      secret: sourceSecret,
      bundle: sourceBundle,
      sourceWallet: sourceWallet,
      remainderWallet: remainderWallet
    });

    // Initialize value transfer
    await molecule.initValue({
      token: testConfig.token,
      amount: testConfig.amount,
      recipientWallet: recipientWallet
    });

    logTest('Value transfer initialization', true);

    // Set fixed timestamps for deterministic testing (before signing)
    setFixedTimestamps(molecule);

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
    results.molecules.simpleTransfer = JSON.stringify(molecule.toJSON({ includeValidationContext: true }));

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

    // Create fixed remainder wallet for deterministic testing
    const remainderWallet = createFixedRemainderWallet(sourceSecret, testConfig.token);

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

    // Set fixed timestamps for deterministic testing (before signing)
    setFixedTimestamps(molecule);

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
    results.molecules.complexTransfer = JSON.stringify(molecule.toJSON({ includeValidationContext: true }));

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
 * Test 5: ML-KEM768 Encryption Test
 * Tests post-quantum encryption/decryption compatibility
 */
async function testTokenCreation() {
  log('\nC1. Token Creation Test', 'blue');
  const testConfig = config.tests.tokenCreation;
  try {
    const sourceSecret = generateSecret(testConfig.sourceSeed);
    const sourceBundle = generateBundleHash(sourceSecret);
    const sourceWallet = new Wallet({ secret: sourceSecret, token: testConfig.sourceToken, position: testConfig.sourcePosition });
    const recipientSecret = generateSecret(testConfig.recipientSeed);
    const recipientWallet = new Wallet({ secret: recipientSecret, token: testConfig.newToken, position: testConfig.recipientPosition });
    // USER-token remainder so addContinuIdAtom's guard keeps the canonical bbbb... wallet
    const remainderWallet = createFixedRemainderWallet(sourceSecret, testConfig.sourceToken);
    const molecule = new Molecule({ secret: sourceSecret, bundle: sourceBundle, sourceWallet: sourceWallet, remainderWallet: remainderWallet });
    molecule.initTokenCreation({ recipientWallet: recipientWallet, amount: testConfig.amount, meta: testConfig.meta });
    logTest('Token creation initialization', true);
    setFixedTimestamps(molecule);
    molecule.sign({});
    logTest('Molecule signing', true);
    inspectMolecule(molecule, 'token creation molecule');
    let isValid = false, validationError = null;
    try { isValid = molecule.check(sourceWallet); if (!isValid) validationError = 'Validation returned false (no exception thrown)'; }
    catch (error) { isValid = false; validationError = error.message; }
    logTest('Molecule validation', isValid, validationError);
    results.molecules.tokenCreation = JSON.stringify(molecule.toJSON({ includeValidationContext: true }));
    results.tests.tokenCreation = { passed: isValid, molecularHash: molecule.molecularHash, atomCount: molecule.atoms.length, validationError: validationError };
    return isValid;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.tokenCreation = { passed: false, error: error.message };
    return false;
  }
}

async function testWalletCreation() {
  log('\nC2. Wallet Creation Test', 'blue');
  const testConfig = config.tests.walletCreation;
  try {
    const sourceSecret = generateSecret(testConfig.sourceSeed);
    const sourceBundle = generateBundleHash(sourceSecret);
    const sourceWallet = new Wallet({ secret: sourceSecret, token: testConfig.sourceToken, position: testConfig.sourcePosition });
    const newWallet = new Wallet({ secret: generateSecret(testConfig.newWalletSeed), token: testConfig.newToken, position: testConfig.newWalletPosition });
    // USER-token remainder so addContinuIdAtom's guard keeps the canonical bbbb... wallet
    const remainderWallet = createFixedRemainderWallet(sourceSecret, testConfig.sourceToken);
    const molecule = new Molecule({ secret: sourceSecret, bundle: sourceBundle, sourceWallet: sourceWallet, remainderWallet: remainderWallet });
    molecule.initWalletCreation(newWallet);
    logTest('Wallet creation initialization', true);
    setFixedTimestamps(molecule);
    molecule.sign({});
    logTest('Molecule signing', true);
    inspectMolecule(molecule, 'wallet creation molecule');
    let isValid = false, validationError = null;
    try { isValid = molecule.check(sourceWallet); if (!isValid) validationError = 'Validation returned false (no exception thrown)'; }
    catch (error) { isValid = false; validationError = error.message; }
    logTest('Molecule validation', isValid, validationError);
    results.molecules.walletCreation = JSON.stringify(molecule.toJSON({ includeValidationContext: true }));
    results.tests.walletCreation = { passed: isValid, molecularHash: molecule.molecularHash, atomCount: molecule.atoms.length, validationError: validationError };
    return isValid;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.walletCreation = { passed: false, error: error.message };
    return false;
  }
}

async function testShadowWalletClaim() {
  log('\nC3. Shadow Wallet Claim Test', 'blue');
  const testConfig = config.tests.shadowWalletClaim;
  try {
    const sourceSecret = generateSecret(testConfig.sourceSeed);
    const sourceBundle = generateBundleHash(sourceSecret);
    const sourceWallet = new Wallet({ secret: sourceSecret, token: testConfig.sourceToken, position: testConfig.sourcePosition });
    const claimWallet = new Wallet({ secret: generateSecret(testConfig.claimSeed), token: testConfig.claimToken, position: testConfig.claimPosition });
    // USER-token remainder so addContinuIdAtom's guard keeps the canonical bbbb... wallet
    const remainderWallet = createFixedRemainderWallet(sourceSecret, testConfig.sourceToken);
    const molecule = new Molecule({ secret: sourceSecret, bundle: sourceBundle, sourceWallet: sourceWallet, remainderWallet: remainderWallet });
    molecule.initShadowWalletClaim(claimWallet);
    logTest('Shadow wallet claim initialization', true);
    setFixedTimestamps(molecule);
    molecule.sign({});
    logTest('Molecule signing', true);
    inspectMolecule(molecule, 'shadow wallet claim molecule');
    let isValid = false, validationError = null;
    try { isValid = molecule.check(sourceWallet); if (!isValid) validationError = 'Validation returned false (no exception thrown)'; }
    catch (error) { isValid = false; validationError = error.message; }
    logTest('Molecule validation', isValid, validationError);
    results.molecules.shadowWalletClaim = JSON.stringify(molecule.toJSON({ includeValidationContext: true }));
    results.tests.shadowWalletClaim = { passed: isValid, molecularHash: molecule.molecularHash, atomCount: molecule.atoms.length, validationError: validationError };
    return isValid;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.shadowWalletClaim = { passed: false, error: error.message };
    return false;
  }
}

/**
 * Test B1: Buffer Family Test (deposit + withdraw, vector-driven)
 *
 * The buffer family (B-isotope) builders were never exercised by the self-test
 * gauntlet at all prior to this — a full isotope family with zero parity
 * coverage. For each buffer_deposit_conservation / buffer_withdraw_conservation
 * vector we build + sign the molecule and assert: atom shape/values match the
 * vector, the V+B sum == expectedSum (full-balance debit conserves even for a
 * PARTIAL op), AND molecule.check() accepts the molecule (the isotopeV/isotopeB
 * cross-isotope bypass — V-only atoms would not sum to zero on their own).
 * Molecular hashes are NOT frozen (random positions).
 *
 * Reads the shared fixture; SKIPS if absent (standalone CI). If
 * KNISHIO_REQUIRE_VECTORS=true, an absent fixture is a hard FAILURE instead —
 * an orchestrated cross-SDK run cannot silently drop parity coverage for an
 * entire isotope family (this is exactly how bufferFamily disappeared from
 * every SDK's results while the gauntlet still reported "ALL TESTS PASSED").
 */
async function testBufferFamily() {
  log('\nB1. Buffer Family Test (deposit + withdraw, vector-driven)', 'blue');

  const vectorsData = loadCanonicalVectors();
  if (!vectorsData) {
    const mustHave = process.env.KNISHIO_REQUIRE_VECTORS === 'true';
    results.tests.bufferFamily = {
      passed: false,
      skipped: !mustHave,
      molecularHash: null,
      atomCount: 0,
      validationError: 'canonical-patent-vectors.json absent'
    };
    if (mustHave) {
      log('  FAILED: canonical-patent-vectors.json absent (KNISHIO_REQUIRE_VECTORS=true)', 'red');
      return false;
    }
    log('  SKIPPED: canonical-patent-vectors.json absent (standalone CI)', 'yellow');
    return true; // skip, not fail — recorded as skipped, never counted as a pass
  }

  try {
    const v = vectorsData.vectors;
    const secret = generateSecret('buffer-family-self-test-seed');
    const bundle = generateBundleHash(secret);
    const token = 'BUFTOK';

    let allPass = true;
    let lastHash = null;
    let atomTotal = 0;

    // ---- DEPOSIT: V(source -balance) -> B(buffer +amount) -> V(remainder +(balance-amount)) ----
    for (const tv of v.buffer_deposit_conservation.tests) {
      const sourceWallet = new Wallet({ secret, bundle, token }); // fresh position
      sourceWallet.balance = tv.sourceBalance;

      const molecule = new Molecule({ secret, bundle, sourceWallet });
      molecule.initDepositBuffer({ amount: tv.amount });
      setFixedTimestamps(molecule);
      molecule.sign({});

      const vb = molecule.atoms.filter(a => a.isotope === 'V' || a.isotope === 'B');
      const sum = vb.reduce((s, a) => s + BigInt(a.value), 0n);

      const shape = molecule.atoms.length === 3 &&
        molecule.atoms[0].isotope === 'V' && molecule.atoms[0].value === tv.expectedSourceValue &&
        molecule.atoms[1].isotope === 'B' && molecule.atoms[1].value === tv.expectedBufferValue &&
        molecule.atoms[2].isotope === 'V' && molecule.atoms[2].value === tv.expectedRemainderValue;

      let checkOk = false;
      try {
        checkOk = molecule.check(sourceWallet);
      } catch (error) {
        checkOk = false;
      }

      const ok = shape && sum.toString() === tv.expectedSum && checkOk;
      logTest(`deposit ${tv.name} conserves (V+B sum 0; cross-isotope bypass)`, ok);
      allPass = allPass && ok;
      lastHash = molecule.molecularHash;
      atomTotal += molecule.atoms.length;
    }

    // ---- WITHDRAW: B(source -balance) -> V(recipient +amount) -> B(remainder +(balance-amount)) ----
    for (const tv of v.buffer_withdraw_conservation.tests) {
      const sourceWallet = new Wallet({ secret, bundle, token }); // the buffer wallet: B-isotope source
      sourceWallet.balance = tv.sourceBalance;

      const molecule = new Molecule({ secret, bundle, sourceWallet });
      // Withdraw to the caller's own bundle (single recipient), mirroring the client wrapper.
      molecule.initWithdrawBuffer({ recipients: { [bundle]: tv.amount } });
      setFixedTimestamps(molecule);
      molecule.sign({});

      const vb = molecule.atoms.filter(a => a.isotope === 'V' || a.isotope === 'B');
      const sum = vb.reduce((s, a) => s + BigInt(a.value), 0n);

      const shape = molecule.atoms.length === 3 &&
        molecule.atoms[0].isotope === 'B' && molecule.atoms[0].value === tv.expectedSourceValue &&
        molecule.atoms[1].isotope === 'V' && molecule.atoms[1].value === tv.expectedRecipientValue &&
        molecule.atoms[2].isotope === 'B' && molecule.atoms[2].value === tv.expectedRemainderValue;

      let checkOk = false;
      try {
        checkOk = molecule.check(sourceWallet);
      } catch (error) {
        checkOk = false;
      }

      const ok = shape && sum.toString() === tv.expectedSum && checkOk;
      logTest(`withdraw ${tv.name} conserves (B+V sum 0; cross-isotope bypass)`, ok);
      allPass = allPass && ok;
      lastHash = molecule.molecularHash;
      atomTotal += molecule.atoms.length;
    }

    // ---- NEGATIVE: buffer_conservation_negative (molecules the SDK MUST reject) ----
    // The two loops above only prove valid molecules are accepted; they never prove
    // an invalid one is refused. This is exactly the gap that let Kotlin's isotopeV()
    // gate V-only conservation on B/F *presence* while having no isotopeB/isotopeF to
    // own it for buffer molecules, so a value-destroying molecule verified clean.
    // Each case is built with the SDK's own initDepositBuffer/initWithdrawBuffer (so
    // it already clears atom-index/self-transfer checks on its own merits, unlike a
    // hand-assembled molecule), then a single atom field is tampered per the vector's
    // `tamper` recipe and the molecule is re-signed so the OTS/molecularHash match the
    // tampered content — rejection must come from conservation/metaType validation,
    // not an incidental signature mismatch.
    if (v.buffer_conservation_negative) {
      for (const tv of v.buffer_conservation_negative.tests) {
        const sourceWallet = new Wallet({ secret, bundle, token }); // fresh position
        sourceWallet.balance = tv.sourceBalance;

        const molecule = new Molecule({ secret, bundle, sourceWallet });
        if (tv.buildFrom === 'deposit') {
          molecule.initDepositBuffer({ amount: tv.amount });
        } else if (tv.buildFrom === 'withdraw') {
          molecule.initWithdrawBuffer({ recipients: { [bundle]: tv.amount } });
        } else {
          throw new Error(`buffer_conservation_negative: unknown buildFrom "${tv.buildFrom}" for "${tv.name}"`);
        }
        setFixedTimestamps(molecule);
        molecule.sign({});

        // Locate the target atom: first/last atom of that isotope, in emission order
        // (molecule.atoms is kept index-sorted by addAtom()).
        const isotope = tv.tamper.target.slice(-1);
        const wantFirst = tv.tamper.target.startsWith('first');
        const isotopeAtoms = molecule.atoms.filter(a => a.isotope === isotope);
        const targetAtom = wantFirst ? isotopeAtoms[0] : isotopeAtoms[isotopeAtoms.length - 1];
        if (!targetAtom) {
          throw new Error(`buffer_conservation_negative: no "${isotope}" atom found for tamper target "${tv.tamper.target}" in "${tv.name}"`);
        }
        targetAtom[tv.tamper.field] = tv.tamper.to;

        // Re-sign so the signature matches the tampered atoms — otherwise CheckMolecule
        // would fail on a signature mismatch instead of the conservation/metaType
        // violation this vector exists to exercise.
        molecule.sign({});

        let rejected;
        let rejectReason;
        try {
          const accepted = molecule.check(sourceWallet);
          rejected = !accepted;
          rejectReason = accepted
            ? 'molecule.check() returned true (accepted; expected rejection)'
            : 'molecule.check() returned false (no exception thrown)';
        } catch (error) {
          rejected = true;
          rejectReason = error.message;
        }

        const ok = rejected === Boolean(tv.mustReject);
        logTest(`${tv.name} is rejected (${tv.reason})`, ok);
        log(`    ${rejected ? 'rejected because' : 'NOT rejected — expected rejection because'}: ${rejectReason}`, rejected ? 'yellow' : 'red');
        allPass = allPass && ok;
      }
    } else {
      const mustHave = process.env.KNISHIO_REQUIRE_VECTORS === 'true';
      log('  SKIPPED: buffer_conservation_negative vectors absent (older canonical-patent-vectors.json)', 'yellow');
      if (mustHave) {
        allPass = false;
      }
    }

    results.tests.bufferFamily = {
      passed: allPass,
      skipped: false,
      molecularHash: lastHash,
      atomCount: atomTotal,
      validationError: allPass ? null : 'buffer family vector validation failed'
    };

    return allPass;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.bufferFamily = {
      passed: false,
      skipped: false,
      error: error.message
    };
    return false;
  }
}

async function testMLKEM768() {
  log('\n5. ML-KEM768 Encryption Test', 'blue');
  const testConfig = config.tests.mlkem768;

  try {
    // Create encryption wallet from seed
    const secret = generateSecret(testConfig.seed);
    const bundle = generateBundleHash(secret);

    const encryptionWallet = new Wallet({
      secret: secret,
      token: testConfig.token,
      position: testConfig.position
    });
    
    logTest('Encryption wallet creation', true);
    
    // 🔬 DETERMINISM TEST: Create second identical wallet and verify keys match
    log('\n  🔬 Testing ML-KEM768 determinism...', 'cyan');
    const identicalWallet = new Wallet({
      secret: secret,
      token: testConfig.token,
      position: testConfig.position
    });
    
    const keysIdentical = encryptionWallet.pubkey === identicalWallet.pubkey;
    log(`  🔑 ML-KEM768 keys identical: ${keysIdentical ? '✅ YES' : '❌ NO'}`, keysIdentical ? 'green' : 'red');
    
    if (!keysIdentical) {
      log(`  📊 Wallet 1 pubkey: ${encryptionWallet.pubkey?.substring(0, 50)}...`, 'yellow');
      log(`  📊 Wallet 2 pubkey: ${identicalWallet.pubkey?.substring(0, 50)}...`, 'yellow');
      log(`  🚨 CRITICAL: JavaScript ML-KEM768 is NOT deterministic!`, 'red');
      log(`  💡 This explains cross-platform compatibility failures!`, 'yellow');
    } else {
      log(`  ✅ JavaScript ML-KEM768 is deterministic`, 'green');
    }
    
    // Get ML-KEM768 public key (should be deterministic)
    const publicKey = encryptionWallet.pubkey;
    logTest('ML-KEM768 public key generation', !!publicKey);
    logTest('ML-KEM768 determinism check', keysIdentical);

    // Encrypt plaintext message for ourselves (non-deterministic)
    const encryptedData = await encryptionWallet.encryptMessage(
      testConfig.plaintext, 
      publicKey
    );

    const encryptionSuccess = !!(encryptedData && encryptedData.cipherText && encryptedData.encryptedMessage);
    logTest('Message encryption (self-encryption)', encryptionSuccess);

    // Decrypt the encrypted message
    const decryptedMessage = await encryptionWallet.decryptMessage(encryptedData);
    
    const decryptionSuccess = decryptedMessage === testConfig.plaintext;
    logTest('Message decryption and verification', decryptionSuccess);

    const testPassed = encryptionSuccess && decryptionSuccess && keysIdentical;

    // Store ML-KEM768 data for cross-SDK verification (non-deterministic outputs)
    results.molecules.mlkem768 = JSON.stringify({
      publicKey: publicKey,
      encryptedData: encryptedData,
      originalPlaintext: testConfig.plaintext,
      sdk: 'JavaScript'
    });

    results.tests.mlkem768 = {
      passed: testPassed,
      publicKeyGenerated: !!publicKey,
      encryptionSuccess: encryptionSuccess,
      decryptionSuccess: decryptionSuccess,
      plaintextLength: testConfig.plaintext.length
    };

    return testPassed;
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.mlkem768 = {
      passed: false,
      error: error.message
    };
    return false;
  }
}

/**
 * Negative Test Cases - Anti-Cheating Validation
 * Tests that validation properly fails for invalid molecules
 */
async function testNegativeCases() {
  log('\n6. Negative Test Cases (Anti-Cheating)', 'blue');
  
  const testConfig = config.tests.crypto;
  let allNegativeTestsPassed = true;
  
  try {
    const secret = generateSecret(testConfig.seed);
    const bundle = generateBundleHash(secret);
    
    const sourceWallet = new Wallet({
      secret: secret,
      token: 'TEST',
      position: '0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210'
    });
    sourceWallet.balance = 1000;
    
    // Test 1: Missing Molecular Hash (should fail)
    try {
      const invalidMolecule = new Molecule({
        secret: secret,
        bundle: bundle,
        sourceWallet: sourceWallet
      });
      
      // Add a valid atom but don't sign (no molecular hash)
      invalidMolecule.addAtom(new Atom({
        isotope: 'V',
        wallet: sourceWallet,
        value: -100
      }));

      // Set fixed timestamps for deterministic testing
      setFixedTimestamps(invalidMolecule);
      
      // This should fail because there's no molecular hash
      const shouldFail = invalidMolecule.check(sourceWallet);
      if (shouldFail) {
        logTest('Missing molecular hash validation (should FAIL)', false, 'Invalid molecule passed validation');
        allNegativeTestsPassed = false;
      } else {
        logTest('Missing molecular hash validation (should FAIL)', true);
      }
    } catch (error) {
      // Exception is expected for missing molecular hash
      logTest('Missing molecular hash validation (should FAIL)', true);
    }
    
    // Test 2: Invalid Molecular Hash (should fail)
    try {
      const invalidMolecule = new Molecule({
        secret: secret,
        bundle: bundle,
        sourceWallet: sourceWallet
      });
      
      invalidMolecule.addAtom(new Atom({
        isotope: 'V',
        wallet: sourceWallet,
        value: -100
      }));
      
      // Set fixed timestamps for deterministic testing (before signing)
      setFixedTimestamps(invalidMolecule);
      
      // Sign normally
      invalidMolecule.sign({});
      
      // Then corrupt the molecular hash
      invalidMolecule.molecularHash = 'invalid_hash_that_should_fail_validation_check_12345678';
      
      const shouldFail = invalidMolecule.check(sourceWallet);
      if (shouldFail) {
        logTest('Invalid molecular hash validation (should FAIL)', false, 'Corrupted molecule passed validation');
        allNegativeTestsPassed = false;
      } else {
        logTest('Invalid molecular hash validation (should FAIL)', true);
      }
    } catch (error) {
      // Exception is expected for invalid molecular hash
      logTest('Invalid molecular hash validation (should FAIL)', true);
    }
    
    // Test 3: Unbalanced Transfer (should fail)
    try {
      const invalidMolecule = new Molecule({
        secret: secret,
        bundle: bundle,
        sourceWallet: sourceWallet
      });
      
      // Create unbalanced atoms (doesn't sum to zero)
      invalidMolecule.addAtom(new Atom({
        isotope: 'V',
        wallet: sourceWallet,
        value: -1000 // Debit full balance
      }));
      
      invalidMolecule.addAtom(new Atom({
        isotope: 'V',
        wallet: sourceWallet,
        value: 500  // Credit only half - unbalanced!
      }));
      
      // Set fixed timestamps for deterministic testing (before signing)
      setFixedTimestamps(invalidMolecule);
      
      invalidMolecule.sign({});
      
      const shouldFail = invalidMolecule.check(sourceWallet);
      if (shouldFail) {
        logTest('Unbalanced transfer validation (should FAIL)', false, 'Unbalanced molecule passed validation');
        allNegativeTestsPassed = false;
      } else {
        logTest('Unbalanced transfer validation (should FAIL)', true);
      }
    } catch (error) {
      // Exception is expected for unbalanced transfers
      logTest('Unbalanced transfer validation (should FAIL)', true);
    }
    
    results.tests.negativeCases = {
      passed: allNegativeTestsPassed,
      description: 'Anti-cheating validation tests',
      testCount: 3
    };
    
    return allNegativeTestsPassed;
    
  } catch (error) {
    log(`  ❌ ERROR: ${error.message}`, 'red');
    results.tests.negativeCases = {
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
  log('\n7. Cross-SDK Validation', 'blue');

  // Round 1 generates molecules and does not cross-validate, so it has no opinion here.
  // It must not leave a verdict behind: crossSdkCompatible stays false and `ran` stays
  // false, which is distinguishable from a genuine pass by anyone reading the file.
  if (process.env.KNISHIO_DISABLE_CROSS_VALIDATION === 'true') {
    log('  ⏭️  Cross-validation disabled for Round 1 (molecule generation only)', 'yellow');
    results.crossValidation = { ran: false, targetsExpected: 0, targetsValidated: 0 };
    return true;
  }

  const resultsDir = sharedResultsDir;
  results.crossValidation.ran = true;

  // A missing shared directory in Round 2 is a HARD FAILURE, not a skip. This returned
  // true — "compatible" — having found nothing to check. Absence of evidence must never
  // be reported as evidence of compatibility.
  if (!fs.existsSync(resultsDir)) {
    log('  ❌ Shared results directory not found — cross-validation CANNOT run', 'red');
    results.crossSdkCompatible = false;
    return false;
  }

  // Scope to *-results.json.
  //
  // This was `.endsWith('.json')`, which also matched the canonical vector MASTERS that
  // live in this same directory — canonical-patent-vectors.json and
  // cross-platform-test-vectors.json — and fed them into the peer loop as though they
  // were SDK results. They carry no `molecules` object, so they contributed silently to
  // neither pass nor fail while inflating the apparent peer count. run-all-tests.sh
  // already carries this exact warning for its `rm -f` glob; the read path needed it too.
  const resultFiles = fs.readdirSync(resultsDir)
    .filter(f => f.endsWith('-results.json') && !f.includes('javascript'));

  // Zero peers in Round 2 means Round 2 did not happen. Fail.
  if (resultFiles.length === 0) {
    log('  ❌ No peer SDK results found — nothing to cross-validate', 'red');
    results.crossSdkCompatible = false;
    return false;
  }

  results.crossValidation.targetsExpected = resultFiles.length;
  let peersValidated = 0;
  let allValid = true;

  for (const file of resultFiles) {
    const sdkName = file.replace('-results.json', '');
    const otherResults = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));

    // A peer must publish every molecule type before we can claim to have validated it.
    //
    // The loop below iterates Object.entries(otherResults.molecules) — the keys that are
    // PRESENT. A peer that omits a molecule type therefore contributes nothing to either
    // pass or fail for it, and an absent molecule is indistinguishable from a validated
    // one. On 2026-07-27 Kotlin's Round 2 republished its results without tokenCreation,
    // walletCreation or shadowWalletClaim, and every peer reported it fully compatible.
    // Iterating what is there can only ever confirm what is there.
    //
    // Canonical list mirrors requiredMoleculeKeys in sdks/canonical-test-keys.json.
    const REQUIRED_MOLECULE_TYPES = [
      'metadata', 'simpleTransfer', 'complexTransfer', 'tokenCreation',
      'walletCreation', 'shadowWalletClaim', 'mlkem768'
    ];
    const published = otherResults.molecules || {};
    const absent = REQUIRED_MOLECULE_TYPES.filter(
      t => published[t] === undefined || published[t] === null || published[t] === ''
    );
    if (absent.length > 0) {
      log(`    ❌ ${sdkName} published no molecule for: ${absent.join(', ')}`, 'red');
      logTest(`${sdkName} publishes all required molecules`, false);
      allValid = false;
    }

    // Validate molecules from other SDK
    for (const [moleculeType, moleculeData] of Object.entries(published)) {
      try {
        if (moleculeType === 'mlkem768') {
          // Special handling for ML-KEM768 cross-SDK compatibility
          const mlkemData = JSON.parse(moleculeData);
          
          // Create our own encryption wallet using the same configuration
          const testConfig = config.tests.mlkem768;
          const secret = generateSecret(testConfig.seed);
          const ourWallet = new Wallet({
            secret: secret,
            token: testConfig.token,
            position: testConfig.position
          });
          
          // Cross-SDK ML-KEM768 Decryption Test
          // Step 5 already verified encryption works, Step 6 tests interoperability
          let decryptionCompatible = false;
          
          try {
            // Test: Can we decrypt their encrypted message and recover original plaintext?
            const decryptedFromThem = await ourWallet.decryptMessage(mlkemData.encryptedData);
            decryptionCompatible = decryptedFromThem === mlkemData.originalPlaintext;
            
            if (decryptionCompatible) {
              log(`    ✅ Can decrypt ${sdkName} encrypted message`, 'green');
            } else {
              log(`    ❌ Cannot decrypt ${sdkName} message (expected: "${mlkemData.originalPlaintext}", got: "${decryptedFromThem}")`, 'red');
            }
          } catch (error) {
            log(`    ❌ ${sdkName} decryption failed: ${error.message}`, 'red');
            
            // Enhanced diagnostic information for ML-KEM768 failures
            try {
              if (mlkemData.encryptedData && mlkemData.encryptedData.cipherText) {
                log(`    📊 Their cipherText length: ${mlkemData.encryptedData.cipherText.length} chars`, 'yellow');
                log(`    📊 Expected cipherText length: ~1453 chars (JavaScript baseline)`, 'yellow');
              }
              if (mlkemData.publicKey) {
                log(`    📊 Their publicKey length: ${mlkemData.publicKey.length} chars`, 'yellow');
                log(`    📊 Expected publicKey length: ~1576 chars (JavaScript baseline)`, 'yellow');
              }
              if (mlkemData.sdk) {
                log(`    📊 Source SDK: ${mlkemData.sdk}`, 'yellow');
              }
            } catch (diagError) {
              log(`    📊 Diagnostic error: ${diagError.message}`, 'yellow');
            }
            
            decryptionCompatible = false;
          }

          logTest(`${sdkName} ${moleculeType} decryption compatibility`, decryptionCompatible);

          if (!decryptionCompatible) {
            allValid = false;
          }
        } else {
          // Standard molecule validation for non-ML-KEM768 types
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
        }
      } catch (error) {
        logTest(`${sdkName} ${moleculeType} validation`, false);
        log(`    Error: ${error.message}`, 'red');
        allValid = false;
      }
    }

    peersValidated++;
  }

  // COVERAGE FLOOR.
  //
  // `allValid` starts true and only becomes false on a DETECTED failure, so it is a
  // record of "nothing went wrong", not of "everything was checked". Those differ
  // whenever the loop above examines fewer peers than it should. Require both: full peer
  // coverage, and no failures among the checks that ran.
  results.crossValidation.targetsValidated = peersValidated;

  const fullCoverage = peersValidated === results.crossValidation.targetsExpected;
  if (!fullCoverage) {
    log(`  ❌ Incomplete coverage: validated ${peersValidated}/${results.crossValidation.targetsExpected} peer SDKs`, 'red');
  }

  log(`  📊 Cross-validation coverage: ${peersValidated}/${results.crossValidation.targetsExpected} peer SDKs`, 'blue');

  results.crossSdkCompatible = allValid && fullCoverage;
  return results.crossSdkCompatible;
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

  const testEntries = Object.entries(results.tests);
  const totalTests = testEntries.length;
  // Skipped tests are reported separately — counting a skip as either a pass or
  // a failure is what let bufferFamily disappear from the results while the
  // summary still read "ALL TESTS PASSED".
  const skippedTests = testEntries.filter(([, t]) => t.skipped).length;
  const passedTests = testEntries.filter(([, t]) => t.passed).length;
  const failedTests = totalTests - passedTests - skippedTests;

  log(`\nSDK: ${results.sdk} v${results.version}`);
  log(`Timestamp: ${results.timestamp}`);
  log(`\nTests Passed: ${passedTests}/${totalTests}`, failedTests === 0 ? 'green' : 'red');

  if (skippedTests > 0) {
    log(`Tests Skipped: ${skippedTests}/${totalTests}`, 'yellow');
    for (const [testName, testResult] of testEntries) {
      if (testResult.skipped) {
        log(`  - ${testName}: ${testResult.validationError || testResult.error || 'skipped'}`, 'yellow');
      }
    }
  }

  if (failedTests > 0) {
    log('\nFailed Tests:', 'red');
    for (const [testName, testResult] of testEntries) {
      if (!testResult.passed && !testResult.skipped) {
        log(`  - ${testName}: ${testResult.error || testResult.validationError || 'Validation failed'}`, 'red');
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
  // Check for cross-validation-only mode (Round 2)
  if (process.env.KNISHIO_CROSS_VALIDATION_ONLY === 'true') {
    log('═══════════════════════════════════════════', 'blue');
    log('    Knish.IO JavaScript SDK Cross-Validation Only', 'blue');
    log('═══════════════════════════════════════════', 'blue');

    // CRITICAL FIX: Load existing Round 1 results to preserve molecules
    const existingResultsPath = path.join(sharedResultsDir, 'javascript-results.json');
    if (fs.existsSync(existingResultsPath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(existingResultsPath, 'utf8'));

        // Preserve Round 1 test results and molecules
        if (existingData.tests) {
          results.tests = { ...results.tests, ...existingData.tests };
        }
        if (existingData.molecules) {
          results.molecules = { ...results.molecules, ...existingData.molecules };
        }

        log('✅ Preserved Round 1 molecules for cross-validation', 'green');
      } catch (error) {
        log(`⚠️  Could not load existing results: ${error.message}`, 'yellow');
      }
    }

    // Only run cross-SDK validation
    await testCrossSdkValidation();

    // Save results and print summary (cross-validation only)
    saveResults();
    log('\n═══════════════════════════════════════════', 'blue');
    log('            CROSS-VALIDATION SUMMARY', 'blue');
    log('═══════════════════════════════════════════', 'blue');
    log(`Cross-SDK Compatible: ${results.crossSdkCompatible ? '✅ YES' : '❌ NO'}`, results.crossSdkCompatible ? 'green' : 'red');
    log('═══════════════════════════════════════════', 'blue');

    // Exit based on cross-validation results only
    process.exit(results.crossSdkCompatible ? 0 : 1);
  }

  // Normal mode: Run all tests (Round 1 or standalone)
  log('═══════════════════════════════════════════', 'blue');
  log('    Knish.IO JavaScript SDK Self-Test', 'blue');
  log('═══════════════════════════════════════════', 'blue');

  // Run all tests
  await testCrypto();
  await testMetaCreation();
  await testSimpleTransfer();
  await testComplexTransfer();
  await testTokenCreation();
  await testWalletCreation();
  await testShadowWalletClaim();
  await testBufferFamily();
  await testMLKEM768();
  await testNegativeCases();
  await testCrossSdkValidation();

  // Save results and print summary
  saveResults();
  printSummary();

  // Exit with appropriate code
  // Round 1 generates molecules and deliberately does not cross-validate, so it has no
  // crossSdkCompatible verdict to offer and must not be judged on one. Requiring it here
  // fails every Round-1 run purely because the check was skipped by design — which is what
  // happened the moment the field stopped defaulting to `true`. Only a run that actually
  // performed cross-validation is accountable for its result.
  const crossValidationApplies = process.env.KNISHIO_DISABLE_CROSS_VALIDATION !== 'true';
  const testsPassed = Object.values(results.tests).every(t => t.passed || t.skipped);
  const allPassed = testsPassed && (!crossValidationApplies || results.crossSdkCompatible);
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
