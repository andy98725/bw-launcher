const { hasAutostart, hasGame, localVer, devBranch } = require('./files.js');
const { onlineVer, connected } = require('./website.js');


var originalBranch = devBranch();

function needsReset() {
	return hasGame() && devBranch() != originalBranch;
}

function needsDownload() {
	return !hasGame();
}
function needsUpdate() {
	return hasGame() && localVer() < onlineVer();
}

function autostart() {
	if (!hasAutostart())
		return false;

	if (!connected())
		return hasGame();

	return !needsDownload() && !needsUpdate();
}


module.exports = {
	needsReset, needsDownload, needsUpdate, autostart
}