const $ = require('jquery');

const { hasAutostart, hasGame } = require('./files.js');
const { getPatchHTML, checkConnection } = require('./website.js');


$(function () {
	clickPlay();
});


function clickPlay() {
	$(".main").load("play.html");

	$("#play-btn").addClass("active");
	$("#patch-btn").removeClass("active");
	$("#set-btn").removeClass("active");
}
function clickSettings() {
	$(".main").load("settings.html");

	$("#play-btn").removeClass("active");
	$("#set-btn").addClass("active");
	$("#patch-btn").removeClass("active");
}

function clickPatch() {
	let patchHTML = getPatchHTML();
	if (patchHTML)
		$(".main").html(patchHTML);
	else
		$(".main").text("Patch Notes not found. Please check your internet connection.");

	$("#play-btn").removeClass("active");
	$("#set-btn").removeClass("active");
	$("#patch-btn").addClass("active");
}

function clickDownload() {
	//TODO
}



function readyToLaunch() {
	if(checkConnection())
		return hasGame();
	//TODO
	return false;
}

function autostart() {
	return hasAutostart() && readyToLaunch();
}

module.exports = {
	readyToLaunch, autostart, launchGame
}