'use strict';
/**
 * controller for User Projects
 */
app.controller('CurrentUserProjects', ["$scope", "localStorageService", "RestService",
    function ($scope, localStorageService, RestService) {
        $scope.simpleProjects = [];
        $scope.owner = '';

        $scope.creationProjectDate = '';
        $scope.deathLineProject = '';

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
    }]);
