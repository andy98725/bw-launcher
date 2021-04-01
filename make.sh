#!/bin/bash

# Package electron
npm run make --prefix ./launcher

# Destination directories
rm -rf ./builds
linRt=./builds/Base-Wars-Linux
linDir=$linRt/data/src
macRt=./builds/Base-Wars-Mac
macDir=$macRt/data/src
winRt=./builds/Base-Wars-Win
winDir=$winRt/data/src
mkdir -p $linDir $macDir $winDir

# Make launcher directory
cp ./launcher/out/Base\ Wars-linux-x64 $linDir/launcher -r
cp ./launcher/out/Base\ Wars-linux-x64 $macDir/launcher -r
cp ./launcher/out/Base\ Wars-win32-x64 $winDir/launcher -r

# Make java directory
cp ./javas/linux $linDir/java -r
cp ./javas/mac $macDir/java -r
cp ./javas/win $winDir/java -r

# Make shortcuts
ln -s ./data/src/launcher/base-wars-launcher $linRt/Base\ Wars
ln -s ./data/src/launcher/base-wars-launcher $macRt/Base\ Wars
ln -s ./data/src/launcher/base-wars-launcher.exe $winRt/Base\ Wars
