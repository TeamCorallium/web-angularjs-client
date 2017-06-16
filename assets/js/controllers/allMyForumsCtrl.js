'use strict';
/**
 * controller for User Projects
 */
app.controller('AllMyForumsCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.allMyForums = [];
            $scope.allProposalsProject = [];
            $scope.allCommentsProject = [];

            $scope.getAllMyForums = function () {
                RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                    .then(
                        function(data) {
                            $scope.allMyForums =  data;

                            for (var i=0; i<$scope.allMyForums.length; i++) {
                                $scope.getProposalCount($scope.allMyForums[i].id);
                                $scope.getCommentsCount($scope.allMyForums[i].id);
                            }
                        },
                        function(errResponse){
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllMyForums();

            $scope.goToForum = function (projectId) {
                localStorageService.set('currentProjectId',projectId);
                $state.go('app.forum.base');
            };

            $scope.getProposalCount = function (projectId) {
                RestService.fetchProposalByProjectId(projectId)
                    .then(
                        function(data) {
                            $scope.allProposalsProject.push(data.length);
                        },
                        function(errResponse){
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getCommentsCount = function (projectId) {
                RestService.fetchAllCommentsById(projectId)
                    .then(
                        function(data) {
                            $scope.allCommentsProject.push(data.length);
                        },
                        function(errResponse){
                            console.log(errResponse);
                        }
                    );
            };
        }
    }]);