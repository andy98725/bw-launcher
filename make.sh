#!/bin/bash

# Destroy helper folder
rm -rf ./launcher/src/data

echo 'Building Project...'
npm run make --prefix ./launcher



echo 'Making Build Directories...'
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
cp ./launcher/out/Base\ Wars-darwin-x64 $macDir/launcher -r
cp ./launcher/out/Base\ Wars-win32-x64 $winDir/launcher -r

echo 'Importing Java...'
cp ./javas/linux $linDir/java -r
cp ./javas/mac $macDir/java -r
cp ./javas/win $winDir/java -r

# Make java shortcuts
ln -s ./bin/java $linDir/java/java.exe
ln -s ./bin/java $macDir/java/java.exe

echo 'Making Shortcuts...'
# Make launcher shortcuts
ln -s ./data/src/launcher/base-wars-launcher $linRt/Base\ Wars.lnk
ln -s ./data/src/launcher/Base\ Wars.app $macRt/Base\ Wars.lnk
cp ./javas/shortcutWin/Base\ Wars.lnk $winRt/Base\ Wars.lnk


echo 'Zipping...'

cd $linRt
zip -qr --symlinks Base\ Wars.zip ./*
cd - > /dev/null
cd $macRt
zip -qr --symlinks Base\ Wars.zip ./*
cd - > /dev/null
cd $winRt
zip -qr --symlinks Base\ Wars.zip ./*
cd - > /dev/null


# Restore dev tools
devDir=./launcher/src/data/src
mkdir -p ./launcher/src/data/src/launcher
cp ./javas/linux $devDir/java -r
ln -s ./java/bin/java $devDir/java.exe


echo 'Done.'
