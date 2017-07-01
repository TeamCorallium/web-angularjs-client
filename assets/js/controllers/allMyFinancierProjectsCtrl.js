'use strict';
/**
 * controller for Fincancier Projects
 */
app.controller('AllMyFinancierProjectsCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.allMyFinancierProjects = [];
            $scope.allFinancierAbstracts = [];


            $scope.getallMyFinancierProjects = function () {
                RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.allMyFinancierProjects = data;

                            for (var i = 0; i < $scope.allMyFinancierProjects.length; i++) {
                                if ($scope.allMyFinancierProjects[i].inverted ||
                                    ($scope.allMyFinancierProjects[i].userId == localStorageService.get('currentUserId') &&
                                    $scope.allMyFinancierProjects[i].ownerInvestedCapital > 0)) {
                                    var forumAbstract = {
                                        id: $scope.allMyFinancierProjects[i].id,
                                        name: $scope.allMyFinancierProjects[i].projectName,
                                        description: $scope.allMyFinancierProjects[i].description,
                                        ownerInvestedCapital: parseFloat($scope.allMyFinancierProjects[i].ownerInvestedCapital),
                                        balance: '',
                                    };
                                    $scope.allFinancierAbstracts.push(forumAbstract);
                                    $scope.invertionsByProjectId($scope.allMyFinancierProjects[i].id);
                                }
                            }
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getallMyFinancierProjects();

            $scope.invertions = [];

            $scope.invertionsByProjectId = function (projectId) {
                RestService.fetchInvertionByProjectId(projectId)
                    .then(
                        function (data) {
                            $scope.invertions = data;

                            var investmentCapitalProject = 0;

                            for (var i = 0; i < $scope.invertions.length; i++) {
                                investmentCapitalProject += parseInt($scope.invertions[i].amount);
                            }

                            for (var i=0; i<$scope.allFinancierAbstracts.length; i++) {
                                if ($scope.allFinancierAbstracts[i].id == projectId) {
                                    investmentCapitalProject += $scope.allFinancierAbstracts[i].ownerInvestedCapital;
                                    $scope.allFinancierAbstracts[i].balance = investmentCapitalProject;
                                }
                            }

                            investmentCapitalProject = 0;
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