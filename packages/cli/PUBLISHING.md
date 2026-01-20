# 📦 Publishing SkyFetch CLI to npm

This guide will walk you through publishing the `@skyfetch/cli` package to npm.

## Prerequisites

1. **npm Account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI**: Ensure you have npm installed (comes with Node.js)
3. **Organization (Optional)**: For scoped packages like `@skyfetch/cli`, you may need to create an npm organization

## Step-by-Step Publishing Guide

### 1. Login to npm

First, login to your npm account from the terminal:

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify you're logged in:

```bash
npm whoami
```

### 2. Create npm Organization (First Time Only)

If you're publishing a scoped package (`@skyfetch/cli`), you need an organization:

**Option A: Via npm CLI**
```bash
npm org create skyfetch
```

**Option B: Via npm Website**
1. Go to [npmjs.com](https://www.npmjs.com)
2. Click on your profile → "Add Organization"
3. Create organization named "skyfetch"

### 3. Update Package Metadata

Before publishing, update the following in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/skyfetch.git",
    "directory": "packages/cli"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/skyfetch/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/skyfetch#readme"
}
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 4. Test the Package Locally

Before publishing, test that everything works:

```bash
# Navigate to CLI package
cd packages/cli

# Install dependencies
npm install

# Test the CLI
node src/index.js --version

# Check what will be published
npm pack --dry-run
```

This will show you exactly what files will be included in the package.

### 5. Verify Package Contents

Check the files that will be published:

```bash
npm pack
```

This creates a `.tgz` file. Extract and inspect it:

```bash
tar -xzf skyfetch-cli-1.0.0.tgz
ls -la package/
```

Clean up after inspection:

```bash
rm -rf package/ skyfetch-cli-1.0.0.tgz
```

### 6. Publish to npm

**For Public Package (Free):**

```bash
# Navigate to CLI package directory
cd packages/cli

# Publish as public package
npm publish --access public
```

**For Private Package (Requires paid plan):**

```bash
npm publish
```

### 7. Verify Publication

Check that your package is live:

```bash
# Search for your package
npm search @skyfetch/cli

# View package info
npm info @skyfetch/cli

# Or visit in browser
# https://www.npmjs.com/package/@skyfetch/cli
```

### 8. Test Installation

Test installing your published package:

```bash
# In a different directory
mkdir test-install
cd test-install
npm install -g @skyfetch/cli

# Verify it works
skyfetch --version
```

## Publishing Updates

When you need to publish a new version:

### 1. Update Version

Use npm's built-in versioning:

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm version patch

# For new features (1.0.0 → 1.1.0)
npm version minor

# For breaking changes (1.0.0 → 2.0.0)
npm version major
```

Or manually update `version` in `package.json`.

### 2. Publish Update

```bash
npm publish --access public
```

## Version Management Best Practices

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Pre-release Versions

For beta/alpha releases:

```bash
# Create beta version (1.0.0-beta.0)
npm version prerelease --preid=beta

# Publish with beta tag
npm publish --tag beta --access public

# Users install with:
npm install @skyfetch/cli@beta
```

## Unpublishing (Use with Caution)

⚠️ **Warning**: Unpublishing can break projects that depend on your package!

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish @skyfetch/cli@1.0.0

# Unpublish entire package (within 72 hours, no dependents)
npm unpublish @skyfetch/cli --force
```

**Better Alternative**: Deprecate instead of unpublishing:

```bash
npm deprecate @skyfetch/cli@1.0.0 "This version has a critical bug, please upgrade to 1.0.1"
```

## Distribution Tags

Manage release channels:

```bash
# Publish to latest (default)
npm publish --access public

# Publish to next/beta channel
npm publish --tag next --access public

# Move latest tag to a specific version
npm dist-tag add @skyfetch/cli@1.0.1 latest

# List all tags
npm dist-tag ls @skyfetch/cli
```

## Automation with CI/CD

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: |
          cd packages/cli
          npm install
      
      - name: Publish to npm
        run: |
          cd packages/cli
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Setup:**
1. Create npm access token: `npm token create`
2. Add to GitHub Secrets as `NPM_TOKEN`
3. Create a GitHub release to trigger publish

## Troubleshooting

### Error: "You do not have permission to publish"

**Solution**: Make sure you're logged in and have access to the organization:

```bash
npm login
npm org ls skyfetch
```

### Error: "Package name too similar to existing package"

**Solution**: Choose a different package name or use a scope:
- Instead of `skyfetch-cli`, use `@yourname/skyfetch-cli`

### Error: "Version already exists"

**Solution**: Bump the version number:

```bash
npm version patch
npm publish --access public
```

### Error: "402 Payment Required"

**Solution**: Scoped packages are private by default. Publish as public:

```bash
npm publish --access public
```

## Post-Publication Checklist

- [ ] Verify package appears on npmjs.com
- [ ] Test installation: `npm install -g @skyfetch/cli`
- [ ] Test CLI commands work
- [ ] Update main README with installation instructions
- [ ] Create GitHub release with changelog
- [ ] Tweet/announce the release
- [ ] Update documentation website

## Useful Commands

```bash
# View package info
npm info @skyfetch/cli

# View all versions
npm view @skyfetch/cli versions

# View download stats
npm info @skyfetch/cli

# Check package size
npm pack --dry-run

# View package on npm
open https://www.npmjs.com/package/@skyfetch/cli
```

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Creating and Publishing Scoped Packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)

---

**Ready to publish?** Follow the steps above and your package will be live on npm! 🚀
