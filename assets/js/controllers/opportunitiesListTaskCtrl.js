app.controller('OpportunitiesListTaskCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.tasksProject = [];

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.getTaskByProjectsId = function () {
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.tasksProject = data;
                    },
                    function(errResponse){
                        toaster.pop('error', 'Error', 'Problems occurred while getting the tasks.');
                    }
                );
        };

        $scope.getTaskByProjectsId();

        $scope.goToOpportunitiesTask = function (taskId) {
            localStorageService.set('currentTaskId',taskId);
            $state.go('app.project.opportunities_task_detail');
        };

    }]);