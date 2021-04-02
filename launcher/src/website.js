
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


function connected(){
    loadData();
    return data.internet;
}


function downloadAndLaunch() {
    if (!connected())
        return launchGame();
    //TODO download
    console.log("DOWNLOAD!");

    launchGame();
}


module.exports = {
    connected, patchHTML, onlineVer, downloadAndLaunch, setData
}
