const { devBranch } = require('./files.js');

const fetch = require("node-fetch");

const versionURL = 'https://everlastinggames.net/base-wars/download/raw/version';


async function pollWebsite() {
    let internetConnected = true;
    let ver = fetch(versionURL + (devBranch() ? '?branch=beta' : ''))
        .then(res => res.text())
        .catch(e => {
            console.error(e);
            internetConnected = false;
        });

    let onlineVersion = await ver;

    return {
        'ver': onlineVersion,
        'internet': internetConnected
    };
}

module.exports = {
    pollWebsite, versionURL
}