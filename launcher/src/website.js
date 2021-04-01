const { devBranch } = require('./files.js');

// Load jquery early
let $ = require('jquery');
if (!$.get) {
    // jquery requires a window, let's give it one
    const { JSDOM } = require("jsdom");
    const { window } = new JSDOM("");
    $ = $(window);
}

const patchURL = 'https://everlastinggames.net/base-wars/patchNotes/raw';
const versionURL = 'https://everlastinggames.net/base-wars/download/raw/version' + devBranch() ? '?branch=beta' : '';

let internetConnected = true;
function connectionErr(XMLHttpRequest, textStatus, errorThrown) {
    if (XMLHttpRequest.readyState == 4) {
        // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
    }
    else if (XMLHttpRequest.readyState == 0) {
        // Network error (i.e. connection refused, access denied due to CORS, etc.)
        internetConnected = false;
    }
    else {
        // something weird is happening
    }
}


// Query caches
let patchHTML = null, versionCache = null;
console.log("HEY");
$.ajax({
    url: patchURL, success: function (data) {
        patchHTML = data;
        console.log("STATUS " + data);
    }, error: checkConnection, async:false
});
$.ajax({
    url: versionURL, success: function (data) {
        patchHTML = data;
    }, error: checkConnection, async:false
});


function getPatchHTML() {
    if (!internetConnected)
        return null;
    if (!patchHTML)
        patchHTML = $.ajax({ url: patchURL, async: false, error: checkConnection }).responseText;

    return patchHTML
}
function onlineVer() {
    if (!internetConnected)
        return '';
    // if (!versionCache)
    //     versionCache = $.ajax({ url: versionURL, async: false, error: checkConnection }).responseText;

    return versionCache;
}
function downloadAndLaunch() {
    if (!internetConnected)
        return launchGame();
    //TODO
}
function checkConnection() {
    onlineVer();
    return internetConnected;
}
module.exports = {
    checkConnection, getPatchHTML, onlineVer, downloadAndLaunch
}
