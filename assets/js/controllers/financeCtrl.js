'use strict';
/**
 * controller for User Projects
 */
app.controller('FinanceCtrl', ["$scope", "localStorageService", "RestService","$state","toaster",
    function ($scope, localStorageService, RestService,$state,toaster) {
        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentProjectActive = '';
            $scope.investmentCapitalProject = 0;
            $scope.listFinanceAbstract = [];
            $scope.balance = [];
            $scope.transactions = [];

            $scope.investmentCapitalProject = 0;
            $scope.income = 0;
            $scope.outcome = 0;

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentProjectActive = data[0];

                            if ($scope.currentProjectActive.ownerInvestedCapital > 0) {
                                var financeAbstract = {
                                    id: $scope.listFinanceAbstract.length,
                                    userId: $scope.currentProjectActive.userId,
                                    name: '',
                                    operation: 'income',
                                    date: $scope.currentProjectActive.creationDate,
                                    total: $scope.currentProjectActive.ownerInvestedCapital,
                                    balance: $scope.currentProjectActive.ownerInvestedCapital
                                };

                                $scope.investmentCapitalProject += parseFloat($scope.currentProjectActive.ownerInvestedCapital);
                                $scope.income += parseFloat($scope.currentProjectActive.ownerInvestedCapital);
                                $scope.listFinanceAbstract.push(financeAbstract);
                                $scope.getUserData(financeAbstract.userId, financeAbstract.id);
                            }
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProjectById();

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

                                var financeAbstract = {
                                    id: $scope.listFinanceAbstract.length,
                                    userId: $scope.transactions[i].userId,
                                    name: '',
                                    operation: $scope.transactions[i].operation,
                                    date: $scope.transactions[i].date,
                                    total: $scope.transactions[i].amount,
                                    balance: $scope.investmentCapitalProject
                                };

                                $scope.listFinanceAbstract.push(financeAbstract);
                                $scope.getUserData(financeAbstract.userId, financeAbstract.id);
                            }
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.invertionsByProjectId();

            $scope.getUserData = function (userId, id) {
                RestService.fetchUser(userId)
                    .then(
                        function (data) {
                            var user = data[0];

                            for (var i=0; i<$scope.listFinanceAbstract.length; i++) {
                                if ($scope.listFinanceAbstract[i].id == id) {
                                    $scope.listFinanceAbstract[i].name = user.fullName;
                                    break;
                                }
                            }
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getDateProject = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };
        }
    }]);
