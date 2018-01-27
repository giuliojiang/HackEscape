mainApp.controller("level1", function($scope) {

    $scope.choices = [];
    for (var i = 0; i < 10; i++) {
        $scope.choices.push({
            is_this: false
        });
    }
    $scope.choices[7].is_this = true;

    $scope.out_message = "";

    $scope.test_choice = function(a_choice) {
        if (a_choice.is_this) {
            $scope.out_message = "Yes! It's this one!";
        } else {
            $scope.out_message = "Nope! Try again!";
        }
    };

});
