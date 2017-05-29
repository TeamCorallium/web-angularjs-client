'use strict';
/**
 * controller for User Projects
 */
app.controller('SubprojectCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.currentProjectActive = [];

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                        $scope.invertionByProjectId();
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();


        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getCreationProject = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.projectRole = function (userId) {
            if (localStorageService.get('currentUserId') == userId) {
                return 'Owner';
            }
            else {
                return 'Financier';
            }
        };

        $scope.invertionByProjectId = function () {
            RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.invertions = data;

                        for (var i = 0; i<$scope.invertions.length; i++) {
                            if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                                $scope.amount = $scope.invertions[i].amount;
                            }
                        }

                        $scope.getFinancierEsimateRevenue();

                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.estimateRevenueF = 0;

        $scope.getFinancierEsimateRevenue = function () {
            var porcientoF= (parseFloat($scope.amount)/parseFloat($scope.currentProjectActive.totalCost)*100.0);
            var estimateRevenueO = (parseFloat($scope.currentProjectActive.revenueOwner)/100.0)* parseFloat($scope.currentProjectActive.totalRevenue);
            $scope.estimateRevenueF = (porcientoF/100.0)* (parseFloat($scope.currentProjectActive.totalRevenue) - estimateRevenueO);
        }
    }]);
