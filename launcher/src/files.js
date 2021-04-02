const fs = require('fs');
const path = require('path');
const admZip = require('adm-zip');
const { exec } = require('child_process');
const { ipcRenderer } = require('electron');

// Set up directory locations
let localDir = __dirname.lastIndexOf('data') > 0 ? __dirname.substr(0, __dirname.lastIndexOf('data')) : __dirname;
version = path.join(localDir, '/data/src/version.txt');
baseWars = path.join(localDir, '/data/src/Base_Wars.jar');
java = path.join(localDir, '/data/src/java.exe');

autostart = path.join(localDir, '/data/AUTOSTART.txt');
dev = path.join(localDir, '/data/src/launcher/beta.txt');
downloadPatch = path.join(localDir, '/data/src/launcher/base_wars_patch.zip');
output = path.join(localDir, '/data/src/launcher/output.txt');


let localVerCache = null;

function localVer() {
    if (localVerCache == null)
        if (!fs.existsSync(version))
            localVerCache = '';
        else
            localVerCache = fs.readFileSync(version);

    return localVerCache;
}

function hasAutostart() {
    // return fs.existsSync(autostart); TODO add autostart toggle
    return false;
}

let autostartDescription = "This file makes the Launcher start Base Wars immediately if there's no update to download.\n"
    + "If you want to see the Launcher, you should delete this file.";
function updateAutostart(set) {
    if (set)
        fs.writeFileSync(autostart, autostartDescription);
    else
        fs.rmSync(autostart);
}

function devBranch() {
    // return fs.existsSync(dev); TODO add dev branch toggle
    return true;
}

let devDescription = "This file tells the Launcher to load the Beta branch.\n"
    + "If you want to change this, please do it from inside the Launcher!";
function updateDevBranch(set) {
    if (set)
        fs.writeFileSync(dev, autostartDescription);
    else
        fs.rmSync(dev);
}

function hasGame() {
    return fs.existsSync(version) && fs.existsSync(baseWars) && fs.existsSync(java);
}


function extract() {
    let zipFile = new admZip(downloadPatch);
    zipFile.extractAllTo(localDir, true);
    fs.unlinkSync(downloadPatch);
}

function launchGame() {
    exec(java + ' -jar -Xmx2G -Xms1G ' + baseWars + ' > ' + output + ' 2>&1', { cwd: localDir });

    ipcRenderer.send('game-launch');
}

module.exports = {
    localVer, hasAutostart, updateAutostart, devBranch, updateDevBranch, hasGame, launchGame, downloadPatch, downloadPatch, extract
}