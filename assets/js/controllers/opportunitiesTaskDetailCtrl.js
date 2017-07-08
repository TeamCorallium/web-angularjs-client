'use strict';
/**
 * controller for User Projects
 */
app.controller('OpportunitiesTaskDetailCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.currentProjectActive = '';

            $scope.getProjectById = function () {
                RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.currentProjectActive = data[0];
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Server not available.');
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getProjectById();

            $scope.currentTaskActive = '';
            $scope.stateArray = ['Under Construction', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.getTaskById = function () {
                RestService.fetchTaskByTaskId(localStorageService.get('currentTaskId'))
                    .then(
                        function (data) {
                            $scope.currentTaskActive = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getTaskById();

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getProjectDate = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.getTodayDate = function () {
                var dateTemp = new Date();
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };

            $scope.proposedFinished = function (date, duration) {
                var dat = new Date(date);
                dat.setDate(dat.getDate() + duration);
                return $scope.getProjectDate(dat);
            };

            $scope.getDuration =  function (duration) {
                var weeks = parseInt(duration / 7);
                var days = parseInt(duration % 7);

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
        }
    }]);
