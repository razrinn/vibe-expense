#!/bin/bash

# Check if a version argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <new_version>"
  echo "Example: $0 1.0.5"
  exit 1
fi

NEW_VERSION="$1"
PACKAGE_JSON="package.json"

echo "Updating version to $NEW_VERSION..."

# 1. Update package.json version
echo "Updating $PACKAGE_JSON..."
# Use npm version to update package.json without creating a git tag
npm version "$NEW_VERSION" --no-git-tag-version || { echo "Failed to update package.json"; exit 1; }

echo "Version updated successfully to $NEW_VERSION."
