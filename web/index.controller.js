var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope) {

    // Current level being shown ----------------------------------------------
    $scope.current_level = 'menu';

    var get_window_hash = function() {
        var hash = window.location.hash;
        if (!hash || hash == '') {
            console.info("No hash detected");
            return;
        }
        var hash_split = hash.split('#');
        var hash = hash_split[hash_split.length - 1];

        if (hash == 'level1') {
            console.info("Detected level1 auto-loading");
            $scope.current_level = hash;
            $scope.intro_start_slideshow(0);
        }

    };

    $scope.current_level_set = function(new_level, transition_type) {
        if (transition_type == 'fade') {
            $("#black").show();
            $("#black").fadeOut();
        }
        $scope.current_level = new_level;
        if (new_level == 'level1') {
            $scope.intro_start_slideshow(0);
        }
    };

    // Level 1 - Intro text and narration -------------------------------------

    $scope.intro_text = "";
    $scope.intro_text_set = [
        {
            txt: "Of a secret a legend is about",
            audio: "audio/intro01.ogg"
        },
        {
            txt: "It is said to be written in a book",
            audio: "audio/intro02.ogg"
        },
        {
            txt: "Over the years I searched in the library",
            audio: "audio/intro03.ogg"
        },
        {
            txt: "Until I found this...",
            audio: "audio/intro04.ogg"
        }
    ];

    $scope.intro_start_slideshow = function(idx) {
        if (idx >= $scope.intro_text_set.length) {
            $scope.current_level_set('level2', 'fade');
            return;
        }
        $scope.intro_text = $scope.intro_text_set[idx].txt;
        $scope.playSound($scope.intro_text_set[idx].audio, function() {
            console.info("Audio ended " + $scope.intro_text_set[idx].audio);
            setTimeout(function() {
                $scope.intro_start_slideshow(idx + 1);
                $scope.$apply();
            }, 10);
        });
    };

    // Sound playback functions -----------------------------------------------

    $scope.sound_last_index = 0;
    $scope.playSound = function(srcPath, onEnd) {
        console.info("Start playing " + srcPath);
        var audio_element = document.createElement("audio");
        var element_id = "sound_element_" + $scope.sound_last_index;
        $scope.sound_last_index += 1;
        // Set the element's id
        audio_element.id = element_id;
        audio_element.autostart = "0";
        // Source
        audio_element.src = srcPath;
        // Add to page
        document.body.appendChild(audio_element);
        // OnEnded listener
        audio_element.onended = function() {
            onEnd();
            audio_element.pause();
            audio_element.remove();
        };
        // Start playing
        audio_element.play();
    };

    $scope.music_track = null;
    $scope.playMusic = function(srcPath) {
        // Stop current playing music
        if ($scope.music_track) {
            $scope.music_track.pause();
            $scope.music_track.remove();
        }
        $scope.music_track = document.createElement("audio");
        $scope.music_track.id = "music_element";
        $scope.music_track.autostart = "0";
        $scope.music_track.src = srcPath;
        document.body.appendChild($scope.music_track);
        $scope.music_track.play();
    };

    // Initialization calls ---------------------------------------------------

    get_window_hash();

});
