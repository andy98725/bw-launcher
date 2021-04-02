const $ = require('jquery');

const { needsDownload, needsUpdate } = require('../gameState.js');
const { hasGame, localVer, launchGame } = require('../files.js');
const { patchHTML, onlineVer, downloadAndLaunch, connected } = require('../website.js');



$(function () {
	clickPlay();
	updateButtonText();
});

function updateButtonText() {
	if (!connected()) {
		$('#loading-info').text('No Internet Connection');
		if (!hasGame())
			$('#download-btn').hide();
		else
			$('#download-btn').text('Play Offline');
	}
	else if (needsDownload()) {
		$('#loading-info').text('Download Ready (V. ' + onlineVer() + ')');
		$('#download-btn').text('Download & Play');
	}
	else if (needsUpdate()) {
		$('#loading-info').text('Update Ready (V. ' + localVer() + ' -> ' + onlineVer() + ')');
		$('#download-btn').text('Update & Play');
	}
	else {
		$('#loading-info').text('Base Wars Ready');
		$('#download-btn').text('Play');
	}
}

function clickDownload() {
	if (!connected()) {
		if (hasGame())
			launchGame();
	}
	else if (needsDownload() || needsUpdate())
		downloadAndLaunch();
	else
		launchGame();
}


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
	$(".main").html(patchHTML());

	$("#play-btn").removeClass("active");
	$("#set-btn").removeClass("active");
	$("#patch-btn").addClass("active");
}