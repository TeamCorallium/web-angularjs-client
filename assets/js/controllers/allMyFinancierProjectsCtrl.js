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
            $scope.allFinancierAbstracts = [];


            $scope.getAllMyFincancierProjects = function () {
                RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                    .then(
                        function (data) {
                            $scope.allMyFincancierProjects = data;

                            for (var i = 0; i < $scope.allMyFincancierProjects.length; i++) {
                                if ($scope.allMyFincancierProjects[i].inverted){
                                    var forumAbstract = {
                                        id: $scope.allMyFincancierProjects[i].id,
                                        name: $scope.allMyFincancierProjects[i].projectName,
                                        description: $scope.allMyFincancierProjects[i].description,
                                        ownerInvestedCapital: parseFloat($scope.allMyFincancierProjects[i].ownerInvestedCapital),
                                        balance: '',
                                    };
                                    $scope.allFinancierAbstracts.push(forumAbstract);
                                    $scope.invertionsByProjectId($scope.allMyFincancierProjects[i].id);
                                }
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