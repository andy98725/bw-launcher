#!/bin/bash

# Destroy helper folder
rm -rf ./launcher/src/data

# Package electron
npm run make --prefix ./launcher



# Destination directories
rm -rf ./builds
linRt=./builds/linux
linDir=$linRt/data/src
macRt=./builds/mac
macDir=$macRt/data/src
winRt=./builds/win
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

# Make launcher shortcuts
ln -s ./data/src/launcher/base-wars-launcher $linRt/Base\ Wars
ln -s ./data/src/launcher/base-wars-launcher $macRt/Base\ Wars
ln -s ./data/src/launcher/base-wars-launcher.exe $winRt/Base\ Wars

# Make java shortcuts
ln -s ./bin/java $linDir/java.exe
ln -s ./bin/java $macDir/java.exe
ln -s ./bin/javaw.exe $winDir/java.exe


# Restore dev tools
mkdir ./launcher/src/data
