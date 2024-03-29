'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreSubprojectListTaskCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

            $scope.currentProjectActive = '';
            $scope.tasksFiltreInPreparation = [];
            $scope.tasksProject = [];
            $scope.stateArray = ['', 'In Preparation', 'Active', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

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

            $scope.getTaskByProjectsId = function () {
                RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                    .then(
                        function (data) {
                            $scope.tasksProject = data;

                            $scope.getTaskByStateInPreparation();
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Problems occurred while getting the tasks.');
                        }
                    );
            };

            $scope.getTaskByProjectsId();

            $scope.getTaskByStateInPreparation = function () {
                for (var i = 0; i < $scope.tasksProject.length; i++) {
                    if ($scope.tasksProject[i].state == 1) {
                        $scope.tasksFiltreInPreparation.push($scope.tasksProject[i]);
                    }
                }
            };

            $scope.goToExploreTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $state.go('app.project.explore_task_detail');
            };

            $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            $scope.getProjectDate = function (date) {
                var dateTemp = new Date(date);
                return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", " + dateTemp.getFullYear();
            };
    }]);
