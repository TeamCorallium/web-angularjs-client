'use strict';
/**
 * controller for User Projects
 */
app.controller('TaskCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.tasksProject = [];

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.getTaskByProjectsId = function (projectId) {
            RestService.fetchTaskByProjectId(projectId)
                .then(
                    function(data) {
                        $scope.tasksProject = data;
                    },
                    function(errResponse){
                        toaster.pop('error', 'Error', 'Problems occurred while getting the tasks.');
                    }
                );
        };

        $scope.getTaskByProjectsId(localStorageService.get('currentProjectId'));

    }]);
