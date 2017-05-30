'use strict';
/**
 * controller for User Projects
 */
app.controller('ExploreSubprojectCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster", "SweetAlert",
    function ($scope, localStorageService, RestService, $state, toaster, SweetAlert) {

        $scope.currentProjectActive = '';

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.tasksFiltre = [];
        $scope.nullTasksFiltre = true;

        $scope.getTaskByProjectsId = function () {
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.tasksProject = data;
                        $scope.getTaskByStateStartedOrFinished();
                        $scope.changeStateFiltre();
                    },
                    function(errResponse){
                        toaster.pop('error', 'Error', 'Problems occurred while getting the tasks.');
                    }
                );
        };

        $scope.getTaskByProjectsId();

        $scope.getTaskByStateStartedOrFinished = function () {
            for (var i=0; i < $scope.tasksProject.length; i++) {
                if ($scope.tasksProject[i].state == 2 || $scope.tasksProject[i].state == 3 ||
                    $scope.tasksProject[i].state == 4 || $scope.tasksProject[i].state == 5) {
                    $scope.tasksFiltre.push($scope.tasksProject[i]);
                }
            }
        };

        $scope.changeStateFiltre  = function () {
            if($scope.tasksFiltre.length > 0) {
                $scope.nullTasksFiltre = false;
            }
        };

        $scope.goToExploreTask = function (taskId) {
            localStorageService.set('currentTaskId',taskId);
            $state.go('app.project.explore_task_detail');
        };

        $scope.invertions = [];
        $scope.investmentCapitalProject = 0;

        $scope.invertionByProjectId = function () {
            RestService.fetchInvertionByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.invertions = data;

                        for (var i = 0; i<$scope.invertions.length; i++) {
                            $scope.investmentCapitalProject += parseFloat($scope.invertions[i].amount);
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.invertionByProjectId();
    }]);
