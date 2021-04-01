#!/bin/bash

linDir=./builds/Base-Wars-Linux/data
macDir=./builds/Base-Wars-Mac/data
winDir=./builds/Base-Wars-Win/data
mkdir -p $linDir $macDir $winDir

cp ./out/Base\ Wars-linux-x64 $linDir/launcher -r
cp ./out/Base\ Wars-linux-x64 $macDir/launcher -r
cp ./out/Base\ Wars-win32-x64 $winDir/launcher -r

