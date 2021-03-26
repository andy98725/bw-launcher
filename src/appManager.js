
$ = require('jquery');
$(function(){
	clickPlay();
});


function clickPlay(){
	$(".main").load("play.html");
}
function clickSettings(){
	$(".main").load("settings.html");
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
}

