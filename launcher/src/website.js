
const { launchGame } = require('./files.js');

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
    internetConnected = data.internet;
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


var internetConnected = true;


function downloadAndLaunch() {
    if (!internetConnected)
        return launchGame();
    //TODO download

    launchGame();
}


module.exports = {
    internetConnected, patchHTML, onlineVer, downloadAndLaunch, setData
}
