'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreSubprojectCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster", "$window",
    function ($scope, localStorageService, RestService, $state, toaster, $window) {

        if (localStorageService.get('isLogged') == null || localStorageService.get('isLogged') == 'false') {
            $scope.logged = false;
        } else {
            $scope.logged = true;
        }

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

        $scope.stateArray = ['Under Construction', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

        $scope.categoryArray = ['','Commodities Production', 'Creating a New Business', 'Diversification', 'Property developments', 'Other'];

        $scope.sectorArray = ['', 'Agriculture', 'Industry', 'Technology', 'Engineering','Real State', 'Academic', 'Food industry', 'Other'];

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $scope.getDateProject = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
        };

        $scope.projectRole = function (userId) {
            if (localStorageService.get('currentUserId') == userId) {
                return 'Owner';
            }
            else {
                return '';
            }
        };

        $scope.goToOpportunitiesTask = function (taskId) {
            localStorageService.set('currentTaskId', taskId);
            $state.go('app.project.explore_task_detail');
        };

        $scope.goToExploreUserProfile = function (userId) {
            localStorageService.set('viewUserProfileId', userId);
            $state.go('app.pages.exploreuser');
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

        $scope.seeReference = function (file) {
            $window.location.href = file;
        };
    }]);
