'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreSubprojectCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (localStorageService.get('isLogged') == null || localStorageService.get('isLogged') == 'false') {
            $scope.logged = false;
        } else {
            $scope.logged = true;
        }

        $scope.currentProjectActive = '';
        $scope.owner = '';

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function (data) {
                        $scope.currentProjectActive = data[0];
                        $scope.getUserData();
                    },
                    function (errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.getUserData = function () {
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

        $scope.tasksProject = [];

        $scope.getTaskByProjectsId = function () {
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function (data) {
                        $scope.tasksProject = data;
                    },
                    function (errResponse) {
                        toaster.pop('error', 'Error', 'Problems occurred while getting the tasks.');
                    }
                );
        };

        $scope.getTaskByProjectsId();

        $scope.goToExploreTask = function (taskId) {
            localStorageService.set('currentTaskId', taskId);
            $state.go('app.project.explore_task_detail');
        };

        $scope.goToExploreUserProfile = function (userId) {
            localStorageService.set('viewUserProfileId', userId);
            $state.go('app.pages.exploreuser');
        };

        $scope.invertions = [];
        $scope.investmentCapitalProject = 0;

        $scope.invertionByProjectId = function () {
            RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function (data) {
                        $scope.invertions = data;

                        for (var i = 0; i < $scope.invertions.length; i++) {
                            $scope.investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.invertionByProjectId();

        $scope.getOwnerData = function () {
            RestService.fetchUser(localStorageService.get('currentUserId'))
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

        $scope.updateUser = function () {
            RestService.updateUser($scope.owner)
                .then(
                    function (data) {
                        toaster.pop('success', 'Good!!!', 'User updated correctly.');
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
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

        $scope.getDuration =  function () {
            var weeks = parseInt($scope.currentProjectActive.estimateDuration / 7);
            var days = parseInt($scope.currentProjectActive.estimateDuration % 7);

            var text = '';

            if (weeks > 0) {
                if (weeks == 1) {
                    text = weeks + " week";
                } else {
                    text = weeks + " weeks";
                }

                if (days!=0) {
                    text+= " and ";
                    if (days == 1) {
                        text+= days + " day"
                    } else {
                        text+= days + " days"
                    }
                }
            } else {
                if (days == 1) {
                    text = days + " day"
                } else {
                    text = days + " days"
                }
            }

            return text;
        };
    }]);
