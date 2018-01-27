var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope) {

    // Flicker
    setInterval(function(){
        $(".flicker").css('opacity', Math.random() * 2);
    }, 200);

    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    // setTimeout(
    // $(".hover_obj").mouseover(function() {
    //     alert();
    //     $(this).attr("src", $(this).attr("src").replace('.png', '_hover.png'));
    // }), 200);


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
            $scope.intro_start_slideshow();
        } else {
            $scope.current_level_set(hash);
        }

    };

    $scope.book_from_shelf = () => {
        setTimeout(() => jQuery( ".bookshelf_book" ).animate({
                        opacity: 1,
                        marginLeft: "-=120"
                        }, 1500), 200);
        setTimeout(() => {
            console.info("switching to menu");
            $scope.current_level_set("bookshelf_open", "fade");
            $scope.$apply();
        }, 1800)
    };

    $scope.current_level_set = function(new_level, transition_type) {
        console.log("Scene change to: " + new_level)
        if (transition_type == 'fade') {
            $("#black").show();
            $("#black").fadeOut();
        }
        $scope.current_level = new_level;

        if (new_level == 'level1') {
            $scope.playMusic("audio/intro_wind.ogg");
            $scope.intro_start_slideshow();
        } else if (new_level == 'bookshelf_open') {
            $scope.playMusic("audio/fire_ambiance.ogg");
        } else if (new_level == "outside") {
            $scope.playMusic("audio/outside_night.ogg");
        }
    };

    // Level 1 - Intro text and narration -------------------------------------

    $scope.narration = {
        intro: "",
        bookshelf: "",
        outside_door: "",
        lion: ""
    };

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

    $scope.play_voice_sequence = function(data_list, text_location, on_finish) {
        var vs_func = function(idx) {
            if (idx >= data_list.length) {
                on_finish();
                return;
            }
            $scope.narration[text_location] = data_list[idx].txt;
            $scope.playSound(data_list[idx].audio, function() {
                console.info("Audio ended " + data_list[idx].audio);
                setTimeout(function() {
                    vs_func(idx + 1);
                    $scope.$apply();
                }, 10);
            });
        };
        vs_func(0);
    };

    $scope.intro_start_slideshow = function() {
        console.info("Starting intro slideshow");
        //                         dataset               $scope.narration.?  onend
        $scope.play_voice_sequence($scope.intro_text_set, "intro", function() {
            $scope.current_level_set('bookshelf', 'fade');
            $scope.$apply();
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
    $scope.music_track_playing_name = null;
    $scope.playMusic = function(srcPath) {
        // If we are already playing this, keep playing it
        if (srcPath == $scope.music_track_playing_name) {
            return;
        }
        // Stop current playing music
        if ($scope.music_track) {
            // Fade out
            $($scope.music_track).animate({volume: 0}, 1000, function() {
                $scope.music_track.pause();
                $scope.music_track.remove();
                $scope.music_track = null;
                setTimeout(function() {
                    $scope.playMusic(srcPath);
                }, 500);
                return;
            });
            return;
        }
        $scope.music_track_playing_name = srcPath;
        $scope.music_track = document.createElement("audio");
        $scope.music_track.id = "music_element";
        $scope.music_track.autostart = "0";
        $scope.music_track.src = srcPath;
        document.body.appendChild($scope.music_track);
        $scope.music_track.volume = 0;
        // Repetition play
        $scope.music_track.onended = function() {
            $scope.music_track.play();
        };
        $scope.music_track.play();
        $($scope.music_track).animate({volume: 1}, 500, function() {
        });
    };

    // Booshelf Open Voice ----------------------------------------------------

    $scope.bookshelf_open_tower_voice_playing = false;

    $scope.bookshelf_open_data = {
        img: "img/qtower_black.png"
    };

    $scope.bookshelf_open_tower_voice = function() {
        $scope.bookshelf_open_data.img = 'img/queenstower_hover.png';
        console.info("imgsrc2 is now " + $scope.imgsrc2);

        console.info("$scope.bookshelf_open_tower_voice");
        if ($scope.bookshelf_open_tower_voice_playing) {
            return;
        }
        $scope.bookshelf_open_tower_voice_playing = true;
        $scope.playSound("audio/book_open_tower.ogg", function() {
            $scope.bookshelf_open_tower_voice_playing = false;
        });
    };

    $scope.bookshelf_open_mouseout = function() {
        $scope.bookshelf_open_data.img = "img/qtower_black.png";
    };

    $scope.bookshelf_open_click_tower = function() {
        $scope.current_level_set("outside", "fade");
    };

    // Player's inventory -----------------------------------------------------

    $scope.inventory_list = [
        "key",
        "book",
        "phone"
    ];

    $scope.inventory = {};
    for (var i = 0; i < $scope.inventory_list.length; i++) {
        $scope.inventory[$scope.inventory_list[i]] = false;
    }

    $scope.inventory_is_visible = function() {
        var scenes_with_inventory = {
            "bookshelf_open": true,
            "outside": true,
            "lion": true
        };
        return !!scenes_with_inventory[$scope.current_level];
    };

    $scope.inventory_item_click = function(item_name) {
        console.info("Player clicked on inventory item " + item_name);
    };

    $scope.inventory_get_class = function(item_name) {
        if ($scope.inventory[item_name]) {
            // Item present
            return "inventory_item_present";
        } else {
            // Item not present
            return "inventory_item_missing";
        }
    };

    // Outside ----------------------------------------------------------------

    $scope.outside_door_click_playing = false;

    $scope.outside_door_click = function() {
        if ($scope.inventory.key) {
            // Player has the key
            console.info("Player has the key. Opening doors...");
        } else {
            // Player doesn't have the keys
            if ($scope.outside_door_click_playing) {
                console.info("Already playing");
                return;
            }
            $scope.outside_door_click_playing = true;
            $scope.play_voice_sequence([
                {
                    txt: "It's locked",
                    audio: "audio/outside_locked_01.ogg"
                },
                {
                    txt: "I need to find a key somewhere",
                    audio: "audio/outside_locked_02.ogg"
                },
                {
                    txt: "Maybe I should look around",
                    audio: "audio/outside_locked_03.ogg"
                }
            ], "outside_door", function() {
                $scope.outside_door_click_playing = false;
            });
        }
    };

    $scope.outside_lion_click = function() {
        $scope.current_level_set("lion", "fade");
    };

    // Lion -------------------------------------------------------------------

    $scope.lion_voice_playing = false;

    $scope.play_lion_voice = function() {
        if ($scope.lion_voice_playing) {
            console.info("Already playing");
            return;
        }
        $scope.lion_voice_playing = true;
        $scope.play_voice_sequence([
            {
                txt: "Something is missing here",
                audio: "audio/lion_01.ogg"
            }
        ], "lion", function() {
            $scope.lion_voice_playing = false;
        });
    };

    $scope.lion_click = function() {
        $scope.play_lion_voice();
    };

    $scope.lion_back = function() {
        $scope.current_level_set("outside", "fade");
    };

    // Initialization calls ---------------------------------------------------

    get_window_hash();

});
