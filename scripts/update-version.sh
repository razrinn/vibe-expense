#!/bin/bash

# Check if a version argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <new_version>"
  echo "Example: $0 1.0.5"
  exit 1
fi

NEW_VERSION="$1"
SW_FILE="public/sw.js"
PACKAGE_JSON="package.json"

echo "Updating version to $NEW_VERSION..."

# 1. Update package.json version
echo "Updating $PACKAGE_JSON..."
# Use npm version to update package.json without creating a git tag
npm version "$NEW_VERSION" --no-git-tag-version || { echo "Failed to update package.json"; exit 1; }

# 2. Update APP_VERSION in public/sw.js
echo "Updating APP_VERSION in $SW_FILE..."
# Use sed to replace the APP_VERSION string
# The 'v' prefix is added for the APP_VERSION in sw.js
sed -i "s/const APP_VERSION = 'v[0-9.]*';/const APP_VERSION = 'v${NEW_VERSION}';/" "$SW_FILE" || { echo "Failed to update APP_VERSION in sw.js"; exit 1; }

echo "Version updated successfully to $NEW_VERSION."
