const { launchGame, devBranch, downloadPatch, extract } = require('./files.js');

const request = require('request');
const fs = require('fs');


const downloadURL = 'https://everlastinggames.net/base-wars/download/raw' + (devBranch() ? '?branch=beta' : '');


const querystring = require('querystring');
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


function downloadAndLaunch() {
    if (!connected())
        return launchGame();

    startDownload();
    request(downloadURL)
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

}
function updateDownload(amt) {
    loadingProgress += amt;
    let percent = Math.round(loadingProgress / loadingMaxProgress * 100) + '%';

    $('#loading-text').text(percent);
    $('#loading-bar').width(percent);



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
    connected, patchHTML, onlineVer, downloadAndLaunch, setData
}
