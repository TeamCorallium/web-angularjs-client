'use strict';
/**
 * controller for Fincancier Projects
 */
app.controller('FinancierCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        $scope.currentFincancierProjectsActive = '';

        $scope.getProjectById = function(projectId){
            RestService.fetchProjectById(projectId)
                .then(
                    function(data) {
                        $scope.currentFincancierProjectsActive =  data[0];
                    },
                    function(errResponse){
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        if(localStorageService.get('currentProjectId')!= null){
            $scope.getProjectById(localStorageService.get('currentProjectId'));
        }
    }]);