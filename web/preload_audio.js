var audioFiles = [
"clock4.ogg", "light.wav", "bookOpen.wav", "clockTick.ogg", "lion_01.ogg", "book_open_tower.ogg", "doorOpen.ogg", "no_fit.ogg", "book_sliding.ogg", "doorUnlock.ogg", "outside_locked_01.ogg", "camera.wav", "outside_locked_02.ogg", "chestOpen.ogg", "outside_locked_03.ogg", "chest_already_open.ogg", "intro01.ogg", "chest_need_key.ogg", "intro02.ogg", "puzzleOnWall.wav", "chest_need_to_look.ogg", "intro03.ogg", "treasure1.ogg", "chime6.ogg", "intro04.ogg", "treasure2.ogg", "clock1.ogg", "intro_wind.ogg", "walking.ogg", "clock2.ogg", "itemFound.ogg", "wallUpSound.ogg", "clock3.ogg", "keyPickUp.wav"
];
    
function preloadAudio(url) {
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = url;
}
    
var loaded = 0;
function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    loaded++;
    $("#loadPerc").html(Math.floor(100 * loaded/audioFiles.length));
    console.log("Audio preloading: " + loaded + " vs " + audioFiles.length);
    if (loaded == audioFiles.length){
        $("#loadingScene").hide();
        $("#most_outer_container").show();
    }
}

setTimeout(() => {
        $("#loadingScene").hide();
        $("#most_outer_container").show();
    }, 8000); // incase preloading fails or taking too long
    
var preloadPlayer = document.getElementById('preloadPlayer');
function play(index) {
    preloadPlayer.src = audioFiles[index];
    preloadPlayer.play();
}
    
    
// we start preloading all the audio files
for (var af of audioFiles) {
    preloadAudio("audio/" + af);
}
