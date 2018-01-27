var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope) {

    // Current level being shown ----------------------------------------------
    $scope.current_level = 'intro';
    $scope.current_level_set = function(new_level, transition_type) {
        if (transition_type == 'fade') {
            $("#black").show();
            $("#black").fadeOut();
        }
        $scope.current_level = new_level;
    };

});
