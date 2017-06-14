'use strict';
/**
 * controller for User Projects
 */
app.controller('FinanceCtrl', ["$scope", "localStorageService", "RestService",
    function ($scope, localStorageService, RestService) {
        $scope.currentProjectActive = '';
        $scope.investmentCapitalProject = '';
        $scope.listAllUser = [];
        $scope.balance = [];
        $scope.invertions = [];

        $scope.investmentCapitalProject = 0;

        $scope.invertionsByProjectId = function () {
            RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.invertions = data;

                        for (var i = 0; i<$scope.invertions.length; i++) {
                            $scope.investmentCapitalProject += parseInt($scope.invertions[i].amount);
                            $scope.balance.push($scope.investmentCapitalProject);
                            $scope.getUserData($scope.invertions[i].userId);
                        }
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.invertionsByProjectId();

        $scope.getUserData = function (userId) {
            RestService.fetchUser(userId)
                .then(
                    function(data) {
                        $scope.listAllUser.push(data[0]);
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getDateProject = function (DateProject) {
            var dateTemp = new Date(DateProject);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.getUserName = function(userId) {
            for (var i=0 ; i<$scope.listAllUser.length; i++) {
                if ($scope.listAllUser[i].id == userId) {
                    return $scope.listAllUser[i].fullName;
                }
            }
        };
    }]);
