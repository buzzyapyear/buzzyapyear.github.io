
buzz.buzzApp.controller('ResumeCtrl', ['$scope', '$timeout', function($scope, $timeout){

    $scope.vars = {
        scrolled: false
    }

    $scope.init = function() {
        console.log('welcome to the resume');

        $(window).scroll(function(){
            $scope.setScrolledState();
        });

        $scope.initProfileChart();
    }

    $scope.setScrolledState = function() {
        var scroll = $(window).scrollTop();

        $timeout(function(){
            $scope.$apply(function(){
                $scope.vars.scrolled = (scroll > 0) ? true : false;
            });
        });
    }

    $scope.initProfileChart = function() {

        var ctx = $('#profile-chart');
        var options = {
            animation:{
                animateScale:true
            },
            legend: {
                display: true,
                position: 'bottom'
            },
            tooltip: {
                display: true
            },
            elements: {
                borderWidth: 4
            }
        };

        var data = {
            labels: [
                'UI Engineer',
                'UX Designer',
                'Ninja',
                'Magician'
            ],
            datasets: [
                {
                    data: [73, 21, 4, 2],
                    backgroundColor: [
                        '#3498DB',
                        '#E74C3C',
                        '#2C3E50',
                        '#ACF0F2'
                    ],
                    hoverBackgroundColor: [
                        '#666666',
                        '#666666',
                        '#666666',
                        '#666666'
                    ]
                }
            ]
        };

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        });
    }

    window.scope = $scope;

}]);