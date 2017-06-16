'use strict';
/**
 * controller for Fincancier Projects
 */
app.controller('AllMyFinancierProjectsCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.allMyFincancierProjects = [];
            $scope.allBalanceProjects = [];

            $scope.getAllMyFincancierProjects = function () {
                RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.allMyFincancierProjects = data;

                            for (var i = 0; i < $scope.allMyFincancierProjects.length; i++) {
                                $scope.invertionsByProjectId($scope.allMyFincancierProjects[i].id);
                            }
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllMyFincancierProjects();

            $scope.invertions = [];
            $scope.investmentCapitalProject = 0;

            $scope.invertionsByProjectId = function (projectId) {
                RestService.fetchInvertionByProjectId(projectId)
                    .then(
                        function (data) {
                            $scope.invertions = data;

                            for (var i = 0; i < $scope.invertions.length; i++) {
                                $scope.investmentCapitalProject += parseInt($scope.invertions[i].amount);
                            }

                            $scope.allBalanceProjects.push(parseInt($scope.investmentCapitalProject));

                            $scope.investmentCapitalProject = 0;
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.goToFinancierProject = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $state.go('app.finance');
            };
        }
    }]);