#!/usr/bin/env node

/**
 * Pre-publish validation script
 * Run this before publishing to npm to ensure everything is ready
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REQUIRED_FILES = [
    'package.json',
    'README.md',
    'LICENSE',
    'src/index.js',
    '.npmignore'
];

const REQUIRED_PACKAGE_FIELDS = [
    'name',
    'version',
    'description',
    'main',
    'bin',
    'keywords',
    'author',
    'license',
    'repository'
];

console.log('🔍 Pre-publish validation for @skyfetch/cli\n');

let hasErrors = false;

// Check required files exist
console.log('📁 Checking required files...');
REQUIRED_FILES.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        hasErrors = true;
    }
});

// Check package.json fields
console.log('\n📦 Checking package.json fields...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

REQUIRED_PACKAGE_FIELDS.forEach(field => {
    if (packageJson[field]) {
        console.log(`  ✅ ${field}: ${typeof packageJson[field] === 'object' ? 'configured' : packageJson[field]}`);
    } else {
        console.log(`  ❌ ${field} - MISSING`);
        hasErrors = true;
    }
});

// Check version format
console.log('\n🔢 Checking version format...');
const versionRegex = /^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/;
if (versionRegex.test(packageJson.version)) {
    console.log(`  ✅ Version ${packageJson.version} is valid`);
} else {
    console.log(`  ❌ Version ${packageJson.version} is invalid (should be semver format)`);
    hasErrors = true;
}

// Check if repository URLs are updated
console.log('\n🔗 Checking repository URLs...');
if (packageJson.repository && packageJson.repository.url) {
    if (packageJson.repository.url.includes('yourusername')) {
        console.log('  ⚠️  Repository URL contains placeholder "yourusername" - update before publishing');
        hasErrors = true;
    } else {
        console.log(`  ✅ Repository URL: ${packageJson.repository.url}`);
    }
}

// Check if logged into npm
console.log('\n👤 Checking npm authentication...');
let isLoggedIn = false;
try {
    const npmUser = execSync('npm whoami', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    console.log(`  ✅ Logged in as: ${npmUser}`);
    isLoggedIn = true;
} catch (error) {
    console.log('  ⚠️  Not logged in to npm (required for actual publish)');
    console.log('  💡 Run: npm login');
}

// Check what will be published
console.log('\n📋 Files that will be published:');
try {
    const packOutput = execSync('npm pack --dry-run', { encoding: 'utf8' });
    const files = packOutput.split('\n').filter(line => line.trim());
    files.forEach(file => {
        if (file.trim()) console.log(`  📄 ${file}`);
    });
} catch (error) {
    console.log('  ⚠️  Could not determine package contents');
}

// Final summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ VALIDATION FAILED - Fix errors before publishing');
    console.log('\nNext steps:');
    console.log('  1. Fix the errors listed above');
    console.log('  2. Run this script again');
    console.log('  3. When all checks pass, run: npm publish --access public');
    process.exit(1);
} else {
    console.log('✅ ALL CHECKS PASSED - Ready to publish!');

    if (!isLoggedIn) {
        console.log('\n⚠️  Remember to login to npm before publishing:');
        console.log('  npm login');
    }

    console.log('\nTo publish, run:');
    console.log('  cd packages/cli');
    console.log('  npm publish --access public');
    console.log('\nOr for a dry run:');
    console.log('  npm publish --dry-run --access public');
    process.exit(0);
}
