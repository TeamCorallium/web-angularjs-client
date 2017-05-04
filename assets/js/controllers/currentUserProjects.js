'use strict';
/**
 * controller for User Projects
 */
app.controller('CurrentUserProjects', ["$scope", "localStorageService", "RestService",
    function ($scope, localStorageService, RestService) {
        $scope.simpleProjects = [];

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
    }]);
