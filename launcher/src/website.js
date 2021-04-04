const { launchGame, devBranch, downloadPatch, extract, deleteGame } = require('./files.js');
const { versionURL } = require('./preloader.js');

const request = require('request');
const fs = require('fs');
const querystring = require('querystring');
const fetch = require('node-fetch');


const downloadURL = 'https://everlastinggames.net/base-wars/download/raw';


var data = null;

function loadData() {
    if (data == null) {
        let query = querystring.parse(global.location.search);
        setData(JSON.parse(query['?data']))
    }
}
function setData(set) {
    data = set;
}

async function updateVer() {
    return await fetch(versionURL + (devBranch() ? '?branch=beta' : ''))
        .then(res => res.text())
        .then(ver => data.ver = ver);
    //TODO
}


function onlineVer() {
    loadData();
    if ('ver' in data)
        return data.ver;
    else return '';
}
function patchHTML() {
    loadData();
    if ('patchNotes' in data)
        return data.patchNotes;
    else return "Patch Notes not found. Please check your internet connection.";
}


function connected() {
    loadData();
    return data.internet;
}

function resetAndLaunch() {
    deleteGame();
    downloadAndLaunch();
}


function downloadAndLaunch() {
    if (!connected())
        return launchGame();

    startDownload();
    request(downloadURL + (devBranch() ? '?branch=beta' : ''))
        .on('response', function (data) {
            startDownload(data.headers['content-length']);
        })
        .on('data', function (chunk) {
            updateDownload(chunk.length);
        })
        .pipe(fs.createWriteStream(downloadPatch))
        .on('close', function () {
            endDownload();
        });
}

var loadingProgress = 0, loadingMaxProgress = 1;
function startDownload(maxAmt) {
    loadingMaxProgress = maxAmt;
    loadingProgress = 0;
    $('#loading-area').show();
    $('#loading-info').hide();
    $('#loading-text').text("Connecting...");

}
function updateDownload(amt) {
    loadingProgress += amt;
    let percent = loadingProgress / loadingMaxProgress * 100;

    $('#loading-text').text(Math.round(percent) + '%');
    $('#loading-bar').width(percent + '%');



}
function endDownload() {
    $('#loading-area').hide();
    $('#loading-info').show();
    $('#loading-info').text("Installing...");

    extract();

    $('#loading-info').text("Starting Game...");

    launchGame();
}


module.exports = {
    connected, patchHTML, onlineVer, updateVer, downloadAndLaunch, resetAndLaunch, setData
}
