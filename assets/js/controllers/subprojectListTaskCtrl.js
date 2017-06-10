app.controller('SubprojectListTaskCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.tasksProject = [];
        $scope.tasksFiltreInPreparation = [];

        $scope.currentProjectActive = [];

        $scope.getProjectById = function () {
            RestService.fetchProjectById(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                    },
                    function(errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjectById();


        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getDateProject = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.getTaskByProjectsId = function () {
            RestService.fetchTaskByProjectId(localStorageService.get('currentProjectId'))
                .then(
                    function(data) {
                        $scope.tasksProject = data;
                        $scope.getTaskByStateInPreparation();
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTaskByProjectsId();

        $scope.getTaskByStateInPreparation = function () {
            for (var i=0; i < $scope.tasksProject.length; i++) {
                if ($scope.tasksProject[i].state == 1) {
                    $scope.tasksFiltreInPreparation.push($scope.tasksProject[i]);
                }
            }
        };

        $scope.goToTask = function (taskId) {
            localStorageService.set('currentTaskId',taskId);
            $state.go('app.project.task_detail');
        };

    }]);