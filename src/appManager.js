$ = require('jquery');
$(function(){
	clickPlay();
});


function clickPlay(){
	$(".main").load("play.html");

	$("#play-btn").addClass("active");
	$("#patch-btn").removeClass("active");
	$("#set-btn").removeClass("active");
}
function clickSettings(){
	$(".main").load("settings.html");

	$("#play-btn").removeClass("active");
	$("#set-btn").addClass("active");
	$("#patch-btn").removeClass("active");
}

let patchHTML = null;

$.ajax({ url: 'https://everlastinggames.net/base-wars/patchNotes/raw', success: function(data) {
	patchHTML = data;
} });
function clickPatch(){
	if(patchHTML)
		$(".main").html(patchHTML);
	else
		$(".main").text("Patch Notes not found. Please check your internet connection.");

		$("#play-btn").removeClass("active");
		$("#set-btn").removeClass("active");
		$("#patch-btn").addClass("active");
}

