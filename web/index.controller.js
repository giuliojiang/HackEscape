var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope) {

    // Flicker
    setInterval(function(){
        $(".flicker").css('opacity', Math.random() * 2);
    }, 200);

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
        } else {
            $scope.current_level_set(hash);
        }

    };

    $scope.current_level_set = function(new_level, transition_type) {
        console.log("Scene change to: " + new_level)
        if (transition_type == 'fade') {
            $("#black").show();
            $("#black").fadeOut();
        }
        $scope.current_level = new_level;

        if (new_level == 'level1') {
            $scope.intro_start_slideshow(0);
        } else if (new_level == 'bookshelf') {
            setTimeout(() => jQuery( ".bookshelf_book" ).animate({
                            opacity: 1,
                            marginLeft: "-=120"
                            }, 1500), 200);
            
        }
    };

    // Level 1 - Intro text and narration -------------------------------------

    $scope.intro_text = "";
    $scope.intro_text_set = [
        "Welcome",
        "This is not a game",
        "This is real"
    ];

    $scope.intro_start_slideshow = function(idx) {
        if (idx >= $scope.intro_text_set.length) {
            $scope.current_level_set('level2', 'fade');
            return;
        }
        $scope.intro_text = $scope.intro_text_set[idx];
        setTimeout(function() {
            $scope.intro_start_slideshow(idx + 1);
            $scope.$apply();
        }, 3000);
    };

    // Initialization calls ---------------------------------------------------

    get_window_hash();

});
