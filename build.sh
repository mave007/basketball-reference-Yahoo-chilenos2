#!/bin/bash
# Simple build script for Basketball Reference Extension
# Usage: ./build.sh [zip|crx|webstore]

set -e

EXTENSION_NAME="basketball-reference-Yahoo-chilenos2"
VERSION="2.0.17"
OUTPUT_DIR="dist"
ZIP_FILE="${OUTPUT_DIR}/${EXTENSION_NAME}-v${VERSION}.zip"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================
# Helper functions
# ============================================================

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================================
# Build functions
# ============================================================

build_zip() {
    echo "Building ZIP file for Chrome Web Store..."

    # Create output directory
    mkdir -p "${OUTPUT_DIR}"

    # Remove old ZIP if exists
    rm -f "${ZIP_FILE}"

    # Create ZIP with only necessary files
    zip -q -r "${ZIP_FILE}" \
        manifest.json \
        baller.js \
        chilenos2.png \
        LICENSE \
        README.md

    success "Created ${ZIP_FILE}"

    # Show file size
    SIZE=$(du -h "${ZIP_FILE}" | cut -f1)
    echo "  Size: ${SIZE}"

    echo ""
    echo "📦 Next steps:"
    echo "  1. Visit https://chrome.google.com/webstore/devconsole"
    echo "  2. Create new item (one-time \$5 fee) or update existing"
    echo "  3. Upload ${ZIP_FILE}"
    echo "  4. Submit for review"
}

build_crx() {
    echo "Building CRX file (legacy format)..."

    warning "Chrome blocks .crx files not from Web Store"
    warning "Consider using 'Load unpacked' or publish to Web Store instead"
    echo ""

    # Check for crx3
    if ! command -v crx3 &> /dev/null; then
        error "crx3 not found. Install with: npm install -g crx3"
    fi

    # Build ZIP first
    build_zip

    # Create CRX
    PRIVATE_KEY="../${EXTENSION_NAME}.pem"
    CRX_FILE="${OUTPUT_DIR}/${EXTENSION_NAME}-v${VERSION}.crx"

    if [ ! -f "${PRIVATE_KEY}" ]; then
        warning "Private key not found at ${PRIVATE_KEY}"
        echo "Generate with: openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out ${PRIVATE_KEY}"
        exit 1
    fi

    crx3 --zip "${ZIP_FILE}" --out "${CRX_FILE}" --key "${PRIVATE_KEY}"
    success "Created ${CRX_FILE}"
}

webstore_publish() {
    echo "Publishing to Chrome Web Store..."

    # Check for chrome-webstore-upload
    if ! command -v chrome-webstore-upload &> /dev/null; then
        error "chrome-webstore-upload not found. Install with: npm install -g chrome-webstore-upload-cli"
    fi

    # Build ZIP
    build_zip

    # Check for credentials
    if [ -z "${CHROME_EXTENSION_ID}" ] || [ -z "${CHROME_CLIENT_ID}" ]; then
        error "Missing credentials. Set environment variables: CHROME_EXTENSION_ID, CHROME_CLIENT_ID, CHROME_CLIENT_SECRET, CHROME_REFRESH_TOKEN"
    fi

    # Upload
    chrome-webstore-upload upload \
        --source "${ZIP_FILE}" \
        --extension-id "${CHROME_EXTENSION_ID}" \
        --client-id "${CHROME_CLIENT_ID}" \
        --client-secret "${CHROME_CLIENT_SECRET}" \
        --refresh-token "${CHROME_REFRESH_TOKEN}"

    success "Uploaded to Chrome Web Store"
}

test_extension() {
    echo "Testing extension in Chrome..."

    # Check for web-ext
    if ! command -v web-ext &> /dev/null; then
        warning "web-ext not found. Install with: npm install -g web-ext"
        exit 1
    fi

    # Run extension
    web-ext run -t chromium --source-dir=. \
        --chromium-binary=/usr/bin/google-chrome 2>/dev/null || \
    web-ext run -t chromium --source-dir=. \
        --chromium-binary=/usr/bin/chromium 2>/dev/null || \
    error "Chrome/Chromium not found"
}

lint_extension() {
    echo "Linting extension..."

    # Check manifest is valid JSON
    if command -v jq &> /dev/null; then
        if jq empty manifest.json 2>/dev/null; then
            success "manifest.json is valid JSON"
        else
            error "manifest.json is invalid"
        fi
    fi

    # Check for web-ext
    if command -v web-ext &> /dev/null; then
        web-ext lint --source-dir=.
    else
        warning "web-ext not found (optional). Install with: npm install -g web-ext"
    fi
}

show_help() {
    cat << EOF
Basketball Reference Extension - Build Script

Usage: ./build.sh [command]

Commands:
  zip         Build ZIP file for Chrome Web Store (recommended)
  crx         Build CRX file (legacy, not recommended)
  webstore    Publish to Chrome Web Store (requires credentials)
  test        Test extension in Chrome
  lint        Lint and validate extension
  help        Show this help message

Examples:
  ./build.sh zip          # Create ZIP for manual upload
  ./build.sh test         # Test in Chrome browser
  ./build.sh lint         # Validate extension

For Chrome Web Store publishing:
  1. Run: ./build.sh zip
  2. Upload dist/${EXTENSION_NAME}-v${VERSION}.zip to:
     https://chrome.google.com/webstore/devconsole

EOF
}

# ============================================================
# Main script
# ============================================================

# Parse command
COMMAND="${1:-zip}"

case "${COMMAND}" in
    zip)
        build_zip
        ;;
    crx)
        build_crx
        ;;
    webstore)
        webstore_publish
        ;;
    test)
        test_extension
        ;;
    lint)
        lint_extension
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Unknown command: ${COMMAND}. Run './build.sh help' for usage."
        ;;
esac
