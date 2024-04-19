#!/bin/bash

# Function for cleanup
cleanup() {
    local exit_code=$?
    echo -e "\n🧹 Cleanup package.json"
    git checkout -- lib/package.json

    artifact="@cowprotocol/cms v${VERSION}"
    if [ $exit_code -eq 0 ]; then
        echo -e "\n✅ Done! New $artifact has been publushed🎉"
    else
        echo -e "\n❌ There was some issue publishing $artifact"
    fi
}

trap cleanup EXIT

# Get the version number from package.json in the root directory
VERSION=$(node -p "require('./package.json').version")

# Update the version number in package.json in the lib directory
echo -e "\n✅ Update the version of the library to ${VERSION}"
sed -i '' -e "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" lib/package.json

# Build the library
echo -e "\n🏗️ Build the library\n"
yarn build:lib

# Publish the library
echo -e "\n🚀 Publish the library"
(cd lib && npm publish --access public)