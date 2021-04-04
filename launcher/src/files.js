const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const admZip = require('adm-zip');
const { spawn } = require('child_process');
const { ipcRenderer, shell } = require('electron');

// Set up directory locations
let localDir = __dirname.lastIndexOf('data') > 0 ? __dirname.substr(0, __dirname.lastIndexOf('data')) : __dirname;

version = path.join(localDir, '/data/src/version.txt');
baseWars = path.join(localDir, '/data/src/Base_Wars.jar');

if (process.platform === "win32")
    java = path.join(localDir, '/data/src/java/bin/javaw.exe');
else
    java = path.join(localDir, '/data/src/java/bin/java');


autostart = path.join(localDir, '/data/AUTOSTART.txt');
dev = path.join(localDir, '/data/src/launcher/beta.txt');
downloadPatch = path.join(localDir, '/data/src/launcher/base_wars_patch.zip');
output = path.join(localDir, '/data/src/launcher/output.txt');
winShortcut = path.join(localDir, 'Base Wars.lnk');
winIcon = path.join(localDir, '/data/src/launcher/resources/app/src/render/Icon.ico')

deleteFiles = [path.join(localDir, '/data/maps'), path.join(localDir, '/data/saves'),
path.join(localDir, '/data/replays'), path.join(localDir, '/data/textures'),
path.join(localDir, '/data/settings'), version, baseWars];


let localVerCache = null;

function localVer() {
    if (localVerCache == null)
        if (!fs.existsSync(version))
            localVerCache = '';
        else
            localVerCache = fs.readFileSync(version);

    return localVerCache;
}
var auto = null;
function hasAutostart() {
    if (auto === null)
        auto = fs.existsSync(autostart);
    return auto;
}

let autostartDescription = "This file makes the Launcher start Base Wars immediately if there's no update to download.\n"
    + "If you want to see the Launcher, you should delete this file.";
function updateAutostart(set) {
    if (auto != set) {
        auto = set;
        if (set)
            fs.writeFileSync(autostart, autostartDescription);
        else
            fs.unlinkSync(autostart);
    }
}

var isDev = null;
function devBranch() {
    if (isDev === null)
        isDev = fs.existsSync(dev);
    return isDev;
}

let devDescription = "This file tells the Launcher to load the Beta branch.\n"
    + "If you want to change this, please do it from inside the Launcher!";
function updateDevBranch(set) {
    if (isDev != set) {
        isDev = set;
        if (set)
            fs.writeFileSync(dev, devDescription);
        else
            fs.unlinkSync(dev);
    }
}

var has = null;
function hasGame() {
    if (has === null)
        has = fs.existsSync(version) && fs.existsSync(baseWars) && fs.existsSync(java);
    return has;
}


function updateShortcutIcon() {
    if (process.platform !== "win32")
        return;

    let shortcut = shell.readShortcutLink(winShortcut);
    shortcut.icon = winIcon;
    shell.writeShortcutLink(winShortcut, shortcut);
}

function deleteGame() {
    deleteFiles.forEach(function (file) {
        rimraf.sync(file);
    });
}

function extract() {
    let zipFile = new admZip(downloadPatch);
    zipFile.extractAllTo(localDir, true);
    fs.unlinkSync(downloadPatch);
}

function launchGame() {
    // let cmd = '"' + java + '" -jar -Xmx2G -Xms1G "' + baseWars + '" > "' + output + '" 2>&1';
    // exec(cmd, { cwd: localDir })
    let args = ['-jar', '-Xmx2G', '-Xms1G', baseWars, '> "' + output + '"', '2>&1'];
    let sp = spawn(java, args, { cwd: localDir, detached: true });
    // sp.stdout.on('data', (data) => {
    //     console.log(`Out: ${data}`);
    // });

    // sp.stderr.on('data', (data) => {
    //     console.error(`Err: ${data}`);
    // });

    // sp.on('close', (code) => {
    //     console.log(`Base Wars exited with code ${code}`);
    // });
    ipcRenderer.send('game-launch');

    // console.log("Executing:");
    // console.log(cmd);
    // console.log(exec(cmd, { cwd: localDir }));

}

module.exports = {
    localVer, hasAutostart, updateAutostart, devBranch, updateDevBranch, hasGame, launchGame, updateShortcutIcon, deleteGame, downloadPatch, extract
}