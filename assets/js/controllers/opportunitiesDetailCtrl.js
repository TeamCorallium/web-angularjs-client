'use strict';
/**
 * controller for User Projects
 */
app.controller('OpportunitiesDetailCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.owner = '';

            $scope.creationProjectDate = '';
            $scope.deathLineProject = '';
            $scope.currentProjectActive = '';
            $scope.amount = '';

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentProjectActive = data[0];

                            $scope.getOwnerData();
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProjectById();

            $scope.tasksProject = [];

            $scope.getTaskByProjectsId = function () {
                RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.tasksProject = data;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getTaskByProjectsId();

            $scope.getOwnerData = function () {
                RestService.fetchUser($scope.currentProjectActive.userId)
                    .then(
                        function (data) {
                            $scope.owner = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.categoryArray = ['','Commodities Production', 'Creating a New Business', 'Diversification', 'Property developments', 'Other'];

            $scope.sectorArray = ['', 'Agriculture', 'Industry', 'Technology', 'Engineering','Real State', 'Academic', 'Food industry', 'Other'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getDateProject = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.possibleInvestmentArray = [];

            $scope.setInvestmentValue = function () {
                if ($scope.amount !=  '' && $scope.amount != null) {
                    localStorageService.set('currentAmountInvestment', $scope.amount);
                    $state.go('app.inversion');
                } else {
                    toaster.pop('error', 'Error', 'Please select the amount to invest.');
                }
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
                        function (data) {
                            $scope.invertions = data;

                            for (var i = 0; i < $scope.invertions.length; i++) {
                                $scope.investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                            }

                            $scope.coveredCapital();
                            $scope.getPossibleInvestment();
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.invertionByProjectId();


            //Upgrade While(true)
            $scope.getPossibleInvestment = function () {
                if ($scope.coveredCapitalPercent != 100) {
                    var minimalInvertion = parseInt($scope.currentProjectActive.totalCost/$scope.currentProjectActive.maxNumInves);

                    var remainingInvertion = parseInt($scope.currentProjectActive.totalCost) - $scope.investmentCapitalProject;

                    var remainingNumMinInvestors = parseInt($scope.currentProjectActive.minNumInves) - $scope.invertions.length;

                    var myInvertion = 0;

                    for (var i=0; i<$scope.invertions.length;  i++) {
                        if ($scope.invertions[i].userId == localStorageService.get('currentUserId')) {
                            myInvertion = parseInt($scope.invertions[i].amount);
                        }
                    }

                    if (myInvertion < ($scope.currentProjectActive.totalCost - (minimalInvertion * (remainingNumMinInvestors - 1)))){

                        var n = 0;

                        while (true) {
                            var a = remainingInvertion - n * minimalInvertion;
                            console.log(a + " a");
                            if ((a >= minimalInvertion)) {
                                if ((remainingNumMinInvestors > 0) && (a > (remainingInvertion - (minimalInvertion * (remainingNumMinInvestors - 1))))) {
                                    n += 1;
                                    continue;
                                }
                                $scope.possibleInvestmentArray.push(a);
                            } else {
                                break;
                            }

                            n += 1;
                        }
                    }
                }
            };

            $scope.estimateRevenueF = 0;

            $scope.estimatePersonalRevenue = function () {
                var porcientoF = (parseFloat($scope.amount) / parseFloat($scope.currentProjectActive.totalCost) * 100.0);

                var estimateRevenueO = (parseFloat($scope.currentProjectActive.revenueOwner) / 100.0) * parseFloat($scope.currentProjectActive.totalRevenue);
                $scope.estimateRevenueF = (porcientoF / 100.0) * (parseFloat($scope.currentProjectActive.totalRevenue) - estimateRevenueO);
            };

            $scope.coveredCapital = function () {
                $scope.coveredCapitalPercent = ($scope.investmentCapitalProject / parseFloat($scope.currentProjectActive.totalCost)) * 100;
            };

            $scope.goToOpportunitiesTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $state.go('app.project.opportunities_task_detail');
            };

            $scope.goToExploreUserProfile = function (userId) {
                localStorageService.set('viewUserProfileId', userId);
                $state.go('app.pages.exploreuser');
            };
        }
    }]);
