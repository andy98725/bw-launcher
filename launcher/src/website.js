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


var loadingProgress = 0, loadingMaxProgress = 1;
function downloadAndLaunch() {
    if (!connected())
        return launchGame();

    startDownload();
    request(downloadURL)
        .on('response', function (data) {
            loadingMaxProgress = data.headers['content-length'];
            loadingProgress = 0;
        })
        .on('data', function (chunk) {
            loadingProgress += chunk.length;
            setDownload(loadingProgress / loadingMaxProgress);
        })
        .pipe(fs.createWriteStream(downloadPatch))
        .on('close', function () {
            endDownload();
        });
}

function startDownload() {
    $('#loading-bar').show();
    $('#loading-info').hide();

}
function setDownload(percent) {

    //TODO
    $('#loading-bar').text(Math.round(percent * 100) + '%');



}
function endDownload() {
    $('#loading-bar').hide();
    $('#loading-info').show();

    $('#loading-info').text("Installing...");
    extract();

    $('#loading-info').text("Starting Game...");
    launchGame();
}


module.exports = {
    connected, patchHTML, onlineVer, downloadAndLaunch, setData
}
