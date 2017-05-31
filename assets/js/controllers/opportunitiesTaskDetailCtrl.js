'use strict';
/**
 * controller for User Projects
 */
app.controller('OpportunitiesTaskDetailCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

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

        $scope.currentTaskActive = '';
        $scope.stateArray = ['','In Preparation', 'Active: On time', 'Active: Best than expected','Active: Delayed', 'Finished'];

        $scope.getTaskById = function(){
            RestService.fetchTaskByTaskId(localStorageService.get('currentTaskId'))
                .then(
                    function(data) {
                        $scope.currentTaskActive =  data[0];
                    },
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTaskById();

        $scope.monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        $scope.getProjectDate = function (date) {
            var dateTemp = new Date(date);
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        };

        $scope.getTodayDate = function () {
            var dateTemp = new Date();
            return $scope.monthArray[dateTemp.getMonth()] + " " + dateTemp.getDate() + ", "+ dateTemp.getFullYear();
        }
    }]);