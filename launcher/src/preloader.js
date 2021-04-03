const { devBranch } = require('./files.js');

const fetch = require("node-fetch");

const patchURL = 'https://everlastinggames.net/base-wars/patchNotes/raw';
const versionURL = 'https://everlastinggames.net/base-wars/download/raw/version';


//TODO only poll when necessary
// Move HTML to website
// and only check when autostart
async function pollWebsite() {
    let patchHTML, onlineVersion, internetConnected = true;
    let ver = fetch(versionURL + (devBranch() ? '?branch=beta' : ''))
        .then(res => res.text())
        .then(txt => onlineVersion = txt)
        .catch(e => {
            console.error(e);
            internetConnected = false;
        });
    let patch = fetch(patchURL)
        .then(res => res.text())
        .then(txt => patchHTML = txt)
        .catch(e => {
            console.error(e);
            internetConnected = false;
        });


    await ver;
    await patch;

    return {
        'ver': onlineVersion,
        'patchNotes': patchHTML,
        'internet': internetConnected
    };
}

module.exports = {
    pollWebsite, versionURL
}