var mainApp = angular.module("mainApp", [ '720kb.tooltips' ]);

mainApp.controller("main_controller", function($scope) {
    $scope.phoneMsg = '';
    $scope.phoneLoading = false;
    $scope.showPhone = false;
    $scope.togglePhone = function() {
        $scope.showOrHidePhone(!$scope.showPhone);
    };

    $scope.showOrHidePhone = function(showBool) {
        $scope.showPhone = showBool;
        $scope.latestResults = jQuery.extend({}, latestResults);
        latestResults = {
           mostLikely: { name: "", prob: -1 } // Empty string means unknown
        };
        $scope.phoneMsg = '';
    };



    // PHone stuff
    setInterval(function() {
        $scope.latestResults = jQuery.extend({}, latestResults);
        latestResults = {
           mostLikely: { name: "", prob: -1 } // Empty string means unknown
        };
        if ($scope.latestResults.mostLikely.prob != -1) {
            $scope.phoneHandler();
        }
        // console.log("PLEASE WORK Latest Results", $scope.latestResults);
        
    }, 50);

    $scope.phoneHandler = function() {
        console.log("phone handler", $scope.latestResults)
        if ($scope.latestResults.mostLikely.prob < 0.05 || $scope.latestResults.mostLikely.name == "" || !$scope.latestResults.mostLikely.name) {
            $scope.phoneMsg = "I'm not sure what that item is, please scan it again."
            return $scope.$apply();
        }
        if ($scope.latestResults.mostLikely.name != "key") {
            $scope.phoneMsg = "I don't think I need the "+$scope.latestResults.mostLikely.name+" right now.";
            return $scope.$apply();
        }
        // Care that the item is supported.
        $scope.phoneMsg = `You have successfully received a ${$scope.latestResults.mostLikely.name}!`;
        $scope.inventory_add_item("key");
        $scope.showOrHidePhone(false);
        $scope.$apply();
    };

    // Flicker
    setInterval(function(){
        $(".flicker").css('opacity', Math.random() * 3);
    }, 200);

    setInterval(function(){
        $(".flickerBright").css('opacity', Math.random() * 4);
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

        // Play sliding sound
        $scope.playSound("audio/book_sliding.ogg");

        // Add book to player's inventory
        $scope.inventory_add_item("book");
    };

    $scope.current_level_set = function(new_level, transition_type) {
        console.log("Scene change to: " + new_level)
        if (transition_type == 'fade') {
            $("#black").show();
            $("#black").fadeOut();
        }
        $scope.current_level = new_level;

        if (new_level == 'level1') {
            // $scope.playMusic("audio/intro_wind.ogg");
            $scope.intro_start_slideshow();
        } else if (new_level == 'bookshelf_open') {
            $scope.playSound("audio/bookOpen.wav");
            setTimeout(function() {
                $scope.playSound("audio/book_open_tower.ogg", function() {
                });
            }, 500);
        } else if (new_level == "outside") {
            $scope.playSound("audio/walking.wav");
            // $scope.playMusic("audio/outside_night.ogg");
        } else if (new_level == "ending") {
            $scope.playMusic("audio/ending.wav");
                    setTimeout(() => jQuery( "#ending_black" ).animate({
                        opacity: 0,
                        },4000), 200);
                    // setTimeout(() => jQuery( "#ending_light" ).animate({
                    //     opacity: 1,
                    //     }, 6000), 1000);
                    setTimeout(() => jQuery( "#ending_big" ).animate({
                        top: 0
                        }, 6000), 4000);
        } else if (new_level == "qtr") {
            console.log($scope.inventory)
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

    $scope.playing = {};

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
            if (onEnd) {
                onEnd();
            }
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

    // MAIN BACKGROUND MUSIC BGM
    $scope.playMusic("audio/bgm.mp3");

    // Booshelf Open Voice ----------------------------------------------------

    $scope.bookshelf_open_data = {
        img: "img/qtower_black.png"
    };

    $scope.heardQTvoice = false;
    $scope.bookshelf_open_tower_voice = function() {
        $scope.bookshelf_open_data.img = 'img/queenstower_hover.png';
        if ($scope.heardQTvoice) return;
        $scope.heardQTvoice = true;
        console.info("imgsrc2 is now " + $scope.imgsrc2);
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
        "phone",
        "Puzzle 1",
        "Puzzle 2",
        "Puzzle 3",
        "Puzzle 4",
        "Minute Hand",
        "Hour Hand"
    ];

    $scope.inventory_extra = {
        selected: null
    };

    $scope.inventory = {};
    for (var i = 0; i < $scope.inventory_list.length; i++) {
        $scope.inventory[$scope.inventory_list[i]] = false;
    }

    $scope.inventory_is_visible = function() {
        // var scenes_with_inventory = {
        //     "bookshelf_open": true,
        //     "outside": true,
        //     "lion": true
        // };
        return $scope.is_game_scene();
    };

    $scope.is_game_scene = function() {
        return !["menu", "level1"].includes($scope.current_level);
    }

    $scope.inventory_item_click = function(item_name) {
        console.info("Player clicked on inventory item " + item_name);
        if ($scope.inventory_extra.selected == item_name) {
            $scope.inventory_extra.selected = null;
        } else {
            $scope.inventory_extra.selected = item_name;
        }
    };

    $scope.inventory_get_class = function(item_name) {
        if ($scope.inventory[item_name]) {
            var cls = "inventory_item_present";
            if ($scope.inventory_extra.selected == item_name) {
                cls += " inventory_item_highlight";
            }
            return cls;
        } else {
            // Item not present
            return "inventory_item_missing";
        }
    };

    $scope.inventory_add_item = function(item_name) {
        if (item_name == "key") {
            $scope.obtainedKey = true;
            $scope.playSound("audio/keyPickUp.wav");
        } else {
            $scope.playSound("audio/itemFound.wav");
        }
        $scope.inventory[item_name] = true;
    };

    $scope.inventory_remove_item = function(item_name) {
        $scope.inventory[item_name] = false;
    };

    $scope.inventory_empty = function() {
        for (var i = 0; i < $scope.inventory_list.length; i++) {
            if ($scope.inventory[$scope.inventory_list[i]]) {
                return false;
            }
        }
        return true;
    };

    // Ground Stuff Floor (CHEST PUZZLE)
    $scope.obtainedKey = false;

    $scope.playing.chest_need_open = false;
    $scope.play_chest_need_open = function() {
        if ($scope.playing.chest_need_open) {
            return;
        }
        $scope.play_chest_need_open = true;
        $scope.playSound("audio/chest_need_to_look.ogg", function() {
            $scope.play_chest_need_open = false;
        });
    };

    $scope.goUpGroundStairs = function() {
        if (!$scope.chest_opened) {
            $scope.play_chest_need_open();
            return;
        }
        $scope.inventory_add_item("Puzzle 4")
        $scope.current_level_set("cr", "fade");
    }

    $scope.playing.chest_already_open = false;
    $scope.play_chest_already_open_voice = function() {
        if ($scope.playing.chest_already_open) {
            return;
        }
        $scope.playing.chest_already_open = true;
        $scope.playSound("audio/chest_already_open.ogg", function() {
            $scope.playing.chest_already_open = false
        });
    };

    $scope.chest_opened = false;
    // $scope.inventory_add_item("key");
    $scope.openChest = function() {
        if ($scope.chest_opened) {
            $scope.play_chest_already_open_voice
            return;
        }
        if (!$scope.inventory.key) {
            playSound("audio/chest_need_key.ogg");
            return;
        }

        $scope.inventory_add_item("Puzzle 2")
        $scope.inventory_add_item("Puzzle 3")
        $scope.chest_opened = true;
        $scope.inventory_remove_item("key");
        $scope.playSound("audio/chestOpen.wav");
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
                    txt: "It's locked.",
                    audio: "audio/outside_locked_01.ogg"
                },
                // {
                //     txt: "I need to find a key somewhere",
                //     audio: "audio/outside_locked_02.ogg"
                // },
                {
                    txt: "Maybe I should look around.",
                    audio: "audio/outside_locked_03.ogg"
                }
            ], "outside_door", function() {
                $scope.outside_door_click_playing = false;
            });
        }
    };


    // QTR STUFF
    // $scope.inventory_add_item("Puzzle 1");
    // $scope.inventory_add_item("Puzzle 2");
    // $scope.inventory_add_item("Puzzle 3");
    // $scope.inventory_add_item("Puzzle 4");
    // $scope.inventory_add_item("book");

    $scope.entrance_opened = false;
    $scope.doneAllSlots = false;
    $scope.doneSlot = [false, true, true, true, false];

    $scope.open_qtr_puzzle = function() {     
        $scope.playSound("audio/wallUpSound.wav");
        setTimeout(() => jQuery( "#qtr_wall" ).animate({
                        opacity: 1,
                        marginTop: "-700px"
                        }, 3000), 400);
        setTimeout(() => { $scope.current_level_set("ending"); $scope.$apply(); }, 3100);
    }

    $scope.qtrClick = function(slot) {
        if ($scope.doneSlot[slot]) return;
        if ($scope.inventory_extra.selected != "Puzzle "+slot) {
            alert("This puzzle piece doesn't quite fit there. I should try somewhere else.");
            return;
        }

        $scope.playSound("audio/puzzleOnWall.wav");
        $scope.inventory_remove_item("Puzzle "+slot);
        $scope.doneSlot[slot] = true;
        console.log("Slot status:", $scope.doneSlot);
        $scope.doneAllSlots = $scope.doneSlot[1] && $scope.doneSlot[2] && $scope.doneSlot[3] && $scope.doneSlot[4];

        if ($scope.doneAllSlots) {
            $scope.open_qtr_puzzle();
        }
    };

    $scope.open_entrance = function() {
        if ($scope.entrance_opened) return; // Already opened so dont reopen
        $scope.entrance_opened = true;
        $scope.inventory_add_item("Puzzle 1");
        $scope.playSound("audio/light.wav");
        setTimeout(() => $( "#left_door" ).animate({
                opacity: 1,
                width: "0px",
                height: "437px"
                }, 1500), 200);
        setTimeout(() => $( "#right_door" ).animate({
                opacity: 1,
                width: "0px",
                height: "437px",
                marginLeft: "130px"
                }, 1500), 200);


        setTimeout(() => { $scope.current_level_set("ground"); $scope.$apply() }, 1600);
    };

    $scope.outside_lion_click = function() {
        $scope.current_level_set("lion", "fade");
    };

    // Lion -------------------------------------------------------------------

    $scope.lion_status = {
        active: false
    };

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
        if ($scope.lion_status.active) {
            console.info("Lion is already active");
            return;
        }


        if ($scope.inventory_extra.selected == "book") {
            $scope.lion_status.active = true;
            $scope.inventory_remove_item("book");
            $scope.playSound("audio/book_sliding.ogg");
            setTimeout(() => $scope.playSound("audio/doorUnlock.wav"), 2000);


            setTimeout(() => jQuery( "#lion_book" ).animate({
                        opacity: 1,
                        marginLeft: "+=70"
                        }, 1500), 200);
            setTimeout(() => { $scope.current_level_set("entrance", "fade"); $scope.$apply(); }, 1800);
        } else {
            $scope.play_lion_voice();
        }
    };

    $scope.lion_back = function() {
        $scope.current_level_set("outside", "fade");
    };

    // CLOCK STUFF HERE
    $scope.clock = {
        zoomed: false,
        minute: 'ne',
        hour: 'sw'
    }
    $scope.completed_clock = function() {
        return $scope.clock.hour == 's' && $scope.clock.minute == 'n';
    }
    $scope.zoom_clock = function() {
        $scope.clock.zoomed = true;
    }
    $scope.clock_put = function(where) {
        if ($scope.clock.hour == where) {
            $scope.inventory_add_item("Hour Hand");
            $scope.clock.hour = "";
        } 
        else if ($scope.clock.minute == where) {
            $scope.inventory_add_item("Minute Hand");
            $scope.clock.minute = "";
        }
        else if ($scope.inventory_extra.selected == "Hour Hand") {
            $scope.inventory_remove_item("Hour Hand");
            $scope.clock.hour = where;
        } else if ($scope.inventory_extra.selected == "Minute Hand") {
            $scope.inventory_remove_item("Minute Hand");
            $scope.clock.minute = where;
        }

        if ($scope.completed_clock()) {
            $scope.playSound("audio/clockTick.wav");
            setTimeout(() => { $scope.playSound("audio/chime6.wav"); }, 2000);
            setTimeout(() => { $scope.current_level_set("qtr"); $scope.$apply() }, 4000);
            
            $scope.clock.zoomed = false;
            $scope.playSound("audio/doorOpen.wav");

            setTimeout(() => $( "#cd_door" ).animate({
                    opacity: 1,
                    width: "0px",
                    height: "465px",
                    marginLeft: "397px"
                    }, 1500), 200);

        }
        console.log($scope.clock);
    }




    // Initialization calls ---------------------------------------------------

    get_window_hash();

    // EVERYTHING BELOW THIS LINE IS THE VISION API MICROSOFT

});
