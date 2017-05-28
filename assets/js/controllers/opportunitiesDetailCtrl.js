'use strict';
/**
 * controller for User Projects
 */
app.controller('OpportunitiesDetailCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {
        $scope.owner = '';

        $scope.creationProjectDate = '';
        $scope.deathLineProject = '';
        $scope.currentProjectActive= '';

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.getOwnerData = function () {
            RestService.fetchUser(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.owner = data[0];
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getOwnerData();

        $scope.getUserName = function (userId) {
            RestService.fetchUser(userId)
                .then(
                    function(data) {
                        $scope.listUserOwners.push(data[0].fullName);
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.possibleInvestmentArray = [];

        $scope.setInvestmentValue = function () {
            localStorageService.set('currentAmountInvestment', $scope.amount);
        };

        $scope.projectRole = function (userId) {
            if (localStorageService.get('currentUserId') == userId) {
                return 'Owner';
            }
            else {
                return 'Financier';
            }
        };

        $scope.investmentCapitalProject = 0;

        $scope.invertionByProjectId = function () {
            RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.invertions = data;

                        for (var i = 0; i<$scope.invertions.length; i++) {
                            $scope.investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                        }

                        $scope.getPossibleInvestment();
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.invertionByProjectId();

        $scope.getPossibleInvestment = function () {
            var remainingInvertion = 0;

            remainingInvertion = parseFloat($scope.currentProjectActive.totalCost) - $scope.investmentCapitalProject;

            var remainingInverters = (parseInt($scope.currentProjectActive.maxNumInves)-$scope.invertions.length);

            var fraction = remainingInvertion/remainingInverters;

            for (var i=0; i<remainingInverters; i++) {
                $scope.possibleInvestmentArray.push((i+1)*parseFloat(fraction));
            }
        };
    }]);
