'use strict';
/**
 * controller for Fincancier Projects
 */
app.controller('AllMyFinancierProjectsCtrl', ["$scope", "$state", "toaster", "WebSocketService", "localStorageService", "RestService", "$rootScope",
    function ($scope, $state, toaster, WebSocketService, localStorageService, RestService, $rootScope) {

        $scope.allMyFincancierProjects = [];

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
            $state.go('app.finance');
        };
    }]);