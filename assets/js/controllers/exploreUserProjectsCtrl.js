'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreUserProjectsCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

            $scope.allProjects = [];
            $scope.owner = '';

            $scope.getAllProjects = function () {
                RestService.fetchSimpleProjects(localStorageService.get('viewUserProfileId'))
                    .then(
                        function (data) {
                            $scope.allProjects = data;
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getAllProjects();

            $scope.getOwnerData = function () {
                RestService.fetchUser(localStorageService.get('viewUserProfileId'))
                    .then(
                        function (data) {
                            $scope.owner = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getOwnerData();

            $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getProjectDate = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.goToExploreProject = function (projectId) {
                localStorageService.set('currentProjectId', projectId);
                $state.go('app.project.explore_subproject');
            };

            $scope.isFollowProject = function (projectId) {
                var followFlag = false;

                if (localStorageService.get('isLogged')) {

                    if ($scope.owner.projectsFollow) {
                        for (var i = 0; i < $scope.owner.projectsFollow.length; i++) {
                            if (projectId == $scope.owner.projectsFollow[i]) {
                                followFlag = true;
                                break;
                            }
                        }
                    }
                }

                return followFlag;
            };

            $scope.follow = function (projectId) {

                if (localStorageService.get('isLogged')) {

                    if (!$scope.owner.projectsFollow) {
                        $scope.owner.projectsFollow = [];
                    }
                    $scope.owner.projectsFollow.push(projectId);

                    $scope.updateUser();
                }
                else {
                    toaster.pop('error', 'Error!!!', 'Must be login first.');
                }
            };

            $scope.unfollow = function (projectId) {
                for (var i = 0; i < $scope.owner.projectsFollow.length; i++) {
                    if (projectId == $scope.owner.projectsFollow[i]) {
                        $scope.owner.projectsFollow.splice(i, 1);
                        break;
                    }
                }
                $scope.updateUser();
            };

            $scope.viewProfile = function (userId) {
                localStorageService.set('viewUserProfileId', userId);
                $state.go('app.pages.exploreuser');
            };
    }]);
