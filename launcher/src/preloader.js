const { devBranch } = require('./files.js');

const fetch = require("node-fetch");

const patchURL = 'https://everlastinggames.net/base-wars/patchNotes/raw';
const versionURL = 'https://everlastinggames.net/base-wars/download/raw/version' + (devBranch() ? '?branch=beta' : '');



async function pollWebsite() {
    let patchHTML = '', onlineVersion = '', internetConnected = true;
    let ver = fetch(versionURL)
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
    pollWebsite
}