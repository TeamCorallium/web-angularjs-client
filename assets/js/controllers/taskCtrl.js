'use strict';
/**
 * controller for User Projects
 */
app.controller('TaskCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        if (!localStorageService.get('isLogged')) {
            $state.go('app.login.signin');
        } else {
            $scope.tasksProject = [];
            $scope.tasksFiltre = [];
            $scope.tasksFiltreInPreparation = [];
            $scope.currentTaskActive = '';
            $scope.stateArray = ['', 'In Preparation', 'Active: On time', 'Active: Best than expected', 'Active: Delayed', 'Finished'];

            $scope.getTaskByProjectsId = function (projectId) {
                RestService.fetchTaskByProjectId(projectId)
                    .then(
                        function (data) {
                            $scope.tasksProject = data;
                            $scope.getTaskByStateStartedOrFinished();
                            $scope.getTaskByStateInPreparation();
                            $scope.changeStateFiltre();
                        },
                        function (errResponse) {
                            toaster.pop('error', 'Error', 'Problems occurred while getting the tasks.');
                        }
                    );
            };

            $scope.getTaskByProjectsId(localStorageService.get('currentProjectId'));

            $scope.getTaskByStateStartedOrFinished = function () {
                for (var i = 0; i < $scope.tasksProject.length; i++) {
                    if ($scope.tasksProject[i].state == 2 || $scope.tasksProject[i].state == 3 ||
                        $scope.tasksProject[i].state == 4 || $scope.tasksProject[i].state == 5) {
                        $scope.tasksFiltre.push($scope.tasksProject[i]);
                    }
                }
            };

            $scope.getTaskByStateInPreparation = function () {
                for (var i = 0; i < $scope.tasksProject.length; i++) {
                    if ($scope.tasksProject[i].state == 1) {
                        $scope.tasksFiltreInPreparation.push($scope.tasksProject[i]);
                    }
                }
            };

            $scope.nullTasksFiltre = true;

            $scope.changeStateFiltre = function () {
                if ($scope.tasksFiltre.length > 0) {
                    $scope.nullTasksFiltre = false;
                }
            };

            $scope.getTaskById = function (taskId) {
                RestService.fetchTaskByTaskId(taskId)
                    .then(
                        function (data) {
                            $scope.currentTaskActive = data[0];
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            if (localStorageService.get('currentTaskId') != null) {
                $scope.getTaskById(localStorageService.get('currentTaskId'));
            }

            $scope.goToTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $scope.getTaskById(taskId);
                $state.go('app.project.task_detail');
            };

            $scope.goToExploreTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $scope.getTaskById(taskId);
                $state.go('app.project.explore_task_detail');
            };

            $scope.goToOpportunitiesTask = function (taskId) {
                localStorageService.set('currentTaskId', taskId);
                $scope.getTaskById(taskId);
                $state.go('app.project.opportunities_task_detail');
            };
        }
    }]);
