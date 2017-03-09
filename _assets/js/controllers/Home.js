
buzz.buzzApp.controller('HomeCtrl', ['$scope', '$timeout',
                                     function($scope, $timeout){

    $scope.vars = {
        
    }

    $scope.init = function() {
        console.log('welcome to chrisyap.com');
    }

    window.scope = $scope;

}]);