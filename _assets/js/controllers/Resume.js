
buzz.buzzApp.controller('ResumeCtrl', ['$scope', '$timeout', function($scope, $timeout){

    $scope.vars = {
        
    }

    $scope.init = function() {
        console.log('welcome to the resume');

        $scope.initProfileChart();
    }

    $scope.initProfileChart = function() {

        console.log('chart');

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
                        '#33ccff',
                        '#2C3E50'
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