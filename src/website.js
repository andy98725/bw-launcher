const $ = require('jquery');

const { devBranch } = require('./files.js');


const patchURL = 'https://everlastinggames.net/base-wars/patchNotes/raw';
const versionURL = 'https://everlastinggames.net/base-wars/download/raw/version' + devBranch() ? '?branch=beta' : '';

let internetConnected = true;
function checkConnection(XMLHttpRequest, textStatus, errorThrown) {
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
$.ajax({
    url: patchURL, success: function (data) {
        patchHTML = data;
    }, error: checkConnection
});
$.ajax({
    url: versionURL, success: function (data) {
        patchHTML = data;
    }, error: checkConnection
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
    if (!versionCache)
        versionCache = $.ajax({ url: versionURL, async: false, error: checkConnection }).responseText;

    return versionCache;
}
function checkConnection(){
    onlineVer();
    return internetConnected;
}
module.exports = {
    checkConnection, getPatchHTML, onlineVer
}
