'use strict';
/**
 * controller for User Projects
 */
app.controller('CurrentUserProjects', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {
        $scope.simpleProjects = [];
        $scope.owner = '';

        $scope.creationProjectDate = '';
        $scope.deathLineProject = '';

        $scope.getProjectById = function (projectId) {
            RestService.fetchProjectById(projectId)
                .then(
                    function(data) {
                        $scope.currentProjectActive =  data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        if(localStorageService.get('currentProjectId')!= null){
            $scope.getProjectById(localStorageService.get('currentProjectId'));
        }

        $scope.getProjects = function () {
            RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.simpleProjects = data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getProjects();

        $scope.getOwnerData = function () {
            RestService.fetchUser(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.owner = data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getOwnerData();

        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getCreationProject = function (DateProject) {
            var dateTemp = new Date(DateProject);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDay() + ", "+ dateTemp.getFullYear();
        };

        $scope.getDeathLineProject = function (DeathLine) {
            var dateTemp = new Date(DeathLine);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDay() + ", "+ dateTemp.getFullYear();
        };

        $scope.goToProject = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $scope.getProjectById(projectId);
            $state.go('app.project.subproject_detail');
        };

        $scope.goToOpportunities = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $scope.getProjectById(projectId);
            $state.go('app.project.opportunities_detail');
        };

        $scope.deleteProject = function (projectId) {
            RestService.deleteProject(projectId)
                .then(
                    function(data) {
                        toaster.pop('success', 'Good!!!', 'Project deleted correctly.');
                        $scope.getProjects();
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };
    }]);
