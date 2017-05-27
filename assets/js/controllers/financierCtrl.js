'use strict';
/**
 * controller for Fincancier Projects
 */
app.controller('FinancierCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        $scope.currentFincancierProjectsActive = '';

        $scope.allMyFincancierProjects = [];

        $scope.getProjectById = function(projectId){
            RestService.fetchProjectById(projectId)
                .then(
                    function(data) {
                        $scope.currentFincancierProjectsActive =  data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        if(localStorageService.get('currentProjectId')!= null){
            $scope.getProjectById(localStorageService.get('currentProjectId'));
        }

        $scope.getAllMyFincancierProjects = function () {
            RestService.fetchSimpleProjects(localStorageService.get('currentUserId'))
                .then(
                    function(data) {
                        $scope.allMyFincancierProjects =  data;
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllMyFincancierProjects();

        $scope.goToFinancierProject = function (projectId) {
            localStorageService.set('currentProjectId',projectId);
            $scope.getProjectById(projectId);
            $state.go('app.finance');
        };
    }]);