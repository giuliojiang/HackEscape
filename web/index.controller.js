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
