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
            $scope.allForumsAbstracts = [];

            $scope.getAllMyForums = function () {
                RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                    .then(
                        function(data) {
                            $scope.allMyForums =  data;

                            for (var i=0; i<$scope.allMyForums.length; i++) {

                                if ($scope.allMyForums[i].inverted ||
                                    ($scope.allMyForums[i].userId == localStorageService.get('currentUserId') &&
                                    $scope.allMyForums[i].ownerInvestedCapital > 0)) {
                                    var abstractForum = {
                                        projectId: '',
                                        proposalsCount: '',
                                        commentsCount: '',
                                        projectName: '',
                                        projectDescription: ''
                                    };

                                    abstractForum.projectId = $scope.allMyForums[i].id;
                                    abstractForum.projectName = $scope.allMyForums[i].projectName;
                                    abstractForum.projectDescription = $scope.allMyForums[i].description;
                                    $scope.getProposalCount(abstractForum.projectId);
                                    $scope.getCommentsCount(abstractForum.projectId);
                                    $scope.allForumsAbstracts.push(abstractForum);
                                }
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
                            var count = data.length;

                            for (var i = 0; i <$scope.allForumsAbstracts.length; i++) {
                                if ($scope.allForumsAbstracts[i].projectId == projectId)  {
                                    $scope.allForumsAbstracts[i].proposalsCount = count;
                                    break;
                                }
                            }
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
                            var count = data.length;

                            for (var i = 0; i <$scope.allForumsAbstracts.length; i++) {
                                if ($scope.allForumsAbstracts[i].projectId == projectId)  {
                                    $scope.allForumsAbstracts[i].commentsCount = count;
                                    break;
                                }
                            }
                        },
                        function(errResponse){
                            console.log(errResponse);
                        }
                    );
            };
        }
    }]);