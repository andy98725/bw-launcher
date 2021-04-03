const $ = require('jquery');

const { needsReset, needsDownload, needsUpdate } = require('../gameState.js');
const { hasGame, localVer, launchGame, updateAutostart, updateDevBranch, hasAutostart, devBranch } = require('../files.js');
const { patchHTML, updateVer, onlineVer, downloadAndLaunch, resetAndLaunch, connected } = require('../website.js');



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
	else if (needsReset()) {
		$('#loading-info').text('Download Ready (V. ' + onlineVer() + ')');
		$('#download-btn').text('Reset & Download');

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
	$('#download-btn').prop('disabled', true);
	if (!connected()) {
		if (hasGame())
			launchGame();
	}
	else if(needsReset())
		resetAndLaunch();
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
	$(".main").load("settings.html", function () {
		updateSettings();
	});

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

var autorunPreviouslySet = false, betaPreviouslySet = false;

const autorunWarn = "Base Wars will launch without the Launcher from now on.<br>"
	+ "To disable this, you'll have to delete the file " + '"data/AUTORUN.txt"' + ".<br>"
	+ "(The Launcher will still open whenever there's an update.) <br>"
	+ "Do you want this set?<br>";

function setAutorun(set, force) {
	if (hasAutostart())
		autorunPreviouslySet = true;
	force |= autorunPreviouslySet;

	if (set && !force)
		setWarningPrompt(autorunWarn, function () {
			setAutorun(set, true);
		})
	else {
		setWarningPrompt(null, null);
		updateAutostart(set);
		updateSettings();
	}
}

const betaWarn = "If you switch Branches, the game's files will reset completely, including the settings.<br>"
	+ "It is recommended to back these up, or create a separate launcher for each branch.<br>"
	+ "Do you want this set?<br>";

var currentBranch = null;
function setBetaBranch(set, force) {
	if (currentBranch === null)
		currentBranch = devBranch();
	else if (currentBranch != devBranch())
		betaPreviouslySet = true;
	force |= betaPreviouslySet;

	if (set)
		$('.dropbtn').text($('#dropdown-beta').text());
	else
		$('.dropbtn').text($('#dropdown-stable').text());

	if (!force)
		if (set != currentBranch)
			setWarningPrompt(betaWarn, function () {
				setBetaBranch(set, true);
			});
		else
			setWarningPrompt(null, null);
	else {
		setWarningPrompt(null, null);
		updateDevBranch(set);
		updateSettings();
		updateVer().then(() => {
			updateButtonText();
		})
	}
}


function updateSettings() {
	$('#autorun-switch').prop('checked', hasAutostart());
	$('#autorun-switch').on('change', function () {
		setAutorun($(this).is(':checked'), false);
	});

	if (devBranch())
		$('.dropbtn').text($('#dropdown-beta').text());
	else
		$('.dropbtn').text($('#dropdown-stable').text());
	$('#dropdown-stable').on('click', function () {
		setBetaBranch(false, false);
	});
	$('#dropdown-beta').on('click', function () {
		setBetaBranch(true, false);
	});
}

function setWarningPrompt(msg, action) {
	if (!msg) {
		$('#warning').hide();
		$('#warning-btn').off('click');
	}
	else {
		$('#warning-txt').html(msg);
		$('#warning-btn').on('click', action);
		$('#warning').show();
	}
}