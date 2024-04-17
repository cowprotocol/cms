#!/bin/bash

# Get the version number from package.json in the root directory
VERSION=$(node -p "require('./package.json').version")

# Update the version number in package.json in the lib directory
sed -i '' -e "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" lib/package.json

