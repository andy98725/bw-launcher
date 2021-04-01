const { hasAutostart, hasGame, localVer } = require('./files.js');
const { checkConnection, onlineVer } = require('./website.js');



function needsDownload() {
	return !hasGame();
}
function needsUpdate() {
	return hasGame() && localVer() < onlineVer();
}

function autostart() {
	if (!hasAutostart())
		return false;

	if (!checkConnection())
		return hasGame();

	return !needsDownload() && !needsUpdate();
}


module.exports = {
	needsDownload, needsUpdate, autostart
}