'use strict';
/**
 * controller for User Projects
 */
app.controller('FinanceCtrl', ["$scope", "localStorageService", "RestService","$state",
    function ($scope, localStorageService, RestService,$state) {
        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentProjectActive = '';
            $scope.investmentCapitalProject = '';
            $scope.listAllUser = [];
            $scope.balance = [];
            $scope.transactions = [];

            $scope.investmentCapitalProject = 0;
            $scope.income = 0;
            $scope.outcome = 0;

            $scope.invertionsByProjectId = function () {
                RestService.fetchTransactionsByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.transactions = data;

                            for (var i = 0; i < $scope.transactions.length; i++) {
                                if($scope.transactions[i].operation == 'income'){
                                    $scope.investmentCapitalProject += parseInt($scope.transactions[i].amount);
                                    $scope.income += parseInt($scope.transactions[i].amount);
                                } else {
                                    $scope.investmentCapitalProject -= parseInt($scope.transactions[i].amount);
                                    $scope.outcome += parseInt($scope.transactions[i].amount);
                                }

                                $scope.balance.push($scope.investmentCapitalProject);
                                $scope.getUserData($scope.transactions[i].userId);
                            }
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.invertionsByProjectId();

            $scope.getUserData = function (userId) {
                RestService.fetchUser(userId)
                    .then(
                        function (data) {
                            $scope.listAllUser.push(data[0]);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getUserName = function (userId) {
                for (var i = 0; i < $scope.listAllUser.length; i++) {
                    if ($scope.listAllUser[i].id == userId) {
                        return $scope.listAllUser[i].fullName;
                    }
                }
            };

            $scope.getDateProject = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };
        }
    }]);
