'use strict';
/**
 * controller for User Projects
 */
app.controller('PagesTimelineCtrl', ["$scope", "localStorageService", "RestService", "$state", "toaster",
    function ($scope, localStorageService, RestService, $state, toaster) {

        $scope.allActivities = '';

        $scope.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wenesday', 'Thuesday', 'Friday', 'Saturday'];

        $scope.getAllActivities = function () {
            RestService.fetchAllActivities(localStorageService.get('currentUserId'))
                .then(
                    function (data) {
                        $scope.allActivities = data;
                    },
                    function (errResponse) {
                        toaster.pop('error', 'Error', 'Server not available.');
                        console.log(errResponse);
                    }
                );
        };

        $scope.getAllActivities();

        $scope.getActivityDay = function (activityDate) {
            var date = new Date(activityDate);
            return date.getDate();
        };

        $scope.getActivityWeekDay = function (activityDate) {
            var date = new Date(activityDate);
            return date.getDay();
        };

        $scope.getMonth = function (activityDate) {
            var date = new Date(activityDate);
            return $scope.monthArray[date.getMonth()];
        };

        $scope.getYear = function (activityDate) {
            var date = new Date(activityDate);
            return date.getFullYear();
        };

    }]);
