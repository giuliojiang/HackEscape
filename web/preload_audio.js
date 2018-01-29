var audioFiles = [
"clock4.ogg", "light.wav", "bookOpen.wav", "clockTick.wav", "lion_01.ogg", "book_open_tower.ogg", "doorOpen.wav", "no_fit.ogg", "book_sliding.ogg", "doorUnlock.wav", "outside_locked_01.ogg", "camera.wav", "outside_locked_02.ogg", "chestOpen.wav", "outside_locked_03.ogg", "chest_already_open.ogg", "intro01.ogg", "chest_need_key.ogg", "intro02.ogg", "puzzleOnWall.wav", "chest_need_to_look.ogg", "intro03.ogg", "treasure1.ogg", "chime6.wav", "intro04.ogg", "treasure2.ogg", "clock1.ogg", "intro_wind.ogg", "walking.wav", "clock2.ogg", "itemFound.wav", "wallUpSound.wav", "clock3.ogg", "keyPickUp.wav"
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
    console.log("LOADED:  " + loaded + " vs " + audioFiles.length);
    if (loaded == audioFiles.length){
        $("#loadingScene").hide();
        $("#most_outer_container").show();
    }
}
    
var player = document.getElementById('player');
function play(index) {
    player.src = audioFiles[index];
    player.play();
}
    
    
// we start preloading all the audio files
for (var af of audioFiles) {
    preloadAudio("audio/" + af);
}