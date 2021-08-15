#!/bin/bash

# Destroy helper folder
rm -rf ./launcher/src/data

echo 'Building Project...'
npm run make --prefix ./launcher



echo 'Making Build Directories...'
rm -rf ./builds
linBW="./builds/linux"
linRt="$linBW/Base Wars"
linDir="$linRt/data/launcher"
macBW="./builds/mac"
macRt="$macBW/Base Wars"
macDir="$macRt/data/launcher"
winBW="./builds/win"
winRt="$winBW/Base Wars"
winDir="$winRt/data/launcher"

mkdir -p "$linDir" "$macDir" "$winDir"


# Make launcher directory
cp ./launcher/out/Base\ Wars-linux-x64/* "$linDir/" -r
cp ./launcher/out/Base\ Wars-darwin-x64/* "$macDir/" -r
cp ./launcher/out/Base\ Wars-win32-x64/* "$winDir/" -r

echo 'Importing Java...'
cp ./javas/linux "$linDir/java" -r
cp ./javas/mac "$macDir/java" -r
cp ./javas/win "$winDir/java" -r

echo 'Making Shortcuts...'
# Make launcher shortcuts
ln -s ./data/launcher/base-wars-launcher "$linRt/Base Wars.lnk"
ln -s ./data/launcher/Base\ Wars.app "$macRt/Base Wars.lnk"
cp ./winShortcut/Base\ Wars.lnk "$winRt/Base Wars.lnk"


if [[ $1 != '--nozip' ]];
then
	echo 'Zipping...'
	linZ=zips/lin
	macZ=zips/mac
	winZ=zips/win
	rm -rf ./zips
	mkdir -p ./$linZ ./$macZ ./$winZ
	
	cd $linBW
	zip -qr --symlinks ../../$linZ/Base\ Wars.zip ./*
	cd - > /dev/null
	echo 'Linux Done.'
	cd $macBW
	zip -qr --symlinks ../../$macZ/Base\ Wars.zip ./*
	cd - > /dev/null
	echo 'Mac Done.'
	cd $winBW
	zip -qr --symlinks ../../$winZ/Base\ Wars.zip ./*
	cd - > /dev/null
	echo 'Windows Done.'
fi

# Restore dev tools
devDir=./launcher/src/data/launcher
mkdir -p $devDir
cp ./javas/linux $devDir/java -r
ln -s ./java/bin/java $devDir/java.exe


echo 'Done.'
