# Build & Distribution Guide

This guide explains how to build and distribute the extension now that `crxmake` is discontinued and we've migrated to Manifest V3.

## Quick Start

```bash
# Easiest: Build ZIP for Chrome Web Store
./build.sh zip

# Or use Makefile
make -f Makefile.new zip
```

## 📦 Distribution Options

### Option 1: Chrome Web Store (Recommended ⭐)

**Pros:**
- Users get automatic updates
- No security warnings
- Better discoverability
- Chrome's recommended approach for Manifest V3

**Cons:**
- One-time $5 developer fee
- Review process (usually 1-3 days)

**Steps:**
1. Build ZIP: `./build.sh zip`
2. Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Click "New Item" (or update existing)
4. Upload `dist/basketball-reference-Yahoo-chilenos2-v2.0.0.zip`
5. Fill in store listing details
6. Submit for review

### Option 2: Developer Mode (Free, for testing)

**Pros:**
- Free
- Immediate deployment
- Good for development

**Cons:**
- Manual updates
- Warning banner in Chrome
- Must enable Developer Mode

**Steps:**
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the extension directory
5. Extension is now installed

### Option 3: CRX File (Not Recommended)

**Pros:**
- Self-hosted distribution

**Cons:**
- Chrome blocks installations (enterprise policy required)
- No automatic updates
- Security warnings

**Only use if:**
- Enterprise deployment with policy
- Firefox distribution (use web-ext instead)

## 🔧 Build Tools Comparison

### Old: crxmake (Discontinued)
```bash
# OLD - Don't use
gem install crxmake
crxmake --pack-extension-key=key.pem --mode crx --pack-extension=.
```

### New: Multiple Options

#### A. Simple ZIP (Recommended)
```bash
./build.sh zip

# Or manually
zip -r extension.zip manifest.json baller.js chilenos2.png LICENSE README.md
```

#### B. web-ext (Mozilla tool)
```bash
# Install
npm install -g web-ext

# Build
web-ext build

# Test in Chrome
web-ext run -t chromium --chromium-binary=/usr/bin/google-chrome

# Lint
web-ext lint
```

#### C. crx3 (Modern CRX builder)
```bash
# Install
npm install -g crx3

# Build
./build.sh crx

# Or manually
crx3 --zip extension.zip --out extension.crx --key key.pem
```

## 🛠️ Available Build Scripts

### 1. build.sh (Simple Bash Script)

```bash
./build.sh zip          # Build ZIP for Web Store
./build.sh crx          # Build CRX (requires crx3)
./build.sh test         # Test in Chrome
./build.sh lint         # Validate extension
./build.sh help         # Show all commands
```

### 2. Makefile.new (GNU Make)

```bash
make -f Makefile.new zip        # Build ZIP
make -f Makefile.new crx        # Build CRX
make -f Makefile.new test       # Test in Chrome
make -f Makefile.new lint       # Lint extension
make -f Makefile.new clean      # Clean build files
make -f Makefile.new help       # Show all targets
```

## 📝 Manual Build (No Tools)

If you don't have npm/make/bash:

```bash
# Create ZIP manually
zip -r extension.zip \
  manifest.json \
  baller.js \
  chilenos2.png \
  LICENSE \
  README.md
```

Then upload to Chrome Web Store.

## 🔑 Private Key Management

### For CRX Files (if needed)

The private key ensures your extension has a consistent ID across versions.

**Location:** `../basketball-reference-Yahoo-chilenos2.pem` (outside repo, never commit!)

**Generate new key:**
```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem
```

**Important:**
- Keep `.pem` file secure (add to `.gitignore`)
- Same key = same extension ID
- Lost key = can't update extension (must publish as new)

### For Chrome Web Store

No private key needed! Chrome manages this for you.

## 🚀 Publishing Workflow

### First Time Setup

1. **Create Developer Account:**
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 fee
   - Verify email

2. **Prepare Extension:**
   ```bash
   ./build.sh zip
   ./build.sh lint  # Validate first
   ```

3. **Create Store Listing:**
   - Upload ZIP file
   - Add screenshots (1280x800 or 640x400)
   - Write description
   - Choose category
   - Set privacy policy (if collecting data)

4. **Submit for Review:**
   - Usually approved in 1-3 days
   - Check email for updates

### Updates (v2.1, v2.2, etc.)

1. **Update version in `manifest.json`:**
   ```json
   "version": "2.1.0"
   ```

2. **Update `build.sh` version:**
   ```bash
   VERSION="2.1.0"
   ```

3. **Build and upload:**
   ```bash
   ./build.sh zip
   ```

4. **Upload to existing item in dashboard**

5. **Users get automatic updates within hours**

## 🧪 Testing Before Publishing

### Local Testing

```bash
# Option 1: web-ext
npm install -g web-ext
web-ext run -t chromium

# Option 2: Manual load
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select extension directory
```

### Test on Real Pages

- Per-game stats: https://www.basketball-reference.com/leagues/NBA_2025_per_game.html
- Player game log: https://www.basketball-reference.com/players/c/curryst01/gamelog/2025
- Box score: https://www.basketball-reference.com/boxscores/202401010BOS.html
- StatHead: https://stathead.com/basketball/

### Validation

```bash
# Validate manifest
./build.sh lint

# Or manually
cat manifest.json | jq empty  # Check JSON syntax
```

## 🔄 Migration from Old Build System

### Step 1: Replace Makefile (Optional)

```bash
# Backup old Makefile
mv Makefile Makefile.old

# Use new Makefile
mv Makefile.new Makefile

# Or keep both and specify
make -f Makefile.new zip
```

### Step 2: Choose Distribution Method

- **Recommended:** Chrome Web Store
- **Alternative:** Load unpacked for private use

### Step 3: Build

```bash
./build.sh zip
```

### Step 4: Test

```bash
./build.sh test
# Or manually load unpacked
```

### Step 5: Publish

Upload `dist/*.zip` to Chrome Web Store

## 📚 Additional Resources

### Chrome Web Store
- [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Best Practices](https://developer.chrome.com/docs/webstore/best_practices/)
- [Review Guidelines](https://developer.chrome.com/docs/webstore/review-process/)

### Extension Development
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [web-ext Documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)

### Build Tools
- [crx3 (npm)](https://www.npmjs.com/package/crx3)
- [web-ext (npm)](https://www.npmjs.com/package/web-ext)
- [chrome-webstore-upload (npm)](https://www.npmjs.com/package/chrome-webstore-upload-cli)

## ❓ FAQ

**Q: Can I still use .crx files?**
A: Not recommended. Chrome blocks them unless enterprise policy is set. Use Chrome Web Store or "Load unpacked" instead.

**Q: Do I need the .pem key?**
A: Only if building CRX files. Chrome Web Store doesn't need it.

**Q: How do I update the extension?**
A: Update version in manifest.json, rebuild ZIP, upload to dashboard.

**Q: What about Firefox?**
A: Use `web-ext` tool. Build: `web-ext build`. Sign: `web-ext sign`.

**Q: Can I self-host the extension?**
A: For Manifest V3, Chrome strongly discourages this. Use Web Store or enterprise policy.

**Q: Is the $5 fee per extension?**
A: No, one-time per developer account. Publish unlimited extensions.

---

**Need help?** Open an issue on GitHub or check the Chrome Web Store documentation.
