const $ = require('jquery');
const fs = require('fs');
const path = require('path');


localVer = path.join(__dirname, '/data/src/version.txt');
baseWars = path.join(__dirname, '/data/src/Base_Wars.jar');

autostart = path.join(__dirname, '/AUTOSTART.txt');
// autostart = path.join(__dirname, '/data/AUTOSTART.txt');
dev = path.join(__dirname, '/data/launcher/beta.txt');

let localVerCache = null, autostartCache = null, devCache = null;

function localVer() {
    if (localVerCache == null)
        if (!fs.existsSync(localVer))
            localVerCache = '';
        else
            localVerCache = fs.readFileSync(localVer);

    return localVerCache;
}

function hasAutostart() {
    if (autostartCache == null)
        if (fs.existsSync(autostart))
            autostartCache = false;
        else
            autostartCache = true;

    return autostartCache;
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
    if (devCache == null)
        if (fs.existsSync(dev))
            devCache = true;
        else
            devCache = false;

    return devCache;
}

function hasGame() {

}

function launchGame() {
    //TODO
}

module.exports = {
    localVer, hasAutostart, updateAutostart, devBranch, hasGame, launchGame
}

updateAutostart(true);
